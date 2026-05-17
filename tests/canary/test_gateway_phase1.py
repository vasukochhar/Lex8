import asyncio
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
GATEWAY = ROOT / "services" / "gateway"
sys.path.insert(0, str(GATEWAY))

from integrations.anchor8_client import Anchor8Client
from routes.case_synth import create_timeline
from routes.defensibility import get_action, get_summary, list_actions
from routes.drafter import create_draft, list_templates
from routes.filer import create_filing, get_filing
from routes.forecast import predict_outcome
from routes.lane4 import decide_review, get_review, list_reviews
from routes.vault_vision import analyze_document


def run(coro):
    return asyncio.run(coro)


def test_anchor8_wrapper_returns_mock_verdict():
    client = Anchor8Client(mock_mode=True)
    result = run(client.guard("drafter", "create_draft", {"matter_id": "demo-acme-beta"}))

    assert result["mock"] is True
    assert result["verdict"] == "PASS"
    assert result["action_id"].startswith("a8_")
    assert result["archetype"] == "drafter"


def test_drafter_routes_return_product_mock():
    templates = run(list_templates())
    draft = run(create_draft({"matter_id": "demo-acme-beta", "template_id": "msj"}))

    assert {t["id"] for t in templates["templates"]} >= {"mtd", "msj", "settlement_letter"}
    assert draft["status"] == "blocked_by_mock_anchor8"
    assert draft["anchor8"]["mock"] is True


def test_filer_routes_return_product_mock():
    filing = run(create_filing({"matter_id": "demo-acme-beta", "court": "PACER mock"}))
    fetched = run(get_filing(filing["filing_id"]))

    assert filing["status"] == "pre_submit_mock"
    assert fetched["filing_id"] == filing["filing_id"]


def test_module_product_routes_return_anchor8_metadata():
    vault = run(analyze_document({"document_id": "exhibit-p14"}))
    forecast = run(predict_outcome({"matter_id": "demo-acme-beta"}))
    timeline = run(create_timeline({"matter_id": "demo-acme-beta"}))

    assert vault["anchor8"]["archetype"] == "vault_vision"
    assert forecast["anchor8"]["archetype"] == "forecast"
    assert timeline["anchor8"]["archetype"] == "case_synth"


def test_defensibility_routes_read_mock_action_records():
    actions = run(list_actions("demo-acme-beta"))
    first = run(get_action(actions["actions"][0]["action_id"]))
    summary = run(get_summary("demo-acme-beta"))

    assert len(actions["actions"]) >= 1
    assert first["matter_id"] == "demo-acme-beta"
    assert summary["total_actions"] == len(actions["actions"])


def test_lane4_queue_routes_are_product_facing_only():
    reviews = run(list_reviews("pending"))
    review_id = reviews["reviews"][0]["review_id"]
    detail = run(get_review(review_id))
    decision = run(decide_review(review_id, {"decision": "APPROVE", "reviewer": "demo-partner"}))

    assert detail["status"] == "pending"
    assert decision["status"] == "decided"
    assert decision["decision"] == "APPROVE"
