
import { Student } from "@/types/match";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface WordDisplayProps {
  currentStudent: Student;
  word: string;
  timeLeft: number;
  maxTime: number;
  potentialPoints: number;
  showPoints: boolean;
  earnedPoints: number;
  showFeedback: boolean;
  feedback: {
    correct: boolean;
    message: string;
  };
  currentWordIndex: number;
  totalQuestions: number;
}

const WordDisplay = ({
  currentStudent,
  word,
  timeLeft,
  maxTime,
  showPoints,
  earnedPoints,
  showFeedback,
  feedback,
  currentWordIndex,
  totalQuestions,
}: WordDisplayProps) => {
  const timeProgress = (timeLeft / maxTime) * 100;
  const questionProgress = ((currentWordIndex + 1) / totalQuestions) * 100;
  
  // Timer circle dimensions
  const timerCircumference = 2 * Math.PI * 32;
  const timerStrokeDashoffset = timerCircumference * (1 - timeProgress / 100);
  
  // Progress circle dimensions (larger for the card)
  const progressCircumference = 2 * Math.PI * 160; // Larger radius for card border
  const progressStrokeDashoffset = progressCircumference * (1 - questionProgress / 100);

  return (
    <div className="relative">
      {/* Progress circle around the card */}
      <svg className="absolute -top-4 -left-4 w-[calc(100%+32px)] h-[calc(100%+32px)] -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="160"
          className="fill-none stroke-muted stroke-[4]"
        />
        <circle
          cx="50%"
          cy="50%"
          r="160"
          className="fill-none stroke-primary stroke-[4]"
          style={{
            strokeDasharray: progressCircumference,
            strokeDashoffset: progressStrokeDashoffset,
            transition: 'stroke-dashoffset 0.3s ease',
          }}
        />
      </svg>
      
      <Card className="p-8 relative z-10">
        <div className="text-center space-y-6 relative">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative w-16 h-16">
              <svg className="absolute -top-1 -left-1 w-[72px] h-[72px] -rotate-90">
                <circle
                  cx="36"
                  cy="36"
                  r="32"
                  className="fill-none stroke-muted stroke-[3]"
                />
                <circle
                  cx="36"
                  cy="36"
                  r="32"
                  className="fill-none stroke-primary stroke-[3]"
                  style={{
                    strokeDasharray: timerCircumference,
                    strokeDashoffset: timerStrokeDashoffset,
                    transition: 'stroke-dashoffset 0.1s linear',
                  }}
                />
              </svg>
              <img
                src={currentStudent.avatar}
                alt={`${currentStudent.name}'s avatar`}
                className="w-16 h-16 rounded-full relative z-10"
              />
            </div>
            <span className="font-medium text-lg">{currentStudent.name}</span>
          </div>
          <h2 className="text-5xl font-bold tracking-tight">{word}</h2>
          <AnimatePresence>
            {showPoints && earnedPoints > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold text-accent"
              >
                +{earnedPoints}
              </motion.div>
            )}
            {showFeedback && feedback.correct === false && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-xl font-semibold text-destructive"
              >
                {feedback.message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
};

export default WordDisplay;
