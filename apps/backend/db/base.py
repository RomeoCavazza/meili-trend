# db/base.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://tco:Gnl0bryg@127.0.0.1:5432/insiderdb")

engine = create_engine(
    DATABASE_URL,
    pool_size=5, 
    max_overflow=5, 
    pool_pre_ping=True, 
    pool_recycle=1800,
    echo=False  # Mettre à True pour voir les requêtes SQL
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

# Import all models to ensure they are registered with Base.metadata
from db.models import (
    User, OAuthAccount, Platform, Hashtag, Post, 
    Report, Job, Alert, Subscription
)
