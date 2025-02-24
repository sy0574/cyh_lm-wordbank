
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Podium from "@/components/Podium";
import WordDisplay from "@/components/WordDisplay";
import AnswerButtons from "@/components/AnswerButtons";
import { useMatchTimer } from "@/hooks/useMatchTimer";
import { useStudentSelection } from "@/hooks/useStudentSelection";
import { useMatchScoring } from "@/hooks/useMatchScoring";
import { MAX_TIME } from "@/utils/scoring";
import { toast } from "@/components/ui/use-toast";

const MatchArena = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { students, wordList, difficulty, questionsPerStudent } = location.state || {};

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordStartTime, setWordStartTime] = useState<number>(Date.now());
  const [results, setResults] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ correct: false, message: "" });
  const [showResultsPopup, setShowResultsPopup] = useState(false);
  const [isMatchComplete, setIsMatchComplete] = useState(false);

  const { timeLeft, potentialPoints } = useMatchTimer(wordStartTime);
  const { score, showPoints, setShowPoints, earnedPoints, updateScores, getRankings } = 
    useMatchScoring(students);
  const { currentStudent, selectNextStudent, updateStudentAnswerCount, studentAnswerCounts } = 
    useStudentSelection(students, questionsPerStudent, score, results, difficulty);

  useEffect(() => {
    if (!wordList || wordList.length === 0 || !students || students.length === 0) {
      console.log("Missing data:", { wordList, students });
      navigate("/");
      return;
    }
    selectNextStudent();
  }, [wordList, students, navigate]);

  const shouldEndMatch = () => {
    const totalAnswers = Object.values(studentAnswerCounts).reduce((sum, count) => sum + count, 0);
    const requiredAnswers = students.length * questionsPerStudent;
    return totalAnswers >= requiredAnswers;
  };

  const handleAnswer = async (isCorrect: boolean) => {
    if (!currentStudent || !wordList[currentWordIndex] || isMatchComplete) return;

    const responseTime = Date.now() - wordStartTime;
    setShowFeedback(true);
    const correct = isCorrect;
    
    const pointsEarned = updateScores(correct, timeLeft, currentStudent.id);
    
    // Update student answer count and check if match should end
    const currentAnswerCount = updateStudentAnswerCount(currentStudent.id);
    const totalAnswers = Object.values(studentAnswerCounts).reduce((sum, count) => sum + count, 0);
    const shouldEnd = totalAnswers + 1 >= students.length * questionsPerStudent;
    
    if (shouldEnd) {
      setIsMatchComplete(true);
    }
    
    setFeedback({
      correct,
      message: correct ? `+${pointsEarned} points!` : "Keep practicing!"
    });

    const newResult = { 
      word: wordList[currentWordIndex].word,
      correct,
      student: currentStudent,
      responseTime,
      pointsEarned,
      answerNumber: results.filter(r => r.student.id === currentStudent.id).length + 1,
      answeredAt: new Date()
    };

    setResults(prev => [...prev, newResult]);

    setTimeout(() => {
      setShowFeedback(false);
      setShowPoints(false);
      
      if (shouldEnd) {
        setShowResultsPopup(true);
        return;
      }
      
      const nextStudent = selectNextStudent();
      
      if (nextStudent === null) {
        setShowResultsPopup(true);
        return;
      }
      
      if (currentWordIndex + 1 < wordList.length) {
        setCurrentWordIndex(prev => prev + 1);
        setWordStartTime(Date.now());
      }
    }, 1500);
  };

  const handleViewResults = () => {
    try {
      const newWindow = window.open("/match-summary", "_blank");
      
      if (!newWindow) {
        // Pop-up was blocked
        toast({
          title: "Pop-up Blocked",
          description: "Please allow pop-ups for this site to open the preview in a new tab. You can also click 'View Results' again to try in the same tab.",
          variant: "destructive",
        });
        
        // Fallback: navigate in same tab
        navigate("/match-summary", {
          state: {
            students,
            score,
            total: results.length,
            results,
            difficulty
          }
        });
      }
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback to same-tab navigation
      navigate("/match-summary", {
        state: {
          students,
          score,
          total: results.length,
          results,
          difficulty
        }
      });
    }
  };

  if (!wordList) {
    return null;
  }

  const rankings = getRankings();
  const totalAnsweredQuestions = Object.values(studentAnswerCounts).reduce((sum, count) => sum + count, 0);
  const totalExpectedQuestions = students.length * questionsPerStudent;
  const displayProgress = isMatchComplete ? totalExpectedQuestions : totalAnsweredQuestions;

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <div className="space-y-8 slide-up">
        <Podium rankings={rankings} />

        {!showResultsPopup && currentStudent && (
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
            currentWordIndex={displayProgress}
            totalQuestions={totalExpectedQuestions}
          />
        )}

        <AnswerButtons
          onAnswer={handleAnswer}
          disabled={showFeedback || isMatchComplete}
          showResultsPopup={showResultsPopup}
          onViewResults={handleViewResults}
        />
      </div>
    </div>
  );
};

export default MatchArena;
