"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch("/api/leaderboard");
        const data = await response.json();
        setLeaderboard(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    }

    fetchLeaderboard();
  }, []);

  return (
    <Container
      maxWidth="sm"
      sx={{
        bgcolor: "#121212",
        color: "white",
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        mt: 5,
      }}
    >
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Leaderboard
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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "aqua", fontWeight: "bold" }}>
                  Team Name
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "aqua", fontWeight: "bold" }}
                >
                  Total Score
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboard.map((team, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: "white" }}>{team.teamName}</TableCell>
                  <TableCell align="right" sx={{ color: "white" }}>
                    {team.totalScore}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
