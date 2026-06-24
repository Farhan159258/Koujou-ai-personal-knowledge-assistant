"use client";

import { useEffect, useState } from "react";

import Message from "./Message";
import ChatInput from "./ChatInput";

type ChatMessage = {
  sender: "user" | "ai";
  text: string;
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("koujou-chat");

    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "koujou-chat",
      JSON.stringify(messages)
    );
  }, [messages]);

  async function sendMessage(text: string) {
    const userMessage = {
      sender: "user" as const,
      text,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setTyping(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/ask",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            question: text,
          }),
        }
      );

      const data = await response.json();

      setMessages((prev) => [
        ...prev,

        {
          sender: "ai",
          text: data.answer,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,

        {
          sender: "ai",
          text: "Unable to reach backend",
        },
      ]);
    }

    setTyping(false);
  }

  return (
    <div className="flex flex-col flex-1">

      <div className="flex-1 p-6 overflow-y-auto">

        {messages.map(
          (msg, index) => (

            <Message
              key={index}
              text={msg.text}
              sender={msg.sender}
            />

          )
        )}

        {typing && (
          <div className="my-4">

            <div className="inline-block bg-gray-300 px-4 py-3 rounded-lg">

              Typing...

            </div>

          </div>
        )}
      </div>

      <ChatInput onSend={sendMessage} />

    </div>
  );
}