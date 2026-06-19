from __future__ import annotations

from integrations.dms.base import DMSConnector
from integrations.dms.imanage import IManageConnector
from integrations.dms.netdocuments import NetDocumentsConnector


CONNECTORS: dict[str, DMSConnector] = {
    "imanage": IManageConnector(),
    "netdocuments": NetDocumentsConnector(),
}


def list_providers() -> list[dict]:
    return [
        {
            "provider": connector.provider,
            "display_name": connector.display_name,
            "status": connector.status,
        }
        for connector in CONNECTORS.values()
    ]


def get_connector(provider: str) -> DMSConnector | None:
    return CONNECTORS.get(provider.lower())
