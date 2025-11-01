# Frontend Status - veyl.io

**Dernière mise à jour**: Janvier 2025  
**Objectif**: État des lieux frontend, pages implémentées, routing, composants

---

## Structure Actuelle

```
apps/frontend/src/
├── components/
│   ├── ui/              Composants Radix UI complets
│   ├── Navbar.tsx       Navigation (Search, Projects, Community, Profile)
│   ├── ProtectedRoute.tsx Auth guard
│   └── AISearchBar.tsx  Barre de recherche
├── contexts/
│   ├── AuthContext.tsx  Gestion authentification
│   └── WatchlistContext.tsx Watchlist state
├── pages/
│   ├── Landing.tsx      Page d'accueil
│   ├── Auth.tsx         Login/Register
│   ├── Search.tsx       Recherche posts
│   ├── Analytics.tsx    Analytics dashboard
│   ├── Profile.tsx      Profil utilisateur + OAuth
│   ├── Projects.tsx     My Projects (liste)
│   ├── ProjectsNew.tsx  Onboarding (création projet)
│   ├── ProjectDetail.tsx Détails projet (tabs Watchlist/Analytics)
│   ├── CreatorDetail.tsx Détails créateur
│   └── Community.tsx    Community Hub
└── lib/
    ├── api.ts           Client API (auth, search, projects)
    ├── fakeData.ts      Datasets mock pour développement/App Review
    └── utils.ts         Utilitaires
```

---

## Routing Actuel (App.tsx)

### Routes Publiques
- `/` → Landing
- `/auth` → Auth (login/register)
- `/auth/callback` → AuthCallback (OAuth)
- `/docs`, `/enterprise`, `/privacy`, `/terms`, `/data-deletion` → Pages légales

### Routes Protégées
- `/search` → Search posts
- `/projects` → My Projects (liste)
- `/projects/new` → Onboarding (création projet)
- `/projects/:id` → Project Detail (Watchlist + Analytics tabs)
- `/projects/:id/creator/:username` → Creator Detail
- `/community` → Community Hub
- `/analytics` → Analytics (global)
- `/profile` → User Profile + OAuth accounts

---

## Pages Projects (Implémentées)

### `/projects` - My Projects
- Liste projets utilisateur avec statut
- Bouton "New project"
- Empty state si aucun projet
- Badge status (active, draft, archived)
- Actions: View, Delete
- Cards responsives (grid layout)

### `/projects/new` - Onboarding
- Formulaire simplifié (1 étape)
- Champs: name, description (optionnel), platforms
- Input hashtags (tags avec add/remove)
- Input créateurs (tags avec add/remove)
- Validation: au moins 1 hashtag OU 1 créateur
- Redirection vers `/projects/:id` après création

### `/projects/:id` - Project Detail
- Header avec nom, description, status badge
- Stats cards (Creators, Posts, Hashtags, Signals)
- Tabs:
  - **Watchlist**: Feed posts, Liste créateurs, Table hashtags
  - **Analytics**: Stats de base + "Coming Soon"
- Navigation vers Creator Detail

---

## Améliorations Futures (Phase 2)

### Investigate Mode
- Recherche avancée dans projet
- Multi-select posts/créateurs
- "Add to Project" batch

### Clustering IA
- Bouton "Cluster with AI" (requiert Qdrant)
- Groupement automatique en niches
- Édition manuelle niches

### Reports
- Liste rapports générés
- Weekly Digest viewer
- Export slides (Gamma/Pomelli) - flag Pro+

### Niches Manager
- Tableau niches
- Drag & drop créateurs entre niches
- Statistiques par niche

---

## Composants Utiles

### UI Components (Radix UI)
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `Button`, `Input`, `Label`
- `Badge`, `Tabs`, `Table`
- `Toast` (sonner)

### Icons (lucide-react)
- `FileText`, `Edit`, `Trash2`, `Calendar`
- `Hash`, `User`, `Plus`, `X`
- `ArrowLeft`, `Settings`, `Heart`, `MessageCircle`

---

## Design System

- **Tailwind CSS** - Framework CSS utility-first
- **Radix UI** - Composants UI accessibles (headless)
- **Theme**: Dark mode par défaut, variables CSS personnalisées

---

## État d'Implémentation

| Page | Statut | Notes |
|------|--------|-------|
| Landing | ✅ | CTA "Start a demo" → `/projects/new` |
| Search | ✅ | Recherche posts Meilisearch |
| Projects | ✅ | Liste projets, création, détails |
| Community | ✅ | Placeholder (à enrichir) |
| Analytics | ✅ | Dashboard global |
| Profile | ✅ | OAuth accounts management |

**Score**: 6/6 pages principales fonctionnelles

---

## Intégration Backend

### API Client (`lib/api.ts`)
- ✅ `createProject()` - Créer projet
- ✅ `getProjects()` - Liste projets
- ✅ `getProject(id)` - Détails projet
- ✅ `deleteProject(id)` - Supprimer projet

### Données Mock (`lib/fakeData.ts`)
- ✅ `getFakeProject(id)` - Projet mock
- ✅ `getFakeProjectPosts(projectId)` - Posts mock
- ✅ `fakeCreators`, `fakePosts` - Données de test

**Note**: Frontend utilise données réelles via API, fallback sur fake data en développement.

---

## Prochaines Étapes

1. **Phase 2**: Investigate mode (recherche avancée)
2. **Phase 2**: Clustering IA (Qdrant)
3. **Phase 3**: Weekly Digest generation (Agent Scribe)
4. **Phase 4**: Export slides (Gamma/Pomelli)

Voir `ARCHITECTURE.md` pour roadmap complète.

---

**Référence**: `ARCHITECTURE.md` pour architecture complète, `README.md` pour quick start.
