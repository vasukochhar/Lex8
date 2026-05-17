"""
Stale Precedent Annotation (Citator).
Flags cases that have been overruled, distinguished, or questioned.
"""

from typing import List, Dict

# Mock citator database mapping case ID/citation to its status
# Statuses: "good", "caution" (distinguished/questioned), "bad" (overruled)
CITATOR_DB = {
    "/opinion/101/smith-v-jones/": {
        "status": "good",
        "notes": "Still good law. Cited positively in 45 cases."
    },
    "/opinion/102/acme-v-beta/": {
        "status": "bad",
        "notes": "Overruled by Supreme Court in 2025 regarding veil piercing standards."
    }
}

def annotate_results(search_results: List[Dict]) -> List[Dict]:
    """
    Takes hybrid search results and annotates them with citator status.
    """
    annotated = []
    for result in search_results:
        doc = result.get("doc", {})
        citation = doc.get("citation", "")
        # fallback to opinion_id if citation is missing from mock DB keys
        opinion_id = str(doc.get("opinion_id", ""))
        
        # Mock lookup
        citator_info = CITATOR_DB.get(citation, {"status": "unknown", "notes": "No citator data available."})
        
        if citator_info["status"] == "unknown" and opinion_id == "102":
            citator_info = CITATOR_DB["/opinion/102/acme-v-beta/"]
            
        if citator_info["status"] == "unknown" and opinion_id == "101":
            citator_info = CITATOR_DB["/opinion/101/smith-v-jones/"]

        doc["citator_status"] = citator_info["status"]
        doc["citator_notes"] = citator_info["notes"]
        
        annotated.append(result)
        
    return annotated

if __name__ == "__main__":
    from services.library.search.hybrid import hybrid_search
    from services.library.security.anti_injection import secure_hybrid_search
    
    # Run a broad search to get Acme v. Beta
    res = secure_hybrid_search("corporate veil piercing", hybrid_search)
    results = res["results"]
    
    annotated = annotate_results(results)
    
    print("Annotated Search Results:")
    for r in annotated:
        doc = r["doc"]
        print(f"[{doc['citator_status'].upper()}] {doc['case_name']}")
        print(f"  Note: {doc['citator_notes']}")
