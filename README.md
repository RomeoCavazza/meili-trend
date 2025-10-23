# 🚀 Insider Trends - Trend Intelligence Engine

**Insider Trends** est une plateforme SaaS qui permet aux marques, agences et créateurs de **détecter plus vite ce qui devient tendance** sur Instagram, TikTok et X, grâce à des données officielles et une interface claire.

## 🎯 Vision Produit

### **Problème résolu**
- **Détection tardive** des tendances (24-48h de retard)
- **Données fragmentées** entre plateformes
- **Outils complexes** et coûteux
- **Manque de contexte** sur les créateurs

### **Solution Insider**
- **Temps réel** : Ingestion continue via APIs officielles + webhooks
- **Multi-platform** : Instagram, TikTok, Twitter/X (extensible)
- **Roadmap IA-native** : RAG system, fine-tuning LLM, scoring algorithmique
- **Roadmap Enterprise-ready** : Scalabilité Kubernetes, observabilité complète

## 🏗️ Architecture Globale

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External APIs │
│   React + TS    │◄──►│   FastAPI       │◄──►│   Meta, TikTok  │
│   Vite + Tailwind│    │   Python 3.11   │    │   X, Google     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Railway       │    │   Webhooks      │
│   Hosting       │    │   PostgreSQL    │    │   Real-time     │
│   Proxy         │    │   Redis         │    │   Events        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### **Backend (Railway)**
```bash
cd apps/backend
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port $PORT
```

### **Frontend (Vercel)**
```bash
cd apps/frontend
npm install
npm run dev
```

### **APIs Principales**
- `GET /v1/search/posts` - Recherche hashtags Instagram
- `GET /auth/instagram/start` - OAuth Instagram Business
- `POST /webhook` - Webhooks Meta

## 📊 Stack Technique

| Composant | Technologie | Justification |
|-----------|------------|---------------|
| **Backend** | FastAPI + Python 3.11 | API moderne, async, OpenAPI auto |
| **Frontend** | React 18 + TypeScript + Vite | Stack moderne et performante |
| **Database** | PostgreSQL (Railway) | Données structurées, relations |
| **Cache** | Redis | Rate limiting, sessions |
| **Search** | MeiliSearch | Recherche full-text, facettes |
| **Auth** | JWT + OAuth2 | Sécurité moderne, multi-providers |
| **Hosting** | Railway + Vercel | Déploiement simple, scalable |

## 🎯 Objectifs App Review

- **12 permissions Meta** validées
- **Interface 100% anglais**
- **Vidéo démo 60-90s**
- **Comptes de test** fournis
- **Guide reviewer** complet

## 📁 Structure Projet

```
insider-monorepo/
├── apps/
│   ├── backend/          # FastAPI + Python
│   └── frontend/         # React + TypeScript
├── packages/
│   └── shared/           # Types partagés
└── documentation/        # Docs techniques
```

## 🔗 Liens Utiles

- **Architecture Backend** : `ARCHITECTURE_BACKEND.md`
- **Architecture Frontend** : `ARCHITECTURE_FRONTEND.md`
- **Vue Système** : `ARCHITECTURE_SYSTEME.md`
- **Sécurité & App Review** : `SECURITY.md`
- **Stack Technique** : `STACK_TECH.md`
- **Plan d'Exécution** : `ROADMAP.md`

---

**Insider Trends** - Détectez les tendances avant tout le monde 🚀