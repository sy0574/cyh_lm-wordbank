
import { Student } from "@/types/match";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import StudentAvatar from "./word-display/StudentAvatar";
import FeedbackEffect from "./word-display/FeedbackEffect";
import WordContent from "./word-display/WordContent";

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
    type?: 'normal' | 'streak' | 'warning';
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
        
        <Card className="p-6 border-0 relative z-10 backdrop-blur-sm bg-card/90 shadow-lg overflow-hidden">
          <div className="text-center space-y-4 relative">
            <StudentAvatar
              student={currentStudent}
              timerProgress={timeProgress}
              onToggleDefinition={() => setShowDefinition(!showDefinition)}
            />
            
            <WordContent
              displayText={displayText}
              alternateText={alternateText}
              showDefinition={showDefinition}
              showPoints={showPoints}
              earnedPoints={earnedPoints}
              partOfSpeech={partOfSpeech}
            />

            <FeedbackEffect
              showFeedback={showFeedback}
              feedback={feedback}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WordDisplay;
