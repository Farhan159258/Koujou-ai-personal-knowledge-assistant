import shutil

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File
from services.chunker import chunk_text
from services.file_reader import extract_text
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

    return {
        "message": "Upload successful",
        "chunks_created": len(chunks),
        "preview": chunks[:3]
    }
    