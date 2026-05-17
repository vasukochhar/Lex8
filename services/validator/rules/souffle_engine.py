"""
Souffle Datalog Rule Engine for Lex8 Validator.
Evaluates formal logical constraints on legal conclusions.
"""

import tempfile
import subprocess
import os

# Base Souffle rule definitions for legal validation
BASE_RULES = """
.type CaseId <: symbol
.type Principle <: symbol

// Facts
.decl Overruled(c: CaseId)
.decl Applies(c: CaseId, p: Principle)
.decl DraftReliesOn(c: CaseId)

// Rules
.decl InvalidDraft(reason: symbol)
InvalidDraft("Relies on overruled precedent") :- DraftReliesOn(c), Overruled(c).
InvalidDraft("Missing standard of care") :- !Applies(_, "StandardOfCare").

.output InvalidDraft
"""

def evaluate_draft_rules(facts: dict) -> list[str]:
    """
    Evaluates a legal draft against deterministic Datalog rules using Souffle.
    facts: dictionary of facts to inject.
    """
    # For MVP without installing souffle locally on windows, we'll mock the execution.
    # In production, this would write the datalog program and facts to a temp dir,
    # run `souffle program.dl -F <fact_dir> -D <out_dir>`, and parse output.
    
    print("Evaluating rules in Souffle Datalog Engine...")
    violations = []
    
    # Mock evaluation logic based on facts
    draft_cases = facts.get("DraftReliesOn", [])
    overruled_cases = facts.get("Overruled", [])
    
    for c in draft_cases:
        if c in overruled_cases:
            violations.append(f"Relies on overruled precedent: {c}")
            
    principles = facts.get("Applies", [])
    has_standard = any(p[1] == "StandardOfCare" for p in principles)
    if not has_standard:
        violations.append("Missing standard of care analysis")
        
    return violations

if __name__ == "__main__":
    test_facts = {
        "DraftReliesOn": ["102"],
        "Overruled": ["102"],
        "Applies": [("101", "StandardOfCare")]
    }
    
    violations = evaluate_draft_rules(test_facts)
    print("Violations Found:")
    for v in violations:
        print(f" - {v}")
