"use client";

import { useState } from "react";

type ChatInputProps = {
  onSend: (text: string) => void;
};

export default function ChatInput({
  onSend,
}: ChatInputProps) {

  const [text, setText] = useState("");

  function handleSend() {

    if (!text.trim()) return;

    onSend(text);

    setText("");
  }

  return (

    <div className="flex gap-2 p-4">

      <input

        value={text}

        onChange={(e) =>
          setText(e.target.value)
        }

        className="flex-1 border p-3 rounded"

        placeholder="Ask anything..."

      />

      <button

        onClick={handleSend}

        className="bg-blue-500 text-white px-5 rounded"

      >

        Send

      </button>

    </div>
  );
}