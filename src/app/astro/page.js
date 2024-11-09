"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import rounds from "../../config/rounds";

export default function AstroRound() {
  const [hint, setHint] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [roundNum, setRoundNum] = useState();

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

    if (roundNum < 3) {
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
          body: JSON.stringify({ color, round: "astronomy" }),
        });

        const data = await response.json();
        const teamRound = data;

        setHint(teamRound.hint);
        setQuestion(teamRound.question);
        setAnswer(teamRound.answer);
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

    console.log("Submitting answer:", selectedAnswer);
    console.log("Correct answer:", answer);

    const answerCorrect = selectedAnswer == answer;
    const newScore = answerCorrect ? score + 50 : score - 20;
    const nextRoundNum = answerCorrect ? 4 : 3;

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
    <Container
      maxWidth="sm"
      sx={{
        backgroundColor: "#121212",
        color: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" align="center" sx={{ marginBottom: "20px" }}>
        Geography Round
      </Typography>
      <Box sx={{ marginBottom: "10px" }}>
        <Typography variant="h6">Hint:</Typography>
        <Typography>{hint}</Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Typography variant="h6">Question:</Typography>
        <Typography>{question}</Typography>
      </Box>
      <FormControl fullWidth variant="outlined" sx={{ marginBottom: "20px" }}>
        <InputLabel sx={{ color: "white" }}>Select an answer</InputLabel>
        <Select
          value={selectedAnswer}
          onChange={(e) => setSelectedAnswer(e.target.value)}
          label="Select an answer"
          sx={{
            backgroundColor: "#1e1e1e",
            color: "white",
            "& .MuiSvgIcon-root": { color: "white" },
          }}
        >
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
        fullWidth
        sx={{
          backgroundColor: "#6200ea",
          color: "white",
          "&:hover": {
            backgroundColor: "#3700b3",
          },
        }}
      >
        Submit
      </Button>
      <Box sx={{ marginTop: "20px", textAlign: "center" }}>
        <Typography variant="h6">Score: {score}</Typography>
      </Box>
    </Container>
  );
}
