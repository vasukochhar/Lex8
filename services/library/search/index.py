"""
OpenSearch index setup for Lex8 Library (BM25 sparse search).
"""

from opensearchpy import OpenSearch, RequestsHttpConnection

def get_opensearch_client(host: str = "localhost", port: int = 9200):
    return OpenSearch(
        hosts=[{"host": host, "port": port}],
        http_compress=True,
        http_auth=("admin", "admin"), # default for local dev if security is enabled
        use_ssl=False,
        verify_certs=False,
        connection_class=RequestsHttpConnection
    )

def setup_index(client: OpenSearch, index_name: str = "legal_cases"):
    """Creates the index with custom analyzer for legal text if it doesn't exist."""
    settings = {
        "settings": {
            "index": {
                "number_of_shards": 1,
                "number_of_replicas": 0
            },
            "analysis": {
                "analyzer": {
                    "legal_analyzer": {
                        "type": "custom",
                        "tokenizer": "standard",
                        "filter": ["lowercase", "stop", "snowball"]
                    }
                }
            }
        },
        "mappings": {
            "properties": {
                "title": {"type": "text", "analyzer": "legal_analyzer"},
                "text": {"type": "text", "analyzer": "legal_analyzer"},
                "jurisdiction": {"type": "keyword"},
                "year": {"type": "integer"},
                "citation": {"type": "keyword"}
            }
        }
    }

    if not client.indices.exists(index=index_name):
        client.indices.create(index=index_name, body=settings)
        print(f"✅ Created OpenSearch index: {index_name}")
    else:
        print(f"ℹ️ OpenSearch index '{index_name}' already exists.")

if __name__ == "__main__":
    import os
    # Get host from env or default to localhost
    os_url = os.environ.get("OPENSEARCH_URL", "http://localhost:9200")
    host = os_url.split("//")[-1].split(":")[0]
    port = int(os_url.split(":")[-1].split("/")[0]) if ":" in os_url.split("//")[-1] else 9200
    
    print(f"Connecting to OpenSearch at {host}:{port}...")
    try:
        client = get_opensearch_client(host, port)
        setup_index(client)
    except Exception as e:
        print(f"❌ Failed to setup OpenSearch index: {e}")
