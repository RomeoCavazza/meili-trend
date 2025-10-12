import httpx
from typing import List, Literal, Optional, Dict

API = "https://graph.facebook.com/v19.0"

def search_hashtag(tag: str, token: str, user_id: str) -> Optional[str]:
    tag = tag.strip().lstrip("#")
    r = httpx.get(f"{API}/ig_hashtag_search", params={"user_id": user_id, "q": tag, "access_token": token})
    data = r.json()
    return data["data"][0]["id"] if data.get("data") else None

def fetch_hashtag_media(hashtag_id: str, kind: Literal["top", "recent"], limit: int, token: str, user_id: str) -> List[Dict]:
    endpoint = "top_media" if kind == "top" else "recent_media"
    fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,username"
    
    r = httpx.get(
        f"{API}/{hashtag_id}/{endpoint}",
        params={"user_id": user_id, "fields": fields, "access_token": token, "limit": min(limit, 50)}
    )
    
    return r.json().get("data", [])
