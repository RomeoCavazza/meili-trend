# oauth/oauth_endpoints.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from db.base import get_db
from .oauth_service import OAuthService

oauth_router = APIRouter(prefix="/api/v1/auth", tags=["oauth"])
oauth_service = OAuthService()

@oauth_router.get("/instagram/start")
def instagram_auth_start():
    """Démarrer OAuth Instagram - Redirection directe"""
    auth_data = oauth_service.start_instagram_auth()
    return RedirectResponse(url=auth_data["auth_url"])

@oauth_router.get("/instagram/callback")
async def instagram_auth_callback(
    code: str,
    state: str,
    db: Session = Depends(get_db)
):
    """Callback Instagram"""
    return await oauth_service.handle_instagram_callback(code, state, db)

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
def facebook_auth_start():
    """Démarrer OAuth Facebook"""
    return oauth_service.start_facebook_auth()

@oauth_router.get("/facebook/callback")
async def facebook_auth_callback(
    code: str,
    state: str,
    db: Session = Depends(get_db)
):
    """Callback Facebook"""
    return await oauth_service.handle_facebook_callback(code, state, db)

@oauth_router.get("/google/start")
def google_auth_start():
    """Démarrer OAuth Google - Redirection directe"""
    auth_data = oauth_service.start_google_auth()
    return RedirectResponse(url=auth_data["auth_url"])

@oauth_router.get("/google/callback")
async def google_auth_callback(
    code: str,
    state: str,
    db: Session = Depends(get_db)
):
    """Callback Google"""
    return await oauth_service.handle_google_callback(code, state, db)

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