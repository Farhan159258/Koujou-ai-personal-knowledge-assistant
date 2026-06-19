import shutil

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File
from services.chunker import chunk_text
from services.file_reader import extract_text
from services.vector_store import store_chunks, search_documents
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {"message": "Koujou AI backend running"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    allowed_extensions = [".pdf", ".txt"]

    if not any(file.filename.lower().endswith(ext) for ext in allowed_extensions):
        return {"error": "Only PDF and TXT files are supported"}

    filepath = f"uploads/{file.filename}"

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text(filepath)

    chunks = chunk_text(text)

    stored = store_chunks(chunks)

    return {
        "message": "Upload successful",
        "chunks_created": len(chunks),
        "stored_in_database": stored,
        "preview": chunks[:3]
}


@app.get("/ask")
async def ask_question(query: str):

    results = search_documents(query)

    return {
        "question": query,
        "results": results
    }
    