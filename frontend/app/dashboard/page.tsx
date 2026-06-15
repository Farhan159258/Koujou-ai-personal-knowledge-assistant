export default function Dashboard() {
  return (

    <div className="p-8">

      <h1 className="text-4xl font-bold">

        Dashboard

      </h1>

      <div className="mt-8 grid grid-cols-3 gap-4">

        <div className="rounded border p-6">

          Documents

        </div>

        <div className="rounded border p-6">

          Chats

        </div>

        <div className="rounded border p-6">

          Upload

        </div>

      </div>

    </div>

  );
}