import chromadb
import uuid

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

    for _ in chunks:
        ids.append(str(uuid.uuid4()))

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings.tolist()
    )

    return len(chunks)


def search_documents(query):

    query_embedding = model.encode(query)

    results = collection.query(
        query_embeddings=[query_embedding.tolist()],
        n_results=3
    )

    return results["documents"][0]