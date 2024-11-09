// app/admin/login/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Box, Typography } from "@mui/material";
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

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (username === adminUsername && password === adminPassword) {
      localStorage.setItem("isAdminAuthenticated", "true");
      router.push("/admin");
    } else {
      alert("Invalid admin credentials");
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
          Admin Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleLogin}
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
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            Login
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
