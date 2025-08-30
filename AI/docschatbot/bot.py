from PyPDF2 import PdfReader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from dotenv import load_dotenv
import os

load_dotenv()


google_api_key = os.getenv("GOOGLE_API_KEY")
serper_api_key = os.getenv("SERPER_API_KEY")



pdf_paths = [
    "/content/DISTRIBUTION_HUB[1].pdf",
    "/content/PIPELINE.pdf",
    "/content/Plant_asset.pdf",
    "/content/STORAGE.pdf",
    "docschatbot\hydrogen file.pdf",
    "docschatbot\Harnessing_Green_Hydrogen_V21_DIGITAL_29062022.pdf"



]

raw_text = ""
for path in pdf_paths:
  pdfreader = PdfReader(path)
  for i,page in enumerate(pdfreader.pages):
    content = page.extract_text()
    if content:
      raw_text += content +  "\n"

from posixpath import sep
text_splitter = CharacterTextSplitter(
    separator = "\n",
    chunk_size = 1000,
    chunk_overlap = 200,
    length_function = len,
)
texts = text_splitter.split_text(raw_text) 

embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

document_search = FAISS.from_texts(texts, embeddings)


llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.0)

chain = load_qa_chain(llm, chain_type="stuff")


query = "What is Hydrogen policy?"
docs = document_search.similarity_search(query)

result = chain.run(input_documents=docs, question=query)
print(result)
