import httpx
import settings

_headers = {"Authorization": f"Bearer {settings.MEILI_MASTER_KEY}"}

def _url(path: str) -> str:
    return f"{settings.MEILI_HOST}{path}"

def ensure_index():
    r = httpx.post(_url("/indexes"),
                   headers=_headers,
                   json={"uid": settings.MEILI_INDEX, "primaryKey": "id"})
    r.raise_for_status()
    
    payload = {
        "searchableAttributes": ["title","text","hashtags","author"],
        "filterableAttributes": ["source","lang","author","date","hashtags"],
        "sortableAttributes": ["date","likes","views"],
        "rankingRules": [
            "words","typo","proximity","attribute","exactness",
            "likes:desc","views:desc","date:desc"
        ]
    }
    r = httpx.patch(_url(f"/indexes/{settings.MEILI_INDEX}/settings"),
                    headers=_headers, json=payload)
    r.raise_for_status()

def add_documents(docs: list[dict]):
    r = httpx.post(_url(f"/indexes/{settings.MEILI_INDEX}/documents"),
                   headers=_headers, json=docs)
    r.raise_for_status()
    return r.json()

def search(body: dict):
    r = httpx.post(_url(f"/indexes/{settings.MEILI_INDEX}/search"),
                   headers=_headers, json=body)
    r.raise_for_status()
    return r.json()

def get_document(doc_id: str) -> dict | None:
    r = httpx.get(_url(f"/indexes/{settings.MEILI_INDEX}/documents/{doc_id}"),
                  headers=_headers)
    if r.status_code == 200:
        return r.json()
    return None

def stats():
    r = httpx.get(_url(f"/indexes/{settings.MEILI_INDEX}/stats"),
                  headers=_headers)
    r.raise_for_status()
    return r.json()
