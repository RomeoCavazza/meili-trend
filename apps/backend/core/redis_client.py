# core/redis_client.py
# Client Redis asyncio réutilisable pour cache et rate limiting

import os
from redis.asyncio import from_url

REDIS_URL = os.getenv("REDIS_URL", "redis://127.0.0.1:6379/0")

redis = from_url(
    REDIS_URL,
    encoding="utf-8",
    decode_responses=True,
    health_check_interval=30,
)
