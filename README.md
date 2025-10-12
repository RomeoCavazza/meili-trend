# Insidr

Moteur de recherche Instagram (Graph API + Meilisearch).

## Démarrage

```bash
cp .env.example .env
# Éditer .env : remplir IG_ACCESS_TOKEN et IG_USER_ID

docker compose up
```

## Tests

```bash
# Health
curl http://localhost:8000/healthz

# Ingestion
curl -X POST http://localhost:8000/v1/ingest/instagram/hashtag \
  -H 'Content-Type: application/json' \
  -d '{"tag":"fashion","kind":"top","limit":25}'

# Recherche
curl "http://localhost:8000/v1/search/posts?q=fashion&sort=score_trend:desc"
```

## Structure

```
backend/          API FastAPI + connecteurs
  ├── app.py              Routes & endpoints
  ├── config.py           Variables d'environnement
  ├── instagram_client.py Connecteur Instagram Graph API
  ├── models.py           Modèles Pydantic + scoring
  └── search.py           Client Meilisearch

frontend/         Site web statique (Vercel)
  ├── app.js              Logique recherche (75 lignes)
  ├── pages/              Landing + pages légales
  └── vercel.json         Config routing

.env.example      Template configuration
```

## License

MIT
