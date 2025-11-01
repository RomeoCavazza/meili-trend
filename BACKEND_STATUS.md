# Backend Status - veyl.io

**Dernière mise à jour**: Janvier 2025  
**Objectif**: État des lieux backend, modules existants, gaps identifiés

---

## Résumé Exécutif

### Fonctionnalités Opérationnelles
- **Backend FastAPI** opérationnel avec structure modulaire
- **Authentification OAuth** (Instagram, Facebook, Google, TikTok)
- **Meilisearch** intégré (recherche full-text)
- **Redis** pour rate limiting
- **PostgreSQL** avec modèles de base (User, Post, Platform, Hashtag)
- **Projects CRUD** (`projects`, `project_hashtags`, `project_creators`)
- **Endpoints Projects** (`/api/v1/projects/*`)
- **Frontend React** avec pages fonctionnelles (Search, Analytics, Profile)
- **Health checks** (`/ping`, `/healthz`)

### À Implémenter (Priorités)
- **Multi-tenant** (`orgs`, `org_members`)
- **Qdrant** (recherche sémantique/embeddings)
- **Celery workers** (jobs background)
- **Feature flags** dans config
- **Usage counters** (quotas/gating)
- **Agents backend** (Scout/Scribe/Planner)
- **docker-compose.yml** local

---

## Modules Backend

### Modules Existants

```
apps/backend/
├── auth_unified/          OAuth complet (IG, FB, Google, TikTok)
├── posts/                 CRUD + search Meilisearch
├── hashtags/              CRUD hashtags
├── platforms/             CRUD plateformes
├── analytics/             Endpoints analytics
├── projects/              CRUD Projects
├── jobs/                  Jobs TikTok (BackgroundTasks, pas Celery workers)
├── webhooks/              Webhooks Meta
├── core/                  Config, Redis, Rate limit
└── db/                    Models (User, Post, Platform, Hashtag, Project)
```

### Modules Manquants

```
apps/backend/
├── search/                Qdrant client (à implémenter)
│   └── qdrant/           
├── rag/                   Embeddings + chunking (à implémenter)
├── workers/               Celery + schedules (à implémenter)
├── agents/                Agents (Scout/Scribe/Planner) (à implémenter)
└── services/
    └── ai_service.py      LLM wrapper + Vertex AI (à implémenter)
```

---

## Base de Données

### Tables Existantes

```python
User
OAuthAccount
Platform
Hashtag
PostHashtag
Post
Subscription
Project
ProjectHashtag
ProjectCreator
```

### Limitations Identifiées

1. **Absence de multi-tenant** : Architecture actuelle liée à `user_id`, pas de support organisations (`org_id`)
2. **Pas de tracking d'usage** : Impossible d'implémenter un gating par plan d'abonnement
3. **Pas d'audit trail** : Absence de traçabilité pour conformité App Review

---

## API Endpoints

### Endpoints Opérationnels

```
GET  /api/v1/auth/* (OAuth)
GET  /api/v1/posts/*
GET  /api/v1/hashtags/*
GET  /api/v1/platforms/*
GET  /api/v1/analytics/*
GET  /api/v1/projects
POST /api/v1/projects
GET  /api/v1/projects/{id}
PUT  /api/v1/projects/{id}
DELETE /api/v1/projects/{id}
POST /api/v1/jobs/sync/tiktok
GET  /ping, /healthz
```

### Endpoints à Implémenter

```
❌ POST   /api/v1/projects/{id}/seed-search
❌ POST   /api/v1/projects/{id}/select-posts
❌ POST   /api/v1/projects/{id}/cluster
❌ POST   /api/v1/projects/{id}/lookalikes
❌ POST   /api/v1/projects/{id}/reports/weekly
❌ GET    /api/v1/projects/{id}/reports
❌ POST   /api/v1/reports/{rid}/export/gamma
❌ POST   /api/v1/reports/{rid}/export/pomelli
❌ GET    /api/v1/orgs
❌ GET    /api/v1/usage
❌ POST   /api/v1/delete-my-data (obligatoire Meta/TikTok)
```

---

## Services & Infrastructure

### Services Opérationnels

```python
services/meilisearch_client.py    Meilisearch intégré
services/tiktok_service.py        TikTok API client
services/cache.py                 Cache Redis
core/redis_client.py              Redis client
core/ratelimit.py                 Rate limiting
```

### Services à Implémenter

```python
services/qdrant_client.py         Qdrant (vectors) - à implémenter
services/ai_service.py            LLM wrapper (OpenAI/Anthropic) - à implémenter
services/embeddings_service.py   Génération embeddings - à implémenter
services/vertex_service.py       Vertex AI (vidéo) - à implémenter
services/gamma_service.py        Gamma API export - à implémenter
services/pomelli_service.py      Pomelli API export - à implémenter
```

### App Review Mode (Temporaire)

```typescript
apps/frontend/src/lib/fakeData.ts    Dataset mock/fake pour App Review
```

**Note**: L'application fonctionne actuellement avec des datasets mock/fake pour la soumission App Review Meta/TikTok. Ces datasets simulent des posts Instagram/TikTok réalistes, créateurs, et métriques. L'ingestion réelle sera activée après validation et obtention de l'accès Public Content.

### Infrastructure Manquante

```
docker-compose.yml                   Local dev - à implémenter
workers/celery_app.py                Celery configuration - à implémenter
workers/tasks.py                     Background jobs - à implémenter
```

---

## Configuration

### Variables d'Environnement Configurées

```python
DATABASE_URL
SECRET_KEY
REDIS_URL
OAuth (IG, FB, Google, TikTok)
MEILI_HOST, MEILI_MASTER_KEY
```

### Variables d'Environnement Manquantes

```python
❌ QDRANT_URL, QDRANT_API_KEY
❌ OPENAI_API_KEY, MISTRAL_API_KEY
❌ VERTEX_AI_PROJECT, VERTEX_AI_REGION
❌ GAMMA_API_KEY
❌ POMELLI_API_KEY
❌ Feature flags:
   ❌ ENABLE_AI_CLUSTERS
   ❌ ENABLE_GAMMA_EXPORT
   ❌ ENABLE_POMELLI_EXPORT
   ❌ ENABLE_VERTEX_VIDEO
   ❌ ENABLE_AGENT_SCOUT
   ❌ ENABLE_AGENT_SCRIBE
   ❌ ENABLE_AGENT_PLANNER
```

---

## Dépendances

### Dépendances Installées

```python
fastapi, uvicorn, gunicorn
sqlalchemy, alembic, psycopg
redis, slowapi, limits
meilisearch
pydantic, python-jose, bcrypt
httpx, python-dotenv
```

### Dépendances à Ajouter

```python
celery                    # Workers background - à ajouter
celery[redis]            # Celery + Redis - à ajouter
qdrant-client            # Vector database - à ajouter
openai                   # LLM API - à ajouter
anthropic                # LLM API (optionnel) - à ajouter
google-cloud-aiplatform  # Vertex AI - à ajouter
sentry-sdk               # Observabilité - à ajouter
prometheus-fastapi-instrumentator  # Métriques - à ajouter
```

---

## Gaps Critiques (Priorité 1)

1. **Qdrant** - Recherche vectorielle pour clustering/lookalikes
2. **Celery Workers** - Jobs background robustes
3. **Agents Backend** - Scout/Scribe/Planner
4. **Multi-tenant** - Support organisations
5. **Feature Flags** - Activation/désactivation features
6. **Usage Counters** - Tracking quotas/gating plans

---

## Score Global

| Catégorie | Score | Commentaire |
|-----------|-------|-------------|
| **Backend Core** | 8/10 | FastAPI solide, OAuth complet, Projects CRUD |
| **Models DB** | 7/10 | Projects implémentés, manque multi-tenant |
| **API Endpoints** | 7/10 | Projects CRUD, manque endpoints avancés |
| **Services AI** | 2/10 | Meilisearch seulement |
| **Frontend** | 8/10 | Pages Projects fonctionnelles |
| **Infrastructure** | 3/10 | Pas de docker-compose, pas Celery |
| **Config** | 5/10 | OAuth OK, manque feature flags |

**Score global: 6.0/10**

---

## Plan d'Action

### Phase 1: Foundations (Terminé)
1. Modèles Projects en base de données
2. Endpoints Projects CRUD
3. Interface My Projects

### Phase 2: Recherche & IA (En cours)
4. Intégration Qdrant + service embeddings
5. Endpoints clustering (`/api/v1/projects/{id}/cluster`)

### Phase 3: Workers & Agents
6. Configuration Celery + jobs background
7. Agents backend (Scout/Scribe/Planner)
8. Génération Weekly Digest

### Phase 4: Features Avancées
9. Multi-tenant (organisations)
10. Vertex AI (analyse vidéo, on-demand)
11. Export Gamma/Pomelli
12. docker-compose pour développement local

---

## Notes Finales

### Points Forts
- Architecture FastAPI propre et modulaire
- OAuth multi-plateformes fonctionnel
- Meilisearch intégré
- Projects CRUD complet
- Frontend React moderne (Radix UI)

### Risques Identifiés
- **Refonte multi-tenant** nécessaire (ajout `org_id` partout)
- **Absence de tests** (E2E/unit tests non visibles)
- **Absence d'observabilité** (Sentry, Prometheus non intégrés)
- **Endpoints debug** en production → à retirer

### Recommandations Immédiates
1. **Qdrant** - Intégration recherche vectorielle (Phase 2)
2. **Feature flags** - Système dans configuration
3. **docker-compose.yml** - Environnement développement local
4. **Celery workers** - Jobs background robustes

---

**Référence**: `ARCHITECTURE.md` pour architecture complète, `DATABASE.md` pour schéma DB.

