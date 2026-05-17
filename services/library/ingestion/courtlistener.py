"""
CourtListener CAP API Ingestion for Lex8 Library.
Fetches legal cases from CourtListener's RECAP / Case Law API.
"""

import os
import httpx
from typing import List, Dict, Any

COURTLISTENER_API_KEY = os.environ.get("COURTLISTENER_API_KEY", "")
BASE_URL = "https://www.courtlistener.com/api/rest/v4"

async def fetch_recent_opinions(jurisdiction: str = "scotus", page: int = 1) -> List[Dict[str, Any]]:
    """Fetch recent opinions from CourtListener."""
    if not COURTLISTENER_API_KEY:
        print("Warning: COURTLISTENER_API_KEY not set. Using mock data for demo.")
        return get_mock_opinions()

    url = f"{BASE_URL}/opinions/"
    headers = {
        "Authorization": f"Token {COURTLISTENER_API_KEY}"
    }
    params = {
        "court__id": jurisdiction,
        "page": page
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
            return data.get("results", [])
        except Exception as e:
            print(f"Error fetching from CourtListener: {e}")
            return get_mock_opinions()

def get_mock_opinions():
    """Mock cases for local dev/testing without active API token."""
    return [
        {
            "id": 101,
            "absolute_url": "/opinion/101/smith-v-jones/",
            "cluster_id": 505,
            "plain_text": "The standard of care in negligence requires the defendant to act as a reasonably prudent person under the same or similar circumstances. We find the defendant breached this duty.",
            "html": "",
            "html_lawbox": "",
            "html_columbia": "",
            "html_with_citations": "",
            "local_path": "",
            "extracted_by_ocr": False,
            "author_id": 22,
            "author_str": "Justice Smith",
            "per_curiam": False,
            "type": "010combined",
            "page_count": 12,
            "download_url": "",
            "case_name": "Smith v. Jones",
            "date_filed": "2023-05-12"
        },
        {
            "id": 102,
            "absolute_url": "/opinion/102/acme-v-beta/",
            "cluster_id": 506,
            "plain_text": "In matters of corporate veil piercing, the plaintiff must show unity of interest and ownership such that the separate personalities of the corporation and the individual no longer exist.",
            "html": "",
            "html_lawbox": "",
            "html_columbia": "",
            "html_with_citations": "",
            "local_path": "",
            "extracted_by_ocr": False,
            "author_id": 23,
            "author_str": "Justice Doe",
            "per_curiam": False,
            "type": "010combined",
            "page_count": 8,
            "download_url": "",
            "case_name": "Acme Corp v. Beta Industries",
            "date_filed": "2024-01-15"
        }
    ]

if __name__ == "__main__":
    import asyncio
    async def main():
        ops = await fetch_recent_opinions()
        print(f"Fetched {len(ops)} opinions.")
    asyncio.run(main())
