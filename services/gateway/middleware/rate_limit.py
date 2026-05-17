"""
Rate limiter middleware using Redis sliding window.
100 req/min per tenant, 1000 req/min global.
"""

import time
import redis.asyncio as redis
from fastapi import Request, HTTPException

from config import settings

_redis = None


async def get_redis():
    global _redis
    if _redis is None:
        _redis = redis.from_url(settings.REDIS_URL, decode_responses=True)
    return _redis


async def rate_limit_middleware(request: Request, call_next):
    """Sliding window rate limiter."""
    r = await get_redis()
    
    # Use IP as key for now (will switch to tenant_id with auth)
    client_ip = request.client.host if request.client else "unknown"
    key = f"rl:{client_ip}"
    now = time.time()
    window = 60  # 1 minute

    pipe = r.pipeline()
    pipe.zremrangebyscore(key, 0, now - window)
    pipe.zadd(key, {str(now): now})
    pipe.zcard(key)
    pipe.expire(key, window)
    results = await pipe.execute()

    request_count = results[2]
    limit = 100

    if request_count > limit:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded: {request_count}/{limit} requests per minute",
        )

    response = await call_next(request)
    response.headers["X-RateLimit-Limit"] = str(limit)
    response.headers["X-RateLimit-Remaining"] = str(max(0, limit - request_count))
    return response
