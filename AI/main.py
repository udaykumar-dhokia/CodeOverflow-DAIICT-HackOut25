from fastapi import FastAPI
from pydantic import BaseModel
from PyPDF2 import PdfReader
from langchain.prompts import PromptTemplate
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import CharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.chains import LLMChain
import os
from dotenv import load_dotenv

# Load environment
load_dotenv()
google_api_key = "AIzaSyC03cRNSjEg8oMBvdX-scEzDW1t15U7hY0"

# FastAPI app
app = FastAPI()

# Input schema
class QueryRequest(BaseModel):
    question: str
    type: str 
plant_template_str = """
You are an expert advisor in hydrogen infrastructure planning.  
Your task is to recommend an optimal location for setting up a hydrogen plant.  

Inputs: Budget, Capacity, Preferred renewable source, Logistic preference.  

Context:  
{context}  

User Question: {question}  

Instructions:  
- Recommend best possible plant location.  
- Justify based on budget, capacity, renewable source, and logistics.  
- If missing info, approximate reasonably from context.  
- Generate a structured report with: Location, Justification, Risks, Alignment, Benefits.  
"""

storage_template_str = """
You are tasked with recommending an optimal location for a hydrogen storage facility.  

Inputs: Budget, Capacity, Technology (optional), Proximity Preference (plant/demand/port).  

Context:  
{context}  

User Question: {question}  

Instructions:  
- Recommend best possible storage location.  
- Justify based on technology, budget, and proximity preference.  
- If missing info, approximate reasonably.  
- Provide a structured report: Location, Rationale, Risks, Alignment.  
"""

distribution_hub_template_str = """
You are tasked with recommending an optimal location for a hydrogen distribution hub.  

Inputs: Budget, Capacity, Service Radius, Proximity Preference, Location Preference (optional), Land Requirement.  

Context:  
{context}  

User Question: {question}  

Instructions:  
- Recommend feasible hub location(s).  
- Justify considering demand centers, pipelines, land availability, and regulatory factors.  
- Provide a structured report: Recommended Location(s), Rationale, Risks, Strategic Alignment.  
"""

pipeline_template_str = """
You are a domain expert in pipeline planning.  

Inputs: Capacity, Length Estimate, Route Preference.  

Context:  
{context}  

User Question: {question}  

Instructions:  
- Predict feasible plant/pipeline route location(s).  
- Approximate based on demand, geography, and infrastructure context.  
- Provide a structured report: Suggested Location, Justification, Risks, Alignment.  
"""

pdf_paths = [
    # "AI/docschatbot/PIPELINE.pdf",
    # "AI/docschatbot/Plant_asset.pdf",
    # "AI/docschatbot/STORAGE.pdf",
    "AI/docschatbot/Distribution_Hub.pdf"
]

raw_text = ""
for path in pdf_paths:
    pdfreader = PdfReader(path)
    for page in pdfreader.pages:
        content = page.extract_text()
        if content:
            raw_text += content + "\n"

text_splitter = CharacterTextSplitter(
    separator="\n", chunk_size=1000, chunk_overlap=200, length_function=len,
)
texts = text_splitter.split_text(raw_text)

embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001",google_api_key=google_api_key)
document_search = FAISS.from_texts(texts, embeddings)

llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.0, google_api_key=google_api_key)

@app.post("/ask")
def ask_question(req: QueryRequest):
    # Retrieve docs
    docs = document_search.similarity_search(req.question)
    context = "\n".join([d.page_content for d in docs])

    # Select template dynamically
    templates = {
        "plant": plant_template_str,
        "storage": storage_template_str,
        "distribution_hub": distribution_hub_template_str,
        "pipeline": pipeline_template_str,
    }

    template_str = templates.get(req.type.lower())
    if not template_str:
        return {"error": f"Invalid asset type: {req.type}. Must be one of {list(templates.keys())}"}

    custom_prompt = PromptTemplate(template=template_str, input_variables=["context", "question"])
    qa_chain = LLMChain(llm=llm, prompt=custom_prompt)

    # Run chain
    response = qa_chain.run(context=context, question=req.question)
    return {"answer": response}
