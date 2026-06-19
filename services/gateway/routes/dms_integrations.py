from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException

from integrations.dms.registry import CONNECTORS, get_connector, list_providers
from response_utils import module_response


router = APIRouter(prefix="/api/v1/integrations/dms", tags=["dms-integrations"])

DEFAULT_SYNC_TARGETS = {
    "imanage": {"workspace_id": "im_ws_acme_beta", "document_id": "im_doc_p14"},
    "netdocuments": {"workspace_id": "nd_ws_acme_beta", "document_id": "nd_doc_p01"},
}


def _require_connector(provider: str):
    connector = get_connector(provider)
    if not connector:
        raise HTTPException(status_code=404, detail="Unsupported DMS provider")
    return connector


def _require_workspace(connector, workspace_id: str) -> dict[str, Any]:
    workspace = next((item for item in connector.list_workspaces() if item["workspace_id"] == workspace_id), None)
    if not workspace:
        raise HTTPException(status_code=404, detail="DMS workspace not found")
    return workspace


def _require_document(connector, workspace_id: str, document_id: str) -> dict[str, Any]:
    _require_workspace(connector, workspace_id)
    document = next((item for item in connector.list_documents(workspace_id) if item["document_id"] == document_id), None)
    if not document:
        raise HTTPException(status_code=404, detail="DMS document not found")
    return document


@router.get("/providers")
async def providers() -> dict[str, Any]:
    legacy = {"providers": list_providers(), "status": "connected_mock"}
    return module_response("dms_integrations", legacy, legacy=legacy)


@router.get("/sync/{sync_id}")
async def sync_status(sync_id: str) -> dict[str, Any]:
    for connector in CONNECTORS.values():
        status = connector.sync_status(sync_id)
        if status:
            return module_response("dms_integrations", status, legacy=status)
    raise HTTPException(status_code=404, detail="Sync job not found")


@router.get("/{provider}/workspaces")
async def workspaces(provider: str) -> dict[str, Any]:
    connector = _require_connector(provider)
    legacy = {"provider": connector.provider, "status": connector.status, "workspaces": connector.list_workspaces()}
    return module_response("dms_integrations", legacy, legacy=legacy)


@router.get("/{provider}/workspaces/{workspace_id}/documents")
async def documents(provider: str, workspace_id: str) -> dict[str, Any]:
    connector = _require_connector(provider)
    _require_workspace(connector, workspace_id)
    legacy = {
        "provider": connector.provider,
        "workspace_id": workspace_id,
        "status": connector.status,
        "documents": connector.list_documents(workspace_id),
    }
    return module_response("dms_integrations", legacy, legacy=legacy)


@router.post("/{provider}/sync")
async def sync(provider: str, payload: dict[str, Any]) -> dict[str, Any]:
    connector = _require_connector(provider)
    defaults = DEFAULT_SYNC_TARGETS[connector.provider]
    workspace_id = payload.get("workspace_id", defaults["workspace_id"])
    document_id = payload.get("document_id", defaults["document_id"])
    _require_document(connector, workspace_id, document_id)
    job = connector.sync_document(
        workspace_id=workspace_id,
        document_id=document_id,
        matter_id=payload.get("matter_id", "demo-acme-beta"),
    )
    return module_response("dms_integrations", job, legacy=job)
