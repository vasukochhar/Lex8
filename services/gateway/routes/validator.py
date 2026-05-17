from typing import Any

from fastapi import APIRouter

from integrations.anchor8_client import anchor8_client
from response_utils import module_response


router = APIRouter(prefix="/api/v1/validator", tags=["validator"])


@router.post("/validate")
async def validate_draft(payload: dict[str, Any]) -> dict[str, Any]:
    matter_id = payload.get("matter_id", "demo-acme-beta")
    draft_id = payload.get("draft_id", "draft_demo_msj_001")
    anchor8 = await anchor8_client.guard("validator", "validate_draft", {"matter_id": matter_id, "draft_id": draft_id})
    legacy = {
        "validation_id": "validator_demo_henderson_check",
        "matter_id": matter_id,
        "draft_id": draft_id,
        "status": "mock_validated",
        "checks": [
            {
                "check_id": "citation-structure",
                "label": "Citation structure",
                "result": "fail",
                "message": "Demo Henderson citation does not match the seeded precedent corpus.",
            },
            {
                "check_id": "standard-of-care",
                "label": "Standard of care analysis",
                "result": "pass",
                "message": "Required section is present in the demo draft.",
            },
        ],
        "anchor8": anchor8,
    }
    return module_response("validator", legacy, status="ok", legacy=legacy)
