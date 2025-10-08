# MeiliTrends

We are developing a search and analytics engine called MeiliTrends, powered by MeiliSearch and FastAPI. The goal is to integrate TikTok’s Business API to collect and analyze public performance data (views, engagement, hashtags, sounds, audience metrics) for research and trend intelligence purposes. Our platform helps brands and agencies monitor emerging trends, creator performance, and audience sentiment across TikTok and other social networks. The API will be used exclusively for data insights, reporting dashboards, and automated analytics — not for publishing or user-generated content. Company: Meili Search Main services: Data analytics, AI-powered insights, API integrations for marketing and media monitoring. Usage scope: Business research, campaign benchmarking, and audience analysis across EMEA. We are also testing integration with OpenAI-based natural language processing to provide semantic trend clustering and predictive analysis.

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
