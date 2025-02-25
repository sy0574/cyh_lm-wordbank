
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
      console.error("Browser does not support speech synthesis");
      toast({
        title: "TTS Error",
        description: "Your browser does not support text-to-speech",
        variant: "destructive",
      });
      return;
    }

    try {
      // Cancel any ongoing speech and wait a moment
      window.speechSynthesis.cancel();
      await new Promise(resolve => setTimeout(resolve, 100));

      // Create new utterance
      const utterance = new SpeechSynthesisUtterance(student.name);
      
      // Get available voices
      let voices = window.speechSynthesis.getVoices();
      
      // If voices aren't loaded yet, wait for them
      if (voices.length === 0) {
        voices = await new Promise((resolve) => {
          const onVoicesChanged = () => {
            window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
            resolve(window.speechSynthesis.getVoices());
          };
          window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
        });
      }

      // Find an English voice
      const englishVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.localService
      ) || voices[0];

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      // Configure utterance
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.lang = 'en-US';

      // Add event handlers
      utterance.onstart = () => console.log("Started speaking:", student.name);
      utterance.onend = () => console.log("Finished speaking:", student.name);
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        if (event.error !== 'canceled') {  // Ignore canceled errors
          toast({
            title: "TTS Error",
            description: "Failed to announce student name",
            variant: "destructive",
          });
        }
      };

      // Speak the name
      console.log("Speaking:", student.name);
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error("TTS error:", error);
      toast({
        title: "TTS Error",
        description: "Failed to announce student name",
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

    // Filter out students who have completed all their questions
    const availableStudents = students.filter(student => 
      (studentAnswerCounts[student.id] || 0) < questionsPerStudent
    );

    // If there's only one student left, they must be selected regardless
    if (availableStudents.length === 1) {
      const selectedStudent = availableStudents[0];
      setCurrentStudent(selectedStudent);
      setLastSelectedStudentId(selectedStudent.id);
      announceStudent(selectedStudent);
      return selectedStudent;
    }

    // Filter out the last selected student to prevent consecutive selections
    const eligibleStudents = availableStudents.filter(
      student => student.id !== lastSelectedStudentId
    );

    // Randomly select from eligible students
    const randomIndex = Math.floor(Math.random() * eligibleStudents.length);
    const selectedStudent = eligibleStudents[randomIndex];

    if (!selectedStudent) {
      setCurrentStudent(null);
      return null;
    }

    setCurrentStudent(selectedStudent);
    setLastSelectedStudentId(selectedStudent.id);
    announceStudent(selectedStudent);

    return selectedStudent;
  };

  const updateStudentAnswerCount = (studentId: string): number => {
    let newCount = (studentAnswerCounts[studentId] || 0) + 1;
    if (newCount <= questionsPerStudent) {
      setStudentAnswerCounts(prev => ({
        ...prev,
        [studentId]: newCount
      }));
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
