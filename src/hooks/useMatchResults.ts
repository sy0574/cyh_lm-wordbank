
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
    category: string
  ) => {
    try {
      console.log('Creating match result payload...');
      const timestamp = new Date().toISOString();
      
      const payload = {
        student_id: student.id,
        word,
        correct,
        response_time: Math.round(responseTime),
        points_earned: Math.round(pointsEarned),
        answer_number: answerNumber,
        difficulty: category,
        answered_at: timestamp
      };

      console.log('Attempting to save match result with payload:', payload);

      const { data, error } = await supabase
        .from('match_history')
        .insert([payload])
        .select('id')
        .single();

      if (error) {
        console.error('Database error:', error.message);
        console.error('Error code:', error.code);
        console.error('Error details:', error);
        throw new Error(error.message);
      }

      console.log('Match result saved successfully with ID:', data?.id);

      const newResult: MatchResult = {
        word,
        correct,
        student,
        responseTime,
        pointsEarned,
        answerNumber,
        answeredAt: new Date(timestamp)
      };

      setResults(prev => [...prev, newResult]);
    } catch (error) {
      console.error('Error saving match result:', error);
      
      toast({
        title: "Error",
        description: error instanceof Error 
          ? `Failed to save match result: ${error.message}` 
          : "Failed to save match result. Please try again.",
        variant: "destructive",
      });

      throw error;
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
