"""
Neuro-Symbolic Conflict Resolution & Telemetry.
Combines deterministic Datalog rules with LLM-based fuzziness for edge cases.
"""

import time
import os
from pathlib import Path
from typing import Dict, Any

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(Path(__file__).resolve().parents[3] / "env")

DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY", "")
DEEPSEEK_BASE_URL = os.environ.get("DEEPSEEK_BASE_URL", "https://api.deepseek.com/v1")
client = OpenAI(api_key=DEEPSEEK_API_KEY, base_url=DEEPSEEK_BASE_URL) if DEEPSEEK_API_KEY else None

def resolve_conflict(violations: list[str], draft_text: str) -> Dict[str, Any]:
    """
    Resolves violations found by the deterministic engine using an LLM.
    If the violation is genuine, it suggests a fix.
    """
    start_time = time.perf_counter()
    
    if not violations:
        return {
            "status": "PASS",
            "resolution": "No violations detected by deterministic engine."
        }
        
    prompt = f"""
    The deterministic legal rule engine flagged the following violations in a draft:
    {chr(10).join(['- ' + v for v in violations])}
    
    Draft Text snippet:
    "{draft_text}"
    
    Are these violations genuine errors that need to be fixed, or are they false positives due to nuance?
    Provide a brief analysis and a recommendation (Fix, Ignore).
    """
    
    if not client:
        resolution_text = "Mock arbitration: deterministic violations should be surfaced to the user with a recommended edit."
        status = "MODIFY"
    else:
        try:
            response = client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {"role": "system", "content": "You are a legal validation arbiter resolving conflicts between deterministic rules and nuanced human/agent drafting."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1
            )
            resolution_text = response.choices[0].message.content
            status = "MODIFY" if "Fix" in resolution_text else "PASS"
        except Exception as e:
            resolution_text = f"LLM Arbitration failed: {e}"
            status = "ERROR"

    return {
        "status": status,
        "resolution": resolution_text
    }

if __name__ == "__main__":
    from services.validator.rules.souffle_engine import evaluate_draft_rules
    
    test_facts = {
        "DraftReliesOn": ["102"],
        "Overruled": ["102"],
        "Applies": []
    }
    
    violations = evaluate_draft_rules(test_facts)
    print(f"Deterministic Engine found {len(violations)} violations.")
    
    draft_text = "As established in Acme v. Beta (102), the corporate veil can be pierced easily without considering standard of care."
    
    print("\nRequesting Neuro-Symbolic Resolution...")
    res = resolve_conflict(violations, draft_text)
    print(f"\nFinal Status: {res['status']}")
    print(f"Analysis: {res['resolution']}")
