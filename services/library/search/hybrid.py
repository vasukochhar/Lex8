"""
Hybrid Search Pipeline for Lex8 Library.
Combines BM25 (OpenSearch) and Dense Vectors (Qdrant + Voyage) using RRF.
"""

import os
import voyageai
from typing import List, Dict, Any

from qdrant_client import QdrantClient
from .bm25 import search_bm25

VOYAGE_API_KEY = os.environ.get("VOYAGE_API_KEY", "")
QDRANT_URL = os.environ.get("QDRANT_URL", "http://localhost:6333")
COLLECTION_NAME = "legal_cases_dense"

if VOYAGE_API_KEY:
    vo = voyageai.Client(api_key=VOYAGE_API_KEY)
else:
    vo = None

qdrant = QdrantClient(url=QDRANT_URL)

def reciprocal_rank_fusion(dense_results: List[Dict], sparse_results: List[Dict], k: int = 60) -> List[Dict]:
    """
    Combine results using Reciprocal Rank Fusion (RRF).
    score = 1 / (k + rank)
    """
    rrf_scores = {}
    
    # Process dense results
    for rank, hit in enumerate(dense_results):
        doc_id = str(hit.payload.get("opinion_id"))
        if doc_id not in rrf_scores:
            rrf_scores[doc_id] = {"score": 0.0, "doc": hit.payload}
        rrf_scores[doc_id]["score"] += 1.0 / (k + rank + 1)
        rrf_scores[doc_id]["dense_rank"] = rank + 1
        
    # Process sparse results
    for rank, hit in enumerate(sparse_results):
        doc_id = str(hit["_id"])
        if doc_id not in rrf_scores:
            rrf_scores[doc_id] = {
                "score": 0.0, 
                "doc": {
                    "opinion_id": doc_id,
                    "case_name": hit["_source"].get("title", ""),
                    "text": hit["_source"].get("text", "")
                }
            }
        rrf_scores[doc_id]["score"] += 1.0 / (k + rank + 1)
        rrf_scores[doc_id]["sparse_rank"] = rank + 1

    # Sort by RRF score descending
    fused_results = sorted(rrf_scores.values(), key=lambda x: x["score"], reverse=True)
    return fused_results

def hybrid_search(query: str, top_k: int = 10) -> List[Dict]:
    """Execute hybrid search pipeline."""
    print(f"Executing hybrid search for: '{query}'")
    
    # 1. Sparse Search (BM25 via OpenSearch)
    try:
        sparse_hits = search_bm25(query, size=top_k * 2)
        print(f"  - BM25 returned {len(sparse_hits)} hits")
    except Exception as e:
        print(f"  - BM25 search failed: {e}")
        sparse_hits = []

    # 2. Dense Search (Voyage embeddings via Qdrant)
    dense_hits = []
    if vo:
        try:
            emb = vo.embed([query], model="voyage-law-2").embeddings[0]
            dense_hits = qdrant.search(
                collection_name=COLLECTION_NAME,
                query_vector=emb,
                limit=top_k * 2
            )
            print(f"  - Dense returned {len(dense_hits)} hits")
        except Exception as e:
            print(f"  - Dense search failed: {e}")
            
    # 3. Reciprocal Rank Fusion
    results = reciprocal_rank_fusion(dense_hits, sparse_hits)
    
    # Return top_k
    return results[:top_k]

if __name__ == "__main__":
    results = hybrid_search("standard of care in negligence")
    print("\n--- Top Results ---")
    for i, r in enumerate(results[:3]):
        doc = r["doc"]
        print(f"{i+1}. [{r['score']:.4f}] {doc.get('case_name')}")
        print(f"   {doc.get('text', '')[:100]}...")
