from __future__ import annotations

from typing import Any

from packages.db.demo_fixtures import DMS_SYNC_JOBS, DMS_WORKSPACES


class NetDocumentsConnector:
    provider = "netdocuments"
    display_name = "NetDocuments"
    status = "connected_mock"

    def __init__(self) -> None:
        self._syncs = {job["sync_id"]: dict(job) for job in DMS_SYNC_JOBS if job["provider"] == self.provider}

    def list_workspaces(self) -> list[dict[str, Any]]:
        return [dict(workspace) for workspace in DMS_WORKSPACES if workspace["provider"] == self.provider]

    def list_documents(self, workspace_id: str) -> list[dict[str, Any]]:
        workspace = next((w for w in self.list_workspaces() if w["workspace_id"] == workspace_id), None)
        return [dict(doc) for doc in (workspace or {}).get("documents", [])]

    def fetch_document_metadata(self, document_id: str) -> dict[str, Any] | None:
        for workspace in self.list_workspaces():
            for document in workspace["documents"]:
                if document["document_id"] == document_id:
                    return {**document, "workspace_id": workspace["workspace_id"], "provider": self.provider}
        return None

    def sync_document(self, workspace_id: str, document_id: str, matter_id: str | None = None) -> dict[str, Any]:
        sync_id = f"sync_{self.provider}_{workspace_id}_{document_id}".replace("-", "_").lower()
        job = {
            "sync_id": sync_id,
            "provider": self.provider,
            "workspace_id": workspace_id,
            "document_id": document_id,
            "matter_id": matter_id or "demo-acme-beta",
            "status": "synced",
            "message": "Mock NetDocuments document synced into Lex8.",
        }
        self._syncs[sync_id] = job
        return {**job, "initial_status": "sync_started"}

    def sync_status(self, sync_id: str) -> dict[str, Any] | None:
        return self._syncs.get(sync_id)
