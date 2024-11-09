"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [roundNum, setRoundNum] = useState(null);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const storedRoundNum = localStorage.getItem("roundNum");
    const storedTotalScore = localStorage.getItem("totalScore");

    if (storedRoundNum) {
      setRoundNum(storedRoundNum);
    }

    if (storedTotalScore) {
      setTotalScore(parseInt(storedTotalScore, 10));
    }

    const interval = setInterval(() => {
      const newRoundNum = localStorage.getItem("roundNum");
      const newTotalScore = localStorage.getItem("totalScore");

      if (newRoundNum !== roundNum) {
        setRoundNum(newRoundNum);
      }

      if (parseInt(newTotalScore, 10) !== totalScore) {
        setTotalScore(parseInt(newTotalScore, 10));
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [roundNum, totalScore]);

  return (
    <nav className="bg-teal-500 py-7 px-20 pl-64 flex flex-row justify-evenly items-center">
      <span>Round: {roundNum}</span>
      <span>Score: {totalScore}</span>
      <button
        onClick={logout}
        className="bg-red-400 text-white px-4 py-2 rounded"
      >
        Logout{" "}
      </button>
    </nav>
  );
}

const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};
