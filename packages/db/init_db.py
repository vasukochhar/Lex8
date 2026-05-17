"""
Database connection and session management.
"""

import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

try:
    from .models import Base
    from .seed_demo_data import seed_demo_data
except ImportError:
    from models import Base
    from seed_demo_data import seed_demo_data


load_dotenv(Path(__file__).resolve().parents[2] / "env")

DATABASE_URL = os.environ.get("POSTGRES_URL", "postgresql://lex8:lex8_dev@localhost:5432/lex8")

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(bind=engine)


def init_db():
    """Create all tables."""
    Base.metadata.create_all(engine)
    print("✅ All tables created.")


def apply_rls():
    """Apply row-level security policies."""
    try:
        from .models import RLS_STATEMENTS
    except ImportError:
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
    """Create the full Acme v. Beta demo fixture set."""
    with SessionLocal() as session:
        counts = seed_demo_data(session)
        print("✅ Acme v. Beta demo data seeded.")
        for key, value in counts.items():
            print(f"   {key}: +{value}")


if __name__ == "__main__":
    print("🔧 Initializing Lex8 database...\n")
    init_db()
    apply_rls()
    seed_demo_tenant()
    print("\n🎉 Database ready!")
