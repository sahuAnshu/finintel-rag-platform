import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging_config import logger
from app.api.v1.endpoints import router as api_v1_router, vector_store, chunker, documents_registry
from app.schemas.rag_schemas import DocumentSummary
from datetime import datetime

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initializes vector store with baseline sample financial reports on startup."""
    logger.info(f"Initializing {settings.PROJECT_NAME} (v{settings.VERSION})...")
    
    samples_dir = os.path.join(os.path.dirname(__file__), "data", "samples")
    if os.path.exists(samples_dir):
        for filename in os.listdir(samples_dir):
            if filename.endswith(".txt"):
                filepath = os.path.join(samples_dir, filename)
                try:
                    with open(filepath, "r", encoding="utf-8") as f:
                        content = f.read()
                    
                    title = filename.replace("_", " ").replace(".txt", "").title()
                    doc_id = f"DOC-{filename[:6].upper()}"
                    
                    chunks = chunker.split_text(content, document_id=doc_id, document_title=title)
                    vector_store.add_chunks(chunks)
                    
                    documents_registry.append(DocumentSummary(
                        document_id=doc_id,
                        title=title,
                        category="FINANCIAL_REPORT" if "report" in filename else "POLICY",
                        chunk_count=len(chunks),
                        character_count=len(content),
                        created_at=datetime.utcnow()
                    ))
                    logger.info(f"Preloaded sample financial document: {title} ({len(chunks)} chunks)")
                except Exception as e:
                    logger.warning(f"Could not preload {filename}: {str(e)}")
                    
    logger.info("FinIntel RAG Vector Store successfully initialized and ready for queries.")
    yield
    logger.info("FinIntel RAG Service shutting down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise LangChain & FAISS RAG Microservice for Financial Document Intelligence",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 router
app.include_router(api_v1_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
        "api_prefix": settings.API_V1_STR,
        "status": "ONLINE"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
