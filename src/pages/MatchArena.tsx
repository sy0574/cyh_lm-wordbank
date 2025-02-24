
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { WordData } from "@/data/wordData";

interface Student {
  id: string;
  name: string;
  avatar: string;
}

const MatchArena = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { students, wordList, difficulty } = location.state || {};

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [score, setScore] = useState(0);
  const [wordStartTime, setWordStartTime] = useState<number>(Date.now());
  const [results, setResults] = useState<Array<{
    word: string;
    correct: boolean;
    student: Student;
    responseTime: number;
  }>>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ correct: false, message: "" });

  useEffect(() => {
    if (!wordList || wordList.length === 0 || !students || students.length === 0) {
      console.log("Missing data:", { wordList, students });
      navigate("/");
      return;
    }
    selectNextStudent();
  }, [wordList, students, navigate]);

  const announceStudent = async (student: Student) => {
    try {
      const speech = new SpeechSynthesisUtterance(student.name + "'s turn");
      speech.rate = 0.8;
      speech.pitch = 1;
      window.speechSynthesis.speak(speech);
    } catch (error) {
      console.error("TTS error:", error);
      toast({
        title: "TTS Error",
        description: "Could not announce student name",
        variant: "destructive",
      });
    }
  };

  const selectNextStudent = () => {
    const nextStudent = students[Math.floor(Math.random() * students.length)];
    setCurrentStudent(nextStudent);
    setWordStartTime(Date.now());
    announceStudent(nextStudent);
  };

  const handleAnswer = async (isCorrect: boolean) => {
    if (!currentStudent || !wordList[currentWordIndex]) return;

    const responseTime = Date.now() - wordStartTime;
    setShowFeedback(true);
    const correct = isCorrect;
    
    if (correct) setScore(score + 1);
    
    setFeedback({
      correct,
      message: correct ? "Excellent!" : "Keep practicing!"
    });

    setResults([...results, { 
      word: wordList[currentWordIndex].word,
      correct,
      student: currentStudent,
      responseTime
    }]);

    setTimeout(() => {
      setShowFeedback(false);
      if (currentWordIndex < wordList.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        selectNextStudent();
      } else {
        navigate("/match-summary", {
          state: {
            students,
            score,
            total: wordList.length,
            results: [...results, { 
              word: wordList[currentWordIndex].word,
              correct,
              student: currentStudent,
              responseTime
            }],
            difficulty
          }
        });
      }
    }, 1500);
  };

  if (!wordList || !currentStudent) {
    console.log("Rendering null due to missing data");
    return null;
  }

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <div className="space-y-8 slide-up">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">
              Word {currentWordIndex + 1} of {wordList.length}
            </span>
            <span className="text-sm font-medium">
              Score: {score}/{wordList.length}
            </span>
          </div>
          <Progress value={((currentWordIndex + 1) / wordList.length) * 100} />
        </div>

        <Card className="p-8">
          <div className="text-center space-y-6">
            <div className="flex flex-col items-center justify-center gap-2">
              <img
                src={currentStudent.avatar}
                alt={`${currentStudent.name}'s avatar`}
                className="w-16 h-16 rounded-full"
              />
              <span className="font-medium text-lg">{currentStudent.name}</span>
            </div>
            <h2 className="text-5xl font-bold tracking-tight">
              {wordList[currentWordIndex].word}
            </h2>
            {showFeedback && (
              <div className={`text-xl font-semibold ${feedback.correct ? 'text-accent' : 'text-destructive'}`}>
                {feedback.message}
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleAnswer(false)}
            disabled={showFeedback}
          >
            <X className="w-4 h-4 mr-2" />
            Incorrect
          </Button>
          <Button
            size="lg"
            onClick={() => handleAnswer(true)}
            disabled={showFeedback}
          >
            <Check className="w-4 h-4 mr-2" />
            Correct
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchArena;

