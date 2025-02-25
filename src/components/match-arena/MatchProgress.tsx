
import React from 'react';
import { Student } from '@/types/match';

interface MatchProgressProps {
  currentStudent: Student | null;
  displayProgress: number;
  totalExpectedQuestions: number;
}

export const MatchProgress: React.FC<MatchProgressProps> = ({
  currentStudent,
  displayProgress,
  totalExpectedQuestions,
}) => {
  if (!currentStudent) return null;

  return (
    <div className="mt-4 text-center">
      <p className="text-sm text-gray-600">
        Question {displayProgress} of {totalExpectedQuestions}
      </p>
    </div>
  );
};
