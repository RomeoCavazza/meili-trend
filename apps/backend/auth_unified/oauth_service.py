# oauth/oauth_service.py
import os
import time
import logging
import httpx  # type: ignore
from typing import Dict, Any
from sqlalchemy.orm import Session  # type: ignore
from fastapi import HTTPException  # type: ignore
from core.config import settings
from db.models import User
from .schemas import TokenResponse
from .auth_service import AuthService

logger = logging.getLogger(__name__)

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
        """Démarrer le processus OAuth Instagram (via Facebook OAuth pour Instagram Business)"""
        logger.info("🚀 Démarrage OAuth Instagram")
        if not settings.IG_APP_ID:
            logger.error("❌ IG_APP_ID non configuré")
            raise HTTPException(status_code=500, detail="IG_APP_ID non configuré dans Railway")
        
        # Nettoyer les valeurs pour enlever les espaces et caractères indésirables
        app_id = settings.IG_APP_ID.strip() if settings.IG_APP_ID else None
        redirect_uri = settings.IG_REDIRECT_URI.strip() if settings.IG_REDIRECT_URI else None
        
        if not app_id:
            raise HTTPException(status_code=500, detail="IG_APP_ID vide ou non configuré dans Railway")
        if not redirect_uri:
            raise HTTPException(status_code=500, detail="IG_REDIRECT_URI vide ou non configuré dans Railway")
        
        # Valider le format de l'App ID Facebook (doit être numérique, 15-17 chiffres)
        if not app_id.isdigit():
            raise HTTPException(
                status_code=500,
                detail=f"IG_APP_ID invalide: '{app_id}' contient des caractères non numériques. "
                       f"L'App ID Facebook doit être un nombre de 15-17 chiffres uniquement. "
                       f"Vérifiez dans Railway que IG_APP_ID ne contient pas d'espaces ou de caractères invalides."
            )
        
        if not (15 <= len(app_id) <= 17):
            raise HTTPException(
                status_code=500,
                detail=f"IG_APP_ID invalide: '{app_id}' a {len(app_id)} chiffres. "
                       f"L'App ID Facebook doit avoir entre 15 et 17 chiffres. "
                       f"App ID actuel (premiers caractères): {app_id[:10]}..."
            )
        
        state = str(int(time.time()))
        # Scopes pour Instagram Business API (via Facebook)
        # Scopes valides: pages_show_list, pages_read_engagement, instagram_basic, pages_manage_posts (si besoin)
        # instagram_business_basic n'existe plus - utiliser instagram_basic à la place
        scopes = "pages_show_list,pages_read_engagement,instagram_basic"
        
        # Construire l'URL manuellement avec quote (comme pour Google) pour éviter les problèmes d'encodage
        from urllib.parse import quote
        query_parts = []
        params = {
            "client_id": app_id,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": scopes,
            "state": state,
        }
        
        for key, value in params.items():
            # Pour redirect_uri, garder : et / non encodés
            if key == "redirect_uri":
                encoded_value = quote(str(value), safe="/:")
            else:
                # Pour les autres paramètres, encoder normalement avec quote (pas quote_plus)
                encoded_value = quote(str(value), safe="")
            query_parts.append(f"{quote(str(key), safe='')}={encoded_value}")
        
        # Utiliser Facebook OAuth pour Instagram Business API
        auth_url = "https://www.facebook.com/v21.0/dialog/oauth?" + "&".join(query_parts)
        
        logger.info(f"✅ URL OAuth Instagram générée: {auth_url[:100]}...")
        logger.info(f"📋 Redirect URI: {redirect_uri}")
        logger.info(f"📋 App ID: {app_id[:10]}...")
        
        return {
            "auth_url": auth_url,
            "state": state
        }
    
    async def handle_instagram_callback(self, code: str, state: str, db: Session) -> TokenResponse:
        """Gérer le callback OAuth Instagram (via Facebook OAuth)"""
        logger.info(f"📥 Callback Instagram reçu - Code: {code[:20]}..., State: {state}")
        if not settings.IG_APP_SECRET:
            logger.error("❌ IG_APP_SECRET non configuré")
            raise HTTPException(status_code=500, detail="IG_APP_SECRET non configuré")
        
        # Nettoyer les valeurs pour enlever les espaces et caractères indésirables
        app_id = settings.IG_APP_ID.strip() if settings.IG_APP_ID else None
        app_secret = settings.IG_APP_SECRET.strip() if settings.IG_APP_SECRET else None
        redirect_uri = settings.IG_REDIRECT_URI.strip() if settings.IG_REDIRECT_URI else None
        
        if not app_id:
            raise HTTPException(status_code=500, detail="IG_APP_ID vide ou non configuré dans Railway")
        if not app_secret:
            raise HTTPException(status_code=500, detail="IG_APP_SECRET vide ou non configuré dans Railway")
        if not redirect_uri:
            raise HTTPException(status_code=500, detail="IG_REDIRECT_URI vide ou non configuré dans Railway")
        
        async with httpx.AsyncClient(timeout=20) as client:
            # 1) Short-lived token
            try:
                r = await client.get(
                    "https://graph.facebook.com/v21.0/oauth/access_token",
                    params={
                        "client_id": app_id,
                        "client_secret": app_secret,
                        "redirect_uri": redirect_uri,
                        "code": code,
                    },
                )
                if r.status_code != 200:
                    error_detail = r.text
                    error_json = r.json() if r.headers.get("content-type", "").startswith("application/json") else {}
                    error_msg = error_json.get("error", {}).get("message", "unknown_error") if isinstance(error_json.get("error"), dict) else error_json.get("error", "unknown_error")
                    error_desc = error_detail
                    
                    logger.error(f"❌ Erreur Instagram token exchange: {r.status_code} - {error_msg}")
                    logger.error(f"📋 Réponse complète: {error_detail}")
                    
                    # Message détaillé pour redirect_uri invalide
                    if "redirect_uri" in error_desc.lower() or "Invalid redirect" in error_desc:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Erreur Instagram OAuth: Invalid redirect_uri. "
                                   f"Vérifiez dans Facebook Developer Console:\n"
                                   f"1. Le Redirect URI '{redirect_uri}' est configuré EXACTEMENT (même casse, même slash final) dans 'Valid OAuth Redirect URIs'\n"
                                   f"2. L'App ID '{app_id[:20]}...' correspond EXACTEMENT à celui dans Railway\n"
                                   f"3. L'App Secret dans Railway correspond à l'App Secret associé à cet App ID"
                        )
                    else:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Erreur Instagram token: {r.status_code} - {error_msg}: {error_desc}. Redirect URI utilisé: {redirect_uri}"
                        )
                data = r.json()
                short_token = data.get("access_token")
                if not short_token:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Access token manquant dans la réponse Facebook/Instagram. Réponse: {data}"
                    )
            except HTTPException:
                raise
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Erreur requête Instagram token: {str(e)}")

            # 2) Long-lived token
            r2 = await client.get(
                "https://graph.facebook.com/v21.0/oauth/access_token",
                params={
                    "grant_type": "fb_exchange_token",
                    "client_id": app_id,
                    "client_secret": app_secret,
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
            
            # Sauvegarder le token Instagram dans OAuthAccount (pour usage API futur)
            from db.models import OAuthAccount
            oauth_account = db.query(OAuthAccount).filter(
                OAuthAccount.user_id == user.id,
                OAuthAccount.provider == "instagram"
            ).first()
            
            if oauth_account:
                oauth_account.access_token = long_token
                oauth_account.provider_user_id = str(ig_user_id)
            else:
                oauth_account = OAuthAccount(
                    user_id=user.id,
                    provider="instagram",
                    provider_user_id=str(ig_user_id),
                    access_token=long_token
                )
                db.add(oauth_account)
            
            db.commit()
            
            # Créer le token JWT
            access_token = self.auth_service.create_access_token(data={"sub": str(user.id)})
            
            # Rediriger vers le frontend avec le token
            from fastapi.responses import RedirectResponse  # type: ignore
            # settings est déjà importé en haut du fichier
            # Utiliser l'URL de production ou localhost selon l'environnement
            if os.getenv("ENVIRONMENT") == "production" or "veyl.io" in settings.IG_REDIRECT_URI:
                frontend_url = "https://veyl.io/auth/callback"
            else:
                frontend_url = "http://localhost:8081/auth/callback"
            redirect_url = f"{frontend_url}?token={access_token}&user_id={user.id}&email={user.email}&name={user.name}"
            return RedirectResponse(url=redirect_url)
        
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
        
        from urllib.parse import urlencode
        auth_url = "https://www.facebook.com/v21.0/dialog/oauth?" + urlencode(params)
        
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
            
            if not fb_user_id:
                raise HTTPException(status_code=400, detail="Impossible de récupérer l'ID utilisateur Facebook")
            
            if not access_token:
                raise HTTPException(status_code=400, detail="Access token manquant dans la réponse Facebook")
            
            # Email peut être None selon les permissions
            if not email:
                # Utiliser l'ID Facebook comme email temporaire
                email = f"facebook_{fb_user_id}@insidr.dev"
            
            if access_token and fb_user_id:
                # Créer ou récupérer l'utilisateur
                user = self.create_or_get_user(db, email=email, name=name or f"Facebook User {fb_user_id}")
                
                # Sauvegarder le token Facebook dans OAuthAccount (pour cohérence)
                from db.models import OAuthAccount
                oauth_account = db.query(OAuthAccount).filter(
                    OAuthAccount.user_id == user.id,
                    OAuthAccount.provider == "facebook"
                ).first()
                
                if oauth_account:
                    oauth_account.access_token = access_token
                    oauth_account.provider_user_id = str(fb_user_id)
                else:
                    oauth_account = OAuthAccount(
                        user_id=user.id,
                        provider="facebook",
                        provider_user_id=str(fb_user_id),
                        access_token=access_token
                    )
                    db.add(oauth_account)
                
                db.commit()
                
                # Créer le token JWT
                jwt_token = self.auth_service.create_access_token(data={"sub": str(user.id)})
                
                # Rediriger vers le frontend avec le token
                from fastapi.responses import RedirectResponse  # type: ignore
                from urllib.parse import quote
                # settings est déjà importé en haut du fichier
                # Utiliser l'URL de production ou localhost selon l'environnement
                if os.getenv("ENVIRONMENT") == "production" or "veyl.io" in settings.FB_REDIRECT_URI:
                    frontend_url = "https://veyl.io/auth/callback"
                else:
                    frontend_url = "http://localhost:8081/auth/callback"
                # Encoder correctement tous les paramètres pour éviter les problèmes avec les caractères spéciaux
                encoded_token = quote(jwt_token, safe='')
                encoded_email = quote(email or '', safe='')
                encoded_name = quote(name or '', safe='')
                redirect_url = f"{frontend_url}?token={encoded_token}&user_id={user.id}&email={encoded_email}&name={encoded_name}"
                return RedirectResponse(url=redirect_url)
        
        raise HTTPException(status_code=400, detail="Erreur OAuth Facebook")
    
    def start_google_auth(self) -> Dict[str, str]:
        """Démarrer le processus OAuth Google"""
        if not settings.GOOGLE_CLIENT_ID:
            raise HTTPException(status_code=500, detail="GOOGLE_CLIENT_ID non configuré")
        
        # Nettoyer le client_id pour enlever les espaces et caractères indésirables
        client_id = settings.GOOGLE_CLIENT_ID.strip()
        redirect_uri = settings.GOOGLE_REDIRECT_URI
        
        state = str(int(time.time()))
        scopes = "openid email profile"
        
        params = {
            "client_id": client_id,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": scopes,
            "state": state,
            "access_type": "offline",
            "prompt": "consent"
        }
        
        # Construire l'URL manuellement avec quote (pas quote_plus) pour éviter les +
        from urllib.parse import quote
        query_parts = []
        for key, value in params.items():
            # Pour redirect_uri, garder : et / non encodés
            if key == "redirect_uri":
                encoded_value = quote(str(value), safe="/:")
            else:
                # Pour les autres paramètres, encoder normalement avec quote (pas quote_plus)
                # quote encode les espaces en %20, pas en +
                encoded_value = quote(str(value), safe="")
            query_parts.append(f"{quote(str(key), safe='')}={encoded_value}")
        auth_url = "https://accounts.google.com/o/oauth2/v2/auth?" + "&".join(query_parts)
        
        return {
            "auth_url": auth_url,
            "state": state
        }
    
    async def handle_google_callback(self, code: str, state: str, db: Session) -> TokenResponse:
        """Gérer le callback OAuth Google"""
        if not settings.GOOGLE_CLIENT_SECRET:
            raise HTTPException(status_code=500, detail="GOOGLE_CLIENT_SECRET non configuré")
        
        # Nettoyer les valeurs pour enlever les espaces et caractères indésirables
        client_id = settings.GOOGLE_CLIENT_ID.strip() if settings.GOOGLE_CLIENT_ID else None
        client_secret = settings.GOOGLE_CLIENT_SECRET.strip() if settings.GOOGLE_CLIENT_SECRET else None
        redirect_uri = settings.GOOGLE_REDIRECT_URI.strip() if settings.GOOGLE_REDIRECT_URI else None
        
        if not client_id:
            raise HTTPException(status_code=500, detail="GOOGLE_CLIENT_ID vide ou non configuré dans Railway")
        if not client_secret:
            raise HTTPException(status_code=500, detail="GOOGLE_CLIENT_SECRET vide ou non configuré dans Railway")
        if not redirect_uri:
            raise HTTPException(status_code=500, detail="GOOGLE_REDIRECT_URI vide ou non configuré dans Railway")
        
        async with httpx.AsyncClient(timeout=20) as client:
            # 1) Access token
            try:
                r = await client.post(
                    "https://oauth2.googleapis.com/token",
                    data={
                        "client_id": client_id,
                        "client_secret": client_secret,
                        "redirect_uri": redirect_uri,
                        "code": code,
                        "grant_type": "authorization_code"
                    }
                )
                if r.status_code != 200:
                    error_detail = r.text
                    error_json = r.json() if r.headers.get("content-type", "").startswith("application/json") else {}
                    error_msg = error_json.get("error", "unknown_error")
                    error_desc = error_json.get("error_description", error_detail)
                    
                    # Message détaillé pour invalid_client
                    if error_msg == "invalid_client":
                        raise HTTPException(
                            status_code=400,
                            detail=f"Erreur Google OAuth: invalid_client - {error_desc}. "
                                   f"Vérifiez dans Google Cloud Console:\n"
                                   f"1. Le Client ID '{client_id[:30]}...' correspond EXACTEMENT à celui dans Railway\n"
                                   f"2. Le Client Secret dans Railway correspond au Client Secret associé à ce Client ID\n"
                                   f"3. Le Redirect URI '{redirect_uri}' est configuré EXACTEMENT (même casse, même slash final) dans 'Authorized redirect URIs'\n"
                                   f"4. L'OAuth consent screen est configuré et publié (pas seulement en mode test)"
                        )
                    else:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Erreur Google token: {r.status_code} - {error_msg}: {error_desc}. Redirect URI utilisé: {redirect_uri}"
                        )
                token_data = r.json()
                access_token = token_data.get("access_token")
                if not access_token:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Access token manquant dans la réponse Google. Réponse: {token_data}"
                    )
            except HTTPException:
                raise
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Erreur requête Google token: {str(e)}")
            
            # 2) User info
            try:
                r2 = await client.get(
                    "https://www.googleapis.com/oauth2/v2/userinfo",
                    headers={"Authorization": f"Bearer {access_token}"}
                )
                if r2.status_code != 200:
                    error_detail = r2.text
                    raise HTTPException(
                        status_code=400,
                        detail=f"Erreur récupération user info Google: {r2.status_code} - {error_detail}"
                    )
                user_info = r2.json()
            except HTTPException:
                raise
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Erreur requête user info Google: {str(e)}")
            
            google_user_id = user_info.get("id")
            email = user_info.get("email")
            name = user_info.get("name")
            
            if not google_user_id:
                raise HTTPException(status_code=400, detail="Impossible de récupérer l'ID utilisateur Google")
            
            if not email:
                raise HTTPException(status_code=400, detail="Impossible de récupérer l'email Google")
            
            try:
                # Créer ou récupérer l'utilisateur
                user = self.create_or_get_user(db, email=email, name=name or email.split("@")[0])
                
                # Sauvegarder le token Google dans OAuthAccount (pour cohérence, même si pas utilisé pour API)
                from db.models import OAuthAccount
                oauth_account = db.query(OAuthAccount).filter(
                    OAuthAccount.user_id == user.id,
                    OAuthAccount.provider == "google"
                ).first()
                
                if oauth_account:
                    oauth_account.access_token = access_token
                    oauth_account.provider_user_id = str(google_user_id)
                else:
                    oauth_account = OAuthAccount(
                        user_id=user.id,
                        provider="google",
                        provider_user_id=str(google_user_id),
                        access_token=access_token
                    )
                    db.add(oauth_account)
                
                db.commit()
                
                # Créer le token JWT
                jwt_token = self.auth_service.create_access_token(data={"sub": str(user.id)})
                
                # Rediriger vers le frontend avec le token
                from fastapi.responses import RedirectResponse  # type: ignore
                from urllib.parse import quote
                # Utiliser l'URL de production ou localhost selon l'environnement
                # settings est déjà importé en haut du fichier
                if os.getenv("ENVIRONMENT") == "production" or "veyl.io" in settings.GOOGLE_REDIRECT_URI:
                    frontend_url = "https://veyl.io/auth/callback"
                else:
                    frontend_url = "http://localhost:8081/auth/callback"
                # Encoder correctement tous les paramètres pour éviter les problèmes avec les caractères spéciaux du JWT
                encoded_token = quote(jwt_token, safe='')
                encoded_email = quote(email or '', safe='')
                encoded_name = quote(name or '', safe='')
                redirect_url = f"{frontend_url}?token={encoded_token}&user_id={user.id}&email={encoded_email}&name={encoded_name}"
                return RedirectResponse(url=redirect_url)
            except Exception as e:
                import traceback
                db.rollback()
                raise HTTPException(
                    status_code=500,
                    detail=f"Erreur lors de la création/récupération utilisateur: {str(e)}. Traceback: {traceback.format_exc()}"
                )
        
        raise HTTPException(status_code=400, detail="Erreur OAuth Google: access_token ou google_user_id manquant")
    
    def start_tiktok_auth(self) -> Dict[str, str]:
        """Démarrer le processus OAuth TikTok"""
        if not settings.TIKTOK_CLIENT_KEY:
            raise HTTPException(status_code=500, detail="TIKTOK_CLIENT_KEY non configuré")
        
        client_key = settings.TIKTOK_CLIENT_KEY
        redirect_uri = settings.TIKTOK_REDIRECT_URI
        
        # Générer un state sécurisé
        import secrets
        state = secrets.token_urlsafe(32)
        
        # Scopes demandés pour notre use case
        scopes = "user.info.basic,user.info.profile,user.info.stats,video.list"
        
        params = {
            "client_key": client_key,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": scopes,
            "state": state
        }
        
        from urllib.parse import urlencode
        auth_url = "https://www.tiktok.com/v2/auth/authorize/?" + urlencode(params)
        
        return {
            "auth_url": auth_url,
            "state": state
        }
    
    async def handle_tiktok_callback(self, code: str, state: str, db: Session) -> TokenResponse:
        """Gérer le callback OAuth TikTok"""
        if not settings.TIKTOK_CLIENT_SECRET:
            raise HTTPException(status_code=500, detail="TIKTOK_CLIENT_SECRET non configuré")
        
        client_key = settings.TIKTOK_CLIENT_KEY
        client_secret = settings.TIKTOK_CLIENT_SECRET
        redirect_uri = settings.TIKTOK_REDIRECT_URI
        
        async with httpx.AsyncClient(timeout=20) as client:
            # 1) Échanger le code contre un access token
            r = await client.post(
                "https://open.tiktokapis.com/v2/oauth/token/",
                data={
                    "client_key": client_key,
                    "client_secret": client_secret,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": redirect_uri
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if r.status_code != 200:
                raise HTTPException(status_code=r.status_code, detail=f"Erreur TikTok OAuth: {r.text}")
            
            token_data = r.json()
            
            if token_data.get("error"):
                raise HTTPException(status_code=400, detail=f"Erreur TikTok: {token_data.get('error_description', 'Unknown error')}")
            
            access_token = token_data.get("access_token")
            refresh_token = token_data.get("refresh_token")
            
            if not access_token:
                raise HTTPException(status_code=400, detail="Access token TikTok non obtenu")
            
            # 2) Récupérer les infos utilisateur
            r2 = await client.get(
                "https://open.tiktokapis.com/v2/user/info/",
                params={"fields": "open_id,union_id,avatar_url,display_name"},
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Content-Type": "application/json"
                }
            )
            
            if r2.status_code != 200:
                raise HTTPException(status_code=r2.status_code, detail=f"Erreur récupération info TikTok: {r2.text}")
            
            user_info = r2.json()
            data = user_info.get("data", {}).get("user", {})
            
            tiktok_user_id = data.get("open_id") or data.get("union_id")
            display_name = data.get("display_name", "")
            avatar_url = data.get("avatar_url")
            
            if tiktok_user_id:
                # Créer un email à partir du TikTok user ID si pas d'email
                email = f"tiktok_{tiktok_user_id}@veyl.io"
                name = display_name or f"TikTok User {tiktok_user_id[:8]}"
                
                # Créer ou récupérer l'utilisateur
                user = self.create_or_get_user(db, email=email, name=name)
                if avatar_url:
                    user.picture_url = avatar_url
                    db.commit()
                
                # Sauvegarder le token OAuth TikTok
                from db.models import OAuthAccount
                oauth_account = db.query(OAuthAccount).filter(
                    OAuthAccount.user_id == user.id,
                    OAuthAccount.provider == "tiktok"
                ).first()
                
                if oauth_account:
                    oauth_account.access_token = access_token
                    oauth_account.refresh_token = refresh_token
                else:
                    oauth_account = OAuthAccount(
                        user_id=user.id,
                        provider="tiktok",
                        provider_user_id=str(tiktok_user_id),
                        access_token=access_token,
                        refresh_token=refresh_token
                    )
                    db.add(oauth_account)
                
                db.commit()
                
                # Créer le token JWT
                jwt_token = self.auth_service.create_access_token(data={"sub": str(user.id)})
                
                # Rediriger vers le frontend avec le token
                from fastapi.responses import RedirectResponse  # type: ignore
                frontend_url = "https://veyl.io/auth/callback"
                redirect_url = f"{frontend_url}?token={jwt_token}&user_id={user.id}&email={email}&name={name}"
                return RedirectResponse(url=redirect_url)
        
        raise HTTPException(status_code=400, detail="Erreur OAuth TikTok")
    