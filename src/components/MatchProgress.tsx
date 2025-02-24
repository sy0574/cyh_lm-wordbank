
import { Progress } from "@/components/ui/progress";

interface MatchProgressProps {
  currentWordIndex: number;
  questionsPerStudent: number;
  totalStudents: number;
}

const MatchProgress = ({ 
  currentWordIndex,
  questionsPerStudent,
  totalStudents
}: MatchProgressProps) => {
  const totalQuestions = questionsPerStudent * totalStudents;
  
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        Word {currentWordIndex + 1} of {totalQuestions}
      </span>
      <Progress 
        value={((currentWordIndex + 1) / totalQuestions) * 100} 
        className="h-2" 
      />
    </div>
  );
};

export default MatchProgress;
