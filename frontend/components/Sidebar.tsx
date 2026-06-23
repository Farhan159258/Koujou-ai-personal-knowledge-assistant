import { FaPlus, FaCog } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4">

      <button className="w-full bg-gray-700 p-3 rounded mb-6 flex items-center justify-center gap-2">

        <FaPlus />

        New Chat

      </button>

      <div className="space-y-2">

        <div className="bg-gray-800 p-3 rounded">

          Chat 1

        </div>

        <div className="bg-gray-800 p-3 rounded">

          Chat 2

        </div>

      </div>

      <div className="absolute bottom-5">

        <button className="flex items-center gap-2">

          <FaCog />

          Settings

        </button>

      </div>

    </div>
  );
}