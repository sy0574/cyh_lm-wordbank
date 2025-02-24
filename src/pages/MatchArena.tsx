
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { WordData } from "@/data/wordData";
import Podium from "@/components/Podium";
import MatchProgress from "@/components/MatchProgress";
import WordDisplay from "@/components/WordDisplay";
import AnswerButtons from "@/components/AnswerButtons";
import { Student, MatchResult } from "@/types/match";
import { MAX_TIME, BASE_POINTS, MAX_BONUS, calculatePoints } from "@/utils/scoring";

const MatchArena = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { students, wordList, difficulty, questionsPerStudent } = location.state || {};

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [score, setScore] = useState(0);
  const [wordStartTime, setWordStartTime] = useState<number>(Date.now());
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [potentialPoints, setPotentialPoints] = useState(200);
  const [showPoints, setShowPoints] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ correct: false, message: "" });
  const [studentAnswerCounts, setStudentAnswerCounts] = useState<Record<string, number>>({});
  const [studentScores, setStudentScores] = useState<Record<string, number>>(() =>
    Object.fromEntries(students?.map((student: Student) => [student.id, 0]) || [])
  );

  useEffect(() => {
    if (!wordList || wordList.length === 0 || !students || students.length === 0) {
      console.log("Missing data:", { wordList, students });
      navigate("/");
      return;
    }
    selectNextStudent();
  }, [wordList, students, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Date.now() - wordStartTime;
      const remaining = Math.max(0, MAX_TIME - elapsed);
      setTimeLeft(remaining);
      
      const timeRatio = remaining / MAX_TIME;
      const bonus = Math.round(MAX_BONUS * timeRatio);
      setPotentialPoints(BASE_POINTS + bonus);
    }, 50);

    return () => clearInterval(timer);
  }, [wordStartTime]);

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
    const availableStudents = students.filter(student => 
      (studentAnswerCounts[student.id] || 0) < questionsPerStudent
    );

    if (availableStudents.length === 0) {
      navigate("/match-summary", {
        state: {
          students,
          score,
          total: results.length,
          results,
          difficulty
        }
      });
      return;
    }

    const nextStudent = availableStudents[Math.floor(Math.random() * availableStudents.length)];
    setCurrentStudent(nextStudent);
    setWordStartTime(Date.now());
    setTimeLeft(MAX_TIME);
    setPotentialPoints(200);
    announceStudent(nextStudent);
  };

  const getRankings = () => {
    return Object.entries(studentScores)
      .map(([id, score]) => ({
        student: students.find((s: Student) => s.id === id)!,
        score,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  const handleAnswer = async (isCorrect: boolean) => {
    if (!currentStudent || !wordList[currentWordIndex]) return;

    const responseTime = Date.now() - wordStartTime;
    setShowFeedback(true);
    const correct = isCorrect;
    
    const pointsEarned = calculatePoints(correct, timeLeft);
    if (correct) {
      setScore(score + pointsEarned);
      setEarnedPoints(pointsEarned);
      setShowPoints(true);

      setStudentScores(prev => ({
        ...prev,
        [currentStudent.id]: prev[currentStudent.id] + pointsEarned
      }));
    }
    
    setFeedback({
      correct,
      message: correct ? `+${pointsEarned} points!` : "Keep practicing!"
    });

    setStudentAnswerCounts(prev => ({
      ...prev,
      [currentStudent.id]: (prev[currentStudent.id] || 0) + 1
    }));

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
    console.log("Rendering null due to missing data");
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
