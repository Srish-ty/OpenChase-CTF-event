"use client";

import { useState, useEffect } from "react";
import rounds from "../../config/rounds";

export default function GeographyRound() {
  const [hint, setHint] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [roundNum, setRoundNum] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedScore = parseInt(localStorage.getItem("totalScore")) || 0;
      const savedRoundNum = parseInt(localStorage.getItem("roundNum")) || 1;
      setScore(savedScore);
      setRoundNum(savedRoundNum);
    }

    const teamName = localStorage.getItem("teamName");
    const color = localStorage.getItem("color");

    if (!teamName || !color) {
      window.location.href = "/login";
      return;
    }

    if (roundNum !== 3) {
      const correctPath = `/${rounds[roundNum]}`;
      window.location.href = correctPath;
      return;
    }

    async function fetchQuestion() {
      try {
        const response = await fetch(`/api/rounds?round=astronomy`);
        const data = await response.json();
        const teamRound = data[color];

        setHint(teamRound.hint);
        setQuestion(teamRound.question);
        setOptions(generateOptions(teamRound.answer));
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching question data!");
      }
    }

    fetchQuestion();
  }, [roundNum]);

  function generateOptions(correctAnswer) {
    const randomOptions = ["Option1", "Option2", "Option3"];
    return [...randomOptions, correctAnswer].sort(() => Math.random() - 0.5);
  }

  async function handleSubmit() {
    const teamName = localStorage.getItem("teamName");
    const color = localStorage.getItem("color");

    const answerCorrect = selectedAnswer === question.answer;
    const newScore = answerCorrect ? score + 50 : score - 20;
    const nextRoundNum = answerCorrect ? roundNum + 1 : roundNum;

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
      localStorage.setItem("totalScore", newScore);
      if (answerCorrect) {
        localStorage.setItem("roundNum", nextRoundNum);
        alert("Answer correct! Moving to the next round.");
        window.location.href = `/${rounds[nextRoundNum]}`;
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
      <h1>Geography Round</h1>
      <p>Hint: {hint}</p>
      <p>Question: {question}</p>
      <select
        value={selectedAnswer}
        onChange={(e) => setSelectedAnswer(e.target.value)}
      >
        <option value="">Select an answer</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      <button onClick={handleSubmit}>Submit</button>
      <p>Score: {score}</p>
    </div>
  );
}
