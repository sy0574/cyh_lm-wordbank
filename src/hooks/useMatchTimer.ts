
import { useState, useEffect } from "react";
import { MAX_TIME, BASE_POINTS, MAX_BONUS } from "@/utils/scoring";

export const useMatchTimer = (wordStartTime: number) => {
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [potentialPoints, setPotentialPoints] = useState(200);

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Date.now() - wordStartTime;
      const remaining = Math.max(0, MAX_TIME - elapsed);
      setTimeLeft(remaining);
      
      const timeRatio = remaining / MAX_TIME;
      const bonus = Math.round(MAX_BONUS * timeRatio);
      setPotentialPoints(BASE_POINTS + bonus);
    }, 50);

    return () => clearInterval(timer);
  }, [wordStartTime]);

  return { timeLeft, potentialPoints };
};

