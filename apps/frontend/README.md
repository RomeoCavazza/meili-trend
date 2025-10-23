# Insider Trends - Monorepo

## 🚀 Architecture

**Backend**: FastAPI + PostgreSQL + SQLAlchemy + Alembic
**Frontend**: React + TypeScript + Vite + Tailwind CSS

## 📁 Structure

```
insider-monorepo/
├── apps/
│   ├── backend/          # API FastAPI
│   └── frontend/         # App React
├── .github/workflows/    # CI/CD
└── README.md
```

## 🛠️ Développement

### Backend
```bash
cd apps/backend
pip install -r requirements.txt
uvicorn app:app --reload
```

### Frontend
```bash
cd apps/frontend
npm install
npm run dev
```

## 🚀 Déploiement

- **Backend**: Railway (Docker)
- **Frontend**: Vercel (rewrites API)

## 📊 Fonctionnalités

- ✅ Authentification JWT + OAuth2
- ✅ Instagram Business API
- ✅ Base de données PostgreSQL
- ✅ Interface React moderne
- ✅ CI/CD GitHub Actions

## 🔧 Configuration

Voir les fichiers `.env.example` pour la configuration locale.