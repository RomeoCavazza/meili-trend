# db/models.py
# Modèles SQLAlchemy pour Insider Trends MVP
# Architecture fonctionnelle et générique

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, ARRAY
from sqlalchemy.orm import relationship
from db.base import Base
import datetime as dt

# Utiliser JSONB pour PostgreSQL
JSONType = JSONB
ArrayType = ARRAY(String)

# =====================================================
# 1. UTILISATEURS & AUTHENTIFICATION
# =====================================================

class User(Base):
    """Utilisateur principal du système Insider Trends"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(Text)  # bcrypt hash + salt
    name = Column(String(255))
    picture_url = Column(Text)
    role = Column(String(50), default='user')  # 'admin' / 'analyst' / 'user'
    created_at = Column(DateTime, default=dt.datetime.utcnow)
    last_login_at = Column(DateTime)
    is_active = Column(Boolean, default=True)  # Pour désactiver sans supprimer
    updated_at = Column(DateTime, default=dt.datetime.utcnow, onupdate=dt.datetime.utcnow)
    
    # Relations
    oauth_accounts = relationship("OAuthAccount", back_populates="user", cascade="all, delete-orphan")

class OAuthAccount(Base):
    """Comptes OAuth liés aux utilisateurs"""
    __tablename__ = "oauth_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    provider = Column(String(50), nullable=False)  # 'google', 'instagram', 'tiktok', 'x'
    provider_user_id = Column(Text, nullable=False)
    access_token = Column(Text)
    refresh_token = Column(Text)
    expires_at = Column(DateTime)
    scopes = Column(ArrayType)  # array des scopes accordés
    created_at = Column(DateTime, default=dt.datetime.utcnow)
    
    # Relations
    user = relationship("User", back_populates="oauth_accounts")
    
    # Contraintes
    __table_args__ = (
        UniqueConstraint('provider', 'provider_user_id', name='uq_oauth_provider_user'),
    )