from fastapi import FastAPI
from pydantic import BaseModel
from PyPDF2 import PdfReader
from langchain.prompts import PromptTemplate
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import CharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.chains import LLMChain
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()
google_api_key = os.getenv("GOOGLE_API_KEY")
class QueryRequest(BaseModel):
    question: str
    type: Optional[str] = None
app = FastAPI()

pdf_paths = [
    "backend/src/FastAPI/green-h2.pdf",
    "backend/src/FastAPI/hydrogen.pdf"
]

raw_text = ""
for path in pdf_paths:
    pdfreader = PdfReader(path)
    for page in pdfreader.pages:
        content = page.extract_text()
        if content:
            raw_text += content + "\n"

text_splitter = CharacterTextSplitter(
    separator="\n", chunk_size=1192, chunk_overlap=200, length_function=len,
)
texts = text_splitter.split_text(raw_text)

embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001",google_api_key=google_api_key)
document_search = FAISS.from_texts(texts, embeddings)

llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.0, google_api_key=google_api_key)

@app.post("/chat")
def ask_question(req: QueryRequest):
    # Retrieve docs
    docs = document_search.similarity_search(req.question)
    context = "\n".join([d.page_content for d in docs])
    template_str="""
    You are an expert assistant specialized in answering questions about Hydrogen and Green Hydrogen in India. 
    Use the provided context from documents to answer the question as accurately as possible. 

    Context:
    {context}

    Question:
   {question}

    Instructions:
    - Only use facts from the context to answer.
    - If the answer is not found in the context, say: 
    "I could not find this information in the provided documents."
    - Keep the answer clear, structured, and concise.
    - If relevant, mention specific policies, targets, or projects.

    Answer:
"""
    custom_prompt = PromptTemplate(template=template_str, input_variables=["context", "question"])
    qa_chain = LLMChain(llm=llm, prompt=custom_prompt)

    response = qa_chain.run(context=context, question=req.question)
    return {"answer": response}
