
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Podium from "@/components/Podium";
import WordDisplay from "@/components/WordDisplay";
import AnswerButtons from "@/components/AnswerButtons";
import { useMatchTimer } from "@/hooks/useMatchTimer";
import { useStudentSelection } from "@/hooks/useStudentSelection";
import { useMatchScoring } from "@/hooks/useMatchScoring";
import { useMatchFeedback } from "@/hooks/useMatchFeedback";
import { useMatchResults } from "@/hooks/useMatchResults";
import { MatchProgress } from "@/components/match-arena/MatchProgress";
import { FeedbackDisplay } from "@/components/match-arena/FeedbackDisplay";
import { MAX_TIME } from "@/utils/scoring";
import { toast } from "@/components/ui/use-toast";

const MatchArena = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { students, wordList, questionsPerStudent, selectedLanguage } = location.state || {};

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordStartTime, setWordStartTime] = useState<number>(Date.now());

  const { timeLeft, potentialPoints } = useMatchTimer(wordStartTime);
  const { score, showPoints, setShowPoints, earnedPoints, updateScores, getRankings } = 
    useMatchScoring(students);
  const { currentStudent, selectNextStudent, updateStudentAnswerCount, studentAnswerCounts } = 
    useStudentSelection(students, questionsPerStudent, score, [], null);
  const { showFeedback, setShowFeedback, feedback, setFeedback, getStreakFeedback } = 
    useMatchFeedback();
  const { results, showResultsPopup, setShowResultsPopup, isMatchComplete, setIsMatchComplete, saveResult } = 
    useMatchResults();

  useEffect(() => {
    if (!wordList || wordList.length === 0 || !students || students.length === 0) {
      console.log("Missing data:", { wordList, students });
      navigate("/");
      return;
    }

    selectNextStudent();
  }, [wordList, students, navigate, selectNextStudent]);

  const handleAnswer = async (isCorrect: boolean) => {
    if (!currentStudent || !wordList[currentWordIndex] || isMatchComplete) return;

    const responseTime = Date.now() - wordStartTime;
    setShowFeedback(true);
    const correct = isCorrect;
    
    const pointsEarned = updateScores(correct, timeLeft, currentStudent.id);
    const currentAnswerCount = updateStudentAnswerCount(currentStudent.id);
    const totalAnswers = Object.values(studentAnswerCounts).reduce((sum, count) => sum + count, 0);
    const shouldEnd = totalAnswers + 1 >= students.length * questionsPerStudent;
    
    if (shouldEnd) {
      setIsMatchComplete(true);
    }
    
    const streakFeedback = getStreakFeedback(correct);
    setFeedback({
      correct,
      message: streakFeedback.message,
      type: streakFeedback.type
    });

    try {
      await saveResult(
        currentStudent,
        wordList[currentWordIndex].word,
        correct,
        responseTime,
        pointsEarned,
        results.filter(r => r.student.id === currentStudent.id).length + 1,
        currentStudent.category || 'Basic'
      );

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
      }, 2000);
    } catch (error) {
      console.error("Error in handleAnswer:", error);
    }
  };

  const handleViewResults = () => {
    try {
      navigate("/match-summary", {
        state: {
          students,
          score,
          total: results.length,
          results
        },
        replace: true
      });
    } catch (error) {
      console.error("Navigation error:", error);
      toast({
        title: "Navigation Error",
        description: "Unable to navigate to results page. Please try again.",
        variant: "destructive",
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
          <>
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
              selectedLanguage={selectedLanguage}
              chineseDefinition={wordList[currentWordIndex].chineseDefinition}
              partOfSpeech={wordList[currentWordIndex].partOfSpeech}
            />
            <MatchProgress
              currentStudent={currentStudent}
              displayProgress={displayProgress}
              totalExpectedQuestions={totalExpectedQuestions}
            />
            <FeedbackDisplay
              showFeedback={showFeedback}
              feedback={feedback}
            />
          </>
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
