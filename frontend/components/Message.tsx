type MessageProps = {
  text: string;
  sender: "user" | "ai";
};

export default function Message({
  text,
  sender,
}: MessageProps) {

  return (

    <div
      className={`my-4 ${
        sender === "user"
          ? "text-right"
          : "text-left"
      }`}
    >

      <div
        className={`inline-block px-4 py-3 rounded-lg ${
          sender === "user"
            ? "bg-blue-500 text-white"
            : "bg-gray-300"
        }`}
      >

        {text}

      </div>

    </div>

  );
}