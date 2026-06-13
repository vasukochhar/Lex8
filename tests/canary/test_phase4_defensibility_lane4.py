import sys
from pathlib import Path

from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[2]
GATEWAY = ROOT / "services" / "gateway"
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(GATEWAY))

from main import app


client = TestClient(app)


