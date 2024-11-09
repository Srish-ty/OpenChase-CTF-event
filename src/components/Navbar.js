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
    <nav>
      <ul>
        <li>Round: {roundNum}</li>
        <li>Score: {totalScore}</li>
      </ul>
    </nav>
  );
}
