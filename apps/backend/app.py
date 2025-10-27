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

# CORS - SÉCURISÉ - CONFIGURÉ POUR PRODUCTION
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://www.insidr.dev", 
        "http://www.insidr.dev",  # Avec et sans HTTPS
        "https://next-insider.vercel.app",
        "http://localhost:3000",  # Dev uniquement
        "http://localhost:5173",  # Dev uniquement
        "http://localhost:8081",  # Dev uniquement - Frontend Insider
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=[
        "Content-Type", 
        "Authorization", 
        "X-Requested-With",
        "Accept",
        "Origin",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers",
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
def root():
    """Endpoint racine - pas de rate limit (health check)"""
    return {
        "message": "Insider Trends API",
        "version": "2.0.0",
        "status": "healthy",
        "docs": "/docs"
    }

@app.get("/ping")
def ping():
    """Health check simple - pas de rate limit"""
    return {"pong": True, "timestamp": int(time.time())}

@app.get("/healthz")
@app.get("/api/healthz")
def healthz():
    """Health check Kubernetes - pas de rate limit"""
    return {"status": "ok", "message": "API running"}

# =====================================================
# LIFECYCLE EVENTS - REDIS STARTUP CHECK
# =====================================================

@app.on_event("startup")
async def startup_event():
    """Démarrage de l'application - Création des tables"""
    # Vérifier Redis
    try:
        await redis.ping()
        print("✅ Redis OK - Rate limiting activé")
    except Exception as e:
        print(f"⚠️ Redis KO: {e} - Rate limiting désactivé")
    
    # Créer les tables si elles n'existent pas
    print("🔄 Création des tables de base de données...")
    try:
        from db.base import Base, engine
        Base.metadata.create_all(bind=engine)
        print("✅ Tables de base de données créées/vérifiées")
    except Exception as e:
        print(f"❌ Erreur création tables: {e}")
        import traceback
        traceback.print_exc()
        raise  # Propager l'erreur pour arrêter le démarrage si problème
