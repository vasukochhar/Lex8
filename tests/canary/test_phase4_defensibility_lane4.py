import sys
from pathlib import Path

from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[2]
GATEWAY = ROOT / "services" / "gateway"
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(GATEWAY))

from main import app


client = TestClient(app)


def test_lane4_review_includes_sla_countdown_and_context():
    response = client.get("/api/v1/lane4/reviews/review_demo_privileged_filing")

    assert response.status_code == 200
    review = response.json()
    assert review["sla_minutes"] == 15
    assert review["created_at"]
    assert review["due_at"]
    assert isinstance(review["seconds_remaining"], int)
    assert isinstance(review["minutes_remaining"], int)
    assert review["sla_status"] in {"ok", "warning", "breached", "resolved"}
    assert review["evidence_bundle"]["documents"][0]["document_id"] == "P-14"
    assert len(review["juror_narratives"]) == 2


def test_lane4_decision_still_works_with_augmented_shape():
    response = client.post(
        "/api/v1/lane4/reviews/review_demo_privileged_filing/decision",
        json={"decision": "BLOCK", "reviewer": "demo-partner", "note": "Keep P-14 out of public filing."},
    )

    assert response.status_code == 200
    review = response.json()
    assert review["status"] == "decided"
    assert review["decision"] == "BLOCK"
    assert review["seconds_remaining"] == 0
    assert review["sla_status"] == "resolved"
    assert review["evidence_bundle"]["anchor8_action_id"] == "a8_demo_filer_privilege_block"


def test_defensibility_block_analyzer_endpoint():
    response = client.get("/api/v1/defensibility/block-analyzer?matter_id=demo-acme-beta")

    assert response.status_code == 200
    analyzer = response.json()
    assert analyzer["total_blocks"] == 3
    assert analyzer["by_category"]["privilege"] == 1
    assert analyzer["by_category"]["hallucinated_citation"] == 1
    assert any(block["severity"] == "critical" for block in analyzer["blocks"])


def test_defensibility_juror_disagreement_endpoint():
    response = client.get("/api/v1/defensibility/juror-disagreements?matter_id=demo-acme-beta")

    assert response.status_code == 200
    log = response.json()
    assert len(log["disagreements"]) == 1
    entry = log["disagreements"][0]
    assert entry["review_id"] == "review_demo_privileged_filing"
    assert entry["action_id"] == "a8_demo_filer_privilege_block"
    assert entry["votes"] == ["BLOCK"]
    assert len(entry["juror_narratives"]) == 2


def test_defensibility_lane4_sla_endpoint():
    response = client.get("/api/v1/defensibility/lane4-sla?matter_id=demo-acme-beta")

    assert response.status_code == 200
    sla = response.json()
    assert sla["queue_depth"] == 1
    assert sla["pending"] == 1
    assert sla["breached"] >= 0
    assert sla["reviews"][0]["review_id"] == "review_demo_privileged_filing"
    assert "minutes_remaining" in sla["reviews"][0]
