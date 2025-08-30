

## Hydrogen Docs Q&A Bot 

This module is part of the AI Branch and provide  a document-based chatbot that answer questions from hydrogen-related policy and infrastructure PDFs.

## 🗺️System Flow
**How it works**

- **PDF Collection** - Import hydrogen-related document.
- **Text Extraction** - Extract raw text from PDFs.
- **Text Splitting** - Break teext into small chunks for retrieval.
- **Embeddings** - Generate vector embeddings using Gemini (models/embedding-001)
- **Vector Store** - Store embeddings in FAISS for fast search.
- **Query Answering** - User's query is matched to relevent chunks.
- **LLM Response** - Gemini-1.5-Flash generates the final answer.

## Architecture

