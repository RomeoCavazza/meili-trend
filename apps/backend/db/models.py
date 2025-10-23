# db/models.py
# Modèles SQLAlchemy pour Insider Trends MVP
# Architecture fonctionnelle et générique

from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey, UniqueConstraint, JSON
from sqlalchemy.dialects.postgresql import JSONB, ARRAY
import os

# Compatibilité SQLite/PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./insider.db")
if "sqlite" in DATABASE_URL:
    JSONType = JSON
    ArrayType = Text  # SQLite n'a pas de type array natif
else:
    JSONType = JSONB
    ArrayType = ARRAY(String)
from sqlalchemy.orm import relationship
from db.base import Base
import datetime as dt

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
    
    # Relations
    oauth_accounts = relationship("OAuthAccount", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="user")
    alerts = relationship("Alert", back_populates="user")
    subscriptions = relationship("Subscription", back_populates="user")

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

# =====================================================
# 2. SOURCES & CONTENU SOCIAL
# =====================================================

class Platform(Base):
    """Plateformes sociales supportées"""
    __tablename__ = "platforms"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)  # 'instagram', 'tiktok', 'x'
    api_key = Column(Text)  # clé API de la plateforme
    created_at = Column(DateTime, default=dt.datetime.utcnow)
    
    # Relations
    hashtags = relationship("Hashtag", back_populates="platform")
    posts = relationship("Post", back_populates="platform")

class Hashtag(Base):
    """Hashtags surveillés avec métriques"""
    __tablename__ = "hashtags"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False, index=True)  # nom du hashtag (sans #)
    platform_id = Column(Integer, ForeignKey("platforms.id"), nullable=False)
    last_scraped = Column(DateTime)  # dernière fois qu'on a scrappé
    total_posts = Column(Integer, default=0)  # nombre total de posts trouvés
    engagement_avg = Column(Float, default=0)  # engagement moyen
    updated_at = Column(DateTime, default=dt.datetime.utcnow)
    
    # Relations
    platform = relationship("Platform", back_populates="hashtags")

class Post(Base):
    """Posts des réseaux sociaux avec métriques et scores"""
    __tablename__ = "posts"
    
    id = Column(Text, primary_key=True)  # ID réel de la plateforme
    platform_id = Column(Integer, ForeignKey("platforms.id"), nullable=False)
    author = Column(String(255))  # nom d'utilisateur de l'auteur
    caption = Column(Text)  # texte du post
    hashtags = Column(ArrayType)  # liste des hashtags extraits
    metrics = Column(JSONType)  # métriques: likes, views, comments, shares
    posted_at = Column(DateTime)  # date de publication originale
    fetched_at = Column(DateTime, default=dt.datetime.utcnow)  # date de récupération
    language = Column(String(10))  # langue détectée
    media_url = Column(Text)  # URL du média (image/vidéo)
    sentiment = Column(Float)  # score de sentiment (-1 à 1)
    score = Column(Float, default=0)  # score de tendance calculé
    
    # Relations
    platform = relationship("Platform", back_populates="posts")

# =====================================================
# 3. ANALYSES, RAPPORTS & HISTORIQUE (Phase 2)
# =====================================================

class Report(Base):
    """Rapports générés par les utilisateurs"""
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=dt.datetime.utcnow)
    filters = Column(JSONType)  # filtres appliqués: {"platform":"instagram","hashtag":"ai"}
    insights = Column(JSONType)  # insights générés: résumé, top posts, stats
    file_url = Column(Text)  # URL du fichier exporté (PDF/PPT)
    
    # Relations
    user = relationship("User", back_populates="reports")

class Job(Base):
    """Tâches en arrière-plan (scraping, analyse, export)"""
    __tablename__ = "jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(100), nullable=False)  # 'crawl', 'analysis', 'export'
    status = Column(String(50), default='pending')  # 'pending', 'running', 'done', 'failed'
    params = Column(JSONType)  # paramètres du job
    result = Column(JSONType)  # résultat du job
    created_at = Column(DateTime, default=dt.datetime.utcnow)
    updated_at = Column(DateTime, default=dt.datetime.utcnow, onupdate=dt.datetime.utcnow)

# =====================================================
# 4. OPTIONNEL / ÉVOLUTIF (Phase 3)
# =====================================================

class Alert(Base):
    """Alertes personnalisées des utilisateurs"""
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    condition = Column(JSONType)  # condition: {"hashtag":"ai","views":">100k"}
    notified_at = Column(DateTime)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=dt.datetime.utcnow)
    
    # Relations
    user = relationship("User", back_populates="alerts")

class Subscription(Base):
    """Abonnements et quotas utilisateur (freemium)"""
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan = Column(String(50), default='free')  # 'free', 'pro', 'enterprise'
    quota = Column(JSONType)  # quotas: nb d'analyses, hashtags suivis, etc.
    renewed_at = Column(DateTime)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=dt.datetime.utcnow)
    
    # Relations
    user = relationship("User", back_populates="subscriptions")

# =====================================================
# UTILITAIRES ET HELPERS
# =====================================================

def get_user_by_email(db, email: str):
    """Récupère un utilisateur par son email"""
    return db.query(User).filter(User.email == email).first()

def get_oauth_account(db, provider: str, provider_user_id: str):
    """Récupère un compte OAuth par provider et ID"""
    return db.query(OAuthAccount).filter(
        OAuthAccount.provider == provider,
        OAuthAccount.provider_user_id == provider_user_id
    ).first()

def get_platform_by_name(db, name: str):
    """Récupère une plateforme par son nom"""
    return db.query(Platform).filter(Platform.name == name).first()

def get_hashtag_by_name(db, name: str):
    """Récupère un hashtag par son nom"""
    return db.query(Hashtag).filter(Hashtag.name == name).first()

def get_posts_by_hashtag(db, hashtag_name: str, limit: int = 100):
    """Récupère les posts contenant un hashtag spécifique"""
    return db.query(Post).filter(
        Post.hashtags.contains([hashtag_name])
    ).order_by(Post.posted_at.desc()).limit(limit).all()

def get_trending_posts(db, platform_id: int = None, limit: int = 50):
    """Récupère les posts les plus tendance"""
    query = db.query(Post).filter(Post.score > 0)
    if platform_id:
        query = query.filter(Post.platform_id == platform_id)
    return query.order_by(Post.score.desc()).limit(limit).all()