"use client";

import ReactMarkdown from "react-markdown";
import "./dashboard.css";
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

    const userQuestion = question;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/ask`,
        {
          question: userQuestion,
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.answer,
        },
      ]);
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
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>⚡ Koujou AI</h2>

        <p
          style={{
            color: "#666",
            fontSize: "14px",
            marginBottom: "20px",
          }}
        >
          Personal Knowledge Assistant
        </p>

        <div className="document-card">
          <strong>Current Document</strong>

          <p>
            {uploadedFile || "No document uploaded"}
          </p>
        </div>

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
        >
          Upload
        </button>

        {uploadStatus && (
          <p
            style={{
              marginTop: "15px",
              color: "green",
            }}
          >
            {uploadStatus}
          </p>
        )}
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #e5e7eb",
            background: "white",
          }}
        >
          <h2>💬 Chat</h2>
        </div>

        <div className="chat-window">
          {messages.length === 0 && (
            <div
              style={{
                textAlign: "center",
                marginTop: "120px",
                color: "#666",
              }}
            >
              <h2>🚀 Welcome to Koujou AI</h2>

              <p>
                Powered by Gemini + RAG + ChromaDB
              </p>

              <br />

              <p>
                Upload a document and start asking questions.
              </p>

              <br />

              <p>Examples:</p>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                }}
              >
                <li>Summarize this document</li>
                <li>Explain the main concepts</li>
                <li>List key takeaways</li>
                <li>Create interview questions</li>
              </ul>
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
                      ? "#2563eb"
                      : "#ffffff",

                  color:
                    message.role === "user"
                      ? "#ffffff"
                      : "#111827",

                  border:
                    message.role === "assistant"
                      ? "1px solid #e5e7eb"
                      : "none",
                }}
              >
                <strong>
                  {message.role === "user"
                    ? "You"
                    : "Koujou AI"}
                </strong>

                <div
                  style={{
                    marginTop: "8px",
                    lineHeight: "1.6",
                  }}
                >
                  <ReactMarkdown>
                    {message.content}
                  </ReactMarkdown>
                </div>
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

        <div className="input-area">
          <textarea
            rows={4}
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
      </div>
    </div>
  );
}