from typing import Any
from fastapi import APIRouter

from integrations.anchor8_client import anchor8_client
from response_utils import module_response


router = APIRouter(prefix="/api/v1/drafter", tags=["drafter"])


@router.get("/templates")
async def list_templates() -> dict[str, Any]:
    return {
        "templates": [
            {"id": "mtd", "name": "Motion to Dismiss"},
            {"id": "msj", "name": "Motion for Summary Judgment"},
            {"id": "settlement_letter", "name": "Settlement Letter"},
        ]
    }


@router.post("/drafts")
async def create_draft(payload: dict[str, Any]) -> dict[str, Any]:
    anchor8 = await anchor8_client.guard("drafter", "create_draft", payload)
    anchor8["action_id"] = "a8_demo_drafter_hallucination_block"
    anchor8["verdict"] = "BLOCK"
    anchor8["lane"] = 2
    anchor8["rahs"] = 0.82
    anchor8["reason"] = "Mock Anchor8 metadata: fabricated Henderson citation blocked before output."
    legacy = {
        "draft_id": "draft_demo_msj_001",
        "status": "blocked_by_mock_anchor8",
        "matter_id": payload.get("matter_id", "demo-acme-beta"),
        "template_id": payload.get("template_id", "msj"),
        "title": "Mock MSJ Draft",
        "content_preview": "Demo draft intercepted before output because a fabricated Henderson citation was detected in mock metadata.",
        "anchor8": anchor8,
    }
    return module_response("drafter", legacy, status="blocked", legacy=legacy)
