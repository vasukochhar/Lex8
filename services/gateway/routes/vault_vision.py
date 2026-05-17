from typing import Any
from fastapi import APIRouter

from integrations.anchor8_client import anchor8_client
from response_utils import module_response


router = APIRouter(prefix="/api/v1/vault-vision", tags=["vault-vision"])


@router.post("/analyze")
async def analyze_document(payload: dict[str, Any]) -> dict[str, Any]:
    anchor8 = await anchor8_client.guard("vault_vision", "analyze_document", payload)
    legacy = {
        "analysis_id": "vv_demo_p14_redaction",
        "document_id": payload.get("document_id", "exhibit-p14"),
        "status": "mock_analyzed",
        "findings": [
            {
                "type": "redaction_review",
                "severity": "medium",
                "message": "Mock finding only. OCR/redaction diff is not implemented in Phase 1.",
            }
        ],
        "anchor8": anchor8,
    }
    return module_response("vault_vision", legacy, status="ok", legacy=legacy)
