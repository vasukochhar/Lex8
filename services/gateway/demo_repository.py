"""DB-first readers for Acme v. Beta demo records with fixture fallback."""

from __future__ import annotations

from datetime import datetime, timedelta
import hashlib
from pathlib import Path
import sys
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from packages.db.demo_fixtures import (
    AGENT_ACTIONS,
    DEMO_MATTER_SLUG,
    EMAIL_EVENTS,
    LANE4_REVIEWS,
)


def _action_from_fixture(action: dict[str, Any]) -> dict[str, Any]:
    return {
        "action_id": action["action_id"],
        "matter_id": DEMO_MATTER_SLUG,
        "module": action["module"],
        "action_type": action["action_type"],
        "verdict": action["verdict"],
        "lane": action["lane"],
        "rahs": action["rahs"],
        "reason": action["reason"],
        "block_category": action["block_category"],
        "severity": action["severity"],
        "narrative": {
            "title": f"{action['module'].title()} demo narrative",
            "summary": action["reason"],
            "snapshot": {
                "mock": True,
                "verdict": action["verdict"],
                "lane": action["lane"],
                "rahs": action["rahs"],
                "block_category": action["block_category"],
                "severity": action["severity"],
            },
        },
    }


def _parse_dt(value: Any) -> datetime | None:
    if isinstance(value, datetime):
        return value
    if isinstance(value, str):
        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00")).replace(tzinfo=None)
        except ValueError:
            return None
    return None


def _review_with_sla(review: dict[str, Any]) -> dict[str, Any]:
    now = datetime.utcnow()
    created_at = _parse_dt(review.get("created_at")) or now
    due_at = created_at + timedelta(minutes=int(review.get("sla_minutes") or 15))
    remaining = int((due_at - now).total_seconds()) if review.get("status") == "pending" else 0
    seconds_remaining = max(0, remaining)
    minutes_remaining = max(0, (seconds_remaining + 59) // 60)
    if review.get("status") != "pending":
        sla_status = "resolved"
    elif remaining <= 0:
        sla_status = "breached"
    elif seconds_remaining <= 300:
        sla_status = "warning"
    else:
        sla_status = "ok"

    return {
        **review,
        "created_at": created_at.isoformat(),
        "due_at": due_at.isoformat(),
        "seconds_remaining": seconds_remaining,
        "minutes_remaining": minutes_remaining,
        "sla_status": sla_status,
        "evidence_bundle": review.get("evidence_bundle") or {},
        "juror_narratives": review.get("juror_narratives") or [],
    }


def fixture_actions(matter_id: str | None = None) -> list[dict[str, Any]]:
    actions = [_action_from_fixture(action) for action in AGENT_ACTIONS]
    return [a for a in actions if not matter_id or a["matter_id"] == matter_id]


def fixture_reviews(status: str | None = None) -> list[dict[str, Any]]:
    reviews = [_review_with_sla(dict(review)) for review in LANE4_REVIEWS]
    return [r for r in reviews if not status or r["status"] == status]


def fixture_events() -> list[dict[str, Any]]:
    return [dict(event) for event in EMAIL_EVENTS]


def list_actions(matter_id: str | None = None) -> list[dict[str, Any]]:
    try:
        from db import session_scope
        from packages.db.models import AgentAction, DefensibilityNarrative, Matter

        with session_scope() as session:
            query = session.query(AgentAction, Matter).join(Matter, AgentAction.matter_id == Matter.id)
            if matter_id:
                query = query.filter(Matter.metadata_["slug"].astext == matter_id)
            rows = query.all()
            actions = []
            for action, matter in rows:
                telemetry = action.telemetry or {}
                anchor8_action_id = telemetry.get("anchor8_action_id", str(action.id))
                narrative = (
                    session.query(DefensibilityNarrative)
                    .filter(DefensibilityNarrative.anchor8_action_id == anchor8_action_id)
                    .first()
                )
                actions.append(
                    {
                        "action_id": anchor8_action_id,
                        "matter_id": (matter.metadata_ or {}).get("slug", str(matter.id)),
                        "module": action.archetype,
                        "action_type": action.action_type,
                        "verdict": action.anchor8_verdict,
                        "lane": action.lane,
                        "rahs": telemetry.get("rahs"),
                        "reason": telemetry.get("reason", ""),
                        "block_category": telemetry.get("block_category"),
                        "severity": telemetry.get("severity"),
                        "narrative": {
                            "title": narrative.title,
                            "summary": narrative.summary,
                            "snapshot": narrative.snapshot,
                        }
                        if narrative
                        else None,
                    }
                )
            return actions or fixture_actions(matter_id)
    except Exception:
        return fixture_actions(matter_id)


def get_action(action_id: str) -> dict[str, Any] | None:
    return next((action for action in list_actions() if action["action_id"] == action_id), None)


def get_summary(matter_id: str | None = None) -> dict[str, Any]:
    actions = list_actions(matter_id)
    blocked = sum(1 for action in actions if action["verdict"] == "BLOCK")
    return {
        "matter_id": matter_id or "all",
        "total_actions": len(actions),
        "blocked_actions": blocked,
        "lane4_queue_depth": len(list_reviews("pending")),
        "average_rahs": round(sum(float(a.get("rahs") or 0) for a in actions) / len(actions), 3) if actions else 0,
    }


def list_reviews(status: str | None = None) -> list[dict[str, Any]]:
    try:
        from db import session_scope
        from packages.db.models import Lane4Review

        with session_scope() as session:
            query = session.query(Lane4Review)
            if status:
                query = query.filter(Lane4Review.status == status)
            rows = query.all()
            reviews = [
                {
                    "review_id": row.review_id,
                    "action_id": row.action_id,
                    "matter_id": row.matter_id,
                    "status": row.status,
                    "sla_minutes": row.sla_minutes,
                    "reason": row.reason,
                    "allowed_decisions": row.allowed_decisions,
                    "evidence_bundle": row.evidence_bundle,
                    "juror_narratives": row.juror_narratives,
                    "decision": row.decision,
                    "reviewer": row.reviewer,
                    "note": row.note,
                    "decided_at": row.decided_at.isoformat() if row.decided_at else None,
                    "created_at": row.created_at,
                }
                for row in rows
            ]
            return [_review_with_sla(review) for review in reviews] or fixture_reviews(status)
    except Exception:
        return fixture_reviews(status)


def get_review(review_id: str) -> dict[str, Any] | None:
    return next((review for review in list_reviews() if review["review_id"] == review_id), None)


def decide_review(review_id: str, decision: str, reviewer: str, note: str = "") -> dict[str, Any] | None:
    normalized = decision.upper()
    try:
        from db import session_scope
        from packages.db.models import Lane4Review

        with session_scope() as session:
            row = session.query(Lane4Review).filter(Lane4Review.review_id == review_id).first()
            if row:
                row.status = "decided"
                row.decision = normalized
                row.reviewer = reviewer
                row.note = note
                row.decided_at = datetime.utcnow()
                session.flush()
                return {
                    "review_id": row.review_id,
                    "action_id": row.action_id,
                    "matter_id": row.matter_id,
                    "status": row.status,
                    "sla_minutes": row.sla_minutes,
                    "reason": row.reason,
                    "allowed_decisions": row.allowed_decisions,
                    "evidence_bundle": row.evidence_bundle,
                    "juror_narratives": row.juror_narratives,
                    "decision": row.decision,
                    "reviewer": row.reviewer,
                    "note": row.note,
                    "decided_at": row.decided_at.isoformat(),
                    "created_at": row.created_at,
                }
                return _review_with_sla(review)
    except Exception:
        pass

    review = get_review(review_id)
    if not review:
        return None
    return {
        **review,
        "status": "decided",
        "decision": normalized,
        "reviewer": reviewer,
        "note": note,
        "decided_at": datetime.utcnow().isoformat(),
        "seconds_remaining": 0,
        "minutes_remaining": 0,
        "sla_status": "resolved",
    }


def get_block_analyzer(matter_id: str | None = None) -> dict[str, Any]:
    actions = [action for action in list_actions(matter_id) if action.get("verdict") == "BLOCK"]
    by_category: dict[str, int] = {}
    by_severity: dict[str, int] = {}
    blocks = []
    for action in actions:
        category = action.get("block_category") or "unknown"
        severity = action.get("severity") or "unknown"
        by_category[category] = by_category.get(category, 0) + 1
        by_severity[severity] = by_severity.get(severity, 0) + 1
        blocks.append(
            {
                "action_id": action["action_id"],
                "matter_id": action["matter_id"],
                "module": action["module"],
                "action_type": action["action_type"],
                "category": category,
                "severity": severity,
                "reason": action.get("reason", ""),
                "rahs": action.get("rahs"),
                "lane": action.get("lane"),
            }
        )
    return {
        "matter_id": matter_id or "all",
        "total_blocks": len(blocks),
        "by_category": by_category,
        "by_severity": by_severity,
        "blocks": blocks,
    }


def get_juror_disagreements(matter_id: str | None = None) -> dict[str, Any]:
    reviews = [review for review in list_reviews() if not matter_id or review["matter_id"] == matter_id]
    entries = []
    for review in reviews:
        narratives = review.get("juror_narratives") or []
        if narratives:
            votes = sorted({narrative.get("vote") for narrative in narratives})
            entries.append(
                {
                    "review_id": review["review_id"],
                    "action_id": review["action_id"],
                    "matter_id": review["matter_id"],
                    "status": "resolved_to_lane4",
                    "votes": votes,
                    "juror_narratives": narratives,
                }
            )
    return {
        "matter_id": matter_id or "all",
        "disagreements": entries,
    }


def get_lane4_sla(matter_id: str | None = None) -> dict[str, Any]:
    reviews = [review for review in list_reviews() if not matter_id or review["matter_id"] == matter_id]
    pending = [review for review in reviews if review["status"] == "pending"]
    breached = [review for review in pending if review["sla_status"] == "breached"]
    warning = [review for review in pending if review["sla_status"] == "warning"]
    return {
        "matter_id": matter_id or "all",
        "queue_depth": len(pending),
        "pending": len(pending),
        "warning": len(warning),
        "breached": len(breached),
        "reviews": reviews,
    }


def build_compliance_export(payload: dict[str, Any]) -> dict[str, Any]:
    matter_id = payload.get("matter_id") or DEMO_MATTER_SLUG
    date_from = payload.get("date_from") or payload.get("from")
    date_to = payload.get("date_to") or payload.get("to")
    export_format = payload.get("format", "PDF")
    actions = list_actions(matter_id)
    included_action_ids = [action["action_id"] for action in actions]
    generated_at = datetime.utcnow().isoformat()
    token_seed = f"{matter_id}:{','.join(included_action_ids)}:{generated_at}".encode("utf-8")
    verification_token = f"mock_{hashlib.sha256(token_seed).hexdigest()[:16]}"
    export_id = f"export_{matter_id.replace('-', '_')}_{hashlib.sha256(token_seed).hexdigest()[:10]}"

    return {
        "export_id": export_id,
        "matter_id": matter_id,
        "format": export_format,
        "status": "ready",
        "signature_status": "anchor8_mock_signed",
        "verification_token": verification_token,
        "verification_url": f"https://verify.lex8.local/mock/{verification_token}",
        "included_action_ids": included_action_ids,
        "generated_at": generated_at,
        "date_range": {
            "from": date_from,
            "to": date_to,
        },
        "narratives": [
            {
                "action_id": action["action_id"],
                "title": (action.get("narrative") or {}).get("title"),
                "summary": (action.get("narrative") or {}).get("summary"),
                "snapshot": (action.get("narrative") or {}).get("snapshot"),
            }
            for action in actions
        ],
    }
