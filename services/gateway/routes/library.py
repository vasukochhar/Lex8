from typing import Any

from fastapi import APIRouter

from cache.embedding_cache import embedding_cache
from response_utils import module_response


router = APIRouter(prefix="/api/v1/library", tags=["library"])

DEMO_RESULTS = [
    {
        "document_id": "P-31",
        "title": "Commingled Ledger Extract",
        "citation": "Demo Exhibit P-31",
        "snippet": "Ledger rows show personal and corporate transfers in the same operating account.",
        "score": 0.91,
        "citator_status": "demo",
    },
    {
        "document_id": "P-23",
        "title": "Beta Board Minutes",
        "citation": "Demo Exhibit P-23",
        "snippet": "Board discussion references delayed segregation of JV funds.",
        "score": 0.84,
        "citator_status": "demo",
    },
]


@router.get("/search")
async def search_library_get(q: str = "corporate veil piercing", matter_id: str = "demo-acme-beta") -> dict[str, Any]:
    return await search_library({"query": q, "matter_id": matter_id})


@router.post("/search")
async def search_library(payload: dict[str, Any]) -> dict[str, Any]:
    query = payload.get("query", "corporate veil piercing")
    matter_id = payload.get("matter_id", "demo-acme-beta")
    cache_key = f"demo:{matter_id}:{query.lower()}"
    await embedding_cache.set(cache_key, [0.12, 0.31, 0.57], {"query": query, "matter_id": matter_id})
    legacy = {
        "query": query,
        "matter_id": matter_id,
        "status": "mock_results",
        "results": DEMO_RESULTS,
        "cache": await embedding_cache.status(),
    }
    return module_response("library", legacy, status="ok", legacy=legacy)
