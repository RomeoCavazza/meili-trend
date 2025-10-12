import httpx
from typing import List, Literal, Optional, Dict
import time

GRAPH_API_BASE = "https://graph.facebook.com/v19.0"

class InstagramGraphError(Exception):
    pass


def _make_request(url: str, params: dict, retries: int = 3) -> dict:
    for attempt in range(retries):
        try:
            with httpx.Client(timeout=20.0) as client:
                response = client.get(url, params=params)
                
                if response.status_code == 429 and attempt < retries - 1:
                    time.sleep([0.5, 1.0, 2.0][attempt])
                    continue
                
                if response.status_code >= 400:
                    try:
                        error = response.json().get("error", {}).get("message", response.text)
                    except:
                        error = response.text[:200]
                    raise InstagramGraphError(f"HTTP {response.status_code}: {error}")
                
                return response.json()
                
        except httpx.RequestError as e:
            if attempt < retries - 1:
                time.sleep(0.5)
                continue
            raise InstagramGraphError(f"Erreur réseau: {str(e)}")
    
    raise InstagramGraphError("Échec après plusieurs tentatives")


def search_hashtag(tag: str, access_token: str, ig_user_id: str) -> Optional[str]:
    clean_tag = tag.strip().lstrip("#")
    if not clean_tag:
        raise InstagramGraphError("Hashtag vide")
    
    url = f"{GRAPH_API_BASE}/ig_hashtag_search"
    params = {"user_id": ig_user_id, "q": clean_tag, "access_token": access_token}
    data = _make_request(url, params)
    
    if "data" in data and len(data["data"]) > 0:
        return data["data"][0].get("id")
    return None


def fetch_hashtag_media(
    hashtag_id: str,
    kind: Literal["top", "recent"],
    limit: int,
    access_token: str,
    ig_user_id: str
) -> List[Dict]:
    if kind not in ("top", "recent"):
        raise ValueError('kind doit être "top" ou "recent"')
    
    endpoint = "top_media" if kind == "top" else "recent_media"
    url = f"{GRAPH_API_BASE}/{hashtag_id}/{endpoint}"
    
    fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,username"
    params = {
        "user_id": ig_user_id,
        "fields": fields,
        "access_token": access_token,
        "limit": min(limit, 50)
    }
    
    all_media = []
    while len(all_media) < limit:
        data = _make_request(url, params)
        all_media.extend(data.get("data", []))
        
        next_url = data.get("paging", {}).get("next")
        if not next_url or len(all_media) >= limit:
            break
        
        url = next_url
        params = {}
    
    return all_media[:limit]
