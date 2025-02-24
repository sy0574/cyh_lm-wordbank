
import { useState } from "react";
import { Student } from "@/types/match";
import { calculatePoints } from "@/utils/scoring";

export const useMatchScoring = (students: Student[]) => {
  const [score, setScore] = useState(0);
  const [studentScores, setStudentScores] = useState<Record<string, number>>(() =>
    Object.fromEntries(students?.map(student => [student.id, 0]) || [])
  );
  const [showPoints, setShowPoints] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const updateScores = (correct: boolean, timeLeft: number, studentId: string) => {
    const pointsEarned = calculatePoints(correct, timeLeft);
    if (correct) {
      setScore(score + pointsEarned);
      setEarnedPoints(pointsEarned);
      setShowPoints(true);

      setStudentScores(prev => ({
        ...prev,
        [studentId]: prev[studentId] + pointsEarned
      }));
    }
    return pointsEarned;
  };

  const getRankings = () => {
    return Object.entries(studentScores)
      .map(([id, score]) => ({
        student: students.find(s => s.id === id)!,
        score,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  return {
    score,
    showPoints,
    setShowPoints,
    earnedPoints,
    updateScores,
    getRankings
  };
};

