import sys
from pathlib import Path

from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[2]
GATEWAY = ROOT / "services" / "gateway"
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(GATEWAY))

from main import app
from observability import init_sentry_if_configured, observability_status


client = TestClient(app)


def test_app_import_and_health_observability_status():
    assert app.title == "Lex8 Gateway"
    response = client.get("/health")

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "healthy"
    assert payload["observability"]["sentry"]["enabled"] is False
    assert payload["observability"]["opentelemetry"]["enabled"] is False


def test_metrics_endpoint_prometheus_text_and_request_counts():
    client.get("/health")
    client.post("/api/v1/drafter/drafts", json={"matter_id": "demo-acme-beta"})
    response = client.get("/metrics")

    assert response.status_code == 200
    assert "text/plain" in response.headers["content-type"]
    body = response.text
    assert "# HELP lex8_gateway_requests_total" in body
    assert "lex8_gateway_health 1" in body
    assert 'lex8_gateway_module_requests_total{module="drafter"}' in body
    assert 'path="/health"' in body


def test_sentry_noop_when_dsn_missing(monkeypatch):
    monkeypatch.delenv("SENTRY_DSN", raising=False)
    state = init_sentry_if_configured()

    assert state["enabled"] is False
    assert state["reason"] == "SENTRY_DSN not configured"
    assert observability_status()["sentry"]["enabled"] is False
