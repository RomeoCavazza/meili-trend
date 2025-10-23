# db/base.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Utiliser psycopg au lieu de psycopg2
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:tKxmfViifAQcuxWJGbqxMHfshknwsVey@tramway.proxy.rlwy.net:49049/railway")

engine = create_engine(
    DATABASE_URL,
    echo=False  # Mettre à True pour voir les requêtes SQL
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

# Dependency pour FastAPI
def get_db():
    """Dependency pour obtenir une session de base de données"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
