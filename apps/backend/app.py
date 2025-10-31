# app.py - REFACTORISÉ - SABOTAGE ÉLIMINÉ - SÉCURISÉ - REDIS INTÉGRÉ !
from fastapi import FastAPI  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
import time

# Import des modules unifiés
from auth_unified.auth_endpoints import auth_router
from auth_unified.oauth_endpoints import oauth_router

# Import des modules CRUD
from posts.posts_endpoints import posts_router
from hashtags.hashtags_endpoints import hashtags_router
from platforms.platforms_endpoints import platforms_router
from analytics.analytics_endpoints import analytics_router
from jobs.jobs_endpoints import jobs_router

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
        "https://veyl.io",
        "https://www.veyl.io",
        "https://insidr.dev",
        "https://www.insidr.dev",
        "https://next-insider.vercel.app",
        "http://localhost:3000",  # Dev uniquement
        "http://localhost:5173",  # Dev uniquement
        "http://localhost:8081",  # Dev uniquement - Frontend Insider
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
app.include_router(jobs_router)
from auth_unified.oauth_accounts_endpoints import oauth_accounts_router
app.include_router(oauth_accounts_router)

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

@app.get("/api/v1/meilisearch/test")
def test_meilisearch():
    """Test de connexion Meilisearch"""
    from services.meilisearch_client import meilisearch_service
    
    if not meilisearch_service.client:
        return {
            "status": "error",
            "message": "Meilisearch client non initialisé",
            "check": "Vérifier MEILI_HOST et MEILI_MASTER_KEY"
        }
    
    try:
        stats = meilisearch_service.get_stats()
        return {
            "status": "ok",
            "message": "Meilisearch connecté avec succès",
            "stats": stats,
            "index_name": meilisearch_service.index_name
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Erreur connexion Meilisearch: {str(e)}"
        }

@app.get("/api/v1/tiktok/test")
async def test_tiktok():
    """Test de connexion TikTok API"""
    from services.tiktok_service import tiktok_service
    
    if not tiktok_service.client_id or not tiktok_service.client_secret:
        return {
            "status": "error",
            "message": "TikTok credentials manquants",
            "check": "Vérifier TIKTOK_CLIENT_KEY et TIKTOK_CLIENT_SECRET"
        }
    
    try:
        token = await tiktok_service.get_access_token()
        if token:
            return {
                "status": "ok",
                "message": "TikTok API connecté avec succès",
                "has_token": True,
                "client_id": tiktok_service.client_id[:8] + "..."  # Masquer partiellement
            }
        else:
            return {
                "status": "error",
                "message": "Impossible d'obtenir le token TikTok",
                "check": "Vérifier les credentials ou statut de l'application TikTok"
            }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Erreur connexion TikTok: {str(e)}"
        }

@app.get("/api/v1/oauth/debug/google")
def debug_google_oauth():
    """Debug: voir l'URL OAuth Google générée"""
    from core.config import settings
    from fastapi import HTTPException
    
    try:
        redirect_uri = settings.GOOGLE_REDIRECT_URI
        client_id_set = bool(settings.GOOGLE_CLIENT_ID)
        client_secret_set = bool(settings.GOOGLE_CLIENT_SECRET)
        
        if not client_id_set:
            return {
                "status": "error",
                "message": "GOOGLE_CLIENT_ID non configuré dans Railway",
                "redirect_uri_used": redirect_uri,
                "client_id_set": False,
                "client_secret_set": client_secret_set
            }
        
        from auth_unified.oauth_service import OAuthService
        oauth_service = OAuthService()
        auth_data = oauth_service.start_google_auth()
        
        return {
            "status": "ok",
            "auth_url": auth_data["auth_url"],
            "redirect_uri_used": redirect_uri,
            "client_id_set": client_id_set,
            "client_secret_set": client_secret_set,
            "client_id_preview": settings.GOOGLE_CLIENT_ID[:20] + "..." if settings.GOOGLE_CLIENT_ID else None,
            "state": auth_data["state"],
            "instructions": "Vérifier que 'redirect_uri_used' correspond EXACTEMENT à celui dans Google Console"
        }
    except HTTPException as e:
        return {
            "status": "error",
            "message": e.detail,
            "status_code": e.status_code,
            "redirect_uri": settings.GOOGLE_REDIRECT_URI,
            "client_id_set": bool(settings.GOOGLE_CLIENT_ID)
        }
    except Exception as e:
        import traceback
        return {
            "status": "error",
            "message": str(e),
            "traceback": traceback.format_exc(),
            "redirect_uri": settings.GOOGLE_REDIRECT_URI if hasattr(settings, 'GOOGLE_REDIRECT_URI') else "N/A",
            "client_id_set": bool(settings.GOOGLE_CLIENT_ID) if hasattr(settings, 'GOOGLE_CLIENT_ID') else False
        }

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
