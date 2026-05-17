from typing import Any
from fastapi import APIRouter

from integrations.anchor8_client import anchor8_client
from response_utils import module_response


router = APIRouter(prefix="/api/v1/forecast", tags=["forecast"])


@router.post("/predict")
async def predict_outcome(payload: dict[str, Any]) -> dict[str, Any]:
    anchor8 = await anchor8_client.observe("forecast", "predict_outcome", payload)
    anchor8["action_id"] = "a8_demo_forecast_bias_block"
    anchor8["verdict"] = "BLOCK"
    anchor8["lane"] = 2
    anchor8["rahs"] = 0.79
    anchor8["reason"] = "Mock Anchor8 metadata: demographic proxy feature blocked in jury forecast."
    legacy = {
        "prediction_id": "forecast_demo_bias_block",
        "matter_id": payload.get("matter_id", "demo-acme-beta"),
        "status": "blocked_by_mock_anchor8",
        "outcomes": [
            {"label": "settlement_likely", "probability": 0.58},
            {"label": "summary_judgment_granted", "probability": 0.31},
        ],
        "anchor8": anchor8,
    }
    return module_response("forecast", legacy, status="blocked", legacy=legacy)
