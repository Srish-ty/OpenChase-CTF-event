"use client";

import { useState, useEffect } from "react";
import rounds from "../../config/rounds";
import {
  Container,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";

export default function CodingRound() {
  const [hint, setHint] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
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

      const teamName = localStorage.getItem("teamName");
      const color = localStorage.getItem("color");

      if (!teamName || !color) {
        window.location.href = "/login";
        return;
      }

      if (savedRoundNum !== 2) {
        const correctPath = `/${rounds[savedRoundNum]}`;
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
            body: JSON.stringify({ color, round: "coding" }),
          });

          const data = await response.json();
          setHint(data.hint);
          setQuestion(data.question);
          setAnswer(data.answer);
          setOptions(["101", "108", "116", "109", "117", "114"]);
        } catch (error) {
          console.error("Error fetching data:", error);
          alert("Error fetching question data!");
        }
      }

      fetchQuestion();
    }
  }, []);

  async function handleSubmit() {
    if (typeof window === "undefined") return;

    const teamName = localStorage.getItem("teamName");
    const color = localStorage.getItem("color");

    const answerCorrect = selectedAnswer == answer;
    const newScore = answerCorrect ? score + 50 : score - 20;
    const nextRoundNum = answerCorrect ? 3 : 2;

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
        alert("Answer correct!  +50. Moving to the next round.");
        window.location.href = `/${rounds[nextRoundNum]}`;
      } else {
        alert("Incorrect answer. -20. Try again!");
      }
      setScore(newScore);
    } else {
      alert("Error updating score.");
    }
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        bgcolor: "#121212",
        color: "white",
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        mt: 8,
      }}
    >
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Coding Round
      </Typography>

      <Box
        sx={{
          bgcolor: "#1e1e1e",
          p: 3,
          borderRadius: 2,
          boxShadow: 1,
          mb: 3,
        }}
      >
        <Typography variant="h6" color="white">
          Hint: {hint}
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: "#1e1e1e",
          p: 3,
          borderRadius: 2,
          boxShadow: 1,
          mb: 3,
        }}
      >
        <Typography variant="h6" color="white">
          Question: {question}
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="answer-select-label" sx={{ color: "white" }}>
            Select Answer
          </InputLabel>
          <Select
            labelId="answer-select-label"
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(e.target.value)}
            label="Select Answer"
            sx={{
              backgroundColor: "#333",
              color: "white",
              "& .MuiSelect-icon": {
                color: "white",
              },
              "& .MuiMenuItem-root": {
                color: "white",
              },
            }}
          >
            <MenuItem value="">Select an answer</MenuItem>
            {options.map((option, index) => (
              <MenuItem key={index} value={option} sx={{ color: "black" }}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 2 }}
        >
          Submit
        </Button>
      </Box>

      <Box
        sx={{
          bgcolor: "#1e1e1e",
          p: 3,
          borderRadius: 2,
          boxShadow: 1,
          mt: 3,
        }}
      >
        <Typography variant="h6" align="center" color="white">
          Score: {score}
        </Typography>
      </Box>
    </Container>
  );
}
