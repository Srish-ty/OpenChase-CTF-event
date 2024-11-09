"use client";

import Image from "next/image";
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

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "background.default",
          textAlign: "center",
          padding: 2,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: "primary.main",
            fontWeight: "bold",
            marginBottom: 2,
          }}
        >
          OpenChase
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "secondary.main",
            fontWeight: "bold",
            marginBottom: 4,
          }}
        >
          Virtual TreasureHunt
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "text.primary",
            marginBottom: 5,
            fontStyle: "italic",
          }}
        >
          Get Ready
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{
            fontWeight: "bold",
            fontSize: "1.2rem",
            padding: "10px 20px",
          }}
          onClick={() => (window.location.href = "/login")}
        >
          Login
        </Button>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            marginTop: 3,
            fontStyle: "italic",
          }}
        >
          By OpencCode and GDSC
        </Typography>
      </Box>
    </ThemeProvider>
  );
}
