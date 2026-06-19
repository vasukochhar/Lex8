import sys
from pathlib import Path

from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[2]
GATEWAY = ROOT / "services" / "gateway"
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(GATEWAY))

from main import app


client = TestClient(app)


def test_app_imports_and_health_still_works():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_eve_auditor_blocks_fabricated_henderson_citation():
    response = client.post(
        "/api/v1/validator/audit-output",
        json={
            "matter_id": "demo-acme-beta",
            "source_module": "drafter",
            "input_output_id": "draft_demo_msj_001",
            "output_text": "The rule is controlled by Henderson v. Omega, 999 F.4th 123 (2d Cir. 2024).",
        },
    )
    body = response.json()

    assert response.status_code == 200
    assert body["feature_name"] == "Eve Auditor"
    assert body["validator_verdict"] == "BLOCK"
    assert body["overall_status"] == "blocked"
    assert body["findings"][0]["category"] == "hallucinated_legal_citation"


def test_eve_auditor_named_route_has_stable_report_shape():
    response = client.post(
        "/api/v1/validator/eve-auditor/audit-output",
        json={
            "matter_id": "demo-acme-beta",
            "source_module": "drafter",
            "input_output_id": "draft_clean_demo",
            "output_text": "This clean demo output includes a certificate of service.",
        },
    )
    body = response.json()
    required_keys = {
        "audit_id",
        "feature_name",
        "matter_id",
        "source_module",
        "input_output_id",
        "overall_status",
        "validator_verdict",
        "lane",
        "risk_score",
        "findings",
        "required_human_review",
        "verification_certificate",
    }

    assert response.status_code == 200
    assert required_keys <= set(body)
    assert body["feature_name"] == "Eve Auditor"
    assert body["overall_status"] == "passed"
    assert body["validator_verdict"] == "ALLOW"


def test_eve_auditor_detects_quote_claim_and_filing_warnings():
    response = client.post(
        "/api/v1/validator/audit-output",
        json={
            "matter_id": "demo-acme-beta",
            "source_module": "filer",
            "input_output_id": "filing_demo_warnings",
            "jurisdiction": "SDNY",
            "output_text": "Quote: Beta admitted breach. It appears that damages exceed the threshold.",
        },
    )
    categories = {finding["category"] for finding in response.json()["findings"]}

    assert {"quote_source_mismatch", "unsupported_factual_claim", "local_rule_filing_readiness"} <= categories


def test_eve_auditor_blocks_p14_privilege_redaction_issue():
    response = client.post(
        "/api/v1/validator/audit-output",
        json={
            "matter_id": "demo-acme-beta",
            "source_module": "filer",
            "input_output_id": "filing_demo_privileged_p14",
            "document_ids": ["P-14"],
            "output_text": "The filing packet includes Exhibit P-14.",
        },
    )
    body = response.json()

    assert body["validator_verdict"] == "BLOCK"
    assert body["required_human_review"] is True
    assert {finding["category"] for finding in body["findings"]} >= {"privilege_redaction_risk"}


def test_eve_auditor_warns_or_blocks_bias_proxy_scenario():
    response = client.post(
        "/api/v1/validator/audit-output",
        json={
            "matter_id": "demo-acme-beta",
            "source_module": "forecast",
            "input_output_id": "forecast_demo_bias_block",
            "output_text": "The forecast uses a demographic proxy feature and zip code proxy weighting.",
        },
    )
    body = response.json()

    assert body["validator_verdict"] in {"MODIFY", "BLOCK"}
    assert body["overall_status"] in {"warning", "blocked"}
    assert {finding["category"] for finding in body["findings"]} >= {"bias_protected_class_proxy_risk"}


def test_dms_providers_include_imanage_and_netdocuments():
    response = client.get("/api/v1/integrations/dms/providers")
    providers = {provider["provider"] for provider in response.json()["providers"]}

    assert response.status_code == 200
    assert providers == {"imanage", "netdocuments"}


def test_dms_workspace_and_document_listing_work_for_mock_data():
    workspaces_response = client.get("/api/v1/integrations/dms/imanage/workspaces")
    workspaces = workspaces_response.json()["workspaces"]
    documents_response = client.get(f"/api/v1/integrations/dms/imanage/workspaces/{workspaces[0]['workspace_id']}/documents")
    documents = documents_response.json()["documents"]

    assert workspaces[0]["matter_id"] == "demo-acme-beta"
    assert any(document["lex8_document_key"] == "P-14" for document in documents)


def test_dms_invalid_provider_workspace_and_document_return_404():
    assert client.get("/api/v1/integrations/dms/unknown/workspaces").status_code == 404
    assert client.get("/api/v1/integrations/dms/imanage/workspaces/missing/documents").status_code == 404
    response = client.post(
        "/api/v1/integrations/dms/imanage/sync",
        json={"workspace_id": "im_ws_acme_beta", "document_id": "missing"},
    )

    assert response.status_code == 404


def test_dms_sync_creates_stable_mock_sync_result():
    response = client.post(
        "/api/v1/integrations/dms/netdocuments/sync",
        json={
            "workspace_id": "nd_ws_acme_beta",
            "document_id": "nd_doc_p01",
            "matter_id": "demo-acme-beta",
        },
    )
    sync = response.json()
    status = client.get(f"/api/v1/integrations/dms/sync/{sync['sync_id']}").json()

    assert sync["initial_status"] == "sync_started"
    assert sync["status"] == "synced"
    assert status["sync_id"] == sync["sync_id"]


def test_dms_sync_defaults_are_provider_specific():
    response = client.post("/api/v1/integrations/dms/netdocuments/sync", json={})
    sync = response.json()

    assert response.status_code == 200
    assert sync["provider"] == "netdocuments"
    assert sync["workspace_id"] == "nd_ws_acme_beta"
    assert sync["document_id"] == "nd_doc_p01"
