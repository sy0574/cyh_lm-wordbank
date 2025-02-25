
import { Feedback } from "@/types/match";
import { motion } from "framer-motion";
import { PartyPopper, Stars } from "lucide-react";

interface FeedbackEffectProps {
  showFeedback: boolean;
  feedback: Feedback;
}

const FeedbackEffect = ({ showFeedback, feedback }: FeedbackEffectProps) => {
  if (!showFeedback || !feedback.type) return null;

  if (feedback.type === 'streak') {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              repeat: 2,
            }}
          >
            <PartyPopper className="w-16 h-16 text-primary" />
          </motion.div>
        </div>
        <div className="absolute inset-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                width: 4,
                height: 4,
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 200],
                y: [0, (Math.random() - 0.5) * 200],
                opacity: [1, 0],
              }}
              transition={{
                duration: 1,
                ease: "easeOut",
                delay: i * 0.1,
              }}
            >
              <Stars className="w-4 h-4 text-primary" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (feedback.type === 'warning') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute inset-x-0 bottom-0 flex justify-center"
      >
        <div className="bg-secondary/80 backdrop-blur-sm rounded-lg px-4 py-2 text-secondary-foreground">
          {feedback.message}
        </div>
      </motion.div>
    );
  }

  return null;
};

export default FeedbackEffect;
