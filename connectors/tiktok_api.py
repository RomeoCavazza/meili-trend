import os
from .base import fetch_since, normalize

def get_tiktok_posts(since_ts: int) -> list[dict]:
    env = {
        "access_token": os.getenv("TIKTOK_ACCESS_TOKEN"),
        "client_key": os.getenv("TIKTOK_CLIENT_KEY"),
        "client_secret": os.getenv("TIKTOK_CLIENT_SECRET")
    }
    
    if not env["access_token"]:
        return []
    
    posts = fetch_since(env, since_ts)
    return [normalize(post) for post in posts]
