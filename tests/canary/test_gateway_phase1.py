import asyncio
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
GATEWAY = ROOT / "services" / "gateway"
sys.path.insert(0, str(GATEWAY))

from routes.case_synth import create_timeline
from routes.drafter import create_draft, list_templates
from routes.filer import create_filing, get_filing
from routes.forecast import predict_outcome
from routes.vault_vision import analyze_document


def run(coro):
    return asyncio.run(coro)


def test_drafter_routes_return_product_mock():
    templates = run(list_templates())
    draft = run(create_draft({"matter_id": "demo-acme-beta", "template_id": "msj"}))

    assert {t["id"] for t in templates["templates"]} >= {"mtd", "msj", "settlement_letter"}


def test_filer_routes_return_product_mock():
    filing = run(create_filing({"matter_id": "demo-acme-beta", "court": "PACER mock"}))
    fetched = run(get_filing(filing["filing_id"]))

    assert filing["status"] == "pre_submit_mock"
    assert fetched["filing_id"] == filing["filing_id"]


