import os
from .base import fetch_since, normalize

def get_instagram_posts(since_ts: int) -> list[dict]:
    env = {
        "access_token": os.getenv("INSTAGRAM_ACCESS_TOKEN"),
        "app_id": os.getenv("INSTAGRAM_APP_ID"),
        "app_secret": os.getenv("INSTAGRAM_APP_SECRET")
    }
    
    if not env["access_token"]:
        return []
    
    posts = fetch_since(env, since_ts)
    return [normalize(post) for post in posts]
