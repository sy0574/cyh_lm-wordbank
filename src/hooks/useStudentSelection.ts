
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
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(student.name + "'s turn");
        speech.rate = 0.8;
        speech.pitch = 1;
        window.speechSynthesis.speak(speech);
      }
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
    return students.every(student => 
      (studentAnswerCounts[student.id] || 0) >= questionsPerStudent
    );
  };

  const selectNextStudent = () => {
    if (shouldEndMatch()) {
      setCurrentStudent(null);
      return null;
    }

    let nextStudentIndex = currentStudentIndex;
    let attempts = 0;
    let selectedStudent: Student | null = null;

    while (attempts < students.length && !selectedStudent) {
      if (nextStudentIndex >= students.length) {
        nextStudentIndex = 0;
      }

      const candidateStudent = students[nextStudentIndex];
      const studentQuestionCount = studentAnswerCounts[candidateStudent.id] || 0;

      if (studentQuestionCount < questionsPerStudent) {
        selectedStudent = candidateStudent;
        break;
      }

      nextStudentIndex++;
      attempts++;
    }

    if (!selectedStudent) {
      setCurrentStudent(null);
      return null;
    }

    setCurrentStudent(selectedStudent);
    setCurrentStudentIndex(nextStudentIndex + 1);
    announceStudent(selectedStudent);

    return selectedStudent;
  };

  const updateStudentAnswerCount = (studentId: string) => {
    setStudentAnswerCounts(prev => {
      const newCount = (prev[studentId] || 0) + 1;
      if (newCount <= questionsPerStudent) {
        return {
          ...prev,
          [studentId]: newCount
        };
      }
      return prev;
    });
  };

  return {
    currentStudent,
    selectNextStudent,
    updateStudentAnswerCount,
    studentAnswerCounts
  };
};
