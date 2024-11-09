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
  const [showQuestion, setShowQuestion] = useState(false);

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
        setOptions([
          "Pablo Picasso",
          "John F. Kennedy",
          "Oscar Wilde",
          "Mark Twain",
          "George Eliot",
          "Walt Disney",
        ]);
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

    const answerCorrect = selectedAnswer === answer;
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

  const toggleQuestionVisibility = () => {
    setShowQuestion(!showQuestion);
  };

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
        Astronomy + Music Round
      </Typography>
      <Box
        sx={{
          backgroundColor: "#1e1e1e",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h6">Hint:</Typography>
        <Typography color="aqua">{hint}</Typography>
        <Typography sx={{ marginTop: "10px" }}>
          Solve the puzzle in real life, then submit here. Once done, click
          below:
        </Typography>
        <Button
          variant="outlined"
          onClick={toggleQuestionVisibility}
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": {
              backgroundColor: "#3700b3",
              borderColor: "#3700b3",
            },
            marginTop: "10px",
          }}
        >
          {showQuestion ? "Not Solved Yet" : "Solved"}
        </Button>
      </Box>
      {showQuestion && (
        <Box
          sx={{
            backgroundColor: "#1e1e1e",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <Typography variant="h6">Question:</Typography>
          <Typography color="aqua">Guess the person from sentence</Typography>
          <Typography>
            Who wrote that line. Or whose dialogue is that sentence?
          </Typography>

          <FormControl fullWidth variant="outlined" sx={{ marginTop: "20px" }}>
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
              marginTop: "20px",
            }}
          >
            Submit
          </Button>
        </Box>
      )}
      <Box sx={{ marginTop: "20px", textAlign: "center" }}>
        <Typography variant="h6">Score: {score}</Typography>
      </Box>
    </Container>
  );
}
