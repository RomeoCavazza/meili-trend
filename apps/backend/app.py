from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from typing import Optional, List
from pydantic import BaseModel
import os, time, hmac, hashlib, base64, urllib.parse
import httpx

import time
from collections import defaultdict
import config
from schemas import PostModel
from instagram_client import search_hashtag, fetch_hashtag_media

# Rate limiting simple
rate_limits = defaultdict(list)

def check_rate_limit(ip: str, max_requests: int = 5, window: int = 3600):
    """Rate limiting simple : 5 requêtes par heure par IP"""
    now = time.time()
    # Nettoyer les anciennes requêtes
    rate_limits[ip] = [req_time for req_time in rate_limits[ip] if now - req_time < window]
    
    if len(rate_limits[ip]) >= max_requests:
        return False
    
    rate_limits[ip].append(now)
    return True

app = FastAPI(title="Insidr API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://www.insidr.dev", 
        "http://localhost:3000",
        "http://localhost:5173",  # Vite dev server
        "https://next-insider.vercel.app",  # NextGen Vercel deployment
    ],
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
    print("🎉 Startup completed - API ready to serve requests (Direct Instagram scraping)")

@app.get("/")
def root():
    return {"message": "Insidr API is running", "version": "2.0.0", "status": "healthy"}

@app.get("/ping")
def ping():
    return {"pong": True, "timestamp": int(time.time())}

@app.get("/healthz")
def healthz():
    try:
        # TODO: Ajouter health check MeiliSearch quand disponible
        return {"status": "ok", "message": "API running"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/healthz")
def api_healthz():
    """Healthcheck endpoint for Railway"""
    # Recherche directe Instagram
    return {"status": "ok", "message": "API running"}

@app.get("/test")
def test():
    """Ultra simple test endpoint"""
    return {"test": "ok", "port": "8000"}

@app.get("/stats")
def stats():
    return {"message": "Direct Instagram scraping"}

@app.get("/debug/token")
def debug_token():
    """Debug endpoint to test Instagram token"""
    import config
    
    if not config.IG_ACCESS_TOKEN:
        return {"error": "No IG_ACCESS_TOKEN configured"}
    
    # Test token with a simple API call
    import httpx

@app.get("/api/debug/ig")
async def debug_instagram():
    """Debug endpoint pour tester l'API Instagram"""
    try:
        # Vérifier les variables d'environnement
        token = config.IG_ACCESS_TOKEN
        user_id = config.IG_USER_ID
        
        debug_info = {
            "has_token": bool(token),
            "has_user_id": bool(user_id),
            "token_type": "System User" if token and "EAAG" in token else "User Token" if token else "None",
            "token_length": len(token) if token else 0,
            "user_id": user_id,
            "tests": {}
        }
        
        if not token or not user_id:
            debug_info["error"] = "Variables d'environnement manquantes"
            return debug_info
        
        # Test 1: Recherche de hashtag
        try:
            hashtag_url = f"https://graph.facebook.com/v19.0/ig_hashtag_search?user_id={user_id}&q=fashion&access_token={token}"
            async with httpx.AsyncClient() as client:
                response = await client.get(hashtag_url)
                debug_info["tests"]["hashtag_search"] = {
                    "status_code": response.status_code,
                    "response": response.json() if response.status_code == 200 else response.text
                }
        except Exception as e:
            debug_info["tests"]["hashtag_search"] = {"error": str(e)}
        
        # Test 2: Informations utilisateur
        try:
            user_url = f"https://graph.facebook.com/v19.0/{user_id}?fields=id,name,account_type&access_token={token}"
            async with httpx.AsyncClient() as client:
                response = await client.get(user_url)
                debug_info["tests"]["user_info"] = {
                    "status_code": response.status_code,
                    "response": response.json() if response.status_code == 200 else response.text
                }
        except Exception as e:
            debug_info["tests"]["user_info"] = {"error": str(e)}
        
        return debug_info
        
    except Exception as e:
        return {"error": str(e)}

@app.post("/admin/seed")
async def admin_seed(request: Request):
    return {"message": "Direct Instagram scraping"}

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

# Endpoint d'ingestion supprimé - Utilisation de la recherche directe

@app.get("/v1/search/posts")
def search_posts(
    q: Optional[str] = None,
    hashtags: Optional[List[str]] = Query(None),
    username: Optional[str] = None,
    sort: str = "score_trend:desc",
    limit: int = Query(5, ge=1, le=10),
    page: int = Query(1, ge=1),
    request: Request = None
):
    """Recherche directe Instagram"""
    
    # Rate limiting
    if request:
        client_ip = request.client.host
        if not check_rate_limit(client_ip, max_requests=3, window=3600):  # 3 requêtes/heure
            return {"error": "Rate limit exceeded. Max 3 requests per hour.", "status": 429}
    
    if not q:
        return {"hits": [], "estimatedTotalHits": 0, "message": "Recherche vide"}
    
    print(f"🔍 Recherche directe Instagram: {q}")
    
    # Scraping direct Instagram
    hashtag_id = search_hashtag(q, config.IG_ACCESS_TOKEN, config.IG_USER_ID)
    if not hashtag_id:
        return {"hits": [], "estimatedTotalHits": 0, "message": f"Hashtag '{q}' introuvable"}
    
    # Récupérer les médias
    media_list = fetch_hashtag_media(hashtag_id, "top", limit, config.IG_ACCESS_TOKEN, config.IG_USER_ID)
    posts = [PostModel.from_ig_media(m) for m in media_list]
    
    print(f"📸 Posts trouvés: {len(posts)}")
    
    # Formatage pour le frontend
    hits = [p.model_dump() for p in posts]
    for hit in hits:
        if hit.get("posted_at"):
            hit["posted_at"] = hit["posted_at"].isoformat()
    
    return {
        "hits": hits,
        "estimatedTotalHits": len(hits),
        "query": q,
        "processingTimeMs": 0
    }
