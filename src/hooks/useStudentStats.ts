
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

  const processMatchHistory = async (studentIds: string[]): Promise<StudentStats[]> => {
    try {
      // Fetch all match history for the selected student IDs
      const { data: matchHistoryData, error } = await supabase
        .from('match_history')
        .select('*')
        .in('student_id', studentIds);

      if (error) {
        console.error('Error fetching match history:', error);
        throw error;
      }

      console.log(`Found ${matchHistoryData?.length || 0} match history records for students:`, studentIds);

      // Process the match history data
      const formattedResults: MatchResult[] = (matchHistoryData || []).map(result => {
        const student = students.find(s => s.id === result.student_id);
        return {
          word: result.word,
          correct: result.correct,
          student: student || {
            id: result.student_id,
            name: 'Unknown',
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${result.student_id}`,
            class: ''
          },
          responseTime: result.response_time,
          pointsEarned: result.points_earned,
          answerNumber: result.answer_number,
          answeredAt: new Date(result.answered_at)
        };
      }).filter(result => result.student.id); // Filter out results with invalid student IDs

      const filteredResults = filterResultsByTime(formattedResults);
      console.log('Time-filtered results:', filteredResults);

      // Create stats for each student, even if they have no results
      return students
        .filter(student => studentIds.includes(student.id))
        .map(student => {
          const studentResults = filteredResults.filter(r => r.student.id === student.id);
          const correct = studentResults.filter(r => r.correct).length;
          const totalResponseTime = studentResults.reduce(
            (acc, curr) => acc + curr.responseTime,
            0
          );

          return {
            name: student.name,
            avatar: student.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.id}`,
            correct,
            total: studentResults.length,
            averageResponseTime:
              studentResults.length > 0
                ? Math.round(totalResponseTime / studentResults.length)
                : 0,
            words: studentResults.map(r => ({
              word: r.word,
              correct: r.correct,
              responseTime: r.responseTime,
              pointsEarned: r.pointsEarned,
              answerNumber: r.answerNumber,
              answeredAt: r.answeredAt,
            })),
          };
        });
    } catch (error) {
      console.error('Error processing match history:', error);
      throw error;
    }
  };

  const { data: studentStats = [], isLoading: loading } = useQuery({
    queryKey: ['matchHistory', selectedClass, timeFilter],
    queryFn: async () => {
      try {
        // Get relevant student IDs based on selected class
        const studentIds = students
          .filter(s => selectedClass === "all" || s.class === selectedClass)
          .map(s => s.id);

        if (studentIds.length === 0) {
          console.log('No students found for class:', selectedClass);
          return [];
        }

        console.log('Fetching match history for students in class:', selectedClass);
        return await processMatchHistory(studentIds);
      } catch (error) {
        console.error('Error in student stats query:', error);
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
