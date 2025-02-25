
import { useState, useEffect } from "react";
import { Student, StudentStats, MatchResult } from "@/types/match";
import { TIME_FILTERS, TimeFilter } from "@/components/match-summary/TimeFilter";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useStudentStats = (students: Student[]) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(TIME_FILTERS.ALL);
  const [studentStats, setStudentStats] = useState<StudentStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchHistory = async () => {
      try {
        const studentIds = students.map(s => s.id);
        const { data, error } = await supabase
          .from('match_history')
          .select('*')
          .in('student_id', studentIds);

        if (error) {
          throw error;
        }

        // 转换数据格式
        const formattedResults: MatchResult[] = data.map(result => ({
          word: result.word,
          correct: result.correct,
          student: students.find(s => s.id === result.student_id)!,
          responseTime: result.response_time,
          pointsEarned: result.points_earned,
          answerNumber: result.answer_number,
          answeredAt: new Date(result.answered_at)
        }));

        // 根据时间过滤数据
        const filteredResults = filterResultsByTime(formattedResults);

        // 计算每个学生的统计数据
        const stats: StudentStats[] = students.map((student) => {
          const studentResults = filteredResults.filter((r) => r.student.id === student.id);
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
              answeredAt: r.answeredAt,
            })),
          };
        });

        setStudentStats(stats);
      } catch (error) {
        console.error('Error fetching match history:', error);
        toast({
          title: "Error",
          description: "Failed to load match history data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMatchHistory();
  }, [students, timeFilter]); // 当学生列表或时间过滤器改变时重新获取数据

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

  return {
    studentStats,
    timeFilter,
    setTimeFilter,
    loading
  };
};
