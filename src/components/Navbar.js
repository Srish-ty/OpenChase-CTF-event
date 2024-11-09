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
  }, []);

  return (
    <nav className="bg-teal-500 py-7 px-20 pl-64 flex flex-row justify-evenly">
      <span>Round: {roundNum}</span>
      <span>Score: {totalScore}</span>
    </nav>
  );
}
