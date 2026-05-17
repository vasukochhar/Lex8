import asyncio
import sys
from pathlib import Path

from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[2]
GATEWAY = ROOT / "services" / "gateway"
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(GATEWAY))

from cache.embedding_cache import EmbeddingCache
from cache.threshold_store import ThresholdStore
from main import app


client = TestClient(app)


def run(coro):
    return asyncio.run(coro)


def test_full_app_import_and_health_route():
    assert app.title == "Lex8 Gateway"
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert response.headers["X-Request-ID"]


def test_modules_and_module_health_routes_cover_all_modules():
    modules_response = client.get("/api/v1/modules")
    health_response = client.get("/api/v1/health/modules")

    assert modules_response.status_code == 200
    assert health_response.status_code == 200
    modules = modules_response.json()["modules"]
    health_modules = health_response.json()["modules"]
    assert len(modules) == 8
    assert len(health_modules) == 8
    assert {module["archetype"] for module in modules} == {
        "drafter",
        "filer",
        "vault_vision",
        "library",
        "forecast",
        "war_room",
        "validator",
        "case_synth",
    }
    assert health_response.json()["anchor8"]["internals"] == "external"


def test_library_validator_and_war_room_routes():
    library = client.post("/api/v1/library/search", json={"query": "veil piercing", "matter_id": "demo-acme-beta"})
    validator = client.post("/api/v1/validator/validate", json={"matter_id": "demo-acme-beta", "draft_id": "draft_demo_msj_001"})
    war_room = client.post("/api/v1/war-room/sessions", json={"matter_id": "demo-acme-beta", "issue": "Veil piercing"})

    assert library.status_code == 200
    assert library.json()["status"] == "mock_results"
    assert len(library.json()["results"]) >= 1
    assert validator.status_code == 200
    assert validator.json()["status"] == "mock_validated"
    assert war_room.status_code == 200
    assert war_room.json()["session_id"] == "warroom_demo_acme_beta"


def test_existing_demo_routes_have_frontend_stable_shapes():
    assert client.get("/api/v1/drafter/templates").json()["templates"][0]["id"]
    assert client.post("/api/v1/drafter/drafts", json={"matter_id": "demo-acme-beta"}).json()["draft_id"] == "draft_demo_msj_001"
    assert client.post("/api/v1/filer/filings", json={"matter_id": "demo-acme-beta"}).json()["filing_id"] == "filing_demo_privileged_p14"
    assert client.post("/api/v1/vault-vision/analyze", json={"document_id": "P-14"}).json()["analysis_id"] == "vv_demo_p14_redaction"
    assert client.post("/api/v1/forecast/predict", json={"matter_id": "demo-acme-beta"}).json()["prediction_id"] == "forecast_demo_bias_block"
    assert client.post("/api/v1/case-synth/timeline", json={"matter_id": "demo-acme-beta"}).json()["timeline_id"] == "timeline_demo_acme_beta"


def test_cache_fallback_behavior():
    embedding_cache = EmbeddingCache(namespace="test:embedding", ttl_seconds=30)
    threshold_store = ThresholdStore(namespace="test:threshold")

    set_result = run(embedding_cache.set("abc", [0.1, 0.2], {"source": "test"}))
    get_result = run(embedding_cache.get("abc"))
    threshold_result = run(threshold_store.set("demo.threshold", 0.42))
    threshold_value = run(threshold_store.get("demo.threshold"))

    assert set_result["backend"] in {"memory", "redis"}
    assert get_result["vector"] == [0.1, 0.2]
    assert threshold_result["backend"] in {"memory", "redis"}
    assert threshold_value == 0.42
