"""
Lex8 Library Ingestion Pipeline.
Fetches from CourtListener -> Embeds with Voyage AI -> Stores in Qdrant & OpenSearch.
"""

import asyncio
from .courtlistener import fetch_recent_opinions
from .voyage_qdrant import setup_qdrant_collection, embed_and_store

# Add opensearch to path
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from search.index import setup_index, get_opensearch_client

async def run_pipeline():
    print("Starting Lex8 Ingestion Pipeline...")
    
    # 1. Setup DBs
    setup_qdrant_collection()
    
    try:
        os_client = get_opensearch_client()
        setup_index(os_client)
    except Exception as e:
        print(f"Warning: OpenSearch not available: {e}")
        os_client = None

    # 2. Fetch data
    opinions = await fetch_recent_opinions(page=1)
    if not opinions:
        print("No opinions fetched. Exiting.")
        return

    # 3. Dense Ingestion (Voyage -> Qdrant)
    embed_and_store(opinions)
    
    # 4. Sparse Ingestion (OpenSearch)
    if os_client:
        print(f"Indexing {len(opinions)} documents to OpenSearch...")
        for op in opinions:
            if not op.get("plain_text"):
                continue
                
            doc = {
                "title": op.get("case_name", ""),
                "text": op.get("plain_text", ""),
                "citation": op.get("absolute_url", ""),
                "year": int(op.get("date_filed", "2000-01-01")[:4]) if op.get("date_filed") else None
            }
            try:
                os_client.index(index="legal_cases", id=str(op.get("id")), body=doc)
            except Exception as e:
                 print(f"Failed to index doc {op.get('id')}: {e}")
        print("✅ OpenSearch indexing complete.")

if __name__ == "__main__":
    asyncio.run(run_pipeline())
