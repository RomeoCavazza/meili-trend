from fastapi import FastAPI, HTTPException
from fastapi.responses import ORJSONResponse
from fastapi.middleware.cors import CORSMiddleware
from models import Post, SearchQuery, MeiliResponse
import meili, seed

app = FastAPI(title="MeiliTrends API", default_response_class=ORJSONResponse)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/index/init")
def index_init():
    meili.ensure_index()
    return {"status": "index_ready"}

@app.post("/posts/bulk")
def posts_bulk(posts: list[Post]):
    res = meili.add_documents([p.model_dump() for p in posts])
    return {"task": res}

@app.post("/seed")
def load_seed():
    res = seed.load_seed()
    return {"task": res}

@app.post("/search", response_model=MeiliResponse)
def search(q: SearchQuery):
    body = {
        "q": q.q,
        "filter": q.filter,
        "facets": q.facets,
        "sort": q.sort,
        "page": q.page,
        "hitsPerPage": q.hitsPerPage,
        "attributesToHighlight": q.attributesToHighlight
    }
    if q.hybrid:
        body["hybrid"] = q.hybrid
    return meili.search(body)

@app.get("/similar/{doc_id}", response_model=MeiliResponse)
def similar(doc_id: str):
    doc = meili.get_document(doc_id)
    if not doc:
        raise HTTPException(404, "document not found")
    query = f"{doc.get('title', '')} {doc.get('text', '')}"
    body = {"q": query, "filter": None, "hitsPerPage": 20}
    return meili.search(body)

@app.get("/stats")
def stats():
    return meili.stats()
