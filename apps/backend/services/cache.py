# services/cache.py
# Helpers de cache JSON avec Redis

import json
from core.redis_client import redis

async def cache_get_json(key: str):
    """Récupère une valeur JSON depuis le cache Redis"""
    v = await redis.get(key)
    return json.loads(v) if v else None

async def cache_set_json(key: str, data, ttl: int = 300):
    """Stocke une valeur JSON dans le cache Redis avec TTL"""
    await redis.set(key, json.dumps(data), ex=ttl)
