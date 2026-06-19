from __future__ import annotations

import hashlib
from datetime import datetime
from typing import Any

from fastapi import APIRouter, HTTPException

from response_utils import module_response


router = APIRouter(prefix="/api/v1/validator", tags=["validator"])

FEATURE_NAME = "Eve Auditor"
_AUDITS: dict[str, dict[str, Any]] = {}


def _text_from_payload(payload: dict[str, Any]) -> str:
    values = [
        payload.get("output_text"),
        payload.get("content"),
        payload.get("draft"),
        payload.get("filing_packet"),
        payload.get("forecast_summary"),
        payload.get("source_text"),
    ]
    return "\n".join(str(value) for value in values if value)


def _finding(
    finding_id: str,
    category: str,
    severity: str,
    message: str,
    evidence: list[str],
    recommended_action: str,
) -> dict[str, Any]:
    return {
        "finding_id": finding_id,
        "category": category,
        "severity": severity,
        "message": message,
        "evidence": evidence,
        "recommended_action": recommended_action,
    }


def _evaluate(payload: dict[str, Any]) -> list[dict[str, Any]]:
    text = _text_from_payload(payload).lower()
    source_module = str(payload.get("source_module", "")).lower()
    output_id = str(payload.get("input_output_id") or payload.get("output_id") or "").lower()
    document_ids = {str(doc).lower() for doc in payload.get("document_ids", [])}
    risk_flags = {str(flag).lower() for flag in payload.get("risk_flags", [])}
    findings: list[dict[str, Any]] = []

    if "henderson" in text or "henderson" in output_id or "fabricated_henderson_citation" in risk_flags:
        findings.append(
            _finding(
                "eve_find_henderson_citation",
                "hallucinated_legal_citation",
                "critical",
                "Eve Auditor detected the demo fabricated Henderson citation before finalization.",
                ["Henderson citation marker found in generated legal output."],
                "Block the output and require counsel to replace the citation with verified authority.",
            )
        )

    if "exhibit p-14" in text or "p-14" in document_ids or "privileged_filing_block" in risk_flags:
        findings.append(
            _finding(
                "eve_find_p14_privilege",
                "privilege_redaction_risk",
                "critical",
                "Exhibit P-14 appears to contain privileged or failed-redaction content.",
                ["Demo fixture P-14 is marked privileged with a visible-layer redaction failure."],
                "Escalate to Lane 4 attorney review and remove or re-redact the exhibit before filing.",
            )
        )

    bias_terms = ["demographic proxy", "protected-class proxy", "zip code proxy", "race proxy", "gender proxy"]
    if any(term in text for term in bias_terms) or source_module == "forecast" or "bias_proxy" in risk_flags:
        findings.append(
            _finding(
                "eve_find_bias_proxy",
                "bias_protected_class_proxy_risk",
                "high",
                "Eve Auditor found a protected-class proxy risk in the forecast output.",
                ["Forecast output references demographic or proxy features from the demo scenario."],
                "Remove proxy features, rerun the forecast, and document a non-discriminatory feature basis.",
            )
        )

    if "quote:" in text and "source:" not in text:
        findings.append(
            _finding(
                "eve_find_quote_source_mismatch",
                "quote_source_mismatch",
                "medium",
                "A quoted passage lacks a matching source reference.",
                ["Generated output contains quote text without a source marker."],
                "Attach the source document, page, and line reference before release.",
            )
        )

    if "on information and belief" in text or "appears that" in text:
        findings.append(
            _finding(
                "eve_find_unsupported_claim",
                "unsupported_factual_claim",
                "medium",
                "The output contains a factual claim that should be tied to record evidence.",
                ["Cautious factual language was emitted without a cited exhibit or transcript reference."],
                "Add supporting record citations or rewrite the claim as attorney argument.",
            )
        )

    if payload.get("jurisdiction", "").upper() in {"SDNY", "S.D.N.Y."} and "certificate of service" not in text:
        findings.append(
            _finding(
                "eve_find_filing_readiness",
                "local_rule_filing_readiness",
                "low",
                "Filing-readiness warning for SDNY packet completeness.",
                ["No certificate of service marker found in the generated filing text."],
                "Confirm local-rule checklist completion before submission.",
            )
        )

    return findings


def _build_report(payload: dict[str, Any]) -> dict[str, Any]:
    matter_id = payload.get("matter_id", "demo-acme-beta")
    source_module = payload.get("source_module", "validator")
    input_output_id = payload.get("input_output_id") or payload.get("output_id") or "output_demo_001"
    seed = f"{matter_id}:{source_module}:{input_output_id}:{_text_from_payload(payload)}"
    audit_id = "eve_audit_" + hashlib.sha256(seed.encode("utf-8")).hexdigest()[:12]
    findings = _evaluate(payload)
    severity_weight = {"low": 10, "medium": 25, "high": 55, "critical": 80}
    risk_score = min(100, sum(severity_weight.get(f["severity"], 10) for f in findings))
    has_critical = any(f["severity"] == "critical" for f in findings)
    has_high = any(f["severity"] == "high" for f in findings)
    overall_status = "blocked" if has_critical else "warning" if findings else "passed"
    validator_verdict = "BLOCK" if has_critical else "MODIFY" if findings else "ALLOW"
    lane = 4 if has_critical else 2 if has_high else 1
    report = {
        "feature_name": FEATURE_NAME,
        "audit_id": audit_id,
        "matter_id": matter_id,
        "source_module": source_module,
        "input_output_id": input_output_id,
        "overall_status": overall_status,
        "validator_verdict": validator_verdict,
        "lane": lane,
        "risk_score": risk_score,
        "findings": findings,
        "required_human_review": validator_verdict in {"MODIFY", "BLOCK"} or lane == 4,
        "verification_certificate": {
            "certificate_id": f"eve_cert_{audit_id.removeprefix('eve_audit_')}",
            "issued_at": datetime.utcnow().isoformat() + "Z",
            "mock": True,
            "ruleset": "eve-auditor-demo-rules-v1",
        },
    }
    _AUDITS[audit_id] = report
    return report


@router.post("/audit-output")
async def audit_output(payload: dict[str, Any]) -> dict[str, Any]:
    report = _build_report(payload)
    return module_response("validator", report, status=report["overall_status"], legacy=report)


@router.post("/eve-auditor/audit-output")
async def eve_auditor_audit_output(payload: dict[str, Any]) -> dict[str, Any]:
    return await audit_output(payload)


@router.get("/audits")
async def list_audits(matter_id: str | None = None) -> dict[str, Any]:
    audits = list(_AUDITS.values())
    if matter_id:
        audits = [audit for audit in audits if audit["matter_id"] == matter_id]
    legacy = {"feature_name": FEATURE_NAME, "audits": audits}
    return module_response("validator", legacy, legacy=legacy)


@router.get("/audits/{audit_id}")
async def get_audit(audit_id: str) -> dict[str, Any]:
    report = _AUDITS.get(audit_id)
    if not report:
        raise HTTPException(status_code=404, detail="Audit not found")
    return module_response("validator", report, status=report["overall_status"], legacy=report)
