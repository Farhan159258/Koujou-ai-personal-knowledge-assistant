import chromadb
from sentence_transformers import SentenceTransformer

# Load embedding model once
model = SentenceTransformer("all-MiniLM-L6-v2")

# Create persistent database
client = chromadb.PersistentClient(path="./database")

collection = client.get_or_create_collection(
    name="koujou_documents"
)


def store_chunks(chunks):

    embeddings = model.encode(chunks)

    ids = []

    for i in range(len(chunks)):
        ids.append(f"chunk_{i}")

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings.tolist()
    )

    return len(chunks)