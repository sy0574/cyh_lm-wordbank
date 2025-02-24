
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
        // 取消任何正在进行的语音
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
    // 首先确保至少有一个学生回答过问题
    if (Object.keys(studentAnswerCounts).length === 0) {
      return false;
    }
    
    // 检查是否所有学生都完成了指定数量的问题
    const allStudentsCompleted = students.every(student => {
      const answeredQuestions = studentAnswerCounts[student.id] || 0;
      return answeredQuestions >= questionsPerStudent;
    });

    // 检查是否有学生超过了指定的问题数量
    const anyStudentExceeded = students.some(student => {
      const answeredQuestions = studentAnswerCounts[student.id] || 0;
      return answeredQuestions > questionsPerStudent;
    });

    return allStudentsCompleted || anyStudentExceeded;
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
    // 先检查是否应该结束比赛
    if (shouldEndMatch()) {
      navigateToSummary();
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
        setCurrentStudent(selectedStudent);
        setCurrentStudentIndex(nextStudentIndex + 1);
        announceStudent(selectedStudent);
        break;
      }

      nextStudentIndex++;
      attempts++;
    }

    if (!selectedStudent) {
      navigateToSummary();
      return null;
    }

    return selectedStudent;
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
