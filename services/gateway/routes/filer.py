from typing import Any
from fastapi import APIRouter

from response_utils import module_response


router = APIRouter(prefix="/api/v1/filer", tags=["filer"])


@router.post("/filings")
async def create_filing(payload: dict[str, Any]) -> dict[str, Any]:
    filing_id = "filing_demo_privileged_p14"
    legacy = {
        "filing_id": filing_id,
        "matter_id": payload.get("matter_id", "demo-acme-beta"),
        "court": payload.get("court", "PACER mock"),
        "status": "pre_submit_mock",
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
