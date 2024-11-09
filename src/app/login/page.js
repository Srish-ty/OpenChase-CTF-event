"use client";

import { useState } from "react";

export default function LoginPage() {
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");

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
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Team Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
