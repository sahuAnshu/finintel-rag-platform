import re
from typing import List, Dict, Any

class RecursiveFinancialChunker:
    """
    Splits long financial reports and balance sheet texts into overlapping chunks
    while respecting natural markdown/financial section boundaries.
    """
    
    def __init__(self, chunk_size: int = 800, chunk_overlap: int = 150):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.separators = ["\n\n## ", "\n\n### ", "\n\n", "\n", ". ", " "]

    def split_text(self, text: str, document_id: str, document_title: str, base_metadata: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Splits document text into chunks with rich metadata and source tracking."""
        base_metadata = base_metadata or {}
        raw_splits = self._recursive_split(text, self.separators)
        
        chunks: List[Dict[str, Any]] = []
        current_chunk = ""
        current_heading = "General Overview"
        
        for split in raw_splits:
            # Detect section heading
            heading_match = re.match(r'^#{1,3}\s+(.+)$', split.strip(), re.MULTILINE)
            if heading_match:
                current_heading = heading_match.group(1).strip()
            
            if len(current_chunk) + len(split) <= self.chunk_size:
                current_chunk += split
            else:
                if current_chunk.strip():
                    chunks.append({
                        "document_id": document_id,
                        "document_title": document_title,
                        "chunk_index": len(chunks),
                        "content": current_chunk.strip(),
                        "section_heading": current_heading,
                        "char_count": len(current_chunk.strip()),
                        "metadata": {**base_metadata, "section": current_heading}
                    })
                
                # Apply overlap
                overlap_text = current_chunk[-self.chunk_overlap:] if len(current_chunk) > self.chunk_overlap else ""
                current_chunk = overlap_text + split
                
        if current_chunk.strip():
            chunks.append({
                "document_id": document_id,
                "document_title": document_title,
                "chunk_index": len(chunks),
                "content": current_chunk.strip(),
                "section_heading": current_heading,
                "char_count": len(current_chunk.strip()),
                "metadata": {**base_metadata, "section": current_heading}
            })
            
        return chunks

    def _recursive_split(self, text: str, separators: List[str]) -> List[str]:
        if not separators or len(text) <= self.chunk_size:
            return [text] if text else []
            
        sep = separators[0]
        splits = text.split(sep)
        result = []
        
        for i, split in enumerate(splits):
            if not split:
                continue
            token = (sep if i > 0 else "") + split
            if len(token) > self.chunk_size and len(separators) > 1:
                result.extend(self._recursive_split(token, separators[1:]))
            else:
                result.append(token)
                
        return result
