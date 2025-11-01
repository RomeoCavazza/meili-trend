# Architecture & Vision - veyl.io

**Dernière mise à jour**: Novembre 2024

---

## Vision Produit

**veyl.io** est une plateforme de veille culturelle et d'analyse des tendances sur les réseaux sociaux. La solution permet aux créateurs, agences et marques de surveiller, analyser et anticiper les tendances émergentes sur Instagram et TikTok.

**Positionnement**: Workspace OSINT (Open Source Intelligence) multi-plateformes pour l'analyse de contenu social media public.

---

## Architecture Technique

### Stack MVP (Actuel)

| Composant | Technologie | Fonction | Statut |
|-----------|------------|----------|--------|
| **API Backend** | FastAPI | API REST, logique métier, orchestration | ✅ Opérationnel |
| **Base de données** | PostgreSQL | Persistence des données, relations | ✅ Opérationnel |
| **Cache** | Redis | Mise en cache, rate limiting, sessions | ✅ Opérationnel |
| **Recherche full-text** | Meilisearch | Recherche textuelle dans posts/captions | ✅ Opérationnel |
| **Recherche vectorielle** | Qdrant | Similarité sémantique, clustering | ❌ À implémenter |
| **IA/Génération** | LLM APIs | Analyse de contenu, résumés, insights | ❌ À implémenter |
| **Agents** | Backend orchestration | Automatisation de workflows | ❌ À implémenter |
| **Interface** | React + TypeScript | Interface utilisateur web | ✅ Opérationnel |
| **Infrastructure** | Railway (API) + Vercel (Frontend) | Hébergement et déploiement | ✅ Opérationnel |

### Modules Backend

```
apps/backend/
├── auth_unified/          ✅ OAuth (Instagram, Facebook, Google, TikTok)
├── posts/                  ✅ CRUD + recherche Meilisearch
├── hashtags/              ✅ CRUD hashtags
├── platforms/              ✅ CRUD plateformes
├── analytics/              ✅ Endpoints analytics
├── projects/               ✅ CRUD Projects
├── jobs/                   ⚠️ Jobs TikTok (BackgroundTasks, à migrer vers Celery)
├── webhooks/              ✅ Webhooks Meta
├── core/                  ✅ Configuration, Redis, Rate limiting
└── db/                    ✅ Models SQLAlchemy (User, Post, Platform, Hashtag, Project)
```

---

## État d'Implémentation

### Fonctionnalités Opérationnelles

- ✅ Authentification OAuth multi-plateformes (Instagram, Facebook, Google, TikTok)
- ✅ Recherche de posts via Meilisearch
- ✅ Modèles de base de données (User, Post, Hashtag, Platform)
- ✅ **Système Projects** (`projects`, `project_hashtags`, `project_creators`)
- ✅ **API Projects CRUD** (`/api/v1/projects`)
- ✅ Interface utilisateur React avec navigation complète
- ✅ **Pages Projects** (`/projects`, `/projects/new`, `/projects/:id`)

### À Implémenter (Priorités)

1. **Qdrant** - Intégration recherche vectorielle pour clustering et détection de similarités
2. **Celery Workers** - Système de jobs asynchrones robuste pour ingestion
3. **Agents Backend** - Orchestration automatisée (Scout, Scribe, Planner)
4. **Multi-tenant** - Support organisations et équipes (`orgs`, `org_members`)
5. **Feature Flags** - Système d'activation conditionnelle des fonctionnalités
6. **Usage Counters** - Tracking des quotas et gating par plan d'abonnement

---

## Schéma Base de Données

### Tables Core

- `users` - Comptes utilisateurs
- `oauth_accounts` - Comptes OAuth liés (Instagram, TikTok, etc.)
- `platforms` - Plateformes supportées (Instagram, TikTok)
- `hashtags` - Hashtags surveillés (réutilisé pour projects)
- `posts` - Posts collectés (réutilisé pour projects)
- `post_hashtags` - Relation posts ↔ hashtags
- `subscriptions` - Abonnements et quotas utilisateurs

### Tables Projects

- `projects` - Projets de monitoring
  - Colonnes: `id`, `user_id`, `name`, `description`, `status`, `platforms` (JSON), `scope_type`, `scope_query`
  - Métriques cachées: `creators_count`, `posts_count`, `signals_count`
  - Timestamps: `last_run_at`, `last_signal_at`, `created_at`, `updated_at`

- `project_hashtags` - Relation projets ↔ hashtags (réutilise `hashtags`)
  - Colonnes: `project_id`, `hashtag_id`, `added_at`

- `project_creators` - Créateurs suivis par projet
  - Colonnes: `project_id`, `creator_username`, `platform_id`, `added_at`

**Architecture**: Tables de liaison pour éviter la duplication, réutilisation des tables existantes (`hashtags`, `posts`).

---

## Architecture Scale (Horizon)

Technologies prévues pour montée en charge (activées via feature flags, uniquement si trafic > 10k utilisateurs/mois):

| Technologie | Usage | Condition |
|-------------|-------|-----------|
| Kubernetes | Orchestration de containers | Multi-instances, haute disponibilité |
| KEDA | Auto-scaling dynamique | Charge variable, scaling automatique |
| Terraform | Infrastructure as Code | Déploiements répétables, multi-environnements |
| Ray | Traitement parallèle distribué | Analyses batch lourdes |
| Hugging Face | Modèles IA pré-entraînés | Intégration de modèles custom |
| Vertex AI | Analyse vidéo avancée | Plans Pro+ uniquement, on-demand |
| Gamma/Pomelli | Génération de présentations | Export slides, plans Pro+ |
| Kafka/NATS | Messaging asynchrone | Communication inter-services |
| Prometheus/Grafana/Sentry | Observabilité | Monitoring production, alerting |

**Principe**: Toutes les technologies avancées sont gérées via feature flags. Activation progressive selon besoins mesurés.

---

## Workflow Utilisateur

### Parcours Principal

1. **Onboarding** (`/projects/new`)
   - Création d'un projet avec nom et description
   - Ajout de hashtags et/ou créateurs à suivre
   - Sélection des plateformes (Instagram, TikTok)

2. **Gestion des Projets** (`/projects`)
   - Liste de tous les projets de l'utilisateur
   - Filtrage par statut (draft, active, archived)
   - Accès rapide aux projets actifs

3. **Détails Projet** (`/projects/:id`)
   - **Onglet Watchlist**: Feed de posts, liste des créateurs, table des hashtags
   - **Onglet Analytics**: Statistiques, métriques, signaux détectés

### Fonctionnalités Futures (Phase 2+)

- **Investigate Mode**: Recherche avancée dans un projet, sélection multi-items
- **Clustering IA**: Groupement automatique par similarité sémantique
- **Weekly Digest**: Résumés hebdomadaires générés par IA
- **Export Slides**: Génération de présentations via Gamma/Pomelli

---

## API Endpoints

### Authentification & OAuth

- `POST /api/v1/auth/register` - Inscription
- `POST /api/v1/auth/login` - Connexion
- `GET /api/v1/auth/me` - Profil utilisateur
- `GET /api/v1/auth/{provider}/start` - Init OAuth
- `GET /api/v1/auth/{provider}/callback` - Callback OAuth

### Projects

- `GET /api/v1/projects` - Liste projets utilisateur
- `POST /api/v1/projects` - Créer projet
- `GET /api/v1/projects/{id}` - Détails projet
- `PUT /api/v1/projects/{id}` - Mettre à jour projet
- `DELETE /api/v1/projects/{id}` - Supprimer projet

### Posts & Recherche

- `GET /api/v1/posts/search` - Recherche posts (Meilisearch)
- `GET /api/v1/posts/trending` - Posts trending

### Analytics

- `GET /api/v1/analytics/*` - Endpoints analytics variés

---

## Configuration & Environnement

### Variables Backend Requises

```bash
# Database
DATABASE_URL=postgresql+psycopg2://...

# Authentication
SECRET_KEY=...
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OAuth Providers
IG_APP_ID=...
IG_APP_SECRET=...
FB_APP_ID=...
FB_APP_SECRET=...
# ... (Google, TikTok)

# Services
REDIS_URL=redis://...
MEILI_HOST=...
MEILI_MASTER_KEY=...

# Advanced (Phase 2+)
QDRANT_URL=...
OPENAI_API_KEY=...
ENABLE_AI_CLUSTERS=false
ENABLE_GAMMA_EXPORT=false
```

---

## Roadmap Technique

### Phase 1: Foundations ✅ (Terminé)
- [x] Modèles Projects en base de données
- [x] Endpoints Projects CRUD
- [x] Interface My Projects
- [x] Onboarding simplifié

### Phase 2: Recherche & IA (En cours)
- [ ] Intégration Qdrant + service embeddings
- [ ] Endpoints clustering (`/api/v1/projects/{id}/cluster`)
- [ ] Recherche sémantique dans posts/créateurs

### Phase 3: Workers & Agents
- [ ] Configuration Celery + workers background
- [ ] Agents backend (Scout, Scribe, Planner)
- [ ] Génération Weekly Digest

### Phase 4: Features Avancées
- [ ] Multi-tenant (organisations)
- [ ] Vertex AI (analyse vidéo, on-demand)
- [ ] Gamma/Pomelli export
- [ ] docker-compose pour développement local

---

## Principes d'Architecture

1. **MVP First** - Implémentation progressive, focus sur App Review
2. **Feature Flags** - Toutes fonctionnalités avancées derrière flags
3. **Réutilisabilité** - Tables de liaison plutôt que duplication de données
4. **Progressive Enhancement** - Scaling technologies uniquement si nécessaire
5. **Simplicité** - Architecture claire, éviter sur-ingénierie

---

## App Review Mode (Meta/TikTok)

### Mode Démonstration

Pour la validation App Review Meta/TikTok, l'application fonctionne en **mode démonstration** avec des datasets mock/fake (posts, creators, insights) permettant d'afficher le fonctionnement complet du flux utilisateur (OAuth → création projet → visualisation → analytics).

**Justification**: Les reviewers évaluent la **compréhension du flux** et la conformité aux politiques, pas nécessairement des données réelles. L'ingestion réelle sera activée automatiquement dès l'obtention de l'accès Public Content.

**Statut**: ✅ Datasets fake disponibles dans `apps/frontend/src/lib/fakeData.ts`

### Permissions OAuth Requises (Meta/Facebook)

**Instagram Business:**
- `instagram_manage_insights` - Gestion des insights Instagram Business
- `read_insights` - Lecture des insights de pages
- `instagram_business_basic` - Accès basique Instagram Business
- `instagram_business_manage_insights` - Gestion avancée insights

**Pages:**
- `pages_show_list` - Liste des pages Facebook connectées
- `pages_read_user_content` - Lecture contenu utilisateur des pages
- `pages_read_engagement` - Lecture métriques d'engagement
- `Page Public Content Access` - Accès contenu public (Advanced Access requis)
- `Page Public Metadata Access` - Accès métadonnées publiques

**Instagram Basic:**
- `instagram_basic` - Accès basique (profile, media)
- `Instagram Public Content Access` - Accès contenu public (Advanced Access requis)

**Autres:**
- `Meta oEmbed Read` - Lecture données oEmbed (embeds)
- `public_profile` - Profil public (renouvellement accès existant)

### Permissions OAuth Requises (TikTok)

**Login Kit:**
- `user.info.basic` - Informations utilisateur basiques
- `user.info.profile` - Informations profil utilisateur
- `user.info.stats` - Statistiques utilisateur
- `video.list` - Liste des vidéos

### Conformité Data Deletion

- ✅ Page `/data-deletion` fonctionnelle avec formulaire
- ✅ Endpoint `DELETE /api/v1/user/{id}` (à implémenter)
- ✅ Documentation complète dans pages légales (`/privacy`, `/terms`)

---

## Documentation Complémentaire

- **README.md** - Guide de démarrage rapide, installation
- **BACKEND_STATUS.md** - État des lieux backend détaillé, gaps identifiés
- **DATABASE.md** - Analyse schéma base de données, réutilisation des tables
- **FRONTEND.md** - État des lieux frontend, pages implémentées
- **REFERENCE.md** - Artefacts techniques (schémas, endpoints, prompts)
