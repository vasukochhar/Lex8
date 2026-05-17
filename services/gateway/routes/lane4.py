from typing import Any

from fastapi import APIRouter, HTTPException

from demo_repository import decide_review as write_review_decision
from demo_repository import get_review as read_review
from demo_repository import list_reviews as read_reviews

router = APIRouter(prefix="/api/v1/lane4", tags=["lane4"])


@router.get("/reviews")
async def list_reviews(status: str | None = None) -> dict[str, Any]:
    return {"reviews": read_reviews(status)}


@router.get("/reviews/{review_id}")
async def get_review(review_id: str) -> dict[str, Any]:
    review = read_review(review_id)
    if review:
        return review
    raise HTTPException(status_code=404, detail="Review not found")


@router.post("/reviews/{review_id}/decision")
async def decide_review(review_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    decision = str(payload.get("decision", "")).upper()
    if decision not in {"APPROVE", "BLOCK", "MODIFY"}:
        raise HTTPException(status_code=400, detail="decision must be APPROVE, BLOCK, or MODIFY")

    review = write_review_decision(
        review_id=review_id,
        decision=decision,
        reviewer=payload.get("reviewer", "demo-partner"),
        note=payload.get("note", ""),
    )
    if review:
        return review
    raise HTTPException(status_code=404, detail="Review not found")
