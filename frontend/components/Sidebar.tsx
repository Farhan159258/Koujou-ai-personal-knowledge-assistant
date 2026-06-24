"use client";

import { FaPlus } from "react-icons/fa";

export default function Sidebar() {

  function newChat() {

    localStorage.removeItem(
      "koujou-chat"
    );

    window.location.reload();
  }

  return (

    <div className="w-64 bg-gray-900 text-white h-screen p-4">

      <button

        onClick={newChat}

        className="w-full bg-gray-700 p-3 rounded"

      >

        <div className="flex items-center justify-center gap-2">

          <FaPlus />

          New Chat

        </div>

      </button>

    </div>

  );
}