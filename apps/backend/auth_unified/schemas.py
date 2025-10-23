# auth_unified/schemas.py
# Schémas Pydantic pour l'authentification - SÉCURISÉS

from pydantic import BaseModel, EmailStr, validator, Field
from datetime import datetime
from typing import Optional
import re

class UserCreate(BaseModel):
    """Schéma pour la création d'utilisateur - VALIDATION STRICTE"""
    email: EmailStr = Field(..., description="Email valide requis")
    password: str = Field(..., min_length=8, max_length=128, description="Mot de passe entre 8 et 128 caractères")
    name: str = Field(..., min_length=2, max_length=100, description="Nom entre 2 et 100 caractères")
    
    @validator('password')
    def validate_password(cls, v):
        """Validation stricte du mot de passe"""
        if not re.search(r'[A-Z]', v):
            raise ValueError('Le mot de passe doit contenir au moins une majuscule')
        if not re.search(r'[a-z]', v):
            raise ValueError('Le mot de passe doit contenir au moins une minuscule')
        if not re.search(r'\d', v):
            raise ValueError('Le mot de passe doit contenir au moins un chiffre')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Le mot de passe doit contenir au moins un caractère spécial')
        return v
    
    @validator('name')
    def validate_name(cls, v):
        """Validation du nom"""
        if not re.match(r'^[a-zA-Z\s\-\.]+$', v):
            raise ValueError('Le nom ne peut contenir que des lettres, espaces, tirets et points')
        return v.strip()

class UserResponse(BaseModel):
    """Schéma pour la réponse utilisateur - SÉCURISÉ"""
    id: int
    email: str
    name: Optional[str]
    role: str
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    """Schéma pour la réponse de token - SÉCURISÉ"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse