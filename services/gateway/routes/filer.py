from typing import Any
from fastapi import APIRouter

from integrations.anchor8_client import anchor8_client
from response_utils import module_response


router = APIRouter(prefix="/api/v1/filer", tags=["filer"])


@router.post("/filings")
async def create_filing(payload: dict[str, Any]) -> dict[str, Any]:
    anchor8 = await anchor8_client.guard("filer", "create_filing", payload)
    anchor8["action_id"] = "a8_demo_filer_privilege_block"
    anchor8["verdict"] = "BLOCK"
    anchor8["lane"] = 4
    anchor8["rahs"] = 0.88
    anchor8["reason"] = "Mock Anchor8 metadata: Exhibit P-14 privilege issue routed for attorney review."
    filing_id = "filing_demo_privileged_p14"
    legacy = {
        "filing_id": filing_id,
        "matter_id": payload.get("matter_id", "demo-acme-beta"),
        "court": payload.get("court", "PACER mock"),
        "status": "pre_submit_mock",
        "anchor8": anchor8,
    }
    return module_response("filer", legacy, status="blocked", legacy=legacy)


@router.get("/filings/{filing_id}")
async def get_filing(filing_id: str) -> dict[str, Any]:
    legacy = {
        "filing_id": filing_id,
        "matter_id": "demo-acme-beta",
        "status": "pre_submit_mock",
        "last_event": "Blocked pending Lane 4 product review for Exhibit P-14.",
    }
    return module_response("filer", legacy, status="blocked", legacy=legacy)
