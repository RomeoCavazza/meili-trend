# auth/auth_endpoints.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.base import get_db
from db.models import User
from .schemas import UserCreate, UserResponse, TokenResponse
from .auth_service import AuthService

auth_router = APIRouter(prefix="/api/v1/auth", tags=["auth"])
auth_service = AuthService()

def get_current_user(request, db: Session = Depends(get_db)) -> User:
    """Obtenir l'utilisateur actuel depuis le token JWT"""
    from fastapi import Request
    from jose import JWTError, jwt
    from core.config import settings
    
    try:
        # Récupérer le token depuis l'header Authorization
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Token manquant")
        
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token invalide")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide")
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")
    return user

@auth_router.post("/register", response_model=TokenResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """Inscription simple"""
    return auth_service.register_user(user_in, db)

@auth_router.post("/login", response_model=TokenResponse)
def login(user_in: UserCreate, db: Session = Depends(get_db)):
    """Connexion simple"""
    return auth_service.login_user(user_in, db)

@auth_router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Profil utilisateur"""
    return current_user
