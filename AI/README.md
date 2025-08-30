# H<sub>2</sub>AI

## 1) Hydrogen Docs Q&A Bot - 

This module is part of the AI Branch and provide  a document-based chatbot that answer questions from hydrogen-related policy and infrastructure PDFs.

## System Flow-
**How it works**

- **PDF Collection** - Import hydrogen-related document.
- **Text Extraction** - Extract raw text from PDFs.
- **Text Splitting** - Break teext into small chunks for retrieval.
- **Embeddings** - Generate vector embeddings using Gemini (models/embedding-001)
- **Vector Store** - Store embeddings in FAISS for fast search.
- **Query Answering** - User's query is matched to relevent chunks.
- **LLM Response** - Gemini-1.5-Flash generates the final answer.

## Architecture-

<img src="demo/1.png" />

## Setup(Feature Only)-

```bash
pip install -r requirements.txt
```

Create .env
```bash
GOOGLE_API_KEY = your_google_api_key
SERPER_API_KEY = your_serper_api_key
```

Run:

```bash
python ai/bot.py
```

## Example

```bash

query = "What is Hydrogen policy?"
docs = document_search.similarity_search(query)
result = chain.run(input_documents=docs, question=query)
print(result)
```

## Next Steps

- Allow dynamic PDF Upload
- Improve retrieval with RAG pipeline
