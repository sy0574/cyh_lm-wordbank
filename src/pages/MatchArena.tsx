import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Podium from "@/components/Podium";
import WordDisplay from "@/components/WordDisplay";
import AnswerButtons from "@/components/AnswerButtons";
import { useMatchTimer } from "@/hooks/useMatchTimer";
import { useStudentSelection } from "@/hooks/useStudentSelection";
import { useMatchScoring } from "@/hooks/useMatchScoring";
import { useMatchFeedback } from "@/hooks/useMatchFeedback";
import { useMatchResults } from "@/hooks/useMatchResults";
import { MAX_TIME } from "@/utils/scoring";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const MatchArena = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { students, wordList, questionsPerStudent, selectedLanguage } = location.state || {};
  const [isGuest, setIsGuest] = useState(true);
  const initializedRef = useRef(false);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordStartTime, setWordStartTime] = useState<number>(Date.now());

  const { timeLeft, potentialPoints } = useMatchTimer(wordStartTime);
  const { score, showPoints, setShowPoints, earnedPoints, updateScores, getRankings } = 
    useMatchScoring(students);
  const { currentStudent, selectNextStudent, updateStudentAnswerCount, studentAnswerCounts } = 
    useStudentSelection(students, questionsPerStudent, score, [], null);
  const { getStreakFeedback } = useMatchFeedback();
  const { results, showResultsPopup, setShowResultsPopup, isMatchComplete, setIsMatchComplete, saveResult } = 
    useMatchResults();

  useEffect(() => {
    if (!wordList || wordList.length === 0 || !students || students.length === 0) {
      console.log("Missing data:", { wordList, students });
      navigate("/");
      return;
    }

    // 确保只在第一次加载时选择学生
    if (!initializedRef.current && !currentStudent) {
      console.log("Initializing first student");
      initializedRef.current = true;
      
      // 短暂延迟选择第一个学生，确保组件完全加载
      setTimeout(() => {
        const firstStudent = selectNextStudent();
        console.log("First student selected:", firstStudent?.name);
      }, 100);
    }

    // Check authentication status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsGuest(!session);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsGuest(!session);
    });

    return () => subscription.unsubscribe();
  }, [wordList, students, navigate, selectNextStudent, currentStudent]);

  const handleAnswer = async (isCorrect: boolean) => {
    if (!currentStudent || !wordList[currentWordIndex] || isMatchComplete) return;

    const responseTime = Date.now() - wordStartTime;
    const correct = isCorrect;
    
    const pointsEarned = updateScores(correct, timeLeft, currentStudent.id);
    const currentAnswerCount = updateStudentAnswerCount(currentStudent.id);
    const totalAnswers = Object.values(studentAnswerCounts).reduce((sum, count) => sum + count, 0);
    const shouldEnd = totalAnswers + 1 >= students.length * questionsPerStudent;
    
    if (shouldEnd) {
      setIsMatchComplete(true);
    }
    
    const streakFeedback = getStreakFeedback(correct);
    
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

      // 显示当前学生的反馈
      setShowPoints(true);

      // 使用一个临时变量保存当前回答问题的学生ID
      const answeredStudentId = currentStudent.id;

      setTimeout(() => {
        // 重置反馈动画
        setShowPoints(false);
        
        if (shouldEnd) {
          setShowResultsPopup(true);
          return;
        }
        
        // 选择下一个学生
        const nextStudent = selectNextStudent();
        
        if (nextStudent === null) {
          setShowResultsPopup(true);
          return;
        }
        
        // 确保已选择了新学生，更新UI
        if (currentWordIndex + 1 < wordList.length) {
          setCurrentWordIndex(prev => prev + 1);
          setWordStartTime(Date.now());
        }
      }, 2000);
    } catch (error) {
      console.error("Error in handleAnswer:", error);
    }
  };

  const handleSignInClick = () => {
    navigate("/auth");
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
      {isGuest && (
        <div className="bg-accent/10 p-4 rounded-lg mb-6 flex items-center justify-between">
          <p className="text-sm text-accent">
            You're in guest mode. Sign in to save your match results!
          </p>
          <Button variant="outline" size="sm" onClick={handleSignInClick}>
            Sign In
          </Button>
        </div>
      )}

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
            showFeedback={false}
            feedback={{correct: false, message: "", type: undefined}}
            currentWordIndex={displayProgress}
            totalQuestions={totalExpectedQuestions}
            selectedLanguage={selectedLanguage}
            chineseDefinition={wordList[currentWordIndex].chineseDefinition}
            partOfSpeech={wordList[currentWordIndex].partOfSpeech}
          />
        )}

        <AnswerButtons
          onAnswer={handleAnswer}
          disabled={isMatchComplete}
          showResultsPopup={showResultsPopup}
          onViewResults={handleViewResults}
        />
      </div>
    </div>
  );
};

export default MatchArena;
