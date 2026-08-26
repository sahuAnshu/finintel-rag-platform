import os
from typing import List, Optional

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
    
    class Settings(BaseSettings):
        PROJECT_NAME: str = "FinIntel Financial RAG Engine"
        VERSION: str = "1.0.0"
        API_V1_STR: str = "/api/v1"
        ENVIRONMENT: str = "development"
        LOG_LEVEL: str = "INFO"
        
        # Vector store & RAG settings
        VECTOR_STORE_TYPE: str = "faiss"
        EMBEDDING_MODEL: str = "text-embedding-3-small"
        EMBEDDING_DIMENSION: int = 384
        CHUNK_SIZE: int = 800
        CHUNK_OVERLAP: int = 150
        TOP_K_RETRIEVAL: int = 4
        MIN_SIMILARITY_THRESHOLD: float = 0.65
        
        # LLM Settings
        OPENAI_API_KEY: Optional[str] = None
        LLM_MODEL: str = "gpt-4o-mini"
        LLM_TEMPERATURE: float = 0.1
        
        # CORS
        BACKEND_CORS_ORIGINS: List[str] = ["*"]
        
        # AWS S3 Settings
        AWS_REGION: str = "us-east-1"
        AWS_S3_BUCKET_NAME: str = "finintel-financial-docs"
        
        model_config = SettingsConfigDict(
            env_file=".env",
            env_file_encoding="utf-8",
            case_sensitive=True,
            extra="allow"
        )

except ImportError:
    from pydantic import BaseModel, Field
    
    class Settings(BaseModel):
        PROJECT_NAME: str = os.getenv("PROJECT_NAME", "FinIntel Financial RAG Engine")
        VERSION: str = "1.0.0"
        API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")
        ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
        LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
        
        # Vector store & RAG settings
        VECTOR_STORE_TYPE: str = os.getenv("VECTOR_STORE_TYPE", "faiss")
        EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
        EMBEDDING_DIMENSION: int = int(os.getenv("EMBEDDING_DIMENSION", "384"))
        CHUNK_SIZE: int = int(os.getenv("CHUNK_SIZE", "800"))
        CHUNK_OVERLAP: int = int(os.getenv("CHUNK_OVERLAP", "150"))
        TOP_K_RETRIEVAL: int = int(os.getenv("TOP_K_RETRIEVAL", "4"))
        MIN_SIMILARITY_THRESHOLD: float = float(os.getenv("MIN_SIMILARITY_THRESHOLD", "0.65"))
        
        # LLM Settings
        OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", None)
        LLM_MODEL: str = os.getenv("LLM_MODEL", "gpt-4o-mini")
        LLM_TEMPERATURE: float = float(os.getenv("LLM_TEMPERATURE", "0.1"))
        
        # CORS
        BACKEND_CORS_ORIGINS: List[str] = ["*"]
        
        # AWS S3 Settings
        AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
        AWS_S3_BUCKET_NAME: str = os.getenv("AWS_S3_BUCKET_NAME", "finintel-financial-docs")

settings = Settings()
