import httpx
from typing import Optional, List, Dict, Any

async def search_hashtag(hashtag: str, access_token: str, user_id: str) -> Optional[str]:
    """
    Recherche un hashtag sur Instagram et retourne son ID
    """
    try:
        url = f"https://graph.facebook.com/v19.0/ig_hashtag_search"
        params = {
            "user_id": user_id,
            "q": hashtag,
            "access_token": access_token
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            if "data" in data and len(data["data"]) > 0:
                return data["data"][0]["id"]
            return None
            
    except Exception as e:
        print(f"Erreur lors de la recherche du hashtag {hashtag}: {e}")
        return None

async def fetch_hashtag_media(hashtag_id: str, media_type: str, limit: int, access_token: str, user_id: str) -> List[Dict[str, Any]]:
    """
    Récupère les médias d'un hashtag Instagram
    """
    try:
        url = f"https://graph.facebook.com/v19.0/{hashtag_id}/{media_type}_media"
        params = {
            "user_id": user_id,
            "fields": "id,username,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count",
            "limit": limit,
            "access_token": access_token
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            return data.get("data", [])
            
    except Exception as e:
        print(f"Erreur lors de la récupération des médias: {e}")
        return []

# Fonctions synchrones pour compatibilité avec le code existant
def search_hashtag_sync(hashtag: str, access_token: str, user_id: str) -> Optional[str]:
    """Version synchrone pour compatibilité"""
    import asyncio
    return asyncio.run(search_hashtag(hashtag, access_token, user_id))

def fetch_hashtag_media_sync(hashtag_id: str, media_type: str, limit: int, access_token: str, user_id: str) -> List[Dict[str, Any]]:
    """Version synchrone pour compatibilité"""
    import asyncio
    return asyncio.run(fetch_hashtag_media(hashtag_id, media_type, limit, access_token, user_id))

# Alias pour compatibilité
search_hashtag = search_hashtag_sync
fetch_hashtag_media = fetch_hashtag_media_sync