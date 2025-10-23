# oauth/oauth_endpoints.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.base import get_db
from .oauth_service import OAuthService

oauth_router = APIRouter(prefix="/api/v1/auth", tags=["oauth"])
oauth_service = OAuthService()

@oauth_router.get("/instagram/start")
def instagram_auth_start():
    """Démarrer OAuth Instagram"""
    return oauth_service.start_instagram_auth()

@oauth_router.get("/instagram/callback")
async def instagram_auth_callback(
    code: str,
    state: str,
    db: Session = Depends(get_db)
):
    """Callback Instagram"""
    return await oauth_service.handle_instagram_callback(code, state, db)

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
