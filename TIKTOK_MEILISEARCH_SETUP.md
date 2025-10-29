# Guide d'Intégration TikTok API + Meilisearch

## ✅ Architecture Implémentée

### Services Créés

1. **`services/meilisearch_client.py`**
   - Client Meilisearch pour l'indexation et la recherche
   - Auto-configuration de l'index avec settings optimisés
   - Support batch indexing
   - Recherche avec filtres et tri

2. **`services/tiktok_service.py`**
   - Service pour interagir avec TikTok Research API
   - Récupération de vidéos par hashtag
   - Récupération des hashtags tendance
   - Transformation des données TikTok → format Post

3. **`jobs/tiktok_sync_job.py`**
   - Job de synchronisation TikTok → PostgreSQL → Meilisearch
   - Support hashtags spécifiques ou trending
   - Gestion des doublons

4. **`jobs/jobs_endpoints.py`**
   - Endpoints pour déclencher les synchronisations
   - Requiert role admin/analyst

### Endpoints Améliorés

- `GET /api/v1/posts/search` - Recherche avec Meilisearch (fallback PostgreSQL)
- `POST /api/v1/jobs/sync/tiktok` - Synchroniser des hashtags spécifiques
- `POST /api/v1/jobs/sync/tiktok/trending` - Synchroniser les hashtags tendance

## 📋 Configuration Requise

### Variables d'environnement Backend

```bash
# Meilisearch (optionnel - fallback sur PostgreSQL si absent)
MEILI_HOST=http://localhost:7700  # Ou URL Meilisearch Cloud
MEILI_INDEX=posts
MEILI_MASTER_KEY=votre_master_key

# TikTok API (obligatoire pour synchronisation)
TIKTOK_CLIENT_KEY=votre_client_key
TIKTOK_CLIENT_SECRET=votre_client_secret
```

### Installation Meilisearch

**Option 1: Local (Développement)**
```bash
# Docker
docker run -d -p 7700:7700 -e MEILI_MASTER_KEY=master_key getmeili/meilisearch:latest

# Ou avec Meilisearch Cloud (recommandé pour production)
```

**Option 2: Meilisearch Cloud**
1. Créer un compte sur https://cloud.meilisearch.com
2. Créer un projet
3. Copier l'URL et master key dans les variables d'environnement

### Obtenir les Credentials TikTok

1. Aller sur https://developers.tiktok.com/
2. Créer une application
3. Utiliser TikTok Research API (nécessite approbation)
4. Copier Client Key et Client Secret

## 🚀 Utilisation

### 1. Synchroniser des Hashtags Spécifiques

```bash
POST /api/v1/jobs/sync/tiktok
Authorization: Bearer <token>
Content-Type: application/json

{
  "hashtags": ["fyp", "viral", "trending"],
  "trending": false
}
```

### 2. Synchroniser les Hashtags Tendance

```bash
POST /api/v1/jobs/sync/tiktok/trending
Authorization: Bearer <token>
```

### 3. Rechercher des Posts

```bash
GET /api/v1/posts/search?q=fashion&platform=tiktok&min_score=50&limit=20
Authorization: Bearer <token>
```

## 🔄 Flux de Données

```
TikTok API → TikTokService → TikTokSyncJob → PostgreSQL + Meilisearch
                                              ↓
                                          Posts Endpoints
                                              ↓
                                     Frontend (via API)
```

1. **Récupération** : TikTokService récupère les vidéos depuis TikTok
2. **Transformation** : Transformation en format Post
3. **Stockage** : Sauvegarde dans PostgreSQL (persistance)
4. **Indexation** : Indexation dans Meilisearch (recherche rapide)
5. **Recherche** : Les endpoints utilisent Meilisearch pour recherche, PostgreSQL pour détails

## 📊 Structure des Données

### Format Post dans Meilisearch

```json
{
  "id": "post_id",
  "platform_id": 1,
  "platform_name": "tiktok",
  "author": "username",
  "caption": "description...",
  "hashtags": ["tag1", "tag2"],
  "metrics": {
    "likes": 1000,
    "comments": 50,
    "shares": 20,
    "views": 5000
  },
  "posted_at": "2024-01-01T00:00:00",
  "language": "en",
  "media_url": "https://...",
  "score": 85.5,
  "score_trend": 90.0
}
```

## ⚡ Améliorations Futures

- [ ] Scheduler automatique (Celery ou APScheduler) pour sync régulière
- [ ] Webhook TikTok pour updates en temps réel
- [ ] Support multi-plateformes (Instagram, YouTube)
- [ ] Analytics avancées avec Meilisearch
- [ ] Cache Redis pour résultats de recherche fréquents

## 🐛 Troubleshooting

### Meilisearch non disponible
- Les endpoints fonctionnent en fallback PostgreSQL
- Vérifier `MEILI_HOST` et `MEILI_MASTER_KEY`

### TikTok API rate limits
- Le job inclut des pauses (2s) entre hashtags
- Respecter les quotas TikTok

### Posts non indexés
- Vérifier les logs backend
- Vérifier la connectivité Meilisearch
- Vérifier le format des données

