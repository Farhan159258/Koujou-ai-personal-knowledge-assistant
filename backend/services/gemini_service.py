import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GOOGLE_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def generate_answer(question, context):

    prompt = f"""
    Answer ONLY from the provided context.

    Context:
    {context}

    Question:
    {question}

    If the answer is not found, say:
    'Information not available in uploaded documents.'
    """

    response = model.generate_content(prompt)

    return response.text