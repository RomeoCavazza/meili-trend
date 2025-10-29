#!/usr/bin/env python3
"""
Script pour supprimer les posts générés par seed_data.py
Usage: python scripts/clear_seeded_posts.py
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from db.base import SessionLocal
from db.models import Post, Platform

def clear_seeded_posts():
    """Supprime les posts avec des IDs qui commencent par 'post_' (pattern du seed)"""
    db = SessionLocal()
    
    try:
        # Trouver tous les posts avec ID commençant par "post_" (pattern du seed)
        seeded_posts = db.query(Post).filter(Post.id.like('post_%')).all()
        count = len(seeded_posts)
        
        if count == 0:
            print("✅ Aucun post seedé trouvé")
            return
        
        print(f"🗑️  Suppression de {count} posts seedés...")
        
        for post in seeded_posts:
            db.delete(post)
        
        db.commit()
        print(f"✅ {count} posts seedés supprimés avec succès")
        
        # Afficher les posts restants
        remaining = db.query(Post).count()
        print(f"📊 Posts restants dans la base: {remaining}")
        
    except Exception as e:
        print(f"❌ Erreur lors de la suppression: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("🧹 Nettoyage des posts seedés...")
    print("=" * 50)
    clear_seeded_posts()
    print("=" * 50)

