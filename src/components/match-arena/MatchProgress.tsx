
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
      <p className="text-sm font-medium text-gray-700">
        Question {displayProgress} of {totalExpectedQuestions}
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${(displayProgress / totalExpectedQuestions) * 100}%` }}
        />
      </div>
    </div>
  );
};

