
import { useState, useEffect } from "react";
import { Student, StudentStats, MatchResult } from "@/types/match";
import { TIME_FILTERS, TimeFilter } from "@/components/match-summary/TimeFilter";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

export const useStudentStats = (students: Student[]) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(TIME_FILTERS.ALL);

  const filterResultsByTime = (results: MatchResult[]) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return results.filter(result => {
      const resultDate = new Date(result.answeredAt);
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

  const processMatchHistory = (data: any[]): StudentStats[] => {
    const formattedResults: MatchResult[] = data.map(result => ({
      word: result.word,
      correct: result.correct,
      student: {
        ...students.find(s => s.id === result.student_id)!,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${result.student_id}`
      },
      responseTime: result.response_time,
      pointsEarned: result.points_earned,
      answerNumber: result.answer_number,
      answeredAt: new Date(result.answered_at)
    }));

    const filteredResults = filterResultsByTime(formattedResults);

    return students.map((student) => {
      const studentResults = filteredResults.filter((r) => r.student.id === student.id);
      const correct = studentResults.filter((r) => r.correct).length;
      const totalResponseTime = studentResults.reduce(
        (acc, curr) => acc + curr.responseTime,
        0
      );

      return {
        name: student.name,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${student.id}`,
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
          answeredAt: r.answeredAt,
        })),
      };
    });
  };

  const { data: studentStats = [], isLoading: loading } = useQuery({
    queryKey: ['matchHistory', students.map(s => s.id).join(','), timeFilter],
    queryFn: async () => {
      try {
        const studentIds = students.map(s => s.id);
        const { data, error } = await supabase
          .from('match_history')
          .select('*')
          .in('student_id', studentIds);

        if (error) {
          throw error;
        }

        return processMatchHistory(data || []);
      } catch (error) {
        console.error('Error fetching match history:', error);
        toast({
          title: "Error",
          description: "Failed to load match history data",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: students.length > 0,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in garbage collection for 30 minutes
  });

  return {
    studentStats,
    timeFilter,
    setTimeFilter,
    loading
  };
};
