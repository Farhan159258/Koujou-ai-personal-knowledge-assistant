"use client";

import { useState } from "react";

import axios from "axios";

export default function Dashboard() {

  const [question, setQuestion] = useState("");

  const [answer, setAnswer] = useState("");

  const askQuestion = async () => {

    if (!question.trim()) return;

    try {

      const response = await axios.post(

        "http://127.0.0.1:8000/ask",

        {
          question
        }

      );

      setAnswer(
        response.data.answer
      );

    } catch (error) {

      console.log(error);

      setAnswer(
        "Unable to connect to backend"
      );

    }

  };

  return (

    <div style={{padding:"40px"}}>

      <h1>Koujou AI</h1>

      <textarea

        rows={5}

        style={{
          width:"500px"
        }}

        placeholder="Ask a question"

        value={question}

        onChange={(e)=>

          setQuestion(
            e.target.value
          )

        }

      />

      <br/><br/>

      <button

        onClick={askQuestion}

      >

        Ask

      </button>

      <div style={{

        marginTop:"30px"

      }}>

        <h3>Answer</h3>

        <p>{answer}</p>

      </div>

    </div>

  );

}