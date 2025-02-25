
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Book, GraduationCap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { wordData, WordData } from "@/data/wordData";
import { DifficultySelect } from "./PreMatchSetup/DifficultySelect";
import { ClassSelect } from "./PreMatchSetup/ClassSelect";
import { StudentList } from "./PreMatchSetup/StudentList";
import { Student } from "@/types/match";
import { useQuery } from "@tanstack/react-query";
import { getStudentsByClass } from "@/utils/databaseQueries";

const PreMatchSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Basic"]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [questionsPerStudent, setQuestionsPerStudent] = useState<number>(3);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<"English" | "Chinese">("English");

  const { data: students = [] } = useQuery({
    queryKey: ['students', selectedClass],
    queryFn: () => getStudentsByClass(selectedClass),
    enabled: !!selectedClass
  });

  useEffect(() => {
    if (selectedClass && students.length > 0) {
      setSelectedStudents(students);
    } else {
      setSelectedStudents([]);
    }
  }, [selectedClass, students]);

  const handleQuestionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setQuestionsPerStudent(value);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
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

    if (selectedCategories.length === 0) {
      toast({
        title: "Invalid setup",
        description: "Please select at least one word category to continue.",
        variant: "destructive",
      });
      return;
    }

    const filteredWords = wordData.filter((word: WordData) => 
      selectedCategories.includes(word.category)
    );

    const totalQuestionsNeeded = selectedStudents.length * questionsPerStudent;
    if (filteredWords.length < totalQuestionsNeeded) {
      toast({
        title: "Not enough words",
        description: `Need ${totalQuestionsNeeded} words but only have ${filteredWords.length} available in the selected categories. Please reduce questions per student or select more categories.`,
        variant: "destructive",
      });
      return;
    }

    navigate("/match-arena", { 
      state: { 
        students: selectedStudents,
        wordList: filteredWords,
        categories: selectedCategories,
        questionsPerStudent,
        selectedLanguage
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

            <div className="space-y-2">
              <Label>Display Language</Label>
              <select
                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as "English" | "Chinese")}
              >
                <option value="English">English</option>
                <option value="Chinese">Chinese</option>
              </select>
            </div>

            <DifficultySelect
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </Card>

        <Button
          className="w-full"
          size="lg"
          onClick={handleStart}
          disabled={!selectedClass || selectedStudents.length === 0 || selectedCategories.length === 0}
        >
          <Book className="w-4 h-4 mr-2" />
          Start Assessment
        </Button>
      </div>
    </div>
  );
};

export default PreMatchSetup;

