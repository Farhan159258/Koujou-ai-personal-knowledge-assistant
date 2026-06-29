export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-6">
        Koujou AI
      </h1>

      <button className="w-full bg-blue-600 p-2 rounded">
        + New Chat
      </button>

      <div className="mt-6">
        <h2 className="font-semibold">
          Documents
        </h2>
      </div>
    </div>
  );
}