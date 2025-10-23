# db/base.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://tco:Gn10bryg@shinkansen.proxy.rlwy.net:26230/railway")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    echo=False  # Mettre à True pour voir les requêtes SQL
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

# Import all models to ensure they are registered with Base.metadata
from db.models import (
    User, OAuthAccount, Platform, Hashtag, Post, 
    Report, Job, Alert, Subscription
)
