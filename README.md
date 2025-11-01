# Veyl.io - Social Media Intelligence Platform

Plateforme de veille culturelle et d'analyse des tendances sur les réseaux sociaux.

**Mission**: Permettre aux créateurs, agences et marques de surveiller, analyser et anticiper les tendances émergentes sur Instagram et TikTok via un workspace dédié.

---

## Démarrage Rapide

### Backend (FastAPI)

```bash
cd apps/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend (React)

```bash
cd apps/frontend
npm install
npm run dev
```

**Accès local**:
- Frontend: `http://localhost:8081`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

---

## Stack Technique

### Backend
- **FastAPI** - Framework API Python asynchrone
- **PostgreSQL** - Base de données relationnelle (Railway)
- **SQLAlchemy + Alembic** - ORM et migrations
- **Redis** - Cache et rate limiting
- **Meilisearch** - Moteur de recherche full-text

### Frontend
- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool et dev server
- **Tailwind CSS** - Framework CSS utility-first
- **Radix UI** - Composants UI accessibles (headless)
- **React Router** - Gestion de navigation

### Infrastructure
- **Railway** - Hébergement backend (auto-deploy)
- **Vercel** - Hébergement frontend (auto-deploy) avec proxy vers Railway
- **Configuration**: URLs API sans slash final (`/api/v1/projects`) pour éviter les redirections Vercel

---

## Structure du Projet

```
veyl.io/
├── apps/
│   ├── backend/              # Application FastAPI
│   │   ├── app.py           # Point d'entrée
│   │   ├── core/            # Configuration, Redis, rate limiting
│   │   ├── db/              # Models SQLAlchemy, migrations
│   │   │   ├── models.py
│   │   │   └── migrations/
│   │   ├── auth_unified/    # OAuth (IG, FB, Google, TikTok)
│   │   ├── posts/           # CRUD posts + recherche
│   │   ├── projects/        # CRUD Projects
│   │   ├── analytics/       # Endpoints analytics
│   │   └── requirements.txt
│   │
│   └── frontend/            # Application React
│       ├── src/
│       │   ├── pages/      # Pages (Landing, Search, Projects, etc.)
│       │   ├── components/ # Composants UI réutilisables
│       │   ├── contexts/   # Context providers (Auth, etc.)
│       │   ├── lib/        # Utilitaires, client API
│       │   └── App.tsx     # Router principal
│       └── package.json
│
├── ARCHITECTURE.md          # Architecture détaillée
├── BACKEND_STATUS.md        # État des lieux backend
├── DATABASE.md              # Schéma base de données
├── FRONTEND.md              # État des lieux frontend
├── REFERENCE.md             # Artefacts techniques
└── README.md               # Ce fichier
```

---

## Configuration

### Backend (.env)

```bash
# Database
DATABASE_URL=postgresql+psycopg2://user:pass@host:port/db

# Authentication
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Cache & Rate Limiting
REDIS_URL=redis://localhost:6379/0

# OAuth Providers
IG_APP_ID=your-instagram-app-id
IG_APP_SECRET=your-instagram-app-secret
IG_REDIRECT_URI=https://veyl.io/auth/callback

FB_APP_ID=your-facebook-app-id
FB_APP_SECRET=your-facebook-app-secret
FB_REDIRECT_URI=https://veyl.io/auth/facebook/callback

# Search Engine
MEILI_HOST=http://localhost:7700
MEILI_MASTER_KEY=your-master-key
```

### Frontend (.env.local)

```bash
VITE_API_URL=http://localhost:8000
```

---

## Base de Données

### Migrations

```bash
cd apps/backend
alembic upgrade head
```

### Tables Principales

- `users` - Comptes utilisateurs
- `projects` - Projets de monitoring
- `project_hashtags` - Relation projets ↔ hashtags
- `project_creators` - Créateurs suivis par projet
- `hashtags` - Hashtags surveillés
- `posts` - Posts collectés
- `platforms` - Plateformes supportées
- `oauth_accounts` - Comptes OAuth liés

Voir `ARCHITECTURE.md` et `DATABASE.md` pour le schéma complet.

---

## API Endpoints

### Authentification
- `POST /api/v1/auth/register` - Inscription
- `POST /api/v1/auth/login` - Connexion
- `GET /api/v1/auth/me` - Profil utilisateur

### OAuth
- `GET /api/v1/auth/{provider}/start` - Init OAuth
- `GET /api/v1/auth/{provider}/callback` - Callback OAuth

### Projects
- `GET /api/v1/projects` - Liste projets
- `POST /api/v1/projects` - Créer projet
- `GET /api/v1/projects/{id}` - Détails projet
- `PUT /api/v1/projects/{id}` - Mettre à jour
- `DELETE /api/v1/projects/{id}` - Supprimer

### Recherche
- `GET /api/v1/posts/search` - Recherche posts
- `GET /api/v1/posts/trending` - Posts trending

### Système
- `GET /ping` - Health check
- `GET /docs` - Documentation Swagger (OpenAPI)

---

## Tests Locaux

### Backend
```bash
cd apps/backend
python -c "from app import app; print('✅ API OK')"
```

### Frontend
```bash
cd apps/frontend
npm run build  # Test compilation
```

---

## Déploiement

### Backend (Railway)
- Déploiement automatique sur push vers `main`
- Variables d'environnement configurées dans Railway dashboard

### Frontend (Vercel)
- Déploiement automatique sur push vers `main`
- Variables d'environnement dans Vercel dashboard

---

## Documentation

- **ARCHITECTURE.md** - Architecture complète, vision produit, roadmap
- **BACKEND_STATUS.md** - État des lieux backend, gaps identifiés
- **DATABASE.md** - Analyse schéma base de données
- **FRONTEND.md** - État des lieux frontend, pages implémentées
- **REFERENCE.md** - Artefacts techniques (schémas, endpoints, prompts)

---

## Roadmap

### ✅ Phase 1: Foundations (Terminé)
- Modèles Projects en base de données
- Endpoints Projects CRUD
- Interface My Projects + Onboarding

### 🔄 Phase 2: Recherche & IA (En cours)
- Qdrant (recherche vectorielle)
- Clustering IA
- Service embeddings

### 📅 Phase 3: Workers & Agents (À venir)
- Celery workers
- Agents backend (Scout/Scribe/Planner)
- Génération Weekly Digest

### 📅 Phase 4: Features Avancées (Futur)
- Multi-tenant (organisations)
- Vertex AI (analyse vidéo)
- Gamma/Pomelli export

---

## Compte de Test

- **Email**: `test@test.com`
- **Password**: `test123`

(Utiliser `create_test_user.py` pour créer un utilisateur de test)

---

## Contribution

1. Créer une branche depuis `main`
2. Développer et tester localement
3. Push et créer une Pull Request

---

## License

Proprietary - Tous droits réservés

---

## App Review Mode

Pour la validation Meta/TikTok App Review, l'application peut fonctionner en **mode démonstration** via des datasets mock/fake (posts, creators, insights) afin d'afficher le fonctionnement complet du flux utilisateur (OAuth → création projet → visualisation → analytics).

Les reviewers évaluent la **compréhension du flux** et la conformité aux politiques, pas nécessairement des données réelles. Les données réelles seront activées automatiquement dès l'obtention de l'accès Public Content.

**Permissions demandées**:
- **Meta/Facebook**: `instagram_business_basic`, `Page Public Content Access`, `Instagram Public Content Access`, etc.
- **TikTok**: `user.info.basic`, `user.info.stats`, `video.list`

**Pages légales**: `/privacy`, `/terms`, `/data-deletion` (complètes et accessibles)

---

**Pour plus de détails**: Voir `ARCHITECTURE.md`
