"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/upload`,
        formData
      );

      localStorage.setItem("uploadedFile", file.name);

      setStatus(`✅ ${response.data.message}`);
    } catch (error) {
      console.error(error);

      setStatus("❌ Upload failed.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Upload Document</h1>

      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            setFile(e.target.files[0]);
          }
        }}
      />

      <br />
      <br />

      <button
        onClick={uploadFile}
        disabled={!file}
        style={{
          padding: "12px 24px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Upload
      </button>

      {file && (
        <p
          style={{
            marginTop: "20px",
          }}
        >
          Selected file: <strong>{file.name}</strong>
        </p>
      )}

      {status && (
        <p
          style={{
            marginTop: "20px",
            fontWeight: "bold",
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
}