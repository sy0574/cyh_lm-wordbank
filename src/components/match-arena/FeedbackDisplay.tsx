
import React from 'react';
import { Feedback } from '@/types/match';

interface FeedbackDisplayProps {
  showFeedback: boolean;
  feedback: Feedback;
}

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({
  showFeedback,
  feedback,
}) => {
  if (!showFeedback) return null;

  const feedbackClass = feedback.correct ? 'text-green-600' : 'text-red-600';
  const feedbackTypeClass = feedback.type === 'streak' ? 'text-yellow-600' : feedbackClass;

  return (
    <div className={`mt-4 text-center ${feedbackTypeClass}`}>
      {feedback.message && <p className="text-lg font-semibold">{feedback.message}</p>}
    </div>
  );
};
