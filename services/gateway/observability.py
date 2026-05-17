"""Lightweight gateway observability without external service requirements."""

from __future__ import annotations

import os
from collections import Counter
from typing import Any

MODULE_PREFIXES = {
    "/api/v1/drafter": "drafter",
    "/api/v1/filer": "filer",
    "/api/v1/vault-vision": "vault_vision",
    "/api/v1/forecast": "forecast",
    "/api/v1/case-synth": "case_synth",
    "/api/v1/library": "library",
    "/api/v1/validator": "validator",
    "/api/v1/war-room": "war_room",
    "/api/v1/defensibility": "defensibility",
    "/api/v1/lane4": "lane4",
}

REQUEST_COUNTER: Counter[tuple[str, str, str]] = Counter()
MODULE_COUNTER: Counter[str] = Counter()
SENTRY_STATUS: dict[str, Any] = {"enabled": False, "reason": "SENTRY_DSN not configured"}


def module_for_path(path: str) -> str | None:
    for prefix, module in MODULE_PREFIXES.items():
        if path.startswith(prefix):
            return module
    return None


def record_request(method: str, path: str, status_code: int) -> None:
    REQUEST_COUNTER[(method, path, str(status_code))] += 1
    module = module_for_path(path)
    if module:
        MODULE_COUNTER[module] += 1


def init_sentry_if_configured() -> dict[str, Any]:
    dsn = os.environ.get("SENTRY_DSN", "")
    if not dsn:
        SENTRY_STATUS.update({"enabled": False, "reason": "SENTRY_DSN not configured"})
        return SENTRY_STATUS

    try:
        import sentry_sdk
    except ImportError:
        SENTRY_STATUS.update({"enabled": False, "reason": "sentry_sdk not installed"})
        return SENTRY_STATUS

    sentry_sdk.init(dsn=dsn, traces_sample_rate=0.0)
    SENTRY_STATUS.update({"enabled": True, "reason": "configured"})
    return SENTRY_STATUS


def render_metrics() -> str:
    lines = [
        "# HELP lex8_gateway_requests_total Total gateway HTTP requests.",
        "# TYPE lex8_gateway_requests_total counter",
    ]
    for (method, path, status), count in sorted(REQUEST_COUNTER.items()):
        lines.append(
            f'lex8_gateway_requests_total{{method="{method}",path="{path}",status="{status}"}} {count}'
        )

    lines.extend(
        [
            "# HELP lex8_gateway_module_requests_total Total gateway requests by Lex8 module.",
            "# TYPE lex8_gateway_module_requests_total counter",
        ]
    )
    for module, count in sorted(MODULE_COUNTER.items()):
        lines.append(f'lex8_gateway_module_requests_total{{module="{module}"}} {count}')

    lines.extend(
        [
            "# HELP lex8_gateway_health Gateway health status.",
            "# TYPE lex8_gateway_health gauge",
            "lex8_gateway_health 1",
            "# HELP lex8_sentry_enabled Sentry initialization status.",
            "# TYPE lex8_sentry_enabled gauge",
            f"lex8_sentry_enabled {1 if SENTRY_STATUS.get('enabled') else 0}",
        ]
    )
    return "\n".join(lines) + "\n"


def observability_status() -> dict[str, Any]:
    return {
        "sentry": dict(SENTRY_STATUS),
        "opentelemetry": {
            "enabled": False,
            "reason": "OpenTelemetry is documented as pending for Lex8 demo backend.",
        },
    }
