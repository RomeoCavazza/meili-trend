# services/meilisearch_client.py
# Client Meilisearch pour l'indexation et la recherche de posts

from typing import List, Dict, Optional, Any
from meilisearch import Client
from meilisearch.errors import MeiliSearchApiError
from core.config import settings
import logging

logger = logging.getLogger(__name__)

class MeilisearchService:
    """Service pour gérer l'indexation et la recherche avec Meilisearch"""
    
    def __init__(self):
        """Initialise le client Meilisearch"""
        try:
            self.client = Client(
                settings.MEILI_HOST,
                api_key=settings.MEILI_MASTER_KEY
            )
            self.index_name = settings.MEILI_INDEX
            self.index = self.client.index(self.index_name)
            logger.info(f"✅ Meilisearch client initialisé - Index: {self.index_name}")
        except Exception as e:
            logger.error(f"❌ Erreur initialisation Meilisearch: {e}")
            self.client = None
            self.index = None
    
    def _ensure_index_exists(self):
        """Crée l'index s'il n'existe pas avec la configuration optimale"""
        if not self.client:
            return False
        
        try:
            # Vérifier si l'index existe
            try:
                self.client.get_index(self.index_name)
            except MeiliSearchApiError as e:
                if e.error_code == "index_not_found":
                    # Créer l'index avec configuration optimale
                    self.client.create_index(self.index_name, {'primaryKey': 'id'})
                    logger.info(f"✅ Index '{self.index_name}' créé")
            
            # Configurer les paramètres de recherche
            index = self.client.index(self.index_name)
            
            # Settings de recherche optimisés pour les posts sociaux
            index.update_searchable_attributes([
                'caption',
                'author',
                'hashtags',
                'language'
            ])
            
            index.update_filterable_attributes([
                'platform_id',
                'platform_name',
                'posted_at',
                'score',
                'score_trend',
                'language'
            ])
            
            index.update_sortable_attributes([
                'posted_at',
                'score',
                'score_trend'
            ])
            
            # Configuration de la typo-tolérance
            index.update_typo_tolerance({
                'enabled': True,
                'minWordSizeForTypos': {
                    'oneTypo': 4,
                    'twoTypos': 8
                }
            })
            
            logger.info("✅ Configuration Meilisearch appliquée")
            return True
        except Exception as e:
            logger.error(f"❌ Erreur configuration index: {e}")
            return False
    
    def index_post(self, post_data: Dict[str, Any]) -> bool:
        """Indexe un post dans Meilisearch"""
        if not self.client:
            return False
        
        try:
            self._ensure_index_exists()
            
            # Formater les données pour Meilisearch
            document = {
                'id': post_data.get('id'),
                'platform_id': post_data.get('platform_id'),
                'platform_name': post_data.get('platform_name', ''),
                'author': post_data.get('author', ''),
                'caption': post_data.get('caption', ''),
                'hashtags': post_data.get('hashtags', []),
                'metrics': post_data.get('metrics', {}),
                'posted_at': post_data.get('posted_at'),
                'fetched_at': post_data.get('fetched_at'),
                'language': post_data.get('language', ''),
                'media_url': post_data.get('media_url', ''),
                'sentiment': post_data.get('sentiment', 0),
                'score': post_data.get('score', 0),
                'score_trend': post_data.get('score_trend', 0),
            }
            
            # Nettoyer les valeurs None
            document = {k: v for k, v in document.items() if v is not None}
            
            self.index.add_documents([document])
            return True
        except Exception as e:
            logger.error(f"❌ Erreur indexation post {post_data.get('id')}: {e}")
            return False
    
    def batch_index_posts(self, posts_data: List[Dict[str, Any]]) -> int:
        """Indexe plusieurs posts en lot"""
        if not self.client or not posts_data:
            return 0
        
        try:
            self._ensure_index_exists()
            
            documents = []
            for post_data in posts_data:
                document = {
                    'id': post_data.get('id'),
                    'platform_id': post_data.get('platform_id'),
                    'platform_name': post_data.get('platform_name', ''),
                    'author': post_data.get('author', ''),
                    'caption': post_data.get('caption', ''),
                    'hashtags': post_data.get('hashtags', []),
                    'metrics': post_data.get('metrics', {}),
                    'posted_at': post_data.get('posted_at'),
                    'fetched_at': post_data.get('fetched_at'),
                    'language': post_data.get('language', ''),
                    'media_url': post_data.get('media_url', ''),
                    'sentiment': post_data.get('sentiment', 0),
                    'score': post_data.get('score', 0),
                    'score_trend': post_data.get('score_trend', 0),
                }
                # Nettoyer les valeurs None
                document = {k: v for k, v in document.items() if v is not None}
                documents.append(document)
            
            task = self.index.add_documents(documents)
            logger.info(f"✅ {len(documents)} posts indexés (task: {task.task_uid})")
            return len(documents)
        except Exception as e:
            logger.error(f"❌ Erreur batch indexation: {e}")
            return 0
    
    def search_posts(
        self,
        query: str,
        limit: int = 20,
        offset: int = 0,
        filters: Optional[Dict[str, Any]] = None,
        sort: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Recherche de posts dans Meilisearch"""
        if not self.client:
            return {'hits': [], 'estimatedTotalHits': 0, 'limit': limit, 'offset': offset}
        
        try:
            search_params = {
                'limit': limit,
                'offset': offset,
            }
            
            if filters:
                filter_str = self._build_filter_string(filters)
                if filter_str:
                    search_params['filter'] = filter_str
            
            if sort:
                search_params['sort'] = sort
            
            results = self.index.search(query, search_params)
            return results
        except Exception as e:
            logger.error(f"❌ Erreur recherche: {e}")
            return {'hits': [], 'estimatedTotalHits': 0, 'limit': limit, 'offset': offset}
    
    def _build_filter_string(self, filters: Dict[str, Any]) -> Optional[str]:
        """Construit une chaîne de filtre Meilisearch"""
        filter_parts = []
        
        if 'platform_name' in filters:
            filter_parts.append(f"platform_name = '{filters['platform_name']}'")
        
        if 'min_score' in filters:
            filter_parts.append(f"score >= {filters['min_score']}")
        
        if 'min_trend_score' in filters:
            filter_parts.append(f"score_trend >= {filters['min_trend_score']}")
        
        if 'language' in filters:
            filter_parts.append(f"language = '{filters['language']}'")
        
        return ' AND '.join(filter_parts) if filter_parts else None
    
    def delete_post(self, post_id: str) -> bool:
        """Supprime un post de l'index"""
        if not self.client:
            return False
        
        try:
            self.index.delete_document(post_id)
            return True
        except Exception as e:
            logger.error(f"❌ Erreur suppression post {post_id}: {e}")
            return False
    
    def update_post(self, post_data: Dict[str, Any]) -> bool:
        """Met à jour un post dans l'index"""
        return self.index_post(post_data)  # Meilisearch gère automatiquement l'upsert
    
    def get_stats(self) -> Dict[str, Any]:
        """Récupère les statistiques de l'index"""
        if not self.client:
            return {}
        
        try:
            stats = self.index.get_stats()
            return stats
        except Exception as e:
            logger.error(f"❌ Erreur récupération stats: {e}")
            return {}

# Instance globale
meilisearch_service = MeilisearchService()

