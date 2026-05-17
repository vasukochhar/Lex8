from typing import Any

from fastapi import APIRouter, HTTPException

from demo_repository import build_compliance_export
from demo_repository import get_block_analyzer as read_block_analyzer
from demo_repository import get_action as read_action
from demo_repository import get_juror_disagreements as read_juror_disagreements
from demo_repository import get_lane4_sla as read_lane4_sla
from demo_repository import get_summary as read_summary
from demo_repository import list_actions as read_actions

router = APIRouter(prefix="/api/v1/defensibility", tags=["defensibility"])


@router.get("/actions")
async def list_actions(matter_id: str | None = None) -> dict[str, Any]:
    return {"actions": read_actions(matter_id)}


@router.get("/actions/{action_id}")
async def get_action(action_id: str) -> dict[str, Any]:
    action = read_action(action_id)
    if action:
        return action
    raise HTTPException(status_code=404, detail="Action not found")


@router.get("/summary")
async def get_summary(matter_id: str | None = None) -> dict[str, Any]:
    return read_summary(matter_id)


@router.get("/block-analyzer")
async def get_block_analyzer(matter_id: str | None = None) -> dict[str, Any]:
    return read_block_analyzer(matter_id)


@router.get("/juror-disagreements")
async def get_juror_disagreements(matter_id: str | None = None) -> dict[str, Any]:
    return read_juror_disagreements(matter_id)


@router.get("/lane4-sla")
async def get_lane4_sla(matter_id: str | None = None) -> dict[str, Any]:
    return read_lane4_sla(matter_id)


@router.post("/export")
async def export_compliance(payload: dict[str, Any]) -> dict[str, Any]:
    return build_compliance_export(payload)
