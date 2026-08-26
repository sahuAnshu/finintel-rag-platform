from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class SourceCitation(BaseModel):
    document_id: str
    document_title: str
    chunk_index: int
    page_number: Optional[int] = None
    similarity_score: float = Field(..., description="Cosine similarity score between query and chunk (0-1)")
    excerpt: str = Field(..., description="Exact context passage retrieved from vector index")
    section_heading: Optional[str] = None

class QueryRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=1000, description="Financial natural language question")
    top_k: int = Field(default=4, ge=1, le=10, description="Number of context passages to retrieve")
    document_filter: Optional[List[str]] = Field(default=None, description="Optional document IDs to filter retrieval")
    include_raw_chunks: bool = Field(default=True, description="Whether to return raw text chunks with similarity scores")
    temperature: Optional[float] = Field(default=0.1, ge=0.0, le=1.0)

class QueryResponse(BaseModel):
    query_id: str
    question: str
    answer: str
    citations: List[SourceCitation]
    latency_ms: float
    tokens_used: int
    model: str
    confidence_score: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class DocumentIngestRequest(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    category: str = Field(default="FINANCIAL_REPORT", description="FINANCIAL_REPORT | AUDIT_MEMO | POLICY | 10K_FILING")
    content: str = Field(..., min_length=50, description="Raw text or parsed financial document content")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)
    chunk_size: Optional[int] = Field(default=800)
    chunk_overlap: Optional[int] = Field(default=150)

class DocumentIngestResponse(BaseModel):
    document_id: str
    title: str
    chunks_created: int
    vectors_indexed: int
    status: str
    ingested_at: datetime = Field(default_factory=datetime.utcnow)

class DocumentSummary(BaseModel):
    document_id: str
    title: str
    category: str
    chunk_count: int
    character_count: int
    created_at: datetime

class VectorStoreStats(BaseModel):
    vector_store_type: str
    total_indexed_vectors: int
    embedding_dimension: int
    embedding_model: str
    total_documents: int
    memory_usage_mb: float
    index_status: str

class AuditLogEntry(BaseModel):
    id: str
    timestamp: datetime
    user_role: str
    query: str
    latency_ms: float
    retrieved_chunks: int
    tokens_used: int
    status: str
