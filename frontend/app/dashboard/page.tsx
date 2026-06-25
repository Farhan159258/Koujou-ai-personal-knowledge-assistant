"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Dashboard() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    const storedFile = localStorage.getItem("uploadedFile");

    if (storedFile) {
      setUploadedFile(storedFile);
    }
  }, []);

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/upload`,
        formData
      );

      setUploadedFile(file.name);

      localStorage.setItem("uploadedFile", file.name);

      setUploadStatus(response.data.message);

      setFile(null);
    } catch (error) {
      console.error(error);
      setUploadStatus("Upload failed.");
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/ask`,
        {
          question,
        }
      );

      const aiAnswer = response.data.answer;

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: question,
        },
        {
          role: "assistant",
          content: aiAnswer,
        },
      ]);

      setQuestion("");
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Unable to connect to backend.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setQuestion("");
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Koujou AI</h1>

      <p style={{ color: "#666" }}>
        📄 Current Document:{" "}
        <strong>
          {uploadedFile || "No document uploaded"}
        </strong>
      </p>

      <hr style={{ margin: "20px 0" }} />

      <h3>Upload Document</h3>

      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
        />

        <button
          onClick={uploadFile}
          disabled={!file}
        >
          Upload
        </button>
      </div>

      {uploadStatus && (
        <p
          style={{
            color: "green",
            marginBottom: "20px",
          }}
        >
          {uploadStatus}
        </p>
      )}

      <hr style={{ marginBottom: "20px" }} />

      <div
        style={{
          height: "500px",
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "20px",
          background: "#fafafa",
          marginBottom: "20px",
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              textAlign: "center",
              marginTop: "100px",
              color: "#666",
            }}
          >
            <h2>👋 Welcome to Koujou AI</h2>

            <p>Upload a document and start chatting.</p>

            <br />

            <p>Example questions:</p>

            <p>• Summarize this document</p>

            <p>• Explain the main concepts</p>

            <p>• List important points</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent:
                message.role === "user"
                  ? "flex-end"
                  : "flex-start",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                maxWidth: "75%",
                padding: "12px 16px",
                borderRadius: "12px",
                background:
                  message.role === "user"
                    ? "#dbeafe"
                    : "#e5e7eb",
              }}
            >
              <strong>
                {message.role === "user"
                  ? "You"
                  : "Koujou AI"}
              </strong>

              <p
                style={{
                  whiteSpace: "pre-wrap",
                  marginTop: "8px",
                }}
              >
                {message.content}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <p
            style={{
              color: "#666",
              fontStyle: "italic",
            }}
          >
            🤖 Koujou AI is analyzing your document...
          </p>
        )}

        <div ref={messagesEndRef} />
      </div>

      <textarea
        rows={4}
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: "10px",
          fontSize: "16px",
          resize: "none",
        }}
        placeholder="Ask a question about your uploaded document..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            askQuestion();
          }
        }}
      />

      <br />
      <br />

      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={askQuestion}
          disabled={!question.trim() || loading}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>

        <button onClick={clearChat}>
          Clear Chat
        </button>
      </div>
    </div>
  );
}