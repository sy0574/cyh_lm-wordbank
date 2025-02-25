
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface WordContentProps {
  displayText: string;
  alternateText: string;
  showDefinition: boolean;
  showPoints: boolean;
  earnedPoints: number;
  partOfSpeech?: string;
}

const WordContent = ({ 
  displayText, 
  alternateText, 
  showDefinition, 
  showPoints, 
  earnedPoints,
  partOfSpeech 
}: WordContentProps) => {
  return (
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
  );
};

export default WordContent;
