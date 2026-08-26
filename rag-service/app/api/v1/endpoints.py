import uuid
from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, Header
from app.schemas.rag_schemas import (
    QueryRequest, QueryResponse, DocumentIngestRequest,
    DocumentIngestResponse, DocumentSummary, VectorStoreStats, AuditLogEntry
)
from app.ingestion.chunker import RecursiveFinancialChunker
from app.vectorstore.faiss_store import FinancialVectorStore
from app.rag.engine import FinancialRAGEngine
from app.core.logging_config import logger

router = APIRouter()

# Global instances (initialized on startup in main.py)
vector_store = FinancialVectorStore()
chunker = RecursiveFinancialChunker(chunk_size=800, chunk_overlap=150)
rag_engine = FinancialRAGEngine(vector_store)

# In-memory document registry
documents_registry: List[DocumentSummary] = []

@router.post("/query", response_model=QueryResponse, summary="Execute Grounded Financial RAG Query")
async def execute_query(
    request: QueryRequest,
    x_user_role: str = Header(default="FINANCIAL_ANALYST", alias="X-User-Role")
):
    """
    Retrieves relevant financial context chunks via MMR / Cosine similarity
    and returns a cited, verifiable answer with latency & token metrics.
    """
    try:
        response = rag_engine.query(request, user_role=x_user_role)
        return response
    except Exception as e:
        logger.error(f"Error executing RAG query: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"RAG query execution failed: {str(e)}")

@router.post("/ingest", response_model=DocumentIngestResponse, summary="Ingest Financial Document into Vector Store")
async def ingest_document(request: DocumentIngestRequest):
    """
    Chunks financial document content and indexes dense embeddings into FAISS vector store.
    """
    try:
        doc_id = f"DOC-{uuid.uuid4().hex[:6].upper()}"
        chunk_size = request.chunk_size or 800
        chunk_overlap = request.chunk_overlap or 150
        
        custom_chunker = RecursiveFinancialChunker(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        chunks = custom_chunker.split_text(
            text=request.content,
            document_id=doc_id,
            document_title=request.title,
            base_metadata={"category": request.category, **request.metadata}
        )
        
        vectors_indexed = vector_store.add_chunks(chunks)
        
        # Register document
        summary = DocumentSummary(
            document_id=doc_id,
            title=request.title,
            category=request.category,
            chunk_count=len(chunks),
            character_count=len(request.content),
            created_at=datetime.now(timezone.utc)
        )
        documents_registry.insert(0, summary)
        
        return DocumentIngestResponse(
            document_id=doc_id,
            title=request.title,
            chunks_created=len(chunks),
            vectors_indexed=vectors_indexed,
            status="INDEXED"
        )
    except Exception as e:
        logger.error(f"Failed to ingest document: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Document ingestion failed: {str(e)}")

@router.get("/documents", response_model=List[DocumentSummary], summary="List Ingested Financial Documents")
async def list_documents():
    return documents_registry

@router.get("/vectorstore/stats", response_model=VectorStoreStats, summary="Vector Index Telemetry & Diagnostic Stats")
async def get_vector_stats():
    return vector_store.get_stats()

@router.get("/audit", response_model=List[AuditLogEntry], summary="Retrieve RAG Query Audit Trail Logs")
async def get_audit_logs():
    return rag_engine.audit_logs

@router.get("/health", summary="Service Health Probe")
async def health_check():
    return {
        "status": "HEALTHY",
        "service": "FinIntel RAG Engine",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "vector_index_ready": len(vector_store.vectors) > 0,
        "total_indexed_chunks": len(vector_store.vectors)
    }
