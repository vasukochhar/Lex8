from typing import Any
from fastapi import APIRouter

from response_utils import module_response


router = APIRouter(prefix="/api/v1/forecast", tags=["forecast"])


@router.post("/predict")
async def predict_outcome(payload: dict[str, Any]) -> dict[str, Any]:
    legacy = {
        "prediction_id": "forecast_demo_bias_block",
        "matter_id": payload.get("matter_id", "demo-acme-beta"),
        "status": "blocked_by_mock_anchor8",
        "outcomes": [
            {"label": "settlement_likely", "probability": 0.58},
            {"label": "summary_judgment_granted", "probability": 0.31},
        ],
    }
    return module_response("forecast", legacy, status="blocked", legacy=legacy)
