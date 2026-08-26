import logging
import sys

def setup_logging(log_level: str = "INFO") -> logging.Logger:
    """Configures structured JSON-friendly console logging for production RAG pipelines."""
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s:%(funcName)s:%(lineno)d - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)
    
    logger = logging.getLogger("finintel")
    logger.setLevel(getattr(logging, log_level.upper(), logging.INFO))
    
    if not logger.handlers:
        logger.addHandler(handler)
        
    return logger

logger = setup_logging()
