# services/tiktok_service.py
# Service pour récupérer les données depuis TikTok API

from typing import List, Dict, Optional, Any
import httpx
import logging
from datetime import datetime
from core.config import settings

logger = logging.getLogger(__name__)

class TikTokService:
    """Service pour interagir avec l'API TikTok"""
    
    def __init__(self):
        """Initialise le service TikTok avec les credentials"""
        self.client_id = settings.TIKTOK_CLIENT_KEY
        self.client_secret = settings.TIKTOK_CLIENT_SECRET
        self.access_token = None
        self.base_url = "https://open.tiktokapis.com/v2"
        
    async def get_access_token(self) -> Optional[str]:
        """Obtient un token d'accès OAuth2 depuis TikTok"""
        if self.access_token:
            return self.access_token
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/oauth/token/",
                    data={
                        "client_key": self.client_id,
                        "client_secret": self.client_secret,
                        "grant_type": "client_credentials",
                    },
                    headers={"Content-Type": "application/x-www-form-urlencoded"},
                )
                response.raise_for_status()
                data = response.json()
                self.access_token = data.get("access_token")
                logger.info("✅ Token TikTok obtenu")
                return self.access_token
        except Exception as e:
            logger.error(f"❌ Erreur obtention token TikTok: {e}")
            return None
    
    async def search_videos_by_hashtag(
        self,
        hashtag: str,
        max_count: int = 20,
        cursor: Optional[int] = None
    ) -> Dict[str, Any]:
        """Recherche des vidéos par hashtag"""
        token = await self.get_access_token()
        if not token:
            return {"error": "Impossible d'obtenir le token"}
        
        try:
            async with httpx.AsyncClient() as client:
                params = {
                    "hashtag": hashtag,
                    "max_count": min(max_count, 20),  # Limite API TikTok
                }
                if cursor:
                    params["cursor"] = cursor
                
                response = await client.get(
                    f"{self.base_url}/research/video/query/",
                    params=params,
                    headers={
                        "Authorization": f"Bearer {token}",
                        "Content-Type": "application/json",
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"❌ Erreur HTTP TikTok: {e.response.status_code} - {e.response.text}")
            return {"error": f"Erreur API: {e.response.status_code}"}
        except Exception as e:
            logger.error(f"❌ Erreur recherche hashtag {hashtag}: {e}")
            return {"error": str(e)}
    
    async def get_trending_hashtags(self, max_count: int = 20) -> Dict[str, Any]:
        """Récupère les hashtags tendance"""
        token = await self.get_access_token()
        if not token:
            return {"error": "Impossible d'obtenir le token"}
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/research/trending/hashtags/",
                    params={"max_count": min(max_count, 20)},
                    headers={
                        "Authorization": f"Bearer {token}",
                        "Content-Type": "application/json",
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"❌ Erreur récupération trending hashtags: {e}")
            return {"error": str(e)}
    
    def transform_tiktok_video_to_post(self, video_data: Dict[str, Any], platform_id: int) -> Dict[str, Any]:
        """Transforme une vidéo TikTok en format Post pour notre BDD"""
        try:
            # Extraire les données selon la structure de l'API TikTok
            video_info = video_data.get("video", {})
            statistics = video_info.get("statistics", {})
            author = video_info.get("author", {})
            
            # Extraire les hashtags du caption
            caption = video_info.get("title", "") or video_info.get("description", "")
            hashtags = []
            if caption:
                hashtags = [tag.strip("#") for tag in caption.split() if tag.startswith("#")]
            
            # Calculer un score de tendance basé sur les métriques
            likes = statistics.get("like_count", 0)
            comments = statistics.get("comment_count", 0)
            shares = statistics.get("share_count", 0)
            views = statistics.get("view_count", 0)
            
            # Score simple: engagement rate = (likes + comments + shares) / views
            engagement_rate = (likes + comments + shares) / views if views > 0 else 0
            score = engagement_rate * 100  # Normaliser sur 100
            score_trend = score  # Pour l'instant, même valeur
            
            post = {
                "id": video_info.get("id", ""),
                "platform_id": platform_id,
                "author": author.get("username", "") or author.get("display_name", ""),
                "caption": caption,
                "hashtags": hashtags,
                "metrics": {
                    "likes": likes,
                    "comments": comments,
                    "shares": shares,
                    "views": views
                },
                "posted_at": datetime.fromtimestamp(
                    int(video_info.get("create_time", 0))
                ) if video_info.get("create_time") else datetime.utcnow(),
                "fetched_at": datetime.utcnow(),
                "language": video_info.get("language", "en"),
                "media_url": video_info.get("cover_image_url", "") or video_info.get("video_url", ""),
                "sentiment": 0,  # À calculer si nécessaire
                "score": score,
                "score_trend": score_trend
            }
            
            return post
        except Exception as e:
            logger.error(f"❌ Erreur transformation vidéo TikTok: {e}")
            return {}
    
    async def fetch_hashtag_posts(
        self,
        hashtag: str,
        platform_id: int,
        max_count: int = 50
    ) -> List[Dict[str, Any]]:
        """Récupère et transforme les posts d'un hashtag"""
        all_posts = []
        cursor = None
        count = 0
        
        while count < max_count:
            remaining = max_count - count
            batch_size = min(remaining, 20)  # Limite API TikTok
            
            result = await self.search_videos_by_hashtag(hashtag, batch_size, cursor)
            
            if "error" in result:
                logger.error(f"Erreur lors de la récupération: {result['error']}")
                break
            
            videos = result.get("data", {}).get("videos", [])
            if not videos:
                break
            
            for video in videos:
                post = self.transform_tiktok_video_to_post(video, platform_id)
                if post:
                    all_posts.append(post)
                    count += 1
            
            # Vérifier s'il y a une page suivante
            cursor = result.get("data", {}).get("cursor")
            if not cursor:
                break
        
        logger.info(f"✅ {len(all_posts)} posts TikTok récupérés pour #{hashtag}")
        return all_posts

# Instance globale
tiktok_service = TikTokService()

