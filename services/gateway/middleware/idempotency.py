"""
Idempotency middleware — prevents duplicate request processing.
Uses Redis with 24h TTL keyed on Idempotency-Key header.
"""

import hashlib
import json

import redis.asyncio as redis
from fastapi import Request, Response
from starlette.responses import JSONResponse

from config import settings

_redis = None
TTL = 86400  # 24 hours
_memory_cache = {}


async def get_redis():
    global _redis
    if _redis is None:
        _redis = redis.from_url(
            settings.REDIS_URL,
            decode_responses=True,
            socket_connect_timeout=0.05,
            socket_timeout=0.05,
        )
    return _redis


async def idempotency_middleware(request: Request, call_next):
    """Cache responses by Idempotency-Key header."""
    idem_key = request.headers.get("Idempotency-Key")

    # Only apply to mutation methods
    if not idem_key or request.method in ("GET", "HEAD", "OPTIONS"):
        return await call_next(request)

    cache_key = f"idem:{idem_key}"

    # Check if we already processed this request
    try:
        r = await get_redis()
        cached = await r.get(cache_key)
        backend = "redis"
    except Exception:
        cached = _memory_cache.get(cache_key)
        backend = "memory"

    if cached:
        data = json.loads(cached) if isinstance(cached, str) else cached
        return JSONResponse(
            content=data["body"],
            status_code=data["status"],
            headers={"X-Idempotent-Replay": "true", "X-Idempotency-Backend": backend},
        )

    # Process the request
    response = await call_next(request)

    # Cache successful responses
    if 200 <= response.status_code < 300:
        body = b""
        async for chunk in response.body_iterator:
            body += chunk

        cache_data = json.dumps({
            "status": response.status_code,
            "body": json.loads(body.decode()),
        })
        if backend == "redis":
            await r.setex(cache_key, TTL, cache_data)
        else:
            _memory_cache[cache_key] = json.loads(cache_data)

        return JSONResponse(
            content=json.loads(body.decode()),
            status_code=response.status_code,
            headers={"X-Idempotency-Backend": backend},
        )

    return response
