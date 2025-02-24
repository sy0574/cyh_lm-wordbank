
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { WordData } from "@/data/wordData";
import Podium from "@/components/Podium";
import MatchProgress from "@/components/MatchProgress";
import WordDisplay from "@/components/WordDisplay";
import AnswerButtons from "@/components/AnswerButtons";
import { MatchResult } from "@/types/match";
import { useMatchTimer } from "@/hooks/useMatchTimer";
import { useStudentSelection } from "@/hooks/useStudentSelection";
import { useMatchScoring } from "@/hooks/useMatchScoring";

const MatchArena = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { students, wordList, difficulty, questionsPerStudent } = location.state || {};

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordStartTime, setWordStartTime] = useState<number>(Date.now());
  const [results, setResults] = useState<MatchResult[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ correct: false, message: "" });

  const { timeLeft, potentialPoints } = useMatchTimer(wordStartTime);
  const { score, showPoints, setShowPoints, earnedPoints, updateScores, getRankings } = 
    useMatchScoring(students);
  const { currentStudent, selectNextStudent, updateStudentAnswerCount } = 
    useStudentSelection(students, questionsPerStudent, score, results, difficulty);

  useEffect(() => {
    if (!wordList || wordList.length === 0 || !students || students.length === 0) {
      console.log("Missing data:", { wordList, students });
      navigate("/");
      return;
    }
    selectNextStudent();
  }, [wordList, students, navigate]);

  const handleAnswer = async (isCorrect: boolean) => {
    if (!currentStudent || !wordList[currentWordIndex]) return;

    const responseTime = Date.now() - wordStartTime;
    setShowFeedback(true);
    const correct = isCorrect;
    
    const pointsEarned = updateScores(correct, timeLeft, currentStudent.id);
    updateStudentAnswerCount(currentStudent.id);
    
    setFeedback({
      correct,
      message: correct ? `+${pointsEarned} points!` : "Keep practicing!"
    });

    const newResult = { 
      word: wordList[currentWordIndex].word,
      correct,
      student: currentStudent,
      responseTime,
      pointsEarned
    };

    setResults([...results, newResult]);

    setTimeout(() => {
      setShowFeedback(false);
      setShowPoints(false);
      
      const nextWordIndex = currentWordIndex + 1;
      if (nextWordIndex < wordList.length) {
        setCurrentWordIndex(nextWordIndex);
        setWordStartTime(Date.now());
        selectNextStudent();
      } else {
        navigate("/match-summary", {
          state: {
            students,
            score,
            total: results.length + 1,
            results: [...results, newResult],
            difficulty
          }
        });
      }
    }, 1500);
  };

  if (!wordList || !currentStudent) {
    return null;
  }

  const rankings = getRankings();

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <div className="space-y-8 slide-up">
        <MatchProgress 
          currentWordIndex={currentWordIndex}
          score={score}
          questionsPerStudent={questionsPerStudent}
          totalStudents={students?.length || 0}
        />

        <Podium rankings={rankings} />

        <WordDisplay
          currentStudent={currentStudent}
          word={wordList[currentWordIndex].word}
          timeLeft={timeLeft}
          maxTime={MAX_TIME}
          potentialPoints={potentialPoints}
          showPoints={showPoints}
          earnedPoints={earnedPoints}
          showFeedback={showFeedback}
          feedback={feedback}
        />

        <AnswerButtons
          onAnswer={handleAnswer}
          disabled={showFeedback}
        />
      </div>
    </div>
  );
};

export default MatchArena;

