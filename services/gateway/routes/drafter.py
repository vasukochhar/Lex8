from typing import Any
from fastapi import APIRouter

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
    legacy = {
        "draft_id": "draft_demo_msj_001",
        "status": "blocked_by_mock_anchor8",
        "matter_id": payload.get("matter_id", "demo-acme-beta"),
        "template_id": payload.get("template_id", "msj"),
        "title": "Mock MSJ Draft",
        "content_preview": "Demo draft intercepted before output because a fabricated Henderson citation was detected in mock metadata.",
    }
    return module_response("drafter", legacy, status="blocked", legacy=legacy)
