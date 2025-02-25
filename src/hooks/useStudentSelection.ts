
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
  const [studentAnswerCounts, setStudentAnswerCounts] = useState<Record<string, number>>({});
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [lastSelectedStudentId, setLastSelectedStudentId] = useState<string | null>(null);

  const announceStudent = async (student: Student) => {
    console.log("Attempting to announce student:", student.name);

    if (!('speechSynthesis' in window)) {
      console.warn("Browser does not support speech synthesis");
      return;
    }

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      await new Promise(resolve => setTimeout(resolve, 100));

      // Create and configure utterance
      const utterance = new SpeechSynthesisUtterance(student.name);
      
      // Get available voices
      let voices = speechSynthesis.getVoices();
      
      // Wait for voices to load if needed
      if (voices.length === 0) {
        await new Promise<SpeechSynthesisVoice[]>((resolve) => {
          const voicesChangedHandler = () => {
            voices = speechSynthesis.getVoices();
            speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
            resolve(voices);
          };
          speechSynthesis.addEventListener('voiceschanged', voicesChangedHandler);
        });
      }

      // Try to find a suitable English voice
      const preferredVoice = voices.find(voice => 
        voice.lang.includes('en') && !voice.name.includes('Test')
      );

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Configure speech parameters
      utterance.rate = 0.9;  // Slightly slower
      utterance.pitch = 1;
      utterance.volume = 1;

      console.log("Speaking:", student.name);
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.warn("Speech synthesis error:", error);
    }
  };

  const shouldEndMatch = () => {
    return students.every(student => 
      (studentAnswerCounts[student.id] || 0) >= questionsPerStudent
    );
  };

  const selectNextStudent = () => {
    // 重要: 如果已经选择了当前学生，就不要重新选择
    if (currentStudent) {
      console.log("Current student already selected:", currentStudent.name);
      return currentStudent;
    }

    if (shouldEndMatch()) {
      console.log("Match should end, no more students to select");
      setCurrentStudent(null);
      return null;
    }

    const availableStudents = students.filter(student => 
      (studentAnswerCounts[student.id] || 0) < questionsPerStudent
    );

    if (availableStudents.length === 0) {
      console.log("No available students");
      setCurrentStudent(null);
      return null;
    }

    if (availableStudents.length === 1) {
      const selectedStudent = availableStudents[0];
      setCurrentStudent(selectedStudent);
      setLastSelectedStudentId(selectedStudent.id);
      announceStudent(selectedStudent);
      return selectedStudent;
    }

    const eligibleStudents = availableStudents.filter(
      student => student.id !== lastSelectedStudentId
    );

    if (eligibleStudents.length === 0) {
      const selectedStudent = availableStudents[0];
      setCurrentStudent(selectedStudent);
      setLastSelectedStudentId(selectedStudent.id);
      announceStudent(selectedStudent);
      return selectedStudent;
    }

    const randomIndex = Math.floor(Math.random() * eligibleStudents.length);
    const selectedStudent = eligibleStudents[randomIndex];

    setCurrentStudent(selectedStudent);
    setLastSelectedStudentId(selectedStudent.id);
    announceStudent(selectedStudent);

    return selectedStudent;
  };

  const updateStudentAnswerCount = (studentId: string): number => {
    const newCount = (studentAnswerCounts[studentId] || 0) + 1;
    if (newCount <= questionsPerStudent) {
      setStudentAnswerCounts(prev => ({
        ...prev,
        [studentId]: newCount
      }));
      // 当学生回答完一个问题后，清除当前学生，这样下一轮才会选择新学生
      setCurrentStudent(null);
      return newCount;
    }
    return studentAnswerCounts[studentId] || 0;
  };

  return {
    currentStudent,
    selectNextStudent,
    updateStudentAnswerCount,
    studentAnswerCounts
  };
};

