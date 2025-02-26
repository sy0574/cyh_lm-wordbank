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
    // Add the result to local state immediately
    const timestamp = new Date().toISOString();
    const result: MatchResult = {
      word,
      correct,
      student,
      responseTime,
      pointsEarned,
      answerNumber,
      answeredAt: new Date(timestamp)
    };
    
    setResults(prev => [...prev, result]);
    
    // Maximum number of retry attempts
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let savedSuccessfully = false;
    
    while (retryCount < MAX_RETRIES && !savedSuccessfully) {
      try {
        console.log(`Attempt ${retryCount + 1} to save match result...`);
        
        // Check if user is logged in before saving to Supabase
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          console.log('User not logged in - skipping database save');
          toast({
            title: "Guest Mode",
            description: "Sign in to save your match results!",
            variant: "default",
          });
          return; // Exit early, no need to retry
        }

        // Prepare the payload with proper type conversions
        const payload = {
          student_id: student.id,
          word,
          correct,
          response_time: Math.round(responseTime) || 0, // Ensure it's a number
          points_earned: Math.round(pointsEarned) || 0, // Ensure it's a number
          answer_number: answerNumber || 0, // Ensure it's a number
          difficulty: category || 'default', // Provide a default value
          answered_at: timestamp
        };

        console.log('Saving match result with payload:', payload);
        
        // Use a timeout to prevent hanging requests
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        
        // Actual database operation
        const dbOperation = supabase
          .from('match_history')
          .insert([payload])
          .select('id')
          .single();
        
        // Race the database operation against the timeout
        const raceResult = await Promise.race([
          dbOperation,
          timeoutPromise
        ]);
        
        // Type assertion for the database response
        const { data, error } = raceResult as {
          data: { id: string } | null;
          error: { message: string; code: string } | null;
        };

        if (error) {
          console.error('Database error:', error.message);
          console.error('Error code:', error.code);
          console.error('Error details:', error);
          throw new Error(error.message);
        }

        console.log('Match result saved successfully with ID:', data?.id);
        savedSuccessfully = true;
        
      } catch (error) {
        console.error(`Error saving match result (attempt ${retryCount + 1}):`, error);
        retryCount++;
        
        if (retryCount >= MAX_RETRIES) {
          console.error('Max retry attempts reached. Giving up.');
          toast({
            title: "Error",
            description: error instanceof Error 
              ? `Failed to save match result: ${error.message}` 
              : "Failed to save match result after multiple attempts.",
            variant: "destructive",
          });
          
          // Don't throw the error - this allows the game to continue even if saving fails
          // Just log it and continue
        } else {
          // Wait before retrying (exponential backoff)
          const delay = Math.min(1000 * Math.pow(2, retryCount), 8000);
          console.log(`Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // Return true if saved successfully, false otherwise
    return savedSuccessfully;
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
