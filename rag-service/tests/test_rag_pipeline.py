import pytest
from app.ingestion.chunker import RecursiveFinancialChunker
from app.vectorstore.faiss_store import FinancialVectorStore
from app.rag.engine import FinancialRAGEngine
from app.schemas.rag_schemas import QueryRequest

def test_recursive_financial_chunking():
    sample_text = """# Q3 Financial Earnings
This is the executive summary describing revenue growth.

## Segment Breakdown
Credit cards generated 48% volume. UPI accounted for 32%."""
    
    chunker = RecursiveFinancialChunker(chunk_size=100, chunk_overlap=20)
    chunks = chunker.split_text(sample_text, document_id="DOC-001", document_title="Q3 Report")
    
    assert len(chunks) >= 2
    assert chunks[0]["document_id"] == "DOC-001"
    assert "section_heading" in chunks[0]

def test_vector_store_indexing_and_search():
    store = FinancialVectorStore(dimension=128)
    chunks = [
        {
            "document_id": "DOC-001",
            "document_title": "Earnings Report",
            "chunk_index": 0,
            "content": "Gross financial volume reached 39.36 Lakhs with 24.8% operating margin.",
            "section_heading": "Revenue"
        },
        {
            "document_id": "DOC-002",
            "document_title": "Risk Policy",
            "chunk_index": 0,
            "content": "Transactions over 50000 require dual authorization by compliance officer.",
            "section_heading": "Risk"
        }
    ]
    
    indexed = store.add_chunks(chunks)
    assert indexed == 2
    
    # Test Similarity Search
    results = store.similarity_search("What was the operating margin and revenue?", top_k=2)
    assert len(results) >= 1
    assert "margin" in results[0][0]["content"].lower()

def test_rag_engine_grounded_response():
    store = FinancialVectorStore(dimension=128)
    chunks = [
        {
            "document_id": "DOC-001",
            "document_title": "Q3 2025 Financial Statement",
            "chunk_index": 0,
            "content": "Net revenue reached 3936000 INR with 24.8% operating margin.",
            "section_heading": "Financial Performance"
        }
    ]
    store.add_chunks(chunks)
    
    engine = FinancialRAGEngine(store)
    req = QueryRequest(query="What is the net revenue and operating margin for Q3?", top_k=2)
    resp = engine.query(req)
    
    assert resp.query_id.startswith("QRY-")
    assert len(resp.citations) >= 1
    assert resp.confidence_score > 0.7
    assert resp.latency_ms > 0
