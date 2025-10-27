# Insider Trends API

API FastAPI pour l'analyse des tendances sur les réseaux sociaux.

## Stack

- **Backend**: FastAPI + Python 3.11
- **Database**: PostgreSQL (Railway)
- **Frontend**: React + TypeScript (Vercel)
- **Auth**: JWT + OAuth2 (Instagram, Facebook)

## Quick Start

### Backend
```bash
cd apps/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd apps/frontend
npm install
npm run dev
```

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get user profile

### OAuth
- `GET /api/v1/auth/instagram/start` - Instagram OAuth
- `GET /api/v1/auth/instagram/callback` - Instagram callback
- `GET /api/v1/auth/facebook/start` - Facebook OAuth
- `GET /api/v1/auth/facebook/callback` - Facebook callback

### System
- `GET /` - Root
- `GET /ping` - Health check
- `GET /docs` - API documentation

## Configuration

```bash
# Database
DATABASE_URL=postgresql+psycopg2://user:pass@host:port/db

# JWT
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Instagram OAuth
IG_APP_ID=your-app-id
IG_APP_SECRET=your-app-secret
IG_REDIRECT_URI=https://www.insidr.dev/auth/callback

# Facebook OAuth
FB_APP_ID=your-app-id
FB_APP_SECRET=your-app-secret
FB_REDIRECT_URI=https://www.insidr.dev/auth/facebook/callback
```

## Project Structure

```
insider-monorepo/
├── apps/
│   ├── backend/          # FastAPI app
│   │   ├── app.py       # Main application
│   │   ├── core/config.py
│   │   ├── db/
│   │   │   ├── base.py
│   │   │   ├── models.py
│   │   │   └── migrations/
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   └── railway.toml
│   └── frontend/         # React app
│       ├── src/
│       ├── package.json
│       └── vercel.json
└── README.md
```

## Development

### Database migrations
```bash
alembic revision --autogenerate -m "Description"
alembic upgrade head
```

### Test
```bash
python -c "from app import app; print('API OK')"
```

## Deployment

- **Backend**: Railway (auto-deploy on push to main)
- **Frontend**: Vercel (auto-deploy on push to main)

## Documentation

- API Docs: `https://your-api.railway.app/docs`
- Frontend: `https://www.insidr.dev`

## Déploiement Production

### Variables d'environnement requises

**Backend (.env)**:
```bash
DATABASE_URL=postgresql+psycopg2://user:pass@host:port/db
SECRET_KEY=<générer-une-clé-aléatoire>
REDIS_URL=redis://localhost:6379/0
ENVIRONMENT=production
OAUTH_STATE_SECRET=<clé-oauth>
WEBHOOK_VERIFY_TOKEN=<webhook-token>
```

### Migration de la base de données

```bash
cd apps/backend
alembic upgrade head
```

### Tests locaux

```bash
# Backend
uvicorn app:app --reload

# Frontend
npm run dev
```

## Seed des données

Pour générer des données de test (utilisateurs, posts, hashtags, etc.) :

```bash
cd apps/backend
python seed_data.py
```

Ce script génère :
- 3 plateformes sociales (Instagram, TikTok, X)
- 15 utilisateurs (dont 3 comptes de test)
- 24 hashtags populaires
- 100 posts avec métriques aléatoires

### Comptes de test générés :
- **admin@insider.dev** / **demo123** (admin)
- **demo@insider.dev** / **demo123** (user)
- **analyst@insider.dev** / **demo123** (analyst)