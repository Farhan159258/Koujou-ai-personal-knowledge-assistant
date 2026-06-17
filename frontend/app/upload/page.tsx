"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  async function uploadFile() {
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setMessage(data.message);
    } catch (error) {
      setMessage("Upload failed");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">

      <div className="w-[450px] space-y-6">

        <h1 className="text-4xl font-bold">
          Upload Document
        </h1>

        <input
          type="file"
          onChange={(e) =>
            setFile(
              e.target.files?.[0] ?? null
            )
          }
        />

        <button
          onClick={uploadFile}
          className="rounded bg-black px-6 py-3 text-white"
        >
          Upload
        </button>

        <p>{message}</p>

      </div>

    </main>
  );
}