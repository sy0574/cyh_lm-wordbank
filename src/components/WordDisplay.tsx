
import { Student } from "@/types/match";
import { Timer } from "lucide-react";
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
}

const WordDisplay = ({
  currentStudent,
  word,
  timeLeft,
  maxTime,
  potentialPoints,
  showPoints,
  earnedPoints,
  showFeedback,
  feedback,
}: WordDisplayProps) => {
  const progress = (timeLeft / maxTime) * 100;
  const circumference = 2 * Math.PI * 32; // Circle radius is 32
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <Card className="p-8">
      <div className="text-center space-y-6 relative">
        <div className="absolute top-0 right-0 p-4 flex items-center gap-2">
          <Timer className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            Potential Points: {potentialPoints}
          </span>
        </div>
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
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-accent"
            >
              +{earnedPoints}
            </motion.div>
          )}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`text-xl font-semibold ${
                feedback.correct ? "text-accent" : "text-destructive"
              }`}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default WordDisplay;
