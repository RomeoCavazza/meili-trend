# oauth/oauth_service.py
import time
import httpx
from typing import Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException
from core.config import settings
from db.models import User
from .schemas import TokenResponse
from .auth_service import AuthService

class OAuthService:
    def __init__(self):
        self.auth_service = AuthService()
    
    def create_or_get_user(self, db: Session, email: str, name: str, role: str = "user") -> User:
        """Créer ou récupérer un utilisateur"""
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(email=email, name=name, role=role)
            db.add(user)
            db.commit()
            db.refresh(user)
        return user
    
    def start_instagram_auth(self) -> Dict[str, str]:
        """Démarrer le processus OAuth Instagram"""
        if not settings.IG_APP_ID:
            raise HTTPException(status_code=500, detail="IG_APP_ID non configuré")
        
        state = str(int(time.time()))
        scopes = "instagram_business_basic,instagram_business_manage_messages"
        
        params = {
            "client_id": settings.IG_APP_ID,
            "redirect_uri": settings.IG_REDIRECT_URI,
            "response_type": "code",
            "scope": scopes,
            "state": state,
        }
        
        auth_url = "https://www.instagram.com/oauth/authorize?" + "&".join([f"{k}={v}" for k, v in params.items()])
        
        return {
            "auth_url": auth_url,
            "state": state
        }
    
    async def handle_instagram_callback(self, code: str, state: str, db: Session) -> TokenResponse:
        """Gérer le callback OAuth Instagram"""
        if not settings.IG_APP_SECRET:
            raise HTTPException(status_code=500, detail="IG_APP_SECRET non configuré")
        
        async with httpx.AsyncClient(timeout=20) as client:
            # 1) Short-lived token
            r = await client.get(
                "https://graph.facebook.com/v21.0/oauth/access_token",
                params={
                    "client_id": settings.IG_APP_ID,
                    "client_secret": settings.IG_APP_SECRET,
                    "redirect_uri": settings.IG_REDIRECT_URI,
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
                    "client_id": settings.IG_APP_ID,
                    "client_secret": settings.IG_APP_SECRET,
                    "fb_exchange_token": short_token,
                },
            )
            r2.raise_for_status()
            long_token = r2.json().get("access_token")

            # 3) Récupérer Page(s) -> IG Business ID
            pages = await client.get(
                "https://graph.facebook.com/v21.0/me/accounts",
                params={"access_token": long_token}
            )
            pages.raise_for_status()
            pages_data = pages.json().get("data", [])
            
            ig_user_id = None
            for p in pages_data:
                page_id = p["id"]
                r3 = await client.get(
                    f"https://graph.facebook.com/v21.0/{page_id}",
                    params={
                        "fields": "instagram_business_account{username,id}",
                        "access_token": long_token
                    },
                )
                r3.raise_for_status()
                ig = r3.json().get("instagram_business_account")
                if ig and ig.get("id"):
                    ig_user_id = ig["id"]
                    break

        if long_token and ig_user_id:
            # Créer ou récupérer l'utilisateur
            user = self.create_or_get_user(
                db, 
                email=f"instagram_{ig_user_id}@insidr.dev",
                name=f"Instagram User {ig_user_id}"
            )
            
            # Créer le token JWT
            access_token = self.auth_service.create_access_token(data={"sub": str(user.id)})
            
            return TokenResponse(
                access_token=access_token,
                token_type="bearer",
                user=user
            )
        
        raise HTTPException(status_code=400, detail="Erreur OAuth Instagram")
    
    def start_facebook_auth(self) -> Dict[str, str]:
        """Démarrer le processus OAuth Facebook"""
        if not settings.FB_APP_ID:
            raise HTTPException(status_code=500, detail="FB_APP_ID non configuré")
        
        state = str(int(time.time()))
        scopes = "email,public_profile"
        
        params = {
            "client_id": settings.FB_APP_ID,
            "redirect_uri": settings.FB_REDIRECT_URI,
            "response_type": "code",
            "scope": scopes,
            "state": state,
        }
        
        auth_url = "https://www.facebook.com/v21.0/dialog/oauth?" + "&".join([f"{k}={v}" for k, v in params.items()])
        
        return {
            "auth_url": auth_url,
            "state": state
        }
    
    async def handle_facebook_callback(self, code: str, state: str, db: Session) -> TokenResponse:
        """Gérer le callback OAuth Facebook"""
        if not settings.FB_APP_SECRET:
            raise HTTPException(status_code=500, detail="FB_APP_SECRET non configuré")
        
        async with httpx.AsyncClient(timeout=20) as client:
            # 1) Access token
            r = await client.get(
                "https://graph.facebook.com/v21.0/oauth/access_token",
                params={
                    "client_id": settings.FB_APP_ID,
                    "client_secret": settings.FB_APP_SECRET,
                    "redirect_uri": settings.FB_REDIRECT_URI,
                    "code": code,
                },
            )
            r.raise_for_status()
            data = r.json()
            access_token = data.get("access_token")
            
            # 2) User info
            r2 = await client.get(
                "https://graph.facebook.com/v21.0/me",
                params={
                    "fields": "id,name,email",
                    "access_token": access_token
                }
            )
            r2.raise_for_status()
            user_info = r2.json()
            
            fb_user_id = user_info.get("id")
            email = user_info.get("email")
            name = user_info.get("name")
            
            if access_token and fb_user_id:
                # Créer ou récupérer l'utilisateur
                user = self.create_or_get_user(db, email=email, name=name)
                
                # Créer le token JWT
                jwt_token = self.auth_service.create_access_token(data={"sub": str(user.id)})
                
                return TokenResponse(
                    access_token=jwt_token,
                    token_type="bearer",
                    user=user
                )
        
        raise HTTPException(status_code=400, detail="Erreur OAuth Facebook")
