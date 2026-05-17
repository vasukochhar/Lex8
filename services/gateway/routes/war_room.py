from typing import Any

from fastapi import APIRouter

from integrations.anchor8_client import anchor8_client
from response_utils import module_response


router = APIRouter(prefix="/api/v1/war-room", tags=["war-room"])

DEMO_SESSION = {
    "session_id": "warroom_demo_acme_beta",
    "matter_id": "demo-acme-beta",
    "issue": "Whether veil piercing is supported by the commingled ledger evidence.",
    "status": "mock_complete",
    "participants": [
        {"role": "plaintiff_advocate", "label": "Plaintiff Advocate"},
        {"role": "defense_counsel", "label": "Defense Counsel"},
        {"role": "precedent_analyst", "label": "Precedent Analyst"},
        {"role": "judge", "label": "Judge"},
    ],
    "final_ruling": "Mock War Room result: the ledger supports further veil-piercing analysis, but intent and corporate separateness remain disputed.",
}


@router.post("/sessions")
async def create_session(payload: dict[str, Any]) -> dict[str, Any]:
    anchor8 = await anchor8_client.observe("war_room", "create_session", payload)
    legacy = {**DEMO_SESSION, "issue": payload.get("issue", DEMO_SESSION["issue"]), "anchor8": anchor8}
    return module_response("war_room", legacy, status="ok", legacy=legacy)


@router.get("/sessions/{session_id}")
async def get_session(session_id: str) -> dict[str, Any]:
    legacy = {**DEMO_SESSION, "session_id": session_id}
    return module_response("war_room", legacy, status="ok", legacy=legacy)
