// app/login/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Correct import for App Router

export default function LoginPage() {
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamName, password }),
    });
    const data = await res.json();

    if (data.success) {
      router.push(`/round1?group=${data.group}`);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Team Login</h2>
      <form onSubmit={handleLogin}>
        <label>
          Team Name:
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
