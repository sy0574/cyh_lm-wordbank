
import { Student } from "@/types/match";
import { Timer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
          <img
            src={currentStudent.avatar}
            alt={`${currentStudent.name}'s avatar`}
            className="w-16 h-16 rounded-full"
          />
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
        <Progress value={(timeLeft / maxTime) * 100} className="w-full mt-4" />
      </div>
    </Card>
  );
};

export default WordDisplay;
