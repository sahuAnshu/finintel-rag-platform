import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture(scope="module")
def client():
    """Context-managed test client that activates the FastAPI lifespan startup event."""
    with TestClient(app) as test_client:
        yield test_client

def test_health_check_endpoint(client):
    """Verify system health and vector index readiness probe."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert data["vector_index_ready"] is True

def test_query_endpoint_execution(client):
    """Test RAG query execution with citation extraction against preloaded reports."""
    payload = {
        "query": "What is the total settlement volume and operating margin in Q3?",
        "top_k": 3
    }
    headers = {"X-User-Role": "FINANCIAL_ANALYST"}
    response = client.post("/api/v1/query", json=payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["query_id"].startswith("QRY-")
    assert "answer" in data
    assert len(data["citations"]) > 0
    assert data["confidence_score"] > 0.5
    assert data["latency_ms"] >= 0

def test_document_ingestion_and_retrieval_cycle(client):
    """Test full document lifecycle: Ingest -> Index -> Verify in Document List."""
    ingest_payload = {
        "title": "2025 Treasury Hedging Strategy Memo",
        "category": "AUDIT_MEMO",
        "content": "# Treasury Memo\n\n## Currency Risk\nSkyReserve locked 70% of foreign currency exposure at 84.20 INR per USD to mitigate foreign exchange volatility.",
        "chunk_size": 400,
        "chunk_overlap": 50
    }
    
    # 1. Ingest
    ingest_resp = client.post("/api/v1/ingest", json=ingest_payload)
    assert ingest_resp.status_code == 200
    ingest_data = ingest_resp.json()
    assert ingest_data["document_id"].startswith("DOC-")
    assert ingest_data["chunks_created"] >= 1
    assert ingest_data["status"] == "INDEXED"
    
    # 2. Verify in Documents list
    docs_resp = client.get("/api/v1/documents")
    assert docs_resp.status_code == 200
    docs = docs_resp.json()
    assert any(d["title"] == "2025 Treasury Hedging Strategy Memo" for d in docs)
    
    # 3. Query the newly ingested knowledge
    query_resp = client.post("/api/v1/query", json={
        "query": "What percentage of foreign currency exposure was locked at 84.20 INR?",
        "top_k": 2
    })
    assert query_resp.status_code == 200
    query_data = query_resp.json()
    assert len(query_data["citations"]) > 0

def test_vectorstore_stats_endpoint(client):
    """Verify vector index diagnostics endpoint."""
    response = client.get("/api/v1/vectorstore/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["total_indexed_vectors"] > 0
    assert data["embedding_dimension"] == 384
    assert data["index_status"] == "READY"

def test_audit_logs_endpoint(client):
    """Verify audit trail logging capture."""
    response = client.get("/api/v1/audit")
    assert response.status_code == 200
    logs = response.json()
    assert isinstance(logs, list)
    assert len(logs) > 0
    assert "user_role" in logs[0]
    assert "latency_ms" in logs[0]
