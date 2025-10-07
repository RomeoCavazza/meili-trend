# MeiliTrends

Micro-service de recherche/reco pour TikTok/Instagram avec Meilisearch + FastAPI.

## Quickstart
```bash
cp .env.example .env
docker compose up -d --build
curl -X POST localhost:8000/index/init
curl -X POST localhost:8000/seed
curl -s -X POST localhost:8000/search -H 'content-type: application/json' -d '{"q":"ai","hitsPerPage":5}'
```

## API
- `GET /health` - Status
- `POST /index/init` - Init index
- `POST /seed` - Load data
- `POST /search` - Search posts
- `GET /similar/{id}` - Similar posts
- `GET /stats` - Statistics

## Front
```bash
python3 -m http.server -d front 5500
# http://localhost:5500
```

## Post Schema
```json
{
  "id": "tt_001",
  "source": "tiktok",
  "title": "AI filter goes viral",
  "text": "New genAI beauty filter demo...",
  "hashtags": ["ai", "filter", "beauty"],
  "author": "@alice_tech",
  "lang": "en",
  "date": "2025-01-15T09:00:00Z",
  "likes": 1280,
  "views": 15200,
  "url": "https://tiktok.com/...",
  "thumb": "https://example.com/thumb.jpg"
}
```
