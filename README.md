# Insidr

🔎 Instagram search & analytics microservice powered by Meta Graph API + MeiliSearch

## Démarrage Local

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
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
  ├── app.py              Routes & endpoints + OAuth
  ├── instagram_client.py Connecteur Instagram Graph API
  ├── models.py           Modèles Pydantic + scoring
  └── search.py           Client Meilisearch

frontend/         Site web statique (Vercel)
  ├── app.js              Logique recherche
  ├── pages/              Landing + pages légales
  └── vercel.json         Config routing
```

## License

MIT
