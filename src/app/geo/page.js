"use client";

import { useState, useEffect } from "react";

export default function GeographyRound() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [track, setTrack] = useState("");
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    const teamName = localStorage.getItem("teamName");
    const password = localStorage.getItem("password");
    const track = localStorage.getItem("track");
    console.log("track", track);

    if (!teamName || !password || !track) {
      window.location.href = "/login";
      return;
    }

    setTrack(track);
    setTeamName(teamName);

    async function fetchQuestion() {
      try {
        const response = await fetch(`/api/rounds?round=geography`);
        const data = await response.json();
        console.log("Fetched Data:", data);

        if (track === "1") {
          setQuestion(data.track1.question);
          setCorrectAnswer(data.track1.answer);
        } else if (track === "2") {
          setQuestion(data.track2.question);
          setCorrectAnswer(data.track2.answer);
        }

        alert("Data fetched successfully!");
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching question data!");
      }
    }

    fetchQuestion();
  }, [track]);

  async function handleSubmit() {
    const answerCorrect = answer === correctAnswer;

    try {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamName,
          answerCorrect,
          track,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(answerCorrect ? "Correct Answer!" : "Wrong Answer!");
        setScore(data.newScore);
        setHint("Here's a hint for the next round!");
        localStorage.setItem(
          "checkpoints",
          JSON.stringify(data.newCheckpoints)
        );

        if (answerCorrect) {
          if (track === "1") {
            window.location.href = "/astro"; // Go to next track
          } else if (track === "2") {
            window.location.href = "/music"; // Go to next track
          }
        }
      } else {
        alert("Error updating score.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting answer.");
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
