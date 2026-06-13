from typing import Any
from fastapi import APIRouter

from demo_repository import fixture_events
from response_utils import module_response


router = APIRouter(prefix="/api/v1/case-synth", tags=["case-synth"])


@router.post("/timeline")
async def create_timeline(payload: dict[str, Any]) -> dict[str, Any]:
    legacy = {
        "timeline_id": "timeline_demo_acme_beta",
        "matter_id": payload.get("matter_id", "demo-acme-beta"),
        "status": "mock_ready",
        "events": fixture_events(),
    }
    return module_response("case_synth", legacy, status="ok", legacy=legacy)
