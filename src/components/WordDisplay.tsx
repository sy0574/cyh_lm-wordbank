
import { Student } from "@/types/match";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

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
  selectedLanguage?: "English" | "Chinese";
  chineseDefinition?: string;
  partOfSpeech?: string;
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
  selectedLanguage = "English",
  chineseDefinition = "",
  partOfSpeech = "",
}: WordDisplayProps) => {
  const [showDefinition, setShowDefinition] = useState(false);
  const timeProgress = (timeLeft / maxTime) * 100;
  const questionProgress = ((currentWordIndex + 1) / totalQuestions) * 100;
  
  const timerCircumference = 2 * Math.PI * 32;
  const timerStrokeDashoffset = timerCircumference * (1 - timeProgress / 100);
  
  const topBorderLength = 600;
  const borderStrokeDashoffset = topBorderLength * (1 - questionProgress / 100);

  const displayText = selectedLanguage === "Chinese" ? chineseDefinition : word;
  const alternateText = selectedLanguage === "Chinese" ? word : chineseDefinition;

  return (
    <div className="relative">
      <div className="relative">
        <svg className="absolute inset-0 w-full h-full -m-[1px]">
          <line
            x1="0"
            y1="1"
            x2="100%"
            y2="1"
            stroke="hsl(var(--muted))"
            strokeWidth="2"
          />
          <line
            x1="0"
            y1="1"
            x2="100%"
            y2="1"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            style={{
              strokeDasharray: topBorderLength,
              strokeDashoffset: borderStrokeDashoffset,
              transition: 'stroke-dashoffset 0.3s ease',
            }}
          />
        </svg>
        
        <Card className="p-8 border-0 relative z-10">
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
            
            <div className="relative">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
                <span>{partOfSpeech}</span>
              </div>
              <h2 className="text-5xl font-bold tracking-tight">{displayText}</h2>
              <button
                onClick={() => setShowDefinition(!showDefinition)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
                title={showDefinition ? "Hide translation" : "Show translation"}
              >
                {showDefinition ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {showDefinition && (
                <div className="mt-4 text-lg text-muted-foreground">
                  {alternateText}
                </div>
              )}
            </div>

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
    </div>
  );
};

export default WordDisplay;

