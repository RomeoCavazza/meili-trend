from meilisearch import Client
from typing import List
import config
from models import PostModel

def get_client() -> Client:
    return Client(config.MEILI_HOST, config.MEILI_MASTER_KEY)

def bootstrap_posts_index() -> None:
    client = get_client()
    try:
        client.get_index(config.MEILI_INDEX)
    except:
        client.create_index(config.MEILI_INDEX, {"primaryKey": "id"})
    
    index = client.index(config.MEILI_INDEX)
    index.update_searchable_attributes(["caption", "hashtags", "username"])
    index.update_filterable_attributes(["platform", "hashtags", "username", "posted_at"])
    index.update_sortable_attributes(["score_trend", "like_count", "comments_count", "posted_at"])
    index.update_ranking_rules(["sort", "words", "typo", "proximity", "attribute", "exactness"])

def index_posts(posts: List[PostModel]) -> int:
    if not posts:
        return 0
    
    client = get_client()
    index = client.index(config.MEILI_INDEX)
    
    documents = []
    for post in posts:
        doc = post.model_dump()
        if "posted_at" in doc and doc["posted_at"]:
            doc["posted_at"] = doc["posted_at"].isoformat()
        documents.append(doc)
    
    index.add_documents(documents)
    return len(documents)

def search(body: dict) -> dict:
    client = get_client()
    index = client.index(config.MEILI_INDEX)
    return index.search(body.get("q", ""), body)

def get_document(doc_id: str) -> dict | None:
    try:
        client = get_client()
        index = client.index(config.MEILI_INDEX)
        return index.get_document(doc_id)
    except:
        return None

def stats() -> dict:
    client = get_client()
    index = client.index(config.MEILI_INDEX)
    return index.get_stats()

def clear_index() -> None:
    client = get_client()
    index = client.index(config.MEILI_INDEX)
    index.delete_all_documents()
