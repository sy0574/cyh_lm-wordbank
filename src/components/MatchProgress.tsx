
import { Progress } from "@/components/ui/progress";

interface MatchProgressProps {
  currentWordIndex: number;
  score: number;
  questionsPerStudent: number;
  totalStudents: number;
}

const MatchProgress = ({ 
  currentWordIndex, 
  score,
  questionsPerStudent,
  totalStudents
}: MatchProgressProps) => {
  const totalQuestions = questionsPerStudent * totalStudents;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">
          Word {currentWordIndex + 1} of {totalQuestions}
        </span>
        <span className="text-sm font-medium">
          Score: {score}/{totalQuestions * 200}
        </span>
      </div>
      <Progress value={((currentWordIndex + 1) / totalQuestions) * 100} />
    </div>
  );
};

export default MatchProgress;
