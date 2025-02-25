
import { useState, useEffect } from "react";
import { Student, StudentStats, MatchResult } from "@/types/match";
import { TIME_FILTERS, TimeFilter } from "@/components/match-summary/TimeFilter";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useStudentStats = (students: Student[], results: MatchResult[]) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(TIME_FILTERS.ALL);
  const [historicalResults, setHistoricalResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const studentIds = students.map(s => s.id);
        const { data, error } = await supabase
          .from('match_history')
          .select('*')
          .in('student_id', studentIds);

        if (error) {
          throw error;
        }

        const formattedResults: MatchResult[] = data.map(result => ({
          word: result.word,
          correct: result.correct,
          student: students.find(s => s.id === result.student_id)!,
          responseTime: result.response_time,
          pointsEarned: result.points_earned,
          answerNumber: result.answer_number,
          answeredAt: new Date(result.answered_at)
        }));

        setHistoricalResults(formattedResults);
      } catch (error) {
        console.error('Error fetching historical data:', error);
        toast({
          title: "Error",
          description: "Failed to load historical match data",
          variant: "destructive",
        });
      } finally {
        setLoading = false;
      }
    };

    fetchHistoricalData();
  }, [students]);

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

  // Combine current session results with historical results
  const allResults = [...results, ...historicalResults];

  const studentStats: StudentStats[] = students.map((student) => {
    const studentResults = filterResultsByTime(
      allResults.filter((r) => r.student.id === student.id)
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
    loading
  };
};
