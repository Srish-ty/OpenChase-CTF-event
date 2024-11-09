"use client";

import { useState, useEffect } from "react";

export default function CodingRound() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [hint, setHint] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(
    parseInt(localStorage.getItem("totalScore")) || 0
  );
  const [roundNum, setRoundNum] = useState(
    parseInt(localStorage.getItem("roundNum")) || 1
  );

  useEffect(() => {
    const teamName = localStorage.getItem("teamName");
    const password = localStorage.getItem("password");
    const color = localStorage.getItem("color");

    if (!teamName || !password || !color) {
      window.location.href = "/login";
      return;
    }

    if (roundNum !== 2) {
      alert("You must complete the previous round to access this one.");
      window.location.href = "/geo";
      return;
    }

    async function fetchQuestion() {
      try {
        const response = await fetch(`/api/rounds?round=coding`);
        const data = await response.json();

        if (data && data[color]) {
          const { question, answer, hint } = data[color];
          setQuestion(question);
          setAnswer(answer);
          setHint(hint);
        } else {
          alert("Error fetching question data.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching question data!");
      }
    }

    fetchQuestion();
  }, [roundNum]);

  async function handleSubmit() {
    const teamName = localStorage.getItem("teamName");
    const color = localStorage.getItem("color");

    const answerCorrect =
      userAnswer.toLowerCase().trim() === answer.toLowerCase();
    const newScore = answerCorrect ? score + 50 : score - 10;

    const response = await fetch("/api/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamName,
        answerCorrect,
        color,
        roundNum,
      }),
    });

    if (response.ok) {
      if (answerCorrect) {
        alert("Answer correct! Moving to the next round.");
        setRoundNum(roundNum + 1);
        localStorage.setItem("roundNum", roundNum + 1);
        localStorage.setItem("totalScore", newScore);
        window.location.href = "/astro";
      } else {
        alert("Incorrect answer. Try again!");
      }
      setScore(newScore);
    } else {
      alert("Error updating score.");
    }
  }

  return (
    <div>
      <h1>Coding Round</h1>
      <p>Question: {question}</p>
      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
      <p>Score: {score}</p>
      {hint && <p>Hint: {hint}</p>}
    </div>
  );
}
