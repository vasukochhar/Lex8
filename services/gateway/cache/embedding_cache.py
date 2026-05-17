"""Embedding cache abstraction with Redis primary and in-memory fallback."""

from __future__ import annotations

import json
import time
from typing import Any

import redis.asyncio as redis

from config import settings

_memory_cache: dict[str, tuple[float, list[float], dict[str, Any]]] = {}
_redis_client = None


async def _get_redis():
    global _redis_client
    if _redis_client is None:
        _redis_client = redis.from_url(
            settings.REDIS_URL,
            decode_responses=True,
            socket_connect_timeout=0.05,
            socket_timeout=0.05,
        )
    return _redis_client


class EmbeddingCache:
    def __init__(self, namespace: str = "lex8:embedding", ttl_seconds: int = 86400):
        self.namespace = namespace
        self.ttl_seconds = ttl_seconds

    def _key(self, text_hash: str) -> str:
        return f"{self.namespace}:{text_hash}"

    async def get(self, text_hash: str) -> dict[str, Any] | None:
        key = self._key(text_hash)
        try:
            client = await _get_redis()
            raw = await client.get(key)
            return json.loads(raw) if raw else None
        except Exception:
            item = _memory_cache.get(key)
            if not item:
                return None
            expires_at, vector, metadata = item
            if expires_at < time.time():
                _memory_cache.pop(key, None)
                return None
            return {"vector": vector, "metadata": metadata, "backend": "memory"}

    async def set(self, text_hash: str, vector: list[float], metadata: dict[str, Any] | None = None) -> dict[str, Any]:
        key = self._key(text_hash)
        payload = {"vector": vector, "metadata": metadata or {}, "backend": "redis"}
        try:
            client = await _get_redis()
            await client.setex(key, self.ttl_seconds, json.dumps(payload))
            return payload
        except Exception:
            memory_payload = {"vector": vector, "metadata": metadata or {}, "backend": "memory"}
            _memory_cache[key] = (time.time() + self.ttl_seconds, vector, metadata or {})
            return memory_payload

    async def status(self) -> dict[str, Any]:
        try:
            client = await _get_redis()
            await client.ping()
            return {"backend": "redis", "available": True}
        except Exception:
            return {"backend": "memory", "available": True}


embedding_cache = EmbeddingCache()
