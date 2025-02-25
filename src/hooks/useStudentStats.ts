
import { useState, useEffect } from "react";
import { Student, StudentStats, MatchResult } from "@/types/match";
import { TIME_FILTERS, TimeFilter } from "@/components/match-summary/TimeFilter";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

export const useStudentStats = (students: Student[], selectedClass: string) => {
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
    // Get all students from the selected class or all students if 'all' is selected
    const relevantStudents = students.filter(
      student => selectedClass === "all" || student.class === selectedClass
    );

    console.log('Processing match history for students:', relevantStudents);
    console.log('Selected class:', selectedClass);
    console.log('Raw match history data:', data);

    const formattedResults: MatchResult[] = data.map(result => ({
      word: result.word,
      correct: result.correct,
      student: relevantStudents.find(s => s.id === result.student_id) || {
        id: result.student_id,
        name: 'Unknown',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${result.student_id}`,
        class: ''
      },
      responseTime: result.response_time,
      pointsEarned: result.points_earned,
      answerNumber: result.answer_number,
      answeredAt: new Date(result.answered_at)
    })).filter(result => result.student); // Only keep results where we found a matching student

    const filteredResults = filterResultsByTime(formattedResults);
    console.log('Filtered results:', filteredResults);

    return relevantStudents.map((student) => {
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
    queryKey: ['matchHistory', selectedClass, timeFilter],
    queryFn: async () => {
      try {
        // Get student IDs for the selected class
        const studentIds = students
          .filter(s => selectedClass === "all" || s.class === selectedClass)
          .map(s => s.id);

        console.log('Fetching match history for student IDs:', studentIds);
        
        if (studentIds.length === 0) {
          console.log('No students found for class:', selectedClass);
          return [];
        }

        const { data, error } = await supabase
          .from('match_history')
          .select('*')
          .in('student_id', studentIds);

        if (error) {
          console.error('Error fetching match history:', error);
          throw error;
        }

        console.log(`Found ${data?.length || 0} match history records`);
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
