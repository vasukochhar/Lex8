import asyncio
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
GATEWAY = ROOT / "services" / "gateway"
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(GATEWAY))

from packages.db.demo_fixtures import (
    AGENT_ACTIONS,
    DEMO_MATTER_SLUG,
    DEPOSITIONS,
    EXHIBITS,
    JURORS,
    LANE4_REVIEWS,
    demo_fixture_summary,
)
from routes.case_synth import create_timeline
from routes.drafter import create_draft
from routes.filer import create_filing
from routes.forecast import predict_outcome
from routes.vault_vision import analyze_document


def run(coro):
    return asyncio.run(coro)


def test_acme_beta_fixture_shape():
    summary = demo_fixture_summary()

    assert summary["matter"]["metadata"]["slug"] == DEMO_MATTER_SLUG
    assert {doc["key"] for doc in EXHIBITS} == {"P-01", "P-12", "P-14", "P-23", "P-31", "D-04"}
    assert next(doc for doc in EXHIBITS if doc["key"] == "P-14")["metadata"]["redaction_failure"] is True
    assert len(DEPOSITIONS) == 3
    assert len(JURORS) == 60
    assert {action["action_id"] for action in AGENT_ACTIONS} == {
        "a8_demo_drafter_hallucination_block",
        "a8_demo_filer_privilege_block",
        "a8_demo_forecast_bias_block",
    }
    assert LANE4_REVIEWS[0]["review_id"] == "review_demo_privileged_filing"


def test_mock_module_routes_match_seeded_demo_ids():
    draft = run(create_draft({"matter_id": DEMO_MATTER_SLUG, "template_id": "msj"}))
    filing = run(create_filing({"matter_id": DEMO_MATTER_SLUG, "court": "PACER mock"}))
    vault = run(analyze_document({"document_id": "P-14"}))
    forecast = run(predict_outcome({"matter_id": DEMO_MATTER_SLUG}))
    timeline = run(create_timeline({"matter_id": DEMO_MATTER_SLUG}))

    assert vault["analysis_id"] == "vv_demo_p14_redaction"
    assert timeline["timeline_id"] == "timeline_demo_acme_beta"
    assert any(event["metadata"].get("case_synth_flag") == "contradiction_support" for event in timeline["events"])
