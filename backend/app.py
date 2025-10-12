from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from pydantic import BaseModel

import config
import search
from models import PostModel, MeiliResponse
from instagram_client import search_hashtag, fetch_hashtag_media, InstagramGraphError

app = FastAPI(title="Insidr API", version="2.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.on_event("startup")
def startup():
    search.bootstrap_posts_index()


@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/healthz")
def healthz():
    try:
        search.get_client().health()
        return {"status": "healthy"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Meilisearch unavailable: {e}")

@app.post("/index/init")
def init_index():
    search.bootstrap_posts_index()
    return {"status": "index_ready"}

@app.post("/index/clear")
def clear_index():
    search.clear_index()
    return {"status": "index_cleared"}

class IngestHashtagRequest(BaseModel):
    tag: str
    kind: str = "top"
    limit: int = 30

@app.post("/v1/ingest/instagram/hashtag")
def ingest_instagram_hashtag(request: IngestHashtagRequest):
    if request.kind not in ("top", "recent"):
        raise HTTPException(400, 'kind doit être "top" ou "recent"')
    
    if not request.tag.strip():
        raise HTTPException(400, "Hashtag vide")
    
    if not 1 <= request.limit <= 50:
        raise HTTPException(400, "Limite entre 1 et 50")
    
    try:
        hashtag_id = search_hashtag(request.tag, config.IG_ACCESS_TOKEN, config.IG_USER_ID)
        if not hashtag_id:
            raise HTTPException(404, f"Hashtag '{request.tag}' introuvable")
        
        media_list = fetch_hashtag_media(hashtag_id, request.kind, request.limit, config.IG_ACCESS_TOKEN, config.IG_USER_ID)
        if not media_list:
            return {"inserted": 0, "hashtag": request.tag}
        
        posts = []
        for media in media_list:
            try:
                posts.append(PostModel.from_ig_media(media))
            except Exception as e:
                print(f"⚠️ Failed to parse media {media.get('id')}: {e}")
        
        indexed_count = search.index_posts(posts)
        return {"inserted": indexed_count, "hashtag": request.tag, "kind": request.kind}
        
    except InstagramGraphError as e:
        status_code = 429 if "Rate limit" in str(e) else (403 if "permissions" in str(e).lower() else 503)
        raise HTTPException(status_code, str(e))
    except Exception as e:
        raise HTTPException(500, str(e))


@app.get("/v1/search/posts", response_model=MeiliResponse)
def search_posts(
    q: Optional[str] = None,
    hashtags: Optional[List[str]] = Query(None),
    username: Optional[str] = None,
    sort: str = "score_trend:desc",
    limit: int = Query(20, ge=1, le=100),
    page: int = Query(1, ge=1)
):
    filters = []
    if hashtags:
        hashtag_filters = " OR ".join([f'hashtags = "{h.lower()}"' for h in hashtags])
        filters.append(f"({hashtag_filters})")
    if username:
        filters.append(f'username = "{username}"')
    
    search_body = {
        "q": q or "",
        "filter": " AND ".join(filters) if filters else None,
        "limit": limit,
        "page": page,
        "attributesToHighlight": ["caption"],
        "highlightPreTag": "<mark>",
        "highlightPostTag": "</mark>",
        "facets": ["hashtags", "username", "platform"],
        "sort": [sort] if sort else None
    }
    
    return search.search(search_body)

@app.get("/v1/similar/{doc_id}")
def find_similar(doc_id: str):
    doc = search.get_document(doc_id)
    if not doc:
        raise HTTPException(404, "Document non trouvé")
    
    search_body = {"q": doc.get("caption", ""), "limit": 20, "filter": f'id != "{doc_id}"'}
    return search.search(search_body)

@app.get("/stats")
def get_stats():
    return search.stats()
