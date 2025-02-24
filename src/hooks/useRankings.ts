
import { Student, StudentStats } from "@/types/match";

export const useRankings = (studentStats: StudentStats[], students: Student[]) => {
  const getRankings = () => {
    return studentStats
      .map((stats) => ({
        student: students.find((s) => s.name === stats.name)!,
        score: stats.words.reduce((acc, word) => acc + word.pointsEarned, 0),
        averageResponseTime: stats.averageResponseTime,
      }))
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.averageResponseTime - b.averageResponseTime;
      });
  };

  return {
    getRankings,
  };
};
