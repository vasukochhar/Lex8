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


def test_compliance_export_endpoint_returns_mock_metadata():
    response = client.post(
        "/api/v1/defensibility/export",
        json={"matter_id": "demo-acme-beta", "date_from": "2024-01-01", "date_to": "2024-12-31"},
    )

    assert response.status_code == 200
    export = response.json()
    assert export["export_id"].startswith("export_demo_acme_beta_")
    assert export["matter_id"] == "demo-acme-beta"
    assert export["format"] == "PDF"
    assert export["status"] == "ready"
    assert export["signature_status"] == "anchor8_mock_signed"
    assert export["verification_token"].startswith("mock_")
    assert "a8_demo_filer_privilege_block" in export["included_action_ids"]
    assert len(export["narratives"]) == len(export["included_action_ids"])


def test_module_routes_include_standard_shape_and_legacy_fields():
    drafter = client.post("/api/v1/drafter/drafts", json={"matter_id": "demo-acme-beta"}).json()
    library = client.post("/api/v1/library/search", json={"query": "veil piercing"}).json()
    war_room = client.post("/api/v1/war-room/sessions", json={"issue": "Veil piercing"}).json()

    for payload in (drafter, library, war_room):
        assert payload["module"]
        assert payload["standard_status"] in {"ok", "degraded", "blocked", "error"}
        assert isinstance(payload["data"], dict)
        assert "error" in payload
        assert "degradation_reason" in payload
        assert payload["anchor8_mode"] in {"mock", "stored"}

    assert drafter["draft_id"] == "draft_demo_msj_001"
    assert library["status"] == "mock_results"
    assert war_room["session_id"] == "warroom_demo_acme_beta"


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
