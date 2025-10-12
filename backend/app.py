from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from pydantic import BaseModel

import config
import search
from models import PostModel, MeiliResponse
from instagram_client import search_hashtag, fetch_hashtag_media

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
    search.get_client().health()
    return {"status": "healthy"}

@app.get("/stats")
def stats():
    return search.stats()

class IngestHashtagRequest(BaseModel):
    tag: str
    kind: str = "top"
    limit: int = 30

@app.post("/v1/ingest/instagram/hashtag")
def ingest_hashtag(req: IngestHashtagRequest):
    hashtag_id = search_hashtag(req.tag, config.IG_ACCESS_TOKEN, config.IG_USER_ID)
    if not hashtag_id:
        raise HTTPException(404, "Hashtag introuvable")
    
    media_list = fetch_hashtag_media(hashtag_id, req.kind, req.limit, config.IG_ACCESS_TOKEN, config.IG_USER_ID)
    posts = [PostModel.from_ig_media(m) for m in media_list]
    count = search.index_posts(posts)
    
    return {"inserted": count, "hashtag": req.tag}

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
        filters.append("(" + " OR ".join([f'hashtags = "{h.lower()}"' for h in hashtags]) + ")")
    if username:
        filters.append(f'username = "{username}"')
    
    body = {
        "q": q or "",
        "filter": " AND ".join(filters) if filters else None,
        "limit": limit,
        "page": page,
        "sort": [sort] if sort else None
    }
    
    return search.search(body)

@app.get("/v1/similar/{doc_id}")
def similar(doc_id: str):
    doc = search.get_document(doc_id)
    if not doc:
        raise HTTPException(404, "Document introuvable")
    return search.search({"q": doc.get("caption", ""), "limit": 20})
