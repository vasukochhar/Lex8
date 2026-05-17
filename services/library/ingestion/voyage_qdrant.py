"""
Voyage AI Embeddings + Qdrant Vector DB Ingestion.
"""

import os
import uuid
from typing import List, Dict, Any

import voyageai
from qdrant_client import QdrantClient
from qdrant_client.http import models

VOYAGE_API_KEY = os.environ.get("VOYAGE_API_KEY", "")
QDRANT_URL = os.environ.get("QDRANT_URL", "http://localhost:6333")
COLLECTION_NAME = "legal_cases_dense"

# Initialize clients
if VOYAGE_API_KEY:
    vo = voyageai.Client(api_key=VOYAGE_API_KEY)
else:
    vo = None
    print("Warning: VOYAGE_API_KEY not set. Dense embeddings will be skipped.")

qdrant = QdrantClient(url=QDRANT_URL)

def setup_qdrant_collection():
    """Create the Qdrant collection for Voyage legal embeddings if it doesn't exist."""
    collections = qdrant.get_collections().collections
    if not any(c.name == COLLECTION_NAME for c in collections):
        # Voyage AI 'voyage-law-2' outputs 1024-dim embeddings
        qdrant.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=models.VectorParams(size=1024, distance=models.Distance.COSINE),
        )
        print(f"✅ Created Qdrant collection: {COLLECTION_NAME}")
    else:
        print(f"ℹ️ Qdrant collection '{COLLECTION_NAME}' already exists.")

def embed_and_store(opinions: List[Dict[str, Any]]):
    """Embed plain text using Voyage AI and store in Qdrant."""
    if not vo:
        print("Skipping dense ingestion (no VOYAGE_API_KEY).")
        return

    texts = [op.get("plain_text", "") for op in opinions if op.get("plain_text")]
    if not texts:
        return

    # Create dense embeddings using the specialized legal model
    print(f"Generating embeddings for {len(texts)} texts using voyage-law-2...")
    result = vo.embed(texts, model="voyage-law-2")
    embeddings = result.embeddings

    points = []
    for i, op in enumerate(opinions):
        if not op.get("plain_text"):
            continue
        
        # In real-world, we'd chunk long texts. For MVP we embed the whole chunk.
        point_id = str(uuid.uuid5(uuid.NAMESPACE_URL, str(op.get("id"))))
        
        points.append(
            models.PointStruct(
                id=point_id,
                vector=embeddings[i],
                payload={
                    "opinion_id": op.get("id"),
                    "case_name": op.get("case_name", "Unknown Case"),
                    "text": op.get("plain_text", ""),
                    "date_filed": op.get("date_filed", "")
                }
            )
        )

    print(f"Uploading {len(points)} points to Qdrant...")
    qdrant.upsert(
        collection_name=COLLECTION_NAME,
        points=points
    )
    print("✅ Ingestion complete.")

if __name__ == "__main__":
    setup_qdrant_collection()
