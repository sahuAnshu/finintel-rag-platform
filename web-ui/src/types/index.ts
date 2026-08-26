export interface SourceCitation {
  document_id: string;
  document_title: string;
  chunk_index: number;
  page_number?: number;
  similarity_score: number;
  excerpt: string;
  section_heading?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: SourceCitation[];
  latency_ms?: number;
  tokens_used?: number;
  confidence_score?: number;
  timestamp: string;
}

export interface DocumentSummary {
  document_id: string;
  title: string;
  category: string;
  chunk_count: number;
  character_count: number;
  created_at: string;
}

export interface VectorStoreStats {
  vector_store_type: string;
  total_indexed_vectors: number;
  embedding_dimension: number;
  embedding_model: string;
  total_documents: number;
  memory_usage_mb: number;
  index_status: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user_role: string;
  query: string;
  latency_ms: number;
  retrieved_chunks: number;
  tokens_used: number;
  status: string;
}
