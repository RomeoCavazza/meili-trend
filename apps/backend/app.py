# app.py - REFACTORISÉ - SABOTAGE ÉLIMINÉ - SÉCURISÉ - REDIS INTÉGRÉ !
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time

# Import des modules unifiés
from auth_unified.auth_endpoints import auth_router
from auth_unified.oauth_endpoints import oauth_router

# Import des modules CRUD
from posts.posts_endpoints import posts_router
from hashtags.hashtags_endpoints import hashtags_router
from platforms.platforms_endpoints import platforms_router
from analytics.analytics_endpoints import analytics_router

# Import Redis et rate limiting
from core.redis_client import redis
from core.ratelimit import setup_rate_limit, limiter

app = FastAPI(
    title="Insider Trends API",
    version="2.0.0",
    description="API refactorisée pour l'analyse des tendances - SÉCURISÉE"
)

# Configuration du rate limiting avec Redis
setup_rate_limit(app)

# CORS - SÉCURISÉ
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://www.insidr.dev", 
        "https://next-insider.vercel.app",
        "http://localhost:3000",  # Dev uniquement
        "http://localhost:5173",  # Dev uniquement
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Content-Type", 
        "Authorization", 
        "X-Requested-With",
        "Accept",
        "Origin"
    ],
    expose_headers=["X-Total-Count"],
    max_age=3600,  # Cache preflight requests
)

# Inclusion des routers
app.include_router(auth_router)
app.include_router(oauth_router)
app.include_router(posts_router)
app.include_router(hashtags_router)
app.include_router(platforms_router)
app.include_router(analytics_router)

# =====================================================
# ENDPOINTS DE BASE - SIMPLES ET PROPRES
# =====================================================

@app.get("/")
@limiter.limit("10/minute")
def root(request):
    """Endpoint racine - Rate limited"""
    return {
        "message": "Insider Trends API",
        "version": "2.0.0",
        "status": "healthy",
        "docs": "/docs"
    }

@app.get("/ping")
@limiter.limit("30/minute")
def ping(request):
    """Health check simple - Rate limited"""
    return {"pong": True, "timestamp": int(time.time())}

@app.get("/healthz")
@limiter.limit("60/minute")
def healthz(request):
    """Health check Kubernetes - Rate limited"""
    return {"status": "ok", "message": "API running"}

# =====================================================
# LIFECYCLE EVENTS - REDIS STARTUP CHECK
# =====================================================

@app.on_event("startup")
async def check_redis():
    """Vérifie la connexion Redis au démarrage"""
    try:
        await redis.ping()
        print("✅ Redis OK - Rate limiting activé")
    except Exception as e:
        print(f"⚠️ Redis KO: {e} - Rate limiting désactivé")
