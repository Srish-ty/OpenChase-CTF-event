"use client";

import { useState, useEffect } from "react";
import rounds from "../../config/rounds";
import {
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#4db6ac" },
    secondary: { main: "#9c27b0" },
    background: { default: "#1e1e1e", paper: "#2e2e2e" },
    text: { primary: "#e0e0e0" },
  },
});

export default function AstroRound() {
  const [hint, setHint] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [roundNum, setRoundNum] = useState();
  const [showQuestion, setShowQuestion] = useState(false); // New state for toggling

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
          body: JSON.stringify({ color, round: "biology" }),
        });

        const data = await response.json();
        const teamRound = data;

        setHint(teamRound.hint);
        setQuestion(teamRound.question);
        setAnswer(teamRound.answer);
        setOptions([
          "ASHOKA",
          "CAESAR",
          "KANISHKA",
          "SENECA",
          "BISMARCK",
          "AUGUSTUS",
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

    console.log("Submitting answer:", selectedAnswer);
    console.log("Correct answer:", answer);

    const answerCorrect = selectedAnswer == answer;
    const newScore = answerCorrect ? score + 50 : score - 20;
    const nextRoundNum = answerCorrect ? 5 : 4;

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
        alert("Incorrect answer. -20 .Try again!");
      }
      setScore(newScore);
    } else {
      alert("Error updating score.");
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: "black",
          color: "text.primary",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          padding: 2,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "primary.main",
            fontWeight: "bold",
            marginBottom: 4,
          }}
        >
          Biology and Ancient History Round
        </Typography>

        <Box
          sx={{
            bgcolor: "grey.900",
            color: "text.primary",
            padding: 3,
            marginBottom: 3,
            width: "100%",
            maxWidth: "500px",
            borderRadius: "8px",
          }}
        >
          <Typography variant="body1" sx={{ marginBottom: 2 }} color="violet">
            Hint:
          </Typography>
          <ul className="py-4 pb-8">
            <li>1. Know the Creature from below link</li>

            <Typography variant="body1">
              2.
              <a
                href={hint}
                className="text-teal-500 underline"
                target="_blank"
              >
                Click here
              </a>
            </Typography>

            <li>
              3. Find the creature in Lawn Space located at the centre of LA
            </li>
            <li>4. Scan QR below it. Recognise the sounds.</li>
            <li>5. Using first letter of each, Guess the Acronym</li>
          </ul>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setShowQuestion((prev) => !prev)}
          >
            {showQuestion ? "Hide Question" : "Show Question"}
          </Button>
        </Box>

        {showQuestion && (
          <div className="bg-zinc-800 rounded-xl w-[80%] px-2 md:px-[30%] py-10 md:py-5">
            <Box
              sx={{
                color: "text.primary",
                padding: 3,
                width: "100%",
                maxWidth: "500px",
                borderRadius: "8px",
              }}
            >
              <Typography variant="body1" color="violet">
                Question:
              </Typography>
              <Typography variant="body1" color="white">
                From the initials of those ancient Egyptian sounds, guess the
                Acronym which gives name of an Emperor
              </Typography>
            </Box>

            <FormControl sx={{ marginBottom: 3, minWidth: 200 }}>
              <InputLabel>Select an answer</InputLabel>
              <Select
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                label="Select an answer"
                sx={{
                  backgroundColor: "background.paper",
                  color: "text.primary",
                  borderRadius: "4px",
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
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              sx={{
                fontWeight: "bold",
                fontSize: "1.2rem",
                padding: "10px 20px",
              }}
            >
              Submit
            </Button>
          </div>
        )}

        <Typography variant="body1" sx={{ marginTop: 4 }}>
          Score: {score}
        </Typography>
      </Box>
    </ThemeProvider>
  );
}
