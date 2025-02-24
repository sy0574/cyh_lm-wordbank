
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Book, GraduationCap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { wordData, WordData } from "@/data/wordData";
import { getUniqueClasses, getStudentsByClass } from "@/data/studentData";
import { DifficultySelect } from "./PreMatchSetup/DifficultySelect";
import { ClassSelect } from "./PreMatchSetup/ClassSelect";
import { StudentList } from "./PreMatchSetup/StudentList";
import { Student } from "@/types/match";

const PreMatchSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [difficulty, setDifficulty] = useState("medium");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [questionsPerStudent, setQuestionsPerStudent] = useState<number>(5);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const classes = getUniqueClasses();

  const generateAvatar = (seed: string) => {
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}`;
  };

  useEffect(() => {
    if (selectedClass) {
      const classStudents = getStudentsByClass(selectedClass).map(s => ({
        id: s.id,
        name: s.name,
        avatar: generateAvatar(s.name)
      }));
      setStudents(classStudents);
      setSelectedStudents(classStudents);
    } else {
      setStudents([]);
      setSelectedStudents([]);
    }
  }, [selectedClass]);

  const handleQuestionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setQuestionsPerStudent(value);
    }
  };

  const handleStart = () => {
    if (!selectedClass) {
      toast({
        title: "Invalid setup",
        description: "Please select a class to continue.",
        variant: "destructive",
      });
      return;
    }

    if (selectedStudents.length === 0) {
      toast({
        title: "Invalid setup",
        description: "Please select at least one student to continue.",
        variant: "destructive",
      });
      return;
    }

    const filteredWords = wordData.filter((word: WordData) => {
      switch (difficulty) {
        case "easy":
          return word.frequency === "high";
        case "medium":
          return true;
        case "hard":
          return word.frequency === "low";
        default:
          return true;
      }
    });

    const totalQuestionsNeeded = selectedStudents.length * questionsPerStudent;
    if (filteredWords.length < totalQuestionsNeeded) {
      toast({
        title: "Not enough words",
        description: `Need ${totalQuestionsNeeded} words but only have ${filteredWords.length} available. Please reduce questions per student or change difficulty.`,
        variant: "destructive",
      });
      return;
    }

    navigate("/match-arena", { 
      state: { 
        students: selectedStudents,
        wordList: filteredWords,
        difficulty,
        questionsPerStudent 
      } 
    });
  };

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <div className="space-y-8 slide-up">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
            <GraduationCap className="w-4 h-4 mr-2" />
            English Assessment
          </span>
          <h1 className="text-4xl font-bold tracking-tight">Match Setup</h1>
          <p className="text-muted-foreground">Configure the assessment parameters</p>
        </div>

        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <ClassSelect
              selectedClass={selectedClass}
              classes={classes}
              onClassChange={setSelectedClass}
            />

            {students.length > 0 && (
              <StudentList
                availableStudents={students}
                onStudentsChange={setSelectedStudents}
              />
            )}

            <div className="space-y-2">
              <Label>Questions per Student</Label>
              <Input
                type="number"
                min="1"
                value={questionsPerStudent}
                onChange={handleQuestionsChange}
                className="w-full"
              />
            </div>

            <DifficultySelect
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
            />
          </div>
        </Card>

        <Button
          className="w-full"
          size="lg"
          onClick={handleStart}
          disabled={!selectedClass || selectedStudents.length === 0}
        >
          <Book className="w-4 h-4 mr-2" />
          Start Assessment
        </Button>
      </div>
    </div>
  );
};

export default PreMatchSetup;
