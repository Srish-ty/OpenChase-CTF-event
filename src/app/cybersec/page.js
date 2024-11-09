"use client";

import { useState, useEffect } from "react";
import rounds from "../../config/rounds";
import {
  Container,
  Typography,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

export default function CyberRound() {
  const [hint, setHint] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [roundNum, setRoundNum] = useState();
  const isCompleted = Boolean(localStorage.getItem("completed"));
  const [completed, setCompleted] = useState(isCompleted);

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

    if (roundNum < 5) {
      const correctPath = `/${rounds[roundNum]}`;
      window.location.href = correctPath;
      return;
    }

    async function fetchQuestion() {
      try {
        const response = await fetch(`/api/rounds`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ color, round: "cybersec" }),
        });

        const data = await response.json();
        const teamRound = data;

        setHint(teamRound.hint);
        setQuestion(teamRound.question);
        setAnswer(teamRound.answer);
        setOptions(["red", "blue", "green", "yellow", "violet", "orange"]);
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

    console.log("Submitting answer:", selectedAnswer);
    console.log("Correct answer:", answer);

    const answerCorrect = selectedAnswer == answer;
    const newScore = answerCorrect ? score + 50 : score - 20;
    const nextRoundNum = answerCorrect ? 6 : 5;

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
        localStorage.setItem("totalScore", newScore);
        alert("Answer correct!  +50 . Well Done.");
        setCompleted(true);
        localStorage.setItem("completed", true);
      } else {
        alert("Incorrect answer. -20 . Try again!");
      }
      setScore(newScore);
    } else {
      alert("Error updating score.");
    }
  }

  return (
    <Container
      style={{
        backgroundColor: "#121212",
        color: "#fff",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Final Round
      </Typography>

      <Box
        sx={{
          backgroundColor: "#1c1c1c",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1rem",
        }}
      >
        <Typography variant="h6" color="violet">
          Hint:
        </Typography>
        <Typography variant="body1" color="white">
          Go to room no. 301.
        </Typography>
      </Box>

      <Box
        sx={{
          backgroundColor: "#1c1c1c",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1rem",
        }}
      >
        <Typography variant="h6" color="aqua">
          Question:
        </Typography>
        <Typography variant="body1" color="white">
          Knock the door. <br />
          Solve the puzzle asked by Goblin inside. Then submit here.
        </Typography>
      </Box>

      <FormControl fullWidth sx={{ marginBottom: "1rem" }}>
        <InputLabel id="answer-select-label" style={{ color: "#fff" }}>
          Select an answer
        </InputLabel>
        <Select
          labelId="answer-select-label"
          value={selectedAnswer}
          label="Select an answer"
          onChange={(e) => setSelectedAnswer(e.target.value)}
          style={{
            color: "#fff",
            backgroundColor: "#333",
            borderRadius: "8px",
          }}
        >
          <MenuItem value="">Select an answer</MenuItem>
          {options.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        style={{ width: "100%", padding: "0.8rem", fontSize: "16px" }}
        disabled={completed}
      >
        Submit
      </Button>

      <Typography
        variant="h6"
        color="textSecondary"
        align="center"
        style={{ marginTop: "1rem", color: "#fff" }}
      >
        Score: {score}
      </Typography>
    </Container>
  );
}
