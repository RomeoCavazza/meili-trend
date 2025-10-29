#!/usr/bin/env python3
"""
Script de seed pour générer des données de test en base de données
Usage: python seed_data.py
"""
import os
from datetime import datetime, timedelta
from random import choice, randint, uniform
from sqlalchemy.orm import Session
from faker import Faker

# Setup
from db.base import SessionLocal, engine
from db.models import User, Post, Platform, Hashtag, PostHashtag, OAuthAccount
from auth_unified.auth_service import AuthService
from passlib.context import CryptContext

fake = Faker(['fr_FR', 'en_US'])
auth_service = AuthService()

def seed_platforms(db: Session):
    """Créer les plateformes sociales"""
    print("🌐 Création des plateformes...")
    
    platforms = [
        {"name": "instagram", "api_key": "ig_api_key_demo"},
        {"name": "tiktok", "api_key": "tt_api_key_demo"},
        {"name": "x", "api_key": "x_api_key_demo"},
    ]
    
    for p_data in platforms:
        existing = db.query(Platform).filter(Platform.name == p_data["name"]).first()
        if not existing:
            platform = Platform(**p_data)
            db.add(platform)
    
    db.commit()
    print(f"✅ Plateformes créées")
    return db.query(Platform).all()

def seed_users(db: Session, count=10):
    """Créer des utilisateurs de test"""
    print(f"👥 Création de {count} utilisateurs...")
    
    users = []
    
    # Créer quelques utilisateurs de test
    test_users = [
        {"email": "admin@insider.dev", "name": "Admin User", "role": "admin"},
        {"email": "demo@insider.dev", "name": "Demo User", "role": "user"},
        {"email": "analyst@insider.dev", "name": "Data Analyst", "role": "analyst"},
    ]
    
    for user_data in test_users:
        existing = db.query(User).filter(User.email == user_data["email"]).first()
        if not existing:
            hashed_password = auth_service.get_password_hash("demo123")
            user = User(
                email=user_data["email"],
                password_hash=hashed_password,
                name=user_data["name"],
                role=user_data["role"],
                is_active=True
            )
            db.add(user)
            users.append(user)
    
    # Créer des utilisateurs aléatoires
    for i in range(count - len(test_users)):
        try:
            email = fake.email()
            name = fake.name()
            hashed_password = auth_service.get_password_hash("demo123")
            
            user = User(
                email=email,
                password_hash=hashed_password,
                name=name,
                role=choice(["user", "analyst", "user"]),
                is_active=True,
                picture_url=f"https://i.pravatar.cc/150?u={i}" if i % 2 == 0 else None
            )
            db.add(user)
            users.append(user)
        except Exception as e:
            print(f"⚠️ Erreur création utilisateur {i}: {e}")
            db.rollback()
            continue
    
    db.commit()
    print(f"✅ {len(users)} utilisateurs créés")
    return users

def seed_hashtags(db: Session, platforms):
    """Créer des hashtags de test"""
    print("🏷️  Création des hashtags...")
    
    hashtag_names = [
        "fashion", "fitness", "food", "travel", "photography", "art", "music",
        "fitnessmotivation", "nofilter", "instagood", "lifestyle", "photooftheday",
        "beautiful", "summer", "nature", "happiness", "love", "inspiration",
        "trending", "viral", "explore", "discover", "youtube", "instagram"
    ]
    
    hashtags = []
    for name in hashtag_names:
        existing = db.query(Hashtag).filter(Hashtag.name == name).first()
        if not existing:
            hashtag = Hashtag(
                name=name,
                platform_id=choice([p.id for p in platforms]),
                last_scraped=datetime.utcnow() - timedelta(days=randint(0, 7))
            )
            db.add(hashtag)
            hashtags.append(hashtag)
    
    db.commit()
    print(f"✅ {len(hashtags)} hashtags créés")
    return hashtags

def seed_posts(db: Session, platforms, hashtags, count=50):
    """Créer des posts de test"""
    print(f"📝 Création de {count} posts...")
    
    posts = []
    media_types = ["IMAGE", "VIDEO", "CAROUSEL"]
    
    for i in range(count):
        try:
            # Générer une date aléatoire dans les 30 derniers jours
            posted_at = datetime.utcnow() - timedelta(
                days=randint(0, 30),
                hours=randint(0, 23)
            )
            
            # Créer un post
            post = Post(
                id=f"post_{fake.uuid4()[:8]}",
                platform_id=choice([p.id for p in platforms]),
                author=fake.user_name(),
                caption=fake.text(max_nb_chars=200),
                hashtags=[fake.word() for _ in range(randint(0, 5))],
                metrics={
                    "likes": randint(10, 50000),
                    "comments": randint(0, 5000),
                    "shares": randint(0, 1000),
                    "views": randint(100, 100000)
                },
                posted_at=posted_at,
                fetched_at=datetime.utcnow(),
                language=choice(["fr", "en", "es"]),
                media_url=f"https://picsum.photos/800/800?random={i}",
                sentiment=uniform(-1, 1),
                score=uniform(0, 100),
                score_trend=uniform(0, 100)
            )
            db.add(post)
            posts.append(post)
            
        except Exception as e:
            print(f"⚠️ Erreur création post {i}: {e}")
            db.rollback()
            continue
    
    db.commit()
    print(f"✅ {len(posts)} posts créés")
    return posts

def main():
    """Fonction principale"""
    print("🌱 Début du seed des données...")
    print("=" * 60)
    
    db = SessionLocal()
    
    try:
        # 1. Créer les plateformes
        platforms = seed_platforms(db)
        
        # 2. Créer les utilisateurs
        users = seed_users(db, count=15)
        
        # 3. Créer les hashtags
        hashtags = seed_hashtags(db, platforms)
        
        # 4. Créer les posts
        posts = seed_posts(db, platforms, hashtags, count=100)
        
        # 5. Afficher le résumé
        print("=" * 60)
        print("📊 RÉSUMÉ DU SEED:")
        print(f"   Platformes: {db.query(Platform).count()}")
        print(f"   Utilisateurs: {db.query(User).count()}")
        print(f"   Hashtags: {db.query(Hashtag).count()}")
        print(f"   Posts: {db.query(Post).count()}")
        print("=" * 60)
        print("✅ Seed terminé avec succès !")
        print("")
        print("🔑 COMPTES DE TEST:")
        print("   • admin@insider.dev / demo123")
        print("   • demo@insider.dev / demo123")
        print("   • analyst@insider.dev / demo123")
        print("")
        
    except Exception as e:
        print(f"❌ Erreur lors du seed: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
