"use client";

import { useState, useEffect } from "react";
import { Button, Box, Typography } from "@mui/material";
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

export default function Navbar() {
  const [roundNum, setRoundNum] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // To track login state

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRoundNum = localStorage.getItem("roundNum");
      const storedTotalScore = localStorage.getItem("totalScore");

      if (storedRoundNum) {
        setRoundNum(storedRoundNum);
      }

      if (storedTotalScore) {
        setTotalScore(parseInt(storedTotalScore, 10));
      }

      const teamName = localStorage.getItem("teamName");
      const password = localStorage.getItem("password");
      const isAdminAuthenticated = localStorage.getItem("isAdminAuthenticated");

      if (!teamName && !password && !isAdminAuthenticated) {
        setIsLoggedIn(false);
      }

      const interval = setInterval(() => {
        const newRoundNum = localStorage.getItem("roundNum");
        const newTotalScore = localStorage.getItem("totalScore");

        if (newRoundNum !== roundNum) {
          setRoundNum(newRoundNum);
        }

        if (parseInt(newTotalScore, 10) !== totalScore) {
          setTotalScore(parseInt(newTotalScore, 10));
        }
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [roundNum, totalScore]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "text.primary",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 40px",
          py: 2,
        }}
      >
        {isLoggedIn ? (
          <>
            <Typography variant="body1">Round: {roundNum}</Typography>
            <Typography variant="body1">Score: {totalScore}</Typography>
            <Button
              onClick={logout}
              variant="contained"
              color="primary"
              sx={{
                fontWeight: "bold",
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            onClick={redirectToLogin}
            variant="contained"
            color="primary"
            sx={{
              fontWeight: "bold",
            }}
          >
            Login
          </Button>
        )}
      </Box>
    </ThemeProvider>
  );
}

const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};

const redirectToLogin = () => {
  window.location.href = "/login";
};
