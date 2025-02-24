
import { useState } from "react";
import { Student, StudentStats, MatchResult } from "@/types/match";
import { TIME_FILTERS, TimeFilter } from "@/components/match-summary/TimeFilter";

export const useStudentStats = (students: Student[], results: MatchResult[]) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(TIME_FILTERS.ALL);

  const filterResultsByTime = (results: MatchResult[]) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return results.filter(result => {
      const resultDate = new Date(result.answeredAt || Date.now());
      switch (timeFilter) {
        case TIME_FILTERS.TODAY:
          return resultDate >= startOfDay;
        case TIME_FILTERS.THIS_WEEK:
          return resultDate >= startOfWeek;
        case TIME_FILTERS.THIS_MONTH:
          return resultDate >= startOfMonth;
        default:
          return true;
      }
    });
  };

  const studentStats: StudentStats[] = students.map((student) => {
    const studentResults = filterResultsByTime(
      results.filter((r) => r.student.id === student.id)
    );
    const correct = studentResults.filter((r) => r.correct).length;
    const totalResponseTime = studentResults.reduce(
      (acc, curr) => acc + curr.responseTime,
      0
    );

    return {
      name: student.name,
      avatar: student.avatar,
      correct,
      total: studentResults.length,
      averageResponseTime:
        studentResults.length > 0
          ? Math.round(totalResponseTime / studentResults.length)
          : 0,
      words: studentResults.map((r) => ({
        word: r.word,
        correct: r.correct,
        responseTime: r.responseTime,
        pointsEarned: r.pointsEarned,
        answerNumber: r.answerNumber,
        answeredAt: r.answeredAt || new Date(),
      })),
    };
  });

  return {
    studentStats,
    timeFilter,
    setTimeFilter,
  };
};

