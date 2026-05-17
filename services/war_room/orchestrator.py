"""
War Room Orchestrator for Lex8.
Executes a 4-agent debate using DeepSeek models (Mocked CrewAI flow).
"""

import time
import os
from typing import Dict, Any

from openai import OpenAI

# Setup DeepSeek LLM
DEEPSEEK_API_KEY = "sk-0d10dd320a454cbe9c32febefe2f5e30"
client = OpenAI(api_key=DEEPSEEK_API_KEY, base_url="https://api.deepseek.com/v1")

def create_war_room(issue: str) -> Dict[str, Any]:
    """
    Initializes and runs a 4-agent debate.
    """
    start_time = time.perf_counter()
    matter_id = "102-acme-v-beta"
    
    print(f"War Room session started | Matter: {matter_id} | Issue: '{issue}'")
    
    print("\n[Agent 1: Plaintiff's Advocate] Drafting opening argument...")
    time.sleep(1)
    
    print("[Agent 2: Defense Counsel] Drafting rebuttal...")
    time.sleep(1)
    
    print("[Agent 3: Precedent Analyst] Reviewing arguments against case law...")
    time.sleep(1)
    
    print("[Agent 4: The Judge] Deliberating...")
    
    prompt = f"""
    You are The Judge in a legal war room. The issue is: {issue}
    The plaintiff argued aggressively for piercing the veil.
    The defense countered conservatively.
    The precedent analyst noted that commingling assets is a strong indicator but requires evaluating intent.
    
    Deliver a fair, binding resolution in 2 short paragraphs.
    """
    
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "You are a pragmatic legal adjudicator."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        result = response.choices[0].message.content
    except Exception as e:
        result = f"War Room Debate failed: {e}"

    latency_ms = (time.perf_counter() - start_time) * 1000

    return {
        "issue": issue,
        "final_ruling": result,
        "latency_ms": round(latency_ms, 2)
    }

if __name__ == "__main__":
    issue = "Whether piercing the corporate veil is justified given the commingling of personal and corporate assets."
    print("Initiating War Room Debate...")
    res = create_war_room(issue)
    print("\n--- Final Ruling ---")
    print(res["final_ruling"])
