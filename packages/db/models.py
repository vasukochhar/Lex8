"""
Lex8 Database Schema — SQLAlchemy models with RLS support.
Tables: tenants, users, matters, documents, agent_actions, blob_refs
"""

import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean, Column, DateTime, Enum, Float, ForeignKey, Index, Integer,
    String, Text, UniqueConstraint, text,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    kms_key_arn = Column(String(512), nullable=True)
    region = Column(String(50), default="us-east-1")
    settings = Column(JSONB, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    users = relationship("User", back_populates="tenant")
    matters = relationship("Matter", back_populates="tenant")


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    email = Column(String(320), nullable=False)
    display_name = Column(String(255))
    role = Column(String(50), default="member")  # admin, member, viewer
    auth_provider_id = Column(String(255), nullable=True)  # Firebase/Clerk UID
    created_at = Column(DateTime, default=datetime.utcnow)

    tenant = relationship("Tenant", back_populates="users")

    __table_args__ = (
        UniqueConstraint("tenant_id", "email", name="uq_tenant_email"),
        Index("ix_users_auth_provider", "auth_provider_id"),
    )


class Matter(Base):
    __tablename__ = "matters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    title = Column(String(500), nullable=False)
    case_number = Column(String(100), nullable=True)
    jurisdiction = Column(String(100), nullable=True)
    status = Column(String(50), default="active")  # active, archived, closed
    metadata_ = Column("metadata", JSONB, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    tenant = relationship("Tenant", back_populates="matters")
    documents = relationship("Document", back_populates="matter")
    agent_actions = relationship("AgentAction", back_populates="matter")
    demo_jurors = relationship("DemoJuror", back_populates="matter")
    demo_events = relationship("DemoEvent", back_populates="matter")

    __table_args__ = (
        Index("ix_matters_tenant", "tenant_id"),
        Index("ix_matters_status", "status"),
    )


class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    matter_id = Column(UUID(as_uuid=True), ForeignKey("matters.id"), nullable=False)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    title = Column(String(500), nullable=False)
    doc_type = Column(String(50))  # brief, exhibit, deposition, email, audio, photo
    blob_ref = Column(String(512), nullable=True)  # S3 key reference
    content_hash = Column(String(128), nullable=True)  # SHA-256
    page_count = Column(Integer, nullable=True)
    metadata_ = Column("metadata", JSONB, default={})
    created_at = Column(DateTime, default=datetime.utcnow)

    matter = relationship("Matter", back_populates="documents")

    __table_args__ = (
        Index("ix_documents_matter", "matter_id"),
        Index("ix_documents_content_hash", "content_hash"),
    )


class AgentAction(Base):
    __tablename__ = "agent_actions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    matter_id = Column(UUID(as_uuid=True), ForeignKey("matters.id"), nullable=False)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    archetype = Column(String(50), nullable=False)  # drafter, filer, vault_vision, etc.
    action_type = Column(String(100), nullable=False)  # generate, search, validate, etc.
    input_hash = Column(String(128))
    output_hash = Column(String(128))
    anchor8_verdict = Column(String(20), nullable=True)  # ALLOW, BLOCK, MODIFY
    lane = Column(Integer, nullable=True)  # 1, 2, 3, or 4
    latency_ms = Column(Float, nullable=True)
    telemetry = Column(JSONB, default={})
    created_at = Column(DateTime, default=datetime.utcnow)

    matter = relationship("Matter", back_populates="agent_actions")
    narratives = relationship("DefensibilityNarrative", back_populates="agent_action")

    __table_args__ = (
        Index("ix_actions_matter", "matter_id"),
        Index("ix_actions_archetype", "archetype"),
        Index("ix_actions_tenant_created", "tenant_id", "created_at"),
    )


class BlobRef(Base):
    __tablename__ = "blob_refs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    s3_key = Column(String(512), nullable=False)
    content_hash = Column(String(128), nullable=False)  # SHA-256
    phash = Column(String(64), nullable=True)  # Perceptual hash for images
    size_bytes = Column(Integer)
    mime_type = Column(String(100))
    region = Column(String(50), default="us-east-1")
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("tenant_id", "content_hash", name="uq_tenant_content_hash"),
        Index("ix_blob_refs_phash", "phash"),
    )


class DemoJuror(Base):
    __tablename__ = "demo_jurors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    matter_id = Column(UUID(as_uuid=True), ForeignKey("matters.id"), nullable=False)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    juror_key = Column(String(50), nullable=False)
    juror_number = Column(Integer, nullable=False)
    status = Column(String(50), default="pool")
    metadata_ = Column("metadata", JSONB, default={})
    created_at = Column(DateTime, default=datetime.utcnow)

    matter = relationship("Matter", back_populates="demo_jurors")

    __table_args__ = (
        UniqueConstraint("matter_id", "juror_key", name="uq_demo_juror_key"),
        Index("ix_demo_jurors_matter", "matter_id"),
    )


class DemoEvent(Base):
    __tablename__ = "demo_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    matter_id = Column(UUID(as_uuid=True), ForeignKey("matters.id"), nullable=False)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    event_key = Column(String(100), nullable=False)
    event_type = Column(String(50), nullable=False)
    occurred_at = Column(String(40), nullable=False)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    metadata_ = Column("metadata", JSONB, default={})
    created_at = Column(DateTime, default=datetime.utcnow)

    matter = relationship("Matter", back_populates="demo_events")

    __table_args__ = (
        UniqueConstraint("matter_id", "event_key", name="uq_demo_event_key"),
        Index("ix_demo_events_matter", "matter_id"),
    )


class Lane4Review(Base):
    __tablename__ = "lane4_reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    review_id = Column(String(100), nullable=False, unique=True)
    action_id = Column(String(100), nullable=False)
    matter_id = Column(String(100), nullable=False)
    status = Column(String(50), default="pending")
    sla_minutes = Column(Integer, default=15)
    reason = Column(Text, nullable=False)
    allowed_decisions = Column(JSONB, default=["APPROVE", "BLOCK", "MODIFY"])
    evidence_bundle = Column(JSONB, default={})
    juror_narratives = Column(JSONB, default=[])
    decision = Column(String(20), nullable=True)
    reviewer = Column(String(255), nullable=True)
    note = Column(Text, nullable=True)
    decided_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("ix_lane4_reviews_status", "status"),
        Index("ix_lane4_reviews_action", "action_id"),
    )


class DefensibilityNarrative(Base):
    __tablename__ = "defensibility_narratives"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    action_id = Column(UUID(as_uuid=True), ForeignKey("agent_actions.id"), nullable=False)
    anchor8_action_id = Column(String(100), nullable=False, unique=True)
    title = Column(String(500), nullable=False)
    summary = Column(Text, nullable=False)
    snapshot = Column(JSONB, default={})
    created_at = Column(DateTime, default=datetime.utcnow)

    agent_action = relationship("AgentAction", back_populates="narratives")


# ── RLS SQL (applied via migration) ──
RLS_STATEMENTS = """
-- Enable RLS on tenant-scoped tables
ALTER TABLE matters ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blob_refs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY tenant_isolation_matters ON matters
    USING (tenant_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY tenant_isolation_documents ON documents
    USING (tenant_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY tenant_isolation_actions ON agent_actions
    USING (tenant_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY tenant_isolation_blobs ON blob_refs
    USING (tenant_id = current_setting('app.tenant_id')::uuid);
"""
