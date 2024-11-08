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

      const { group, track } = teamData;

      localStorage.setItem("teamName", teamName);
      localStorage.setItem("password", password);
      localStorage.setItem("track", track);
      localStorage.setItem("teamGroup", group);

      if (group === "red") {
        window.location.href = "/geo";
      } else if (group === "blue") {
        window.location.href = "/astro";
      } else if (group === "green") {
        window.location.href = "/music";
      }
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
