"""
OpenSearch BM25 query implementation for Lex8 Library.
"""

from opensearchpy import OpenSearch
from .index import get_opensearch_client

def search_bm25(query: str, index_name: str = "legal_cases", size: int = 100, host: str = "localhost", port: int = 9200):
    """
    Search the legal_cases index using BM25.
    Returns the top-K results to be combined later with dense search.
    """
    client = get_opensearch_client(host, port)
    
    search_body = {
        "size": size,
        "query": {
            "multi_match": {
                "query": query,
                "fields": ["title^2", "text"],
                "type": "best_fields"
            }
        }
    }
    
    response = client.search(index=index_name, body=search_body)
    return response["hits"]["hits"]

if __name__ == "__main__":
    # Test query
    import json
    print("Testing BM25 search...")
    try:
        results = search_bm25("negligence standard of care")
        print(f"Found {len(results)} results.")
        if results:
             print(json.dumps(results[0], indent=2))
    except Exception as e:
        print(f"Search failed: {e}")
