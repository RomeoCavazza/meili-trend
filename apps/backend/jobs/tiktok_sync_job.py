# jobs/tiktok_sync_job.py
# Job pour synchroniser les données TikTok vers PostgreSQL et Meilisearch

import asyncio
import logging
from datetime import datetime
from typing import List
from sqlalchemy.orm import Session

from db.base import SessionLocal
from db.models import Post, Platform, Hashtag
from services.tiktok_service import tiktok_service
from services.meilisearch_client import meilisearch_service
from core.config import settings

logger = logging.getLogger(__name__)

class TikTokSyncJob:
    """Job pour synchroniser les données TikTok"""
    
    def __init__(self):
        self.db: Session = SessionLocal()
    
    async def sync_hashtag(self, hashtag_name: str) -> int:
        """Synchronise les posts d'un hashtag depuis TikTok"""
        try:
            # Récupérer ou créer la plateforme TikTok
            platform = self.db.query(Platform).filter(Platform.name == "tiktok").first()
            if not platform:
                platform = Platform(name="tiktok", api_key=settings.TIKTOK_CLIENT_KEY)
                self.db.add(platform)
                self.db.commit()
                self.db.refresh(platform)
            
            # Récupérer ou créer le hashtag
            hashtag = self.db.query(Hashtag).filter(
                Hashtag.name == hashtag_name,
                Hashtag.platform_id == platform.id
            ).first()
            
            if not hashtag:
                hashtag = Hashtag(
                    name=hashtag_name,
                    platform_id=platform.id,
                    last_scraped=datetime.utcnow()
                )
                self.db.add(hashtag)
                self.db.commit()
                self.db.refresh(hashtag)
            
            # Récupérer les posts depuis TikTok
            logger.info(f"🔄 Synchronisation du hashtag #{hashtag_name}...")
            posts_data = await tiktok_service.fetch_hashtag_posts(
                hashtag_name,
                platform.id,
                max_count=50
            )
            
            if not posts_data:
                logger.warning(f"⚠️ Aucun post trouvé pour #{hashtag_name}")
                return 0
            
            # Enrichir avec platform_name pour Meilisearch
            for post_data in posts_data:
                post_data['platform_name'] = 'tiktok'
            
            # Sauvegarder dans PostgreSQL
            saved_count = self._save_posts_to_db(posts_data)
            
            # Indexer dans Meilisearch
            indexed_count = meilisearch_service.batch_index_posts(posts_data)
            
            # Mettre à jour last_scraped
            hashtag.last_scraped = datetime.utcnow()
            self.db.commit()
            
            logger.info(f"✅ #{hashtag_name}: {saved_count} posts sauvegardés, {indexed_count} indexés")
            return saved_count
            
        except Exception as e:
            logger.error(f"❌ Erreur synchronisation #{hashtag_name}: {e}")
            self.db.rollback()
            return 0
    
    def _save_posts_to_db(self, posts_data: List[dict]) -> int:
        """Sauvegarde les posts dans PostgreSQL"""
        saved_count = 0
        
        for post_data in posts_data:
            try:
                # Vérifier si le post existe déjà
                existing_post = self.db.query(Post).filter(
                    Post.id == post_data.get('id'),
                    Post.platform_id == post_data.get('platform_id')
                ).first()
                
                if existing_post:
                    # Mettre à jour
                    for key, value in post_data.items():
                        if hasattr(existing_post, key) and key != 'id':
                            setattr(existing_post, key, value)
                    existing_post.fetched_at = datetime.utcnow()
                else:
                    # Créer nouveau post
                    post = Post(**post_data)
                    self.db.add(post)
                
                saved_count += 1
                
            except Exception as e:
                logger.error(f"❌ Erreur sauvegarde post {post_data.get('id')}: {e}")
                continue
        
        self.db.commit()
        return saved_count
    
    async def sync_trending_hashtags(self, max_hashtags: int = 10) -> int:
        """Synchronise les hashtags tendance depuis TikTok"""
        try:
            logger.info(f"🔄 Récupération des hashtags tendance...")
            trending_data = await tiktok_service.get_trending_hashtags(max_hashtags)
            
            if "error" in trending_data:
                logger.error(f"❌ Erreur récupération trending: {trending_data['error']}")
                return 0
            
            hashtags = trending_data.get("data", {}).get("hashtags", [])
            total_synced = 0
            
            for hashtag_info in hashtags:
                hashtag_name = hashtag_info.get("hashtag_name", "").strip("#")
                if hashtag_name:
                    count = await self.sync_hashtag(hashtag_name)
                    total_synced += count
                    # Pause pour éviter rate limiting
                    await asyncio.sleep(2)
            
            logger.info(f"✅ Synchronisation trending: {total_synced} posts au total")
            return total_synced
            
        except Exception as e:
            logger.error(f"❌ Erreur synchronisation trending hashtags: {e}")
            return 0
    
    async def sync_specific_hashtags(self, hashtag_names: List[str]) -> dict:
        """Synchronise une liste spécifique de hashtags"""
        results = {}
        
        for hashtag_name in hashtag_names:
            hashtag_clean = hashtag_name.strip("#")
            count = await self.sync_hashtag(hashtag_clean)
            results[hashtag_clean] = count
            # Pause pour éviter rate limiting
            await asyncio.sleep(2)
        
        return results
    
    def close(self):
        """Ferme la session DB"""
        if self.db:
            self.db.close()

async def run_sync_job(hashtags: List[str] = None, trending: bool = False):
    """Fonction utilitaire pour exécuter le job de synchronisation"""
    job = TikTokSyncJob()
    
    try:
        if trending:
            await job.sync_trending_hashtags()
        elif hashtags:
            await job.sync_specific_hashtags(hashtags)
        else:
            logger.warning("⚠️ Aucune action spécifiée")
    finally:
        job.close()

if __name__ == "__main__":
    # Pour tester en standalone
    import sys
    hashtags = sys.argv[1:] if len(sys.argv) > 1 else ["fyp", "viral", "trending"]
    asyncio.run(run_sync_job(hashtags=hashtags))

