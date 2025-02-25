
import { useState } from 'react';
import { MatchResult, Student } from '@/types/match';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useMatchResults = () => {
  const [results, setResults] = useState<MatchResult[]>([]);
  const [showResultsPopup, setShowResultsPopup] = useState(false);
  const [isMatchComplete, setIsMatchComplete] = useState(false);

  const saveResult = async (
    student: Student,
    word: string,
    correct: boolean,
    responseTime: number,
    pointsEarned: number,
    answerNumber: number,
    difficulty: string
  ) => {
    try {
      const { error } = await supabase
        .from('match_history')
        .insert({
          student_id: student.id,
          word: word,
          correct,
          response_time: responseTime,
          points_earned: pointsEarned,
          answer_number: answerNumber,
          difficulty
        });

      if (error) throw error;

      const newResult: MatchResult = {
        word,
        correct,
        student,
        responseTime,
        pointsEarned,
        answerNumber,
        answeredAt: new Date()
      };

      setResults(prev => [...prev, newResult]);
    } catch (error) {
      console.error('Error saving match result:', error);
      toast({
        title: "Error",
        description: "Failed to save match result",
        variant: "destructive",
      });
    }
  };

  return {
    results,
    showResultsPopup,
    setShowResultsPopup,
    isMatchComplete,
    setIsMatchComplete,
    saveResult
  };
};
