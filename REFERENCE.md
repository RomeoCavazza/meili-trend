# 📚 Technical Reference - veyl.io

**Objectif**: Artefacts techniques de référence (schémas, endpoints, prompts, contrats)

**Note**: Ces artefacts sont des exemples de référence. L'implémentation actuelle peut différer (voir `ARCHITECTURE.md` pour l'état réel).

---

## 📋 Contrat `summary_json` (Weekly Digest)

Format stable pour les résumés IA générés.

```json
{
  "project_id": "uuid",
  "period": { "start": "2025-10-20", "end": "2025-10-27" },
  "signals": [
    {
      "title": "GRWM revient fort chez micro-influenceuses",
      "why_it_matters": "hausse de 34% de la complétion vidéo chez 18-24",
      "evidence": ["#grwm", "audio: 'get ready with me'", "format facecam 9:16"],
      "score": 0.82
    }
  ],
  "top_creators": [
    {
      "platform": "instagram",
      "handle": "alice.beauty",
      "creator_id": "1789...",
      "momentum": { "slope7d": 0.27, "posts": 9, "avg_views": 18200 }
    }
  ],
  "patterns": {
    "formats": ["facecam cut rapide", "jumpcut + captions bold"],
    "visuals": ["palette pastel", "typo sans bold", "UGC room light"],
    "audio": ["pop-soft-115bpm"]
  },
  "actions": [
    { "type": "test_content", "text": "Tester 3x GRWM 20–30s avec captions bold" },
    { "type": "partner_outreach", "text": "Contacter 5 micro-créatrices 'clean beauty'" }
  ],
  "examples": [
    { "platform": "tiktok", "post_id": "723...", "url": "https://...", "reason": "pattern canon" }
  ]
}
```

---

## 🗄️ Schéma SQLModel Multi-tenant (Référence)

**Note**: L'implémentation actuelle utilise Integer IDs (non UUID) et des tables de liaison (`project_hashtags`, `project_creators`) pour réutiliser les tables existantes. Voir `DATABASE.md` pour la structure réelle.

```python
from sqlmodel import SQLModel, Field, Column, JSON, UniqueConstraint
from datetime import datetime, date
from typing import Optional

# Organisation (multi-tenant)
class Org(SQLModel, table=True):
    __tablename__ = "orgs"
    id: str = Field(primary_key=True)
    name: str
    plan: str = Field(default="free")  # free|pro|team
    created_at: datetime = Field(default_factory=datetime.utcnow)

class OrgMember(SQLModel, table=True):
    __tablename__ = "org_members"
    id: str = Field(primary_key=True)
    org_id: str = Field(index=True, foreign_key="orgs.id")
    user_id: str = Field(index=True)
    role: str = Field(default="owner")  # owner|member

# Projet
class Project(SQLModel, table=True):
    __tablename__ = "projects"
    id: str = Field(primary_key=True)
    org_id: str = Field(index=True, foreign_key="orgs.id")
    name: str
    description: Optional[str] = None
    status: str = Field(default="active")  # draft|active|archived
    settings_json: dict = Field(sa_column=Column(JSON), default_factory=dict)
    last_run_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    __table_args__ = (UniqueConstraint("org_id", "name", name="uq_project_org_name"),)

# Usage tracking
class UsageCounters(SQLModel, table=True):
    __tablename__ = "usage_counters"
    id: str = Field(primary_key=True)
    org_id: str = Field(index=True, foreign_key="orgs.id")
    period: str  # e.g. "2025-11"
    llm_tokens: int = 0
    video_minutes: int = 0
    jobs_run: int = 0
    exports: int = 0
    __table_args__ = (UniqueConstraint("org_id", "period", name="uq_org_period"),)
```

**Référence complète**: Voir structure réelle dans `apps/backend/db/models.py` (tables `projects`, `project_hashtags`, `project_creators`).

---

## 🔌 Endpoints FastAPI (Référence)

**Note**: Les endpoints Projects actuels sont dans `apps/backend/projects/projects_endpoints.py`. Exemples ci-dessous pour référence.

```python
from fastapi import APIRouter, Depends, HTTPException
from typing import List

projects_router = APIRouter(prefix="/api/v1/projects", tags=["projects"])

@projects_router.post("/", response_model=ProjectResponse)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Créer un nouveau projet"""
    # Logique création avec hashtags/créateurs via tables de liaison
    pass

@projects_router.get("/", response_model=List[ProjectResponse])
def list_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste tous les projets de l'utilisateur"""
    pass

@projects_router.post("/{project_id}/cluster")
def cluster_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    config: Settings = Depends(get_settings)
):
    """Clustering IA (requiert ENABLE_AI_CLUSTERS=true)"""
    if not config.ENABLE_AI_CLUSTERS:
        raise HTTPException(400, "Feature disabled")
    # Logique clustering avec Qdrant
    pass
```

**Endpoints réels**: Voir `apps/backend/projects/projects_endpoints.py`

---

## 🤖 Prompts Agents (Référence)

### Agent Scout (Lookalikes)

```
Tu es Scout, un agent d'analyse de créateurs.

Objectif: Identifier des créateurs similaires à un créateur source.

Données disponibles:
- Créateur source: {creator_handle}, plateforme {platform}
- Posts du créateur source (exemples)
- Embeddings des créateurs dans le projet

Tâche:
1. Rechercher dans Qdrant les créateurs avec similarité > 0.7
2. Filtrer par niche/engagement si défini
3. Retourner top 10 lookalikes avec score de similarité

Format réponse:
{
  "lookalikes": [
    {
      "creator_id": "...",
      "handle": "...",
      "similarity_score": 0.85,
      "reason": "Contenu similaire, même niche"
    }
  ]
}
```

### Agent Scribe (Weekly Digest)

```
Tu es Scribe, un agent de résumé IA.

Objectif: Générer un résumé hebdomadaire d'un projet.

Données:
- Projet: {project_name}
- Période: {start_date} à {end_date}
- Posts collectés (top 100 par engagement)
- Créateurs suivis
- Hashtags surveillés

Tâche:
1. Identifier les signaux émergents (patterns, formats, visuels)
2. Identifier les créateurs en momentum
3. Générer actions recommandées
4. Formater en markdown + summary_json

Contrat JSON:
{summary_json_schema}

Instructions:
- Être concis mais précis
- Donner des exemples concrets (post_id, url)
- Actions actionables uniquement
```

### Agent Planner (Actions)

```
Tu es Planner, un agent de planification stratégique.

Objectif: Générer des actions stratégiques basées sur les signaux.

Données:
- Weekly Digest (summary_json)
- Historique projets similaires
- Objectifs utilisateur (si définis)

Tâche:
1. Analyser les signaux identifiés
2. Proposer actions concrètes (test content, outreach, etc.)
3. Prioriser les actions
4. Estimer effort/impact

Format réponse:
{
  "actions": [
    {
      "type": "test_content",
      "priority": "high",
      "effort": "low",
      "impact": "high",
      "description": "..."
    }
  ]
}
```

**Note**: Agents à implémenter dans Phase 3 (voir `ARCHITECTURE.md`).

---

## 🎨 Routes Frontend (Référence)

**Note**: Routes actuelles dans `apps/frontend/src/App.tsx`.

```typescript
// Routes principales
- /                    → Landing
- /auth                → Auth (login/register)
- /auth/callback       → OAuth callback
- /search              → Search posts
- /projects            → My Projects (liste)
- /projects/new        → Onboarding (création projet)
- /projects/:id        → Project Detail (Watchlist + Analytics tabs)
- /projects/:id/creator/:username → Creator Detail
- /community           → Community Hub
- /profile             → User Profile
- /analytics            → Analytics (global)
```

**Composants clés**:
- `Projects.tsx` - Liste projets
- `ProjectsNew.tsx` - Formulaire création
- `ProjectDetail.tsx` - Détails projet (tabs Watchlist/Analytics)

---

## ⚙️ Feature Flags (Référence)

```python
# core/config.py
class Settings:
    # Feature flags
    ENABLE_AI_CLUSTERS: bool = False
    ENABLE_GAMMA_EXPORT: bool = False
    ENABLE_POMELLI_EXPORT: bool = False
    ENABLE_VERTEX_VIDEO: bool = False
    ENABLE_AGENT_SCOUT: bool = False
    ENABLE_AGENT_SCRIBE: bool = False
    ENABLE_AGENT_PLANNER: bool = False
    
    # Services (conditionnels)
    QDRANT_URL: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    VERTEX_AI_PROJECT: Optional[str] = None
```

**Principe**: Toutes features avancées derrière flags, activation progressive selon besoins.

---

## 📚 Références

- **ARCHITECTURE.md** - Architecture complète, état actuel
- **BACKEND_STATUS.md** - Gaps identifiés, plan d'action
- **DATABASE.md** - Schéma DB réel avec tables de liaison

**Note**: Ces artefacts sont des références. L'implémentation actuelle peut différer (Integer IDs vs UUID, tables de liaison vs JSON, etc.).

