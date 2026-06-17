from pypdf import PdfReader


def extract_text(filepath):

    if filepath.endswith(".txt"):

        with open(filepath, "r", encoding="utf-8") as f:
            return f.read()

    elif filepath.endswith(".pdf"):

        reader = PdfReader(filepath)

        text = ""

        for page in reader.pages:
            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

        return text

    else:
        raise ValueError("Unsupported file type")