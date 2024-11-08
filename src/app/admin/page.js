// app/admin/page.js
"use client";
import { useState } from "react";

export default function AdminPage() {
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [group, setGroup] = useState("red");

  const handleCreateTeam = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamName, password, group }),
    });

    const data = await res.json();
    if (data.insertedId) {
      alert("Team created successfully!");
      setTeamName("");
      setPassword("");
      setGroup("red");
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
          Group:
          <select value={group} onChange={(e) => setGroup(e.target.value)}>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
          </select>
        </label>
        <button type="submit">Create Team</button>
      </form>
    </div>
  );
}
