
export const MAX_TIME = 5000; // 5 seconds per word
export const BASE_POINTS = 100;
export const MAX_BONUS = 100;

export const calculatePotentialPoints = (timeLeft: number): number => {
  const timeRatio = timeLeft / MAX_TIME;
  const bonus = Math.round(MAX_BONUS * timeRatio);
  return BASE_POINTS + bonus;
};

export const calculatePoints = (correct: boolean, timeLeft: number): number => {
  if (!correct) return 0;
  return calculatePotentialPoints(timeLeft);
};
