"""
Lex8-side Anchor8 adapter.

This module represents calls to Anchor8 without implementing Anchor8 internals.
Real DID issuance, lane engines, RAHS scoring, Tribunal, signing, and detectors
belong to Anchor8 and are intentionally outside Lex8.
"""

import hashlib
import os
import time
import uuid
from typing import Any


class Anchor8Client:
    """Small product-facing wrapper for Anchor8 guard/observe calls."""

    def __init__(self, base_url: str | None = None, mock_mode: bool | None = None):
        self.base_url = base_url or os.environ.get("ANCHOR8_GATEWAY_URL", "")
        self.mock_mode = mock_mode if mock_mode is not None else os.environ.get("ANCHOR8_MOCK_MODE", "true").lower() != "false"

    async def guard(self, archetype: str, action_type: str, payload: dict[str, Any]) -> dict[str, Any]:
        """Return a mock Anchor8 verdict envelope for product flows."""
        return self._mock_response("guard", archetype, action_type, payload)

    async def observe(self, archetype: str, action_type: str, payload: dict[str, Any]) -> dict[str, Any]:
        """Return a mock Anchor8 observe envelope for product flows."""
        return self._mock_response("observe", archetype, action_type, payload)

    def _mock_response(self, mode: str, archetype: str, action_type: str, payload: dict[str, Any]) -> dict[str, Any]:
        seed = repr(sorted(payload.items())).encode("utf-8")
        digest = hashlib.sha256(seed).hexdigest()
        return {
            "mode": mode,
            "mock": True,
            "action_id": f"a8_{uuid.uuid4().hex[:12]}",
            "archetype": archetype,
            "action_type": action_type,
            "verdict": "PASS",
            "lane": 2,
            "rahs": 0.12,
            "reason": "Mock Anchor8 verdict for Lex8 product development.",
            "metadata": {
                "payload_hash": digest,
                "generated_at_ms": int(time.time() * 1000),
            },
        }


anchor8_client = Anchor8Client()
