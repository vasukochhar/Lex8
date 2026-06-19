from __future__ import annotations

from typing import Any, Protocol


class DMSConnector(Protocol):
    provider: str
    display_name: str
    status: str

    def list_workspaces(self) -> list[dict[str, Any]]:
        ...

    def list_documents(self, workspace_id: str) -> list[dict[str, Any]]:
        ...

    def fetch_document_metadata(self, document_id: str) -> dict[str, Any] | None:
        ...

    def sync_document(self, workspace_id: str, document_id: str, matter_id: str | None = None) -> dict[str, Any]:
        ...

    def sync_status(self, sync_id: str) -> dict[str, Any] | None:
        ...
