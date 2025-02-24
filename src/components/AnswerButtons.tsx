
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface AnswerButtonsProps {
  onAnswer: (correct: boolean) => void;
  disabled: boolean;
  showResultsPopup: boolean;
  onViewResults: () => void;
}

const AnswerButtons = ({ 
  onAnswer, 
  disabled, 
  showResultsPopup,
  onViewResults 
}: AnswerButtonsProps) => {
  return (
    <AnimatePresence>
      {showResultsPopup ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
        >
          <Card className="w-[300px]">
            <CardHeader>
              <CardTitle>Assessment Complete!</CardTitle>
              <CardDescription>
                All students have completed their questions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={onViewResults}
              >
                View Results
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => onAnswer(false)}
            disabled={disabled}
          >
            <X className="w-4 h-4 mr-2" />
            Incorrect
          </Button>
          <Button 
            size="lg" 
            onClick={() => onAnswer(true)} 
            disabled={disabled}
          >
            <Check className="w-4 h-4 mr-2" />
            Correct
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnswerButtons;
