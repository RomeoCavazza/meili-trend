import httpx
from typing import List, Literal, Optional, Dict

API = "https://graph.facebook.com/v19.0"

def search_hashtag(tag: str, token: str, user_id: str) -> Optional[str]:
    tag = tag.strip().lstrip("#")
    print(f"🔍 Recherche hashtag: '{tag}' avec user_id: {user_id}")
    
    r = httpx.get(f"{API}/ig_hashtag_search", params={"user_id": user_id, "q": tag, "access_token": token})
    data = r.json()
    
    print(f"🔍 Réponse API: {data}")
    
    if "error" in data:
        print(f"❌ Erreur API: {data['error']}")
        return None
        
    return data["data"][0]["id"] if data.get("data") else None

def fetch_hashtag_media(hashtag_id: str, kind: Literal["top", "recent"], limit: int, token: str, user_id: str) -> List[Dict]:
    endpoint = "top_media" if kind == "top" else "recent_media"
    fields = "id,media_type"
    
    r = httpx.get(
        f"{API}/{hashtag_id}/{endpoint}",
        params={"user_id": user_id, "fields": fields, "access_token": token, "limit": min(limit, 50)}
    )
    
    media_list = r.json().get("data", [])
    
    # Récupérer les détails de chaque média
    detailed_media = []
    for media in media_list:
        media_id = media["id"]
        # Récupérer les détails complets du média
        detail_r = httpx.get(
            f"{API}/{media_id}",
            params={
                "fields": "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count",
                "access_token": token
            }
        )
        if detail_r.status_code == 200:
            media_data = detail_r.json()
            
            # Récupérer le username via l'endpoint /me
            try:
                user_r = httpx.get(f"{API}/me", params={"fields": "username", "access_token": token})
                if user_r.status_code == 200:
                    user_data = user_r.json()
                    media_data["username"] = user_data.get("username", "Instagram User")
                else:
                    media_data["username"] = "Instagram User"
            except:
                media_data["username"] = "Instagram User"
            
            detailed_media.append(media_data)
        else:
            # Fallback avec les données de base
            detailed_media.append(media)
    
    return detailed_media
