"use client";

import { useState } from "react";
import axios from "axios";

export default function UploadPage() {

  const [file, setFile] = useState<File | null>(null);

  const uploadFile = async () => {

    if (!file) return;

    const formData = new FormData();

    formData.append(
      "file",
      file
    );

    try {

      await axios.post(
        "http://127.0.0.1:8000/upload",
        formData
      );

      alert("Upload successful");

    } catch (error) {

      console.log(error);

      alert("Upload failed");
    }
  };

  return (

    <div>

      <h1>Upload Document</h1>

      <input

        type="file"

        onChange={(e) => {

          if (e.target.files) {

            setFile(
              e.target.files[0]
            );
          }

        }}

      />

      <button

        onClick={uploadFile}

      >

        Upload

      </button>

    </div>
  );
}