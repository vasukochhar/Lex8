"""Idempotent Acme v. Beta demo data seeding."""

from __future__ import annotations

import uuid

try:
    from .demo_fixtures import (
        AGENT_ACTIONS,
        DEFENSIBILITY_NARRATIVES,
        DEMO_MATTER,
        DEMO_MATTER_ID,
        DEMO_TENANT,
        DEMO_TENANT_ID,
        DEMO_USER,
        DEPOSITIONS,
        EMAIL_EVENTS,
        EXHIBITS,
        JURORS,
        LANE4_REVIEWS,
    )
    from .models import (
        AgentAction,
        DefensibilityNarrative,
        DemoEvent,
        DemoJuror,
        Document,
        Lane4Review,
        Matter,
        Tenant,
        User,
    )
except ImportError:
    from demo_fixtures import (
        AGENT_ACTIONS,
        DEFENSIBILITY_NARRATIVES,
        DEMO_MATTER,
        DEMO_MATTER_ID,
        DEMO_TENANT,
        DEMO_TENANT_ID,
        DEMO_USER,
        DEPOSITIONS,
        EMAIL_EVENTS,
        EXHIBITS,
        JURORS,
        LANE4_REVIEWS,
    )
    from models import (
        AgentAction,
        DefensibilityNarrative,
        DemoEvent,
        DemoJuror,
        Document,
        Lane4Review,
        Matter,
        Tenant,
        User,
    )


def stable_uuid(name: str) -> uuid.UUID:
    return uuid.uuid5(uuid.UUID(DEMO_TENANT_ID), name)


def seed_demo_data(session) -> dict[str, int]:
    tenant_id = uuid.UUID(DEMO_TENANT_ID)
    matter_id = uuid.UUID(DEMO_MATTER_ID)
    counts = {
        "tenants": 0,
        "users": 0,
        "matters": 0,
        "documents": 0,
        "jurors": 0,
        "events": 0,
        "agent_actions": 0,
        "lane4_reviews": 0,
        "narratives": 0,
    }

    if not session.get(Tenant, tenant_id):
        session.add(Tenant(id=tenant_id, name=DEMO_TENANT["name"], region=DEMO_TENANT["region"]))
        counts["tenants"] += 1

    user_id = uuid.UUID(DEMO_USER["id"])
    if not session.get(User, user_id):
        session.add(
            User(
                id=user_id,
                tenant_id=tenant_id,
                email=DEMO_USER["email"],
                display_name=DEMO_USER["display_name"],
                role=DEMO_USER["role"],
            )
        )
        counts["users"] += 1

    if not session.get(Matter, matter_id):
        session.add(
            Matter(
                id=matter_id,
                tenant_id=tenant_id,
                title=DEMO_MATTER["title"],
                case_number=DEMO_MATTER["case_number"],
                jurisdiction=DEMO_MATTER["jurisdiction"],
                status=DEMO_MATTER["status"],
                metadata_=DEMO_MATTER["metadata"],
            )
        )
        counts["matters"] += 1

    for doc in [*EXHIBITS, *DEPOSITIONS]:
        doc_id = stable_uuid(f"document:{doc['key']}")
        if not session.get(Document, doc_id):
            session.add(
                Document(
                    id=doc_id,
                    matter_id=matter_id,
                    tenant_id=tenant_id,
                    title=doc["title"],
                    doc_type=doc["doc_type"],
                    blob_ref=f"demo/{doc['key']}",
                    content_hash=f"demo-{doc['key'].lower()}",
                    page_count=doc["page_count"],
                    metadata_={"key": doc["key"], **doc.get("metadata", {})},
                )
            )
            counts["documents"] += 1

    for juror in JURORS:
        juror_id = stable_uuid(f"juror:{juror['juror_key']}")
        if not session.get(DemoJuror, juror_id):
            session.add(
                DemoJuror(
                    id=juror_id,
                    matter_id=matter_id,
                    tenant_id=tenant_id,
                    juror_key=juror["juror_key"],
                    juror_number=juror["juror_number"],
                    status=juror["status"],
                    metadata_=juror["metadata"],
                )
            )
            counts["jurors"] += 1

    for event in EMAIL_EVENTS:
        event_id = stable_uuid(f"event:{event['event_key']}")
        if not session.get(DemoEvent, event_id):
            session.add(
                DemoEvent(
                    id=event_id,
                    matter_id=matter_id,
                    tenant_id=tenant_id,
                    event_key=event["event_key"],
                    event_type=event["event_type"],
                    occurred_at=event["occurred_at"],
                    title=event["title"],
                    description=event["description"],
                    metadata_=event["metadata"],
                )
            )
            counts["events"] += 1

    action_rows: dict[str, uuid.UUID] = {}
    for action in AGENT_ACTIONS:
        action_uuid = stable_uuid(f"action:{action['action_id']}")
        action_rows[action["action_id"]] = action_uuid
        if not session.get(AgentAction, action_uuid):
            session.add(
                AgentAction(
                    id=action_uuid,
                    matter_id=matter_id,
                    tenant_id=tenant_id,
                    archetype=action["module"],
                    action_type=action["action_type"],
                    anchor8_verdict=action["verdict"],
                    lane=action["lane"],
                    latency_ms=180.0,
                    telemetry={
                        "anchor8_action_id": action["action_id"],
                        "rahs": action["rahs"],
                        "reason": action["reason"],
                        "block_category": action["block_category"],
                        "severity": action["severity"],
                        "mock": True,
                    },
                )
            )
            counts["agent_actions"] += 1

    for review in LANE4_REVIEWS:
        review_uuid = stable_uuid(f"review:{review['review_id']}")
        if not session.get(Lane4Review, review_uuid):
            session.add(Lane4Review(id=review_uuid, **review))
            counts["lane4_reviews"] += 1

    for narrative in DEFENSIBILITY_NARRATIVES:
        narrative_uuid = stable_uuid(f"narrative:{narrative['action_id']}")
        if not session.get(DefensibilityNarrative, narrative_uuid):
            session.add(
                DefensibilityNarrative(
                    id=narrative_uuid,
                    action_id=action_rows[narrative["action_id"]],
                    anchor8_action_id=narrative["action_id"],
                    title=narrative["title"],
                    summary=narrative["summary"],
                    snapshot=narrative["snapshot"],
                )
            )
            counts["narratives"] += 1

    session.commit()
    return counts
