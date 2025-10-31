# oauth/oauth_endpoints.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from db.base import get_db
from core.config import settings
from urllib.parse import quote
from .oauth_service import OAuthService

oauth_router = APIRouter(prefix="/api/v1/auth", tags=["oauth"])
oauth_service = OAuthService()

@oauth_router.get("/instagram/start")
def instagram_auth_start(user_id: int = None):
    """Démarrer OAuth Instagram - Redirection directe"""
    auth_data = oauth_service.start_instagram_auth(user_id=user_id)
    return RedirectResponse(url=auth_data["auth_url"])

@oauth_router.get("/instagram/callback")
async def instagram_auth_callback(
    code: str = None,
    state: str = None,
    error: str = None,
    error_description: str = None,
    db: Session = Depends(get_db)
):
    """Callback Instagram"""
    # settings et quote sont déjà importés en haut du fichier
    
    # Déterminer l'URL frontend
    if "veyl.io" in settings.IG_REDIRECT_URI:
        frontend_url = "https://veyl.io/auth/callback"
    else:
        frontend_url = "http://localhost:8081/auth/callback"
    
    # Gérer les erreurs OAuth de Facebook/Instagram
    if error:
        error_desc = quote(error_description or '')
        return RedirectResponse(url=f"{frontend_url}?error={quote(error)}&error_description={error_desc}")
    
    # Vérifier les paramètres requis
    if not code or not state:
        return RedirectResponse(url=f"{frontend_url}?error=missing_params&error_description={quote('Code ou state manquant dans la réponse Instagram')}")
    
    # Traiter le callback
    try:
        return await oauth_service.handle_instagram_callback(code, state, db)
    except HTTPException as e:
        # Rediriger vers le frontend avec l'erreur détaillée
        error_msg = quote(str(e.detail))
        return RedirectResponse(url=f"{frontend_url}?error=oauth_error&error_description={error_msg}")
    except Exception as e:
        # Capturer toutes les autres exceptions
        import traceback
        error_msg = quote(f"Erreur interne: {str(e)}")
        return RedirectResponse(url=f"{frontend_url}?error=internal_error&error_description={error_msg}")

@oauth_router.get("/callback")
async def auth_callback(
    code: str = None,
    state: str = None,
    error: str = None,
    db: Session = Depends(get_db)
):
    """Callback général pour redirection vers localhost"""
    if error:
        # Rediriger vers localhost avec l'erreur
        from fastapi.responses import RedirectResponse
        return RedirectResponse(url=f"http://localhost:8081/auth/callback?error={error}")
    
    if code and state:
        # Appeler le callback Instagram
        return await oauth_service.handle_instagram_callback(code, state, db)
    
    # Rediriger vers localhost par défaut
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="http://localhost:8081/auth/callback")

@oauth_router.get("/facebook/start")
def facebook_auth_start(user_id: int = None):
    """Démarrer OAuth Facebook - Redirection directe"""
    auth_data = oauth_service.start_facebook_auth(user_id=user_id)
    return RedirectResponse(url=auth_data["auth_url"])

@oauth_router.get("/facebook/callback")
async def facebook_auth_callback(
    code: str = None,
    state: str = None,
    error: str = None,
    error_description: str = None,
    db: Session = Depends(get_db)
):
    """Callback Facebook"""
    # Déterminer l'URL frontend
    if "veyl.io" in settings.FB_REDIRECT_URI:
        frontend_url = "https://veyl.io/auth/callback"
    else:
        frontend_url = "http://localhost:8081/auth/callback"
    
    # Gérer les erreurs OAuth de Facebook
    if error:
        error_desc = quote(error_description or '')
        return RedirectResponse(url=f"{frontend_url}?error={quote(error)}&error_description={error_desc}")
    
    # Vérifier les paramètres requis
    if not code or not state:
        return RedirectResponse(url=f"{frontend_url}?error=missing_params&error_description={quote('Code ou state manquant dans la réponse Facebook')}")
    
    # Traiter le callback
    try:
        return await oauth_service.handle_facebook_callback(code, state, db)
    except HTTPException as e:
        # Rediriger vers le frontend avec l'erreur détaillée
        error_msg = quote(str(e.detail))
        return RedirectResponse(url=f"{frontend_url}?error=oauth_error&error_description={error_msg}")
    except Exception as e:
        # Capturer toutes les autres exceptions
        import traceback
        error_msg = quote(f"Erreur interne: {str(e)}")
        return RedirectResponse(url=f"{frontend_url}?error=internal_error&error_description={error_msg}")

@oauth_router.get("/google/start")
def google_auth_start():
    """Démarrer OAuth Google - Redirection directe"""
    auth_data = oauth_service.start_google_auth()
    return RedirectResponse(url=auth_data["auth_url"])

@oauth_router.get("/google/callback")
async def google_auth_callback(
    code: str = None,
    state: str = None,
    error: str = None,
    error_description: str = None,
    db: Session = Depends(get_db)
):
    """Callback Google"""
    # settings et quote sont déjà importés en haut du fichier
    
    # Déterminer l'URL frontend
    if "veyl.io" in settings.GOOGLE_REDIRECT_URI:
        frontend_url = "https://veyl.io/auth/callback"
    else:
        frontend_url = "http://localhost:8081/auth/callback"
    
    # Gérer les erreurs OAuth de Google
    if error:
        error_desc = quote(error_description or '')
        return RedirectResponse(url=f"{frontend_url}?error={quote(error)}&error_description={error_desc}")
    
    # Vérifier les paramètres requis
    if not code or not state:
        return RedirectResponse(url=f"{frontend_url}?error=missing_params&error_description={quote('Code ou state manquant dans la réponse Google')}")
    
    # Traiter le callback
    try:
        return await oauth_service.handle_google_callback(code, state, db)
    except HTTPException as e:
        # Rediriger vers le frontend avec l'erreur détaillée
        error_msg = quote(str(e.detail))
        return RedirectResponse(url=f"{frontend_url}?error=oauth_error&error_description={error_msg}")
    except Exception as e:
        # Capturer toutes les autres exceptions
        import traceback
        error_msg = quote(f"Erreur interne: {str(e)}")
        return RedirectResponse(url=f"{frontend_url}?error=internal_error&error_description={error_msg}")

@oauth_router.get("/tiktok/start")
def tiktok_auth_start():
    """Démarrer OAuth TikTok - Redirection directe"""
    auth_data = oauth_service.start_tiktok_auth()
    return RedirectResponse(url=auth_data["auth_url"])

@oauth_router.get("/tiktok/callback")
async def tiktok_auth_callback(
    code: str = None,
    state: str = None,
    error: str = None,
    error_description: str = None,
    db: Session = Depends(get_db)
):
    """Callback TikTok"""
    if error:
        from fastapi.responses import RedirectResponse
        frontend_url = "https://veyl.io/auth/callback"
        return RedirectResponse(url=f"{frontend_url}?error={error}&error_description={error_description or ''}")
    
    if code and state:
        return await oauth_service.handle_tiktok_callback(code, state, db)
    
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="https://veyl.io/auth/callback?error=missing_params")