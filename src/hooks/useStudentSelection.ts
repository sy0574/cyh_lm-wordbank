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
    if (!student) {
      console.warn("Cannot announce null student");
      return;
    }
    
    console.log("Attempting to announce student:", student.name);

    if (!('speechSynthesis' in window)) {
      console.warn("Browser does not support speech synthesis");
      return;
    }

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Add a small delay to ensure previous speech is fully canceled
      // and UI has updated to show the correct student
      await new Promise(resolve => setTimeout(resolve, 300));

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
    // If there are no students available, end the match
    if (!students || students.length === 0) {
      console.log("No students available");
      setCurrentStudent(null);
      return null;
    }

    // Check if match should end based on question count
    if (shouldEndMatch()) {
      console.log("Match should end, no more students to select");
      setCurrentStudent(null);
      return null;
    }

    // Find students who still need to answer questions
    const availableStudents = students.filter(student => 
      (studentAnswerCounts[student.id] || 0) < questionsPerStudent
    );

    if (availableStudents.length === 0) {
      console.log("No available students");
      setCurrentStudent(null);
      return null;
    }

    let selectedStudent: Student;

    // If there's only one student available, select them
    if (availableStudents.length === 1) {
      selectedStudent = availableStudents[0];
    } else {
      // Try to select a different student than the last one
      const eligibleStudents = availableStudents.filter(
        student => student.id !== lastSelectedStudentId
      );

      if (eligibleStudents.length === 0) {
        // If no eligible students, select randomly from available students
        const randomIndex = Math.floor(Math.random() * availableStudents.length);
        selectedStudent = availableStudents[randomIndex];
      } else {
        // Select randomly from eligible students
        const randomIndex = Math.floor(Math.random() * eligibleStudents.length);
        selectedStudent = eligibleStudents[randomIndex];
      }
    }

    console.log("Selected student:", selectedStudent.name);
    
    // Set the new selected student
    setCurrentStudent(selectedStudent);
    setLastSelectedStudentId(selectedStudent.id);
    
    // Announce the selected student
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
      // 不要立即清除当前学生，让当前学生保持显示直到新学生被选择
      // setCurrentStudent(null);
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

