"""Threshold/config store with Redis primary and in-memory fallback."""

from __future__ import annotations

import json
from typing import Any

import redis.asyncio as redis

from config import settings

DEFAULT_THRESHOLDS: dict[str, Any] = {
    "drafter.block_rahs": 0.7,
    "filer.privilege_block_rahs": 0.7,
    "forecast.bias_block_rahs": 0.7,
    "lane4.sla_minutes": 15,
}

_memory_store: dict[str, Any] = dict(DEFAULT_THRESHOLDS)
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


class ThresholdStore:
    def __init__(self, namespace: str = "lex8:threshold"):
        self.namespace = namespace

    def _key(self, name: str) -> str:
        return f"{self.namespace}:{name}"

    async def get(self, name: str, default: Any = None) -> Any:
        try:
            client = await _get_redis()
            raw = await client.get(self._key(name))
            return json.loads(raw) if raw is not None else DEFAULT_THRESHOLDS.get(name, default)
        except Exception:
            return _memory_store.get(name, default)

    async def set(self, name: str, value: Any) -> dict[str, Any]:
        try:
            client = await _get_redis()
            await client.set(self._key(name), json.dumps(value))
            return {"name": name, "value": value, "backend": "redis"}
        except Exception:
            _memory_store[name] = value
            return {"name": name, "value": value, "backend": "memory"}

    async def all(self) -> dict[str, Any]:
        return {name: await self.get(name) for name in DEFAULT_THRESHOLDS}

    async def status(self) -> dict[str, Any]:
        try:
            client = await _get_redis()
            await client.ping()
            return {"backend": "redis", "available": True}
        except Exception:
            return {"backend": "memory", "available": True}


threshold_store = ThresholdStore()
