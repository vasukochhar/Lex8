# Lex8 Backend Environment

Lex8 uses the repo-local `env` file for local backend configuration. Keep that file out of git; it may contain live service credentials.

Required keys:

```ini
ENV=development
DEBUG=true
LOG_LEVEL=20

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_KMS_KEY_ARN=
AWS_S3_BUCKET=

ANCHOR8_GATEWAY_URL=
ANCHOR8_API_KEY=
ANCHOR8_TENANT_ID=
ANCHOR8_MOCK_MODE=true

CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=

DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1

COURTLISTENER_API_TOKEN=
VOYAGE_API_KEY=

POSTGRES_URL=postgresql://lex8:lex8_dev@localhost:5432/lex8
REDIS_URL=redis://localhost:6379
REDPANDA_BROKER=localhost:9092
QDRANT_URL=http://localhost:6333
OPENSEARCH_URL=http://localhost:9200

SENTRY_DSN=
OTEL_EXPORTER_OTLP_ENDPOINT=
```

Anchor8 boundary: Lex8 stores and displays Anchor8-returned IDs, verdicts, lane numbers, scores, and narrative metadata. Lex8 does not issue DIDs, run Anchor8 lanes, calculate RAHS, orchestrate Tribunal jurors, or sign forensic narratives.

## Observability

- `GET /metrics` exposes lightweight Prometheus-style text metrics for gateway request counts, per-module route counts, health, and Sentry enabled status.
- `SENTRY_DSN` is optional. If it is empty, Sentry is a no-op. If it is set but `sentry_sdk` is not installed, startup continues and reports Sentry disabled.
- `OTEL_EXPORTER_OTLP_ENDPOINT` is reserved for future OpenTelemetry wiring. OpenTelemetry is not enabled in the demo backend yet.

## Eve Auditor and DMS Integrations

- `POST /api/v1/validator/audit-output` runs Eve Auditor, a deterministic Validator QA pass for AI outputs. It returns `feature_name: "Eve Auditor"`, a Validator verdict, lane, risk score, findings, human-review requirement, and a mock verification certificate. Demo rules catch the fabricated Henderson citation, Exhibit P-14 privilege/redaction risk, bias proxy risk, quote/source mismatch, unsupported claims, and filing-readiness warnings.
- `GET /api/v1/validator/audits/{audit_id}` and `GET /api/v1/validator/audits?matter_id=demo-acme-beta` read in-memory demo audit reports created during the gateway process.
- `GET /api/v1/integrations/dms/providers` lists mock iManage and NetDocuments connectors. The DMS routes also expose workspace listing, document listing, document sync, and sync status under `/api/v1/integrations/dms/...`.
- These integrations are demo scaffolds only. They do not perform OAuth, store vendor credentials, or call external vendor APIs.
