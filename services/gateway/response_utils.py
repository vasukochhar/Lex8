"""Small response helpers for Lex8 product module routes."""

from __future__ import annotations

import asyncio
from typing import Any, Awaitable, Callable

from integrations.anchor8_client import anchor8_client


STANDARD_STATUS = {"ok", "degraded", "blocked", "error"}


def module_response(
    module: str,
    data: dict[str, Any],
    *,
    status: str = "ok",
    error: dict[str, Any] | None = None,
    degradation_reason: str | None = None,
    legacy: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Return stable module fields while preserving legacy top-level keys."""
    standard_status = status if status in STANDARD_STATUS else "ok"
    response = {
        "module": module,
        "standard_status": standard_status,
        "data": data,
        "error": error,
        "degradation_reason": degradation_reason,
        "anchor8_mode": "mock" if anchor8_client.mock_mode else "stored",
    }
    if legacy:
        response.update(legacy)
    return response


def degraded_response(module: str, reason: str, *, data: dict[str, Any] | None = None) -> dict[str, Any]:
    return module_response(
        module,
        data or {},
        status="degraded",
        error=None,
        degradation_reason=reason,
        legacy={"status": "degraded"},
    )


async def retry_with_backoff(
    operation: Callable[[], Awaitable[Any]],
    *,
    attempts: int = 2,
    base_delay_seconds: float = 0.01,
) -> Any:
    """Tiny async retry helper for simulated external calls."""
    last_error: Exception | None = None
    for attempt in range(attempts):
        try:
            return await operation()
        except Exception as exc:
            last_error = exc
            if attempt < attempts - 1:
                await asyncio.sleep(base_delay_seconds * (2 ** attempt))
    if last_error:
        raise last_error
    raise RuntimeError("retry operation failed without an exception")
