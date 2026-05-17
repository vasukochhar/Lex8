"""
Database connection and session management.
"""

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from models import Base


DATABASE_URL = "postgresql://lex8:lex8_dev@localhost:5432/lex8"

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(bind=engine)


def init_db():
    """Create all tables."""
    Base.metadata.create_all(engine)
    print("✅ All tables created.")


def apply_rls():
    """Apply row-level security policies."""
    from models import RLS_STATEMENTS
    with engine.connect() as conn:
        for stmt in RLS_STATEMENTS.strip().split(";"):
            stmt = stmt.strip()
            if stmt:
                try:
                    conn.execute(text(stmt))
                except Exception as e:
                    if "already exists" in str(e):
                        pass
                    else:
                        print(f"  ⚠ RLS warning: {e}")
        conn.commit()
    print("✅ RLS policies applied.")


def seed_demo_tenant():
    """Create the Acme v. Beta demo tenant and matter."""
    import uuid
    with SessionLocal() as session:
        from models import Tenant, Matter, User
        
        tenant_id = uuid.UUID("11111111-1111-1111-1111-111111111111")
        existing = session.get(Tenant, tenant_id)
        if existing:
            print("  ℹ Demo tenant already exists, skipping.")
            return

        tenant = Tenant(id=tenant_id, name="Demo Law Firm LLP", region="us-east-1")
        session.add(tenant)

        user = User(
            tenant_id=tenant_id,
            email="vasu@demo.lex8.ai",
            display_name="Vasu (Demo)",
            role="admin",
        )
        session.add(user)

        matter = Matter(
            tenant_id=tenant_id,
            title="Acme Corp. v. Beta Industries",
            case_number="1:24-cv-01234",
            jurisdiction="SDNY",
            status="active",
        )
        session.add(matter)
        session.commit()
        print(f"✅ Demo tenant seeded: {tenant.name}")
        print(f"   Matter: {matter.title} ({matter.case_number})")


if __name__ == "__main__":
    print("🔧 Initializing Lex8 database...\n")
    init_db()
    apply_rls()
    seed_demo_tenant()
    print("\n🎉 Database ready!")
