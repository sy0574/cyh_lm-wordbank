
import { useState } from 'react';
import { Feedback } from '@/types/match';

export const useMatchFeedback = () => {
  const [correctStreak, setCorrectStreak] = useState(0);
  const [incorrectStreak, setIncorrectStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({ 
    correct: false, 
    message: "", 
    type: undefined 
  });

  const getStreakFeedback = (correct: boolean): { message: string; type: 'streak' | 'warning' | 'normal' } => {
    if (correct) {
      const newStreak = correctStreak + 1;
      setCorrectStreak(newStreak);
      setIncorrectStreak(0);

      if (newStreak >= 3) {
        return {
          message: "Amazing streak! You're on fire! 🔥",
          type: 'streak'
        };
      }
    } else {
      const newStreak = incorrectStreak + 1;
      setCorrectStreak(0);
      setIncorrectStreak(newStreak);

      if (newStreak >= 2) {
        const messages = [
          "Don't worry, even Einstein made mistakes! 🧠",
          "Keep going! Success is stumbling from failure to failure! 💪",
          "Every master was once a disaster! You've got this! 🌟"
        ];
        return {
          message: messages[Math.floor(Math.random() * messages.length)],
          type: 'warning'
        };
      }
    }
    return { message: "", type: 'normal' };
  };

  return {
    showFeedback,
    setShowFeedback,
    feedback,
    setFeedback,
    getStreakFeedback
  };
};
