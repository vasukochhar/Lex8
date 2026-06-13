import asyncio
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[2]
GATEWAY = ROOT / "services" / "gateway"
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(GATEWAY))

from main import app
from response_utils import degraded_response, retry_with_backoff


client = TestClient(app)


def run(coro):
    return asyncio.run(coro)


def test_degraded_response_helper_shape():
    response = degraded_response("library", "Redis unavailable", data={"results": []})

    assert response["module"] == "library"
    assert response["standard_status"] == "degraded"
    assert response["status"] == "degraded"
    assert response["degradation_reason"] == "Redis unavailable"
    assert response["data"]["results"] == []


def test_retry_with_backoff_success_after_retry():
    attempts = {"count": 0}

    async def flaky():
        attempts["count"] += 1
        if attempts["count"] == 1:
            raise RuntimeError("temporary")
        return "ok"

    assert run(retry_with_backoff(flaky, attempts=2, base_delay_seconds=0)) == "ok"
    assert attempts["count"] == 2


def test_retry_with_backoff_raises_after_failures():
    async def failing():
        raise RuntimeError("still failing")

    with pytest.raises(RuntimeError):
        run(retry_with_backoff(failing, attempts=2, base_delay_seconds=0))
