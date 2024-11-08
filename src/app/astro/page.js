"use client";

import { useState, useEffect } from "react";

export default function GeographyRound() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

  useEffect(() => {
    const teamName = localStorage.getItem("teamName");
    const password = localStorage.getItem("password");
    const track = localStorage.getItem("track");

    if (!teamName || !password || !track) {
      window.location.href = "/login";
      return;
    }

    async function fetchQuestion() {
      const response = await fetch(`/api/rounds?round=astronomy`);
      const data = await response.json();

      if (track === "1") {
        setQuestion(data.track1.question);
        setCorrectAnswer(data.track1.answer);
      } else if (track === "2") {
        setQuestion(data.track2.question);
        setCorrectAnswer(data.track2.answer);
      }
    }

    fetchQuestion();
  }, []);

  async function handleSubmit() {
    if (answer === correctAnswer) {
      setScore((prev) => prev + 50);
      setHint("Here's a hint for the next round!");
    } else {
      setScore((prev) => prev - 10);
    }
  }

  return (
    <div>
      <h1>Geography Round</h1>
      <p>Question: {question}</p>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
      <p>Score: {score}</p>
      {hint && <p>Hint: {hint}</p>}
    </div>
  );
}
