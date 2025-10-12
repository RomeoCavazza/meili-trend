from meilisearch import Client
from typing import List
import config
from models import PostModel

def get_client() -> Client:
    return Client(config.MEILI_HOST, config.MEILI_MASTER_KEY)

def bootstrap_posts_index():
    client = get_client()
    try:
        client.get_index(config.MEILI_INDEX)
    except:
        client.create_index(config.MEILI_INDEX, {"primaryKey": "id"})
    
    index = client.index(config.MEILI_INDEX)
    index.update_searchable_attributes(["caption", "hashtags", "username"])
    index.update_filterable_attributes(["platform", "hashtags", "username", "posted_at"])
    index.update_sortable_attributes(["score_trend", "like_count", "comments_count", "posted_at"])

def index_posts(posts: List[PostModel]) -> int:
    if not posts:
        return 0
    
    docs = [p.model_dump() for p in posts]
    for d in docs:
        if d.get("posted_at"):
            d["posted_at"] = d["posted_at"].isoformat()
    
    get_client().index(config.MEILI_INDEX).add_documents(docs)
    return len(docs)

def search(body: dict) -> dict:
    return get_client().index(config.MEILI_INDEX).search(body.get("q", ""), body)

def get_document(doc_id: str):
    try:
        return get_client().index(config.MEILI_INDEX).get_document(doc_id)
    except:
        return None

def stats():
    return get_client().index(config.MEILI_INDEX).get_stats()

def clear_index():
    get_client().index(config.MEILI_INDEX).delete_all_documents()
