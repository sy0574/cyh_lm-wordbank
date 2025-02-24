
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface AnswerButtonsProps {
  onAnswer: (correct: boolean) => void;
  disabled: boolean;
}

const AnswerButtons = ({ onAnswer, disabled }: AnswerButtonsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        size="lg"
        onClick={() => onAnswer(false)}
        disabled={disabled}
      >
        <X className="w-4 h-4 mr-2" />
        Incorrect
      </Button>
      <Button size="lg" onClick={() => onAnswer(true)} disabled={disabled}>
        <Check className="w-4 h-4 mr-2" />
        Correct
      </Button>
    </div>
  );
};

export default AnswerButtons;
