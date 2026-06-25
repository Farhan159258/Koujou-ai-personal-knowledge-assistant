import os

import google.generativeai as genai

from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_answer(question, context):

    prompt = f"""
You are Koujou AI.

Use ONLY the supplied context to answer.

Be concise, accurate and well structured.

If the information is unavailable, reply:

Information not available in uploaded documents.

Context:
{context}

Question:
{question}
"""

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Gemini API error: {str(e)}"