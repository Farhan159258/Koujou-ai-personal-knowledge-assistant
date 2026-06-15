export default function Login() {
  return (
    <div className="flex h-screen items-center justify-center">

      <div className="w-96 space-y-4">

        <h1 className="text-3xl font-bold">

          Login

        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full rounded border p-3"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded border p-3"
        />

        <button
          className="w-full rounded bg-black p-3 text-white"
        >

          Login

        </button>

      </div>

    </div>
  );
}