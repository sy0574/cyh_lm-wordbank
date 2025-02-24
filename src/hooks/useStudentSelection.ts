
import { useState } from "react";
import { Student, MatchResult } from "@/types/match";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export const useStudentSelection = (
  students: Student[],
  questionsPerStudent: number,
  score: number,
  results: MatchResult[],
  difficulty: string
) => {
  const navigate = useNavigate();
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [studentAnswerCounts, setStudentAnswerCounts] = useState<Record<string, number>>({});
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

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

  const shouldEndMatch = () => {
    return Object.values(studentAnswerCounts).every(count => count >= questionsPerStudent);
  };

  const navigateToSummary = () => {
    navigate("/match-summary", {
      state: {
        students,
        score,
        total: results.length,
        results,
        difficulty
      }
    });
  };

  const selectNextStudent = () => {
    if (shouldEndMatch()) {
      navigateToSummary();
      return;
    }

    let nextStudentIndex = currentStudentIndex;
    let attempts = 0;

    while (attempts < students.length) {
      if (nextStudentIndex >= students.length) {
        nextStudentIndex = 0;
      }

      const nextStudent = students[nextStudentIndex];
      const studentQuestionCount = studentAnswerCounts[nextStudent.id] || 0;

      if (studentQuestionCount < questionsPerStudent) {
        setCurrentStudent(nextStudent);
        setCurrentStudentIndex(nextStudentIndex + 1);
        announceStudent(nextStudent);
        return nextStudent;
      }

      nextStudentIndex++;
      attempts++;
    }

    navigateToSummary();
  };

  const updateStudentAnswerCount = (studentId: string) => {
    setStudentAnswerCounts(prev => ({
      ...prev,
      [studentId]: (prev[studentId] || 0) + 1
    }));
  };

  return {
    currentStudent,
    selectNextStudent,
    updateStudentAnswerCount,
    studentAnswerCounts
  };
};

