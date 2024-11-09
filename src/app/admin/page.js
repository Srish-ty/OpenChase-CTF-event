// app/admin/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { colors } from "@/config/colors";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
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

export default function AdminPage() {
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [color, setColor] = useState("orange");
  const [totalScore, setTotalScore] = useState(0);
  const [roundNum, setRoundNum] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const isAdminAuthenticated = localStorage.getItem("isAdminAuthenticated");
    if (!isAdminAuthenticated) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamName, password, color, totalScore, roundNum }),
    });

    const data = await res.json();
    if (data.insertedId) {
      alert("Team created successfully!");
      setTeamName("");
      setPassword("");
      setColor("orange");
      setTotalScore(0);
      setRoundNum(1);
    } else {
      alert("Error creating team");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          p: 4,
        }}
      >
        <Typography variant="h4" color="primary" gutterBottom>
          Admin - Create New Team
        </Typography>
        <Box
          component="form"
          onSubmit={handleCreateTeam}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            maxWidth: "400px",
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <TextField
            label="Team Name"
            variant="outlined"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            fullWidth
            color="primary"
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            color="primary"
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel>Color</InputLabel>
            <Select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              label="Color"
              color="primary"
            >
              {colors.map((color) => (
                <MenuItem key={color.value} value={color.value}>
                  {color.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
            sx={{
              mt: 2,
              fontWeight: "bold",
            }}
          >
            Create Team
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
