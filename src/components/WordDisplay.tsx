
import { Student } from "@/types/match";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Sparkles } from "lucide-react";

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
    <div className="relative max-w-xl mx-auto">
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
        
        <Card className="p-6 border-0 relative z-10 backdrop-blur-sm bg-card/90 shadow-lg">
          <div className="text-center space-y-4 relative">
            <div className="flex flex-col items-center justify-center gap-2">
              <button
                onClick={() => setShowDefinition(!showDefinition)}
                className="group relative w-16 h-16 cursor-pointer focus:outline-none transition-transform hover:scale-105"
                title={showDefinition ? "Hide translation" : "Show translation"}
              >
                <svg className="absolute -top-1 -left-1 w-[72px] h-[72px] -rotate-90">
                  <circle
                    cx="36"
                    cy="36"
                    r="32"
                    className="fill-none stroke-muted/50 stroke-[3]"
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
                  className="w-16 h-16 rounded-full relative z-10 transition-opacity group-hover:opacity-90 ring-2 ring-primary/20"
                />
              </button>
              <span className="font-medium text-base text-muted-foreground">{currentStudent.name}</span>
            </div>
            
            <div className="relative min-h-[120px] py-4">
              {partOfSpeech && (
                <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-secondary text-xs font-medium text-secondary-foreground mb-3">
                  {partOfSpeech}
                </div>
              )}
              
              <div className="relative">
                <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                  {displayText}
                </h2>
                {showPoints && earnedPoints > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    className="absolute -top-8 right-1/4 flex items-center gap-1 text-3xl font-bold text-primary"
                  >
                    <Sparkles className="w-5 h-5" />
                    +{earnedPoints}
                  </motion.div>
                )}
              </div>
              
              <AnimatePresence>
                {showDefinition && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-base text-muted-foreground mt-2"
                  >
                    {alternateText}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {showFeedback && feedback.correct === false && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-lg font-semibold text-destructive mt-1 p-2 rounded-lg bg-destructive/10"
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
