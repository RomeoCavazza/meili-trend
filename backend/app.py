from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from typing import Optional, List
from pydantic import BaseModel
import os, time, hmac, hashlib, base64, urllib.parse
import httpx

import config
import search
from models import PostModel, MeiliResponse
from instagram_client import search_hashtag, fetch_hashtag_media

app = FastAPI(title="Insidr API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.insidr.dev", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# OAuth Instagram configuration
IG_APP_ID = os.getenv("IG_APP_ID")
IG_APP_SECRET = os.getenv("IG_APP_SECRET")
IG_REDIRECT_URI = os.getenv("IG_REDIRECT_URI", "https://www.insidr.dev/auth/callback")
STATE_SECRET = os.getenv("OAUTH_STATE_SECRET", "change-me")

SCOPES = ",".join([
    "instagram_business_basic",
    "instagram_business_manage_messages", 
    "instagram_business_manage_comments",
    "instagram_business_content_publish",
    "instagram_business_manage_insights",
])

def _sign_state(raw: str) -> str:
    sig = hmac.new(STATE_SECRET.encode(), raw.encode(), hashlib.sha256).digest()
    return base64.urlsafe_b64encode(sig).decode().rstrip("=")

def _make_state() -> str:
    payload = f"{int(time.time())}"
    return f"{payload}.{_sign_state(payload)}"

def _check_state(state: str, max_age=600) -> bool:
    try:
        ts_str, sig = state.split(".", 1)
        expected = _sign_state(ts_str)
        if not hmac.compare_digest(sig, expected):
            return False
        return (int(time.time()) - int(ts_str)) <= max_age
    except Exception:
        return False

@app.on_event("startup")
def startup():
    print("🚀 Insidr API starting up...")
    try:
        print("Starting bootstrap...")
        search.bootstrap_posts_index()
        print("✅ Bootstrap completed successfully")
    except Exception as e:
        print(f"❌ Bootstrap failed: {e}")
        # Continue anyway - bootstrap will happen on first request
    print("🎉 Startup completed - API ready to serve requests")

@app.get("/")
def root():
    return {"message": "Insidr API is running", "version": "2.0.0", "status": "healthy"}

@app.get("/ping")
def ping():
    return {"pong": True, "timestamp": int(time.time())}

@app.get("/healthz")
def healthz():
    try:
        search.get_client().health()
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/healthz")
def api_healthz():
    """Healthcheck endpoint for Railway"""
    # Temporairement sans MeiliSearch pour debug
    return {"status": "ok", "message": "API running"}

@app.get("/test")
def test():
    """Ultra simple test endpoint"""
    return {"test": "ok", "port": "8000"}

@app.get("/stats")
def stats():
    return search.stats()

@app.post("/admin/seed")
async def admin_seed(request: Request):
    token = request.headers.get("X-Admin-Token")
    if token != config.WEBHOOK_VERIFY_TOKEN:
        raise HTTPException(403, "Unauthorized")
    
    search.bootstrap_posts_index()
    return {"status": "index created", "ready": True}

@app.get("/webhook")
async def verify_webhook(request: Request):
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")
    
    if mode == "subscribe" and token == config.WEBHOOK_VERIFY_TOKEN:
        return int(challenge)
    
    raise HTTPException(403, "Invalid verify token")

@app.post("/webhook")
async def receive_webhook(request: Request):
    body = await request.json()
    # TODO: process webhook events
    return {"status": "received"}

@app.post("/meta/deauth")
async def meta_deauth(request: Request):
    try:
        body = await request.json()
        # TODO: enregistrer l'event de désautorisation si besoin
        return {"status": "ok"}
    except:
        return {"status": "ok"}

@app.get("/auth/instagram/start")
def auth_start():
    if not (IG_APP_ID and IG_REDIRECT_URI):
        raise HTTPException(500, "IG_APP_ID/IG_REDIRECT_URI missing")
    state = _make_state()
    params = {
        "client_id": IG_APP_ID,
        "redirect_uri": IG_REDIRECT_URI,
        "response_type": "code",
        "scope": SCOPES,
        "state": state,
        "force_reauth": "true",
    }
    url = "https://www.instagram.com/oauth/authorize?" + urllib.parse.urlencode(params)
    resp = RedirectResponse(url)
    resp.set_cookie("insidr_oauth_state", state, max_age=600, httponly=True, secure=True, samesite="lax")
    return resp

@app.get("/auth/status")
def auth_status():
    """Vérifier le statut de connexion Instagram"""
    if config.IG_ACCESS_TOKEN and config.IG_USER_ID:
        return {"connected": True, "user_id": config.IG_USER_ID}
    return {"connected": False}

@app.get("/auth/callback")
async def auth_callback(request: Request, code: str | None = None, state: str | None = None, error: str | None = None):
    if error:
        return RedirectResponse(f"https://www.insidr.dev/review?error={error}", status_code=302)
    
    cookie_state = request.cookies.get("insidr_oauth_state")
    if not state or not cookie_state or state != cookie_state or not _check_state(state):
        return RedirectResponse("https://www.insidr.dev/review?error=invalid_state", status_code=302)

    if not code:
        return RedirectResponse("https://www.insidr.dev/review?error=missing_code", status_code=302)

    # 1) Short-lived token
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.get(
            "https://graph.facebook.com/v21.0/oauth/access_token",
            params={
                "client_id": IG_APP_ID,
                "client_secret": IG_APP_SECRET,
                "redirect_uri": IG_REDIRECT_URI,
                "code": code,
            },
        )
        r.raise_for_status()
        data = r.json()
        short_token = data.get("access_token")

        # 2) Long-lived token
        r2 = await client.get(
            "https://graph.facebook.com/v21.0/oauth/access_token",
            params={
                "grant_type": "fb_exchange_token",
                "client_id": IG_APP_ID,
                "client_secret": IG_APP_SECRET,
                "fb_exchange_token": short_token,
            },
        )
        r2.raise_for_status()
        long_token = r2.json().get("access_token")

        # 3) Récupérer Page(s) -> IG Business ID
        pages = await client.get("https://graph.facebook.com/v21.0/me/accounts", params={"access_token": long_token})
        pages.raise_for_status()
        pages_data = pages.json().get("data", [])
        ig_user_id = None
        for p in pages_data:
            page_id = p["id"]
            r3 = await client.get(
                f"https://graph.facebook.com/v21.0/{page_id}",
                params={"fields": "instagram_business_account{username,id}", "access_token": long_token},
            )
            r3.raise_for_status()
            ig = r3.json().get("instagram_business_account")
            if ig and ig.get("id"):
                ig_user_id = ig["id"]
                break

    # 4) Mettre à jour les variables d'environnement
    if long_token and ig_user_id:
        config.IG_ACCESS_TOKEN = long_token
        config.IG_USER_ID = ig_user_id
        print(f"✅ Token OAuth mis à jour: user_id={ig_user_id}")

    return RedirectResponse("https://www.insidr.dev/review?connected=1", status_code=302)

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
