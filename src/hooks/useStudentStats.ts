import { useState, useEffect } from "react";
import { Student, StudentStats, MatchResult } from "@/types/match";
import { TIME_FILTERS, TimeFilter } from "@/components/match-summary/TimeFilter";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

export const useStudentStats = (students: Student[], selectedClass: string) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(TIME_FILTERS.ALL);
  const [lastProcessedClass, setLastProcessedClass] = useState<string>(selectedClass);
  const [classStudents, setClassStudents] = useState<Student[]>(students || []);

  // Update class students when students array or selectedClass changes
  useEffect(() => {
    if (selectedClass !== lastProcessedClass) {
      console.log(`Class changed from ${lastProcessedClass} to ${selectedClass}, triggering refetch`);
      setLastProcessedClass(selectedClass);
    }
    
    // Filter students for the selected class
    const relevantStudents = students.filter(s => 
      selectedClass === "all" || s.class === selectedClass
    );
    
    console.log(`useStudentStats: Filtered ${relevantStudents.length} students for class ${selectedClass} from ${students.length} total students`);
    setClassStudents(relevantStudents);
  }, [students, selectedClass, lastProcessedClass]);

  // Additional safety query to directly get students if needed
  const { data: directClassStudents = [], refetch: refetchDirectStudents } = useQuery({
    queryKey: ['direct-class-students', selectedClass],
    queryFn: async () => {
      try {
        if (selectedClass === "all") {
          console.log(`useStudentStats: Directly fetching all students`);
          const { data, error } = await supabase
            .from('students')
            .select('*');
          
          if (error) throw error;
          console.log(`useStudentStats: Directly found ${data?.length || 0} students`);
          return data || [];
        } else {
          console.log(`useStudentStats: Directly fetching students for class ${selectedClass}`);
          const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('class', selectedClass);
          
          if (error) throw error;
          console.log(`useStudentStats: Directly found ${data?.length || 0} students in class ${selectedClass}`);
          return data || [];
        }
      } catch (error) {
        console.error('Error directly fetching students:', error);
        return [];
      }
    },
    enabled: true,
  });

  // Combine both sources of students
  const effectiveStudents = classStudents.length > 0 ? classStudents : directClassStudents;

  // Force refetch of direct students when class changes
  useEffect(() => {
    refetchDirectStudents();
  }, [selectedClass, refetchDirectStudents]);

  const filterResultsByTime = (results: MatchResult[]) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekDate = new Date(now);
    const startOfWeek = new Date(weekDate.setDate(weekDate.getDate() - weekDate.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    console.log(`Time filtering with filter: ${timeFilter}`);
    console.log(`- Start of day: ${startOfDay.toISOString()}`);
    console.log(`- Start of week: ${startOfWeek.toISOString()}`);
    console.log(`- Start of month: ${startOfMonth.toISOString()}`);

    return results.filter(result => {
      if (!result.answeredAt) return false;
      
      const resultDate = result.answeredAt instanceof Date ? 
        result.answeredAt : 
        new Date(result.answeredAt);
      
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

  interface MatchHistoryRecord {
    student_id: string;
    word: string;
    correct: boolean;
    response_time: number;
    points_earned: number;
    answer_number: number;
    answered_at: string;
  }

  const fetchMatchHistory = async (studentIds: string[]): Promise<MatchHistoryRecord[]> => {
    try {
      console.log(`Fetching match history for students:`, studentIds);
      
      const { data, error } = await supabase
        .from('match_history')
        .select('*')
        .in('student_id', studentIds);

      if (error) {
        console.error('Error fetching match history:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} match history records`);
      return data || [];
    } catch (error) {
      console.error('Error in fetchMatchHistory:', error);
      return [];
    }
  };

  const processMatchHistory = async (studentIds: string[]): Promise<StudentStats[]> => {
    try {
      if (studentIds.length === 0) {
        console.log('No students to fetch match history for');
        return [];
      }

      // Fetch match history data
      const matchHistoryData = await fetchMatchHistory(studentIds);
      console.log(`Processing ${matchHistoryData.length} match history records for class: ${selectedClass}`);

      // Need to use effectiveStudents here to ensure we have the right student data
      const formattedResults: MatchResult[] = matchHistoryData
        .map(result => {
          const student = effectiveStudents.find(s => s.id === result.student_id);
          if (!student) {
            console.log('Student not found for ID:', result.student_id);
            return null;
          }
          return {
            word: result.word,
            correct: result.correct,
            student: student,
            responseTime: result.response_time,
            pointsEarned: result.points_earned,
            answerNumber: result.answer_number,
            answeredAt: new Date(result.answered_at || Date.now())
          };
        })
        .filter((result): result is MatchResult => result !== null);

      const filteredResults = filterResultsByTime(formattedResults);
      console.log(`After time filtering (${timeFilter}): ${filteredResults.length} results`);

      // Use effectiveStudents instead of students
      return effectiveStudents.map(student => {
        const studentResults = filteredResults.filter(r => r.student.id === student.id);
        const correct = studentResults.filter(r => r.correct).length;
        const totalResponseTime = studentResults.reduce(
          (acc, curr) => acc + curr.responseTime,
          0
        );

        const stats = {
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
        
        console.log(`Stats for student ${student.name}: ${stats.total} entries, ${stats.correct} correct`);
        return stats;
      });
    } catch (error) {
      console.error('Error processing match history:', error);
      toast({
        title: "Error",
        description: "Failed to process match history data",
        variant: "destructive",
      });
      return [];
    }
  };

  const { data: studentStats = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['matchHistory', selectedClass, timeFilter, effectiveStudents.length],
    queryFn: async () => {
      try {
        console.log(`Executing matchHistory query for class: ${selectedClass}, timeFilter: ${timeFilter}`);
        
        if (effectiveStudents.length === 0) {
          console.log('No students found for selected class:', selectedClass);
          return [];
        }

        const studentIds = effectiveStudents.map(s => s.id);
        console.log('Processing match history for students:', studentIds);
        
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
    enabled: true,
    staleTime: 0, // Don't cache this data
  });

  // Force refetch when class or time filter changes
  useEffect(() => {
    console.log(`Refetching due to change in: class=${selectedClass} or timeFilter=${timeFilter}`);
    refetch();
  }, [selectedClass, timeFilter, effectiveStudents, refetch]);

  return {
    studentStats,
    timeFilter,
    setTimeFilter,
    loading,
    refetch
  };
};

