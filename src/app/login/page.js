"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
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

export default function LoginPage() {
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin() {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teamName, password }),
    });

    if (response.ok) {
      const teamData = await response.json();
      const { color, totalScore, roundNum } = teamData;

      localStorage.setItem("teamName", teamName);
      localStorage.setItem("password", password);
      localStorage.setItem("color", color);
      localStorage.setItem("totalScore", totalScore);
      localStorage.setItem("roundNum", roundNum);

      window.location.href = "/geo";
    } else {
      alert("Invalid login credentials");
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          bgcolor: "background.default",
          color: "text.primary",
          p: 4,
          mt: 8,
        }}
      >
        <Typography variant="h4" color="primary" gutterBottom>
          Login
        </Typography>
        <TextField
          label="Team Name"
          variant="outlined"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          fullWidth
          color="primary"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          color="primary"
          sx={{ mb: 2 }}
        />
        <Button
          onClick={handleLogin}
          variant="contained"
          color="secondary"
          fullWidth
        >
          Login
        </Button>
      </Container>
    </ThemeProvider>
  );
}
