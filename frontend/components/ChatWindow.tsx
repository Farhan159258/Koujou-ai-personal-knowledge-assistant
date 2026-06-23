"use client";

import { useState } from "react";

import Message from "./Message";

import ChatInput from "./ChatInput";

type ChatMessage = {
  sender: "user" | "ai";
  text: string;
};

export default function ChatWindow() {

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  function sendMessage(text: string) {

    setMessages((prev) => [

      ...prev,

      {
        sender: "user",
        text,
      },

    ]);
  }

  return (

    <div className="flex flex-col flex-1">

      <div className="flex-1 p-6 overflow-y-auto">

        {messages.map((msg, index) => (

          <Message

            key={index}

            text={msg.text}

            sender={msg.sender}

          />

        ))}

      </div>

      <ChatInput onSend={sendMessage} />

    </div>
  );
}