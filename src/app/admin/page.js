"use client";
import { colors } from "@/config/colors";
import { useState } from "react";

export default function AdminPage() {
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [color, setColor] = useState("orange");
  const [totalScore, setTotalScore] = useState(0);
  const [roundNum, setRoundNum] = useState(1);

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
    <div>
      <h2>Admin - Create New Team</h2>
      <form onSubmit={handleCreateTeam}>
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
        <label>
          Color:
          <select value={color} onChange={(e) => setColor(e.target.value)}>
            {colors.map((color) => (
              <option key={color.value} value={color.value}>
                {color.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Create Team</button>
      </form>
    </div>
  );
}
