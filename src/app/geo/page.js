"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
  Paper,
  ThemeProvider,
  createTheme,
} from "@mui/material";

export default function GeographyRound() {
  const [hint, setHint] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [roundNum, setRoundNum] = useState(1);
  const [solved, setSolved] = useState(false);

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

    if (roundNum !== 1) {
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
          body: JSON.stringify({ color, round: "geography" }),
        });

        const data = await response.json();
        const teamRound = data;

        setHint(teamRound.hint);
        setQuestion(teamRound.question);
        setAnswer(teamRound.answer);
        setOptions([
          "Blockchain Island",
          "Zug",
          "Token2049",
          "2025",
          "eNaira",
          "Italian",
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
    const nextRoundNum = answerCorrect ? 2 : 1;

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
        alert("Incorrect answer. -20 .Try again!");
      }
      setScore(newScore);
    } else {
      alert("Error updating score.");
    }
  }

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#bb86fc",
      },
      secondary: {
        main: "#03dac6",
      },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Container
        maxWidth="sm"
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          mt: 8,
        }}
      >
        <Typography variant="h4" gutterBottom align="center" color="primary">
          Geography Round
        </Typography>

        {/* Hint Box */}
        <Paper
          sx={{
            p: 3,
            bgcolor: "background.default",
            mb: 4,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Hint:
          </Typography>
          <div className="px-10 py-10">
            <img src={hint || null} width={400} height={200} alt="Hint" />
          </div>
          <Typography variant="body1" color="text.primary" mb={2}>
            Solve the puzzle in real life, then submit here. Once done, click
            below.
          </Typography>
          <Button
            onClick={() => setSolved(!solved)}
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mb: 2 }}
          >
            {solved ? "Not Solved Yet" : "Solved"}
          </Button>
        </Paper>

        {solved && (
          <Paper
            sx={{
              p: 3,
              bgcolor: "background.default",
              mb: 4,
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Question:
            </Typography>
            <Typography variant="body1" color="text.primary" mb={2}>
              {question}
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="answer-select-label" color="primary">
                Select Answer
              </InputLabel>
              <Select
                labelId="answer-select-label"
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                label="Select Answer"
                color="primary"
              >
                <MenuItem value="">Select an answer</MenuItem>
                {options.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        )}

        {solved && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 2 }}
          >
            Submit
          </Button>
        )}

        <Typography variant="h6" align="center">
          Score: {score}
        </Typography>
      </Container>
    </ThemeProvider>
  );
}
