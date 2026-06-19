"""Canonical Acme v. Beta demo fixture records for Lex8-owned product data."""

from __future__ import annotations

DEMO_TENANT_ID = "11111111-1111-1111-1111-111111111111"
DEMO_USER_ID = "22222222-2222-2222-2222-222222222222"
DEMO_MATTER_ID = "33333333-3333-3333-3333-333333333333"
DEMO_MATTER_SLUG = "demo-acme-beta"

DEMO_TENANT = {
    "id": DEMO_TENANT_ID,
    "name": "Demo Law Firm LLP",
    "region": "us-east-1",
}

DEMO_USER = {
    "id": DEMO_USER_ID,
    "tenant_id": DEMO_TENANT_ID,
    "email": "vasu@demo.lex8.ai",
    "display_name": "Vasu (Demo)",
    "role": "admin",
}

DEMO_MATTER = {
    "id": DEMO_MATTER_ID,
    "tenant_id": DEMO_TENANT_ID,
    "title": "Acme Corp. v. Beta Industries",
    "case_number": "1:24-cv-01234",
    "jurisdiction": "SDNY",
    "status": "active",
    "metadata": {"slug": DEMO_MATTER_SLUG, "demo": True},
}

EXHIBITS = [
    {"key": "P-01", "title": "Joint Venture Agreement", "doc_type": "exhibit", "page_count": 14},
    {"key": "P-12", "title": "March Payment Notice", "doc_type": "exhibit", "page_count": 3},
    {
        "key": "P-14",
        "title": "Redacted Privileged Counsel Email",
        "doc_type": "exhibit",
        "page_count": 2,
        "metadata": {
            "privileged": True,
            "redaction_failure": True,
            "issue": "Visible-layer redaction hides text that remains in the text layer.",
            "demo_intercept": "privileged_filing_block",
        },
    },
    {"key": "P-23", "title": "Beta Board Minutes", "doc_type": "exhibit", "page_count": 9},
    {"key": "P-31", "title": "Commingled Ledger Extract", "doc_type": "exhibit", "page_count": 6},
    {"key": "D-04", "title": "Beta Remediation Plan", "doc_type": "exhibit", "page_count": 5},
]

DEPOSITIONS = [
    {"key": "DEPO-CHEN", "title": "Deposition Transcript - Sarah Chen", "doc_type": "deposition", "page_count": 118},
    {"key": "DEPO-WEBB", "title": "Deposition Transcript - Marcus Webb", "doc_type": "deposition", "page_count": 96},
    {"key": "DEPO-PATEL", "title": "Deposition Transcript - Nina Patel", "doc_type": "deposition", "page_count": 104},
]

EMAIL_EVENTS = [
    {
        "event_key": "email-2024-03-22-acme-notice",
        "event_type": "email",
        "occurred_at": "2024-03-22T14:10:00Z",
        "title": "Acme sends disputed payment notice",
        "description": "Acme finance sends notice claiming Beta missed the milestone payment.",
        "metadata": {"sender": "finance@acme.example", "recipient": "ops@beta.example"},
    },
    {
        "event_key": "email-2024-03-23-beta-denial",
        "event_type": "email",
        "occurred_at": "2024-03-23T09:35:00Z",
        "title": "Beta denies receiving complete deliverables",
        "description": "Beta says Acme had not delivered the required compliance packet.",
        "metadata": {"contradicts": "email-2024-03-22-acme-notice"},
    },
    {
        "event_key": "email-2024-03-24-forwarded-attachment",
        "event_type": "email",
        "occurred_at": "2024-03-24T18:45:00Z",
        "title": "Forwarded attachment shows compliance packet timestamp",
        "description": "Forwarded attachment metadata suggests delivery happened before Beta's denial.",
        "metadata": {"case_synth_flag": "contradiction_support"},
    },
]

AGENT_ACTIONS = [
    {
        "action_id": "a8_demo_drafter_hallucination_block",
        "module": "drafter",
        "action_type": "create_draft",
        "verdict": "BLOCK",
        "lane": 2,
        "rahs": 0.82,
        "reason": "Mock Anchor8 metadata: fabricated Henderson citation blocked before output.",
        "block_category": "hallucinated_citation",
        "severity": "high",
    },
    {
        "action_id": "a8_demo_filer_privilege_block",
        "module": "filer",
        "action_type": "create_filing",
        "verdict": "BLOCK",
        "lane": 4,
        "rahs": 0.88,
        "reason": "Mock Anchor8 metadata: Exhibit P-14 privilege issue routed for attorney review.",
        "block_category": "privilege",
        "severity": "critical",
    },
    {
        "action_id": "a8_demo_forecast_bias_block",
        "module": "forecast",
        "action_type": "predict_outcome",
        "verdict": "BLOCK",
        "lane": 2,
        "rahs": 0.79,
        "reason": "Mock Anchor8 metadata: demographic proxy feature blocked in jury forecast.",
        "block_category": "bias_proxy",
        "severity": "high",
    },
]

EVE_AUDITOR_AUDITS = [
    {
        "audit_id": "eve_audit_demo_henderson",
        "matter_id": DEMO_MATTER_SLUG,
        "source_module": "drafter",
        "input_output_id": "draft_demo_msj_001",
        "overall_status": "blocked",
        "validator_verdict": "BLOCK",
        "lane": 4,
        "risk_score": 80,
        "feature_name": "Eve Auditor",
        "demo_trigger": "fabricated Henderson citation",
    },
    {
        "audit_id": "eve_audit_demo_p14_privilege",
        "matter_id": DEMO_MATTER_SLUG,
        "source_module": "filer",
        "input_output_id": "filing_demo_privileged_p14",
        "overall_status": "blocked",
        "validator_verdict": "BLOCK",
        "lane": 4,
        "risk_score": 80,
        "feature_name": "Eve Auditor",
        "demo_trigger": "Exhibit P-14 privilege/redaction risk",
    },
    {
        "audit_id": "eve_audit_demo_bias_proxy",
        "matter_id": DEMO_MATTER_SLUG,
        "source_module": "forecast",
        "input_output_id": "forecast_demo_bias_block",
        "overall_status": "warning",
        "validator_verdict": "MODIFY",
        "lane": 2,
        "risk_score": 55,
        "feature_name": "Eve Auditor",
        "demo_trigger": "protected-class proxy risk",
    },
]

DMS_WORKSPACES = [
    {
        "provider": "imanage",
        "workspace_id": "im_ws_acme_beta",
        "name": "Acme Corp. v. Beta Industries",
        "matter_id": DEMO_MATTER_SLUG,
        "status": "connected_mock",
        "documents": [
            {
                "document_id": "im_doc_p14",
                "title": "Redacted Privileged Counsel Email",
                "document_type": "exhibit",
                "lex8_document_key": "P-14",
                "version": "3",
                "status": "available_mock",
            },
            {
                "document_id": "im_doc_depo_chen",
                "title": "Deposition Transcript - Sarah Chen",
                "document_type": "deposition",
                "lex8_document_key": "DEPO-CHEN",
                "version": "1",
                "status": "available_mock",
            },
        ],
    },
    {
        "provider": "netdocuments",
        "workspace_id": "nd_ws_acme_beta",
        "name": "Acme Corp. v. Beta Industries",
        "matter_id": DEMO_MATTER_SLUG,
        "status": "connected_mock",
        "documents": [
            {
                "document_id": "nd_doc_p01",
                "title": "Joint Venture Agreement",
                "document_type": "exhibit",
                "lex8_document_key": "P-01",
                "version": "2",
                "status": "available_mock",
            },
            {
                "document_id": "nd_doc_minutes",
                "title": "Beta Board Minutes",
                "document_type": "exhibit",
                "lex8_document_key": "P-23",
                "version": "1",
                "status": "available_mock",
            },
        ],
    },
]

DMS_SYNC_JOBS = [
    {
        "sync_id": "sync_imanage_im_ws_acme_beta_im_doc_p14",
        "provider": "imanage",
        "workspace_id": "im_ws_acme_beta",
        "document_id": "im_doc_p14",
        "matter_id": DEMO_MATTER_SLUG,
        "status": "synced",
        "message": "Demo iManage Exhibit P-14 sync is available in Lex8.",
    },
    {
        "sync_id": "sync_netdocuments_nd_ws_acme_beta_nd_doc_p01",
        "provider": "netdocuments",
        "workspace_id": "nd_ws_acme_beta",
        "document_id": "nd_doc_p01",
        "matter_id": DEMO_MATTER_SLUG,
        "status": "synced",
        "message": "Demo NetDocuments P-01 sync is available in Lex8.",
    },
]

LANE4_REVIEWS = [
    {
        "review_id": "review_demo_privileged_filing",
        "action_id": "a8_demo_filer_privilege_block",
        "matter_id": DEMO_MATTER_SLUG,
        "status": "pending",
        "sla_minutes": 15,
        "reason": "Exhibit P-14 appears to contain privileged material in public filing packet.",
        "allowed_decisions": ["APPROVE", "BLOCK", "MODIFY"],
        "evidence_bundle": {
            "documents": [
                {
                    "document_id": "P-14",
                    "title": "Redacted Privileged Counsel Email",
                    "flags": ["privileged", "redaction_failure"],
                }
            ],
            "filing_id": "filing_demo_privileged_p14",
            "anchor8_action_id": "a8_demo_filer_privilege_block",
            "matter_id": DEMO_MATTER_SLUG,
        },
        "juror_narratives": [
            {
                "juror": "Justice A",
                "model": "mock-deepseek-juror",
                "vote": "BLOCK",
                "summary": "The text layer appears to expose attorney-client privileged advice despite visible redaction.",
            },
            {
                "juror": "Justice B",
                "model": "mock-claude-juror",
                "vote": "BLOCK",
                "summary": "The public filing packet should be stopped until Exhibit P-14 is removed or re-redacted.",
            },
        ],
    }
]

DEFENSIBILITY_NARRATIVES = [
    {
        "action_id": action["action_id"],
        "title": f"{action['module'].title()} demo narrative",
        "summary": action["reason"],
        "snapshot": {
            "mock": True,
            "verdict": action["verdict"],
            "lane": action["lane"],
            "rahs": action["rahs"],
            "anchor8_owned": "Narrative signing and governance internals are not implemented in Lex8.",
            "block_category": action["block_category"],
            "severity": action["severity"],
        },
    }
    for action in AGENT_ACTIONS
]


def build_jurors() -> list[dict]:
    jurors = []
    for number in range(1, 61):
        jurors.append(
            {
                "juror_key": f"J-{number:02d}",
                "juror_number": number,
                "status": "pool",
                "metadata": {
                    "county": ["Kings", "Queens", "New York", "Bronx"][number % 4],
                    "occupation_band": ["healthcare", "education", "engineering", "retail"][number % 4],
                    "mock_score": round(0.2 + (number % 17) * 0.037, 3),
                },
            }
        )
    return jurors


JURORS = build_jurors()


def demo_fixture_summary() -> dict:
    return {
        "tenant": DEMO_TENANT,
        "user": DEMO_USER,
        "matter": DEMO_MATTER,
        "exhibits": EXHIBITS,
        "depositions": DEPOSITIONS,
        "juror_count": len(JURORS),
        "email_events": EMAIL_EVENTS,
        "agent_actions": AGENT_ACTIONS,
        "lane4_reviews": LANE4_REVIEWS,
        "defensibility_narratives": DEFENSIBILITY_NARRATIVES,
        "eve_auditor_audits": EVE_AUDITOR_AUDITS,
        "dms_workspaces": DMS_WORKSPACES,
        "dms_sync_jobs": DMS_SYNC_JOBS,
    }
