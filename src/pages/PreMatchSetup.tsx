
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Book, GraduationCap, UserPlus, X } from "lucide-react";

const PreMatchSetup = () => {
  const navigate = useNavigate();
  const [studentNames, setStudentNames] = useState<string[]>([""]);
  const [wordList, setWordList] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState("medium");

  const handleStart = () => {
    if (studentNames.filter(name => name.trim()).length === 0 || wordList.length === 0) return;
    navigate("/match-arena", { 
      state: { 
        studentNames: studentNames.filter(name => name.trim()), 
        wordList, 
        difficulty 
      } 
    });
  };

  const addStudent = () => {
    setStudentNames([...studentNames, ""]);
  };

  const removeStudent = (index: number) => {
    const newStudents = studentNames.filter((_, i) => i !== index);
    setStudentNames(newStudents.length ? newStudents : [""]); // Keep at least one student
  };

  const updateStudentName = (index: number, name: string) => {
    const newStudents = [...studentNames];
    newStudents[index] = name;
    setStudentNames(newStudents);
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
            <div className="space-y-2">
              <Label>Student Names</Label>
              <div className="space-y-2">
                {studentNames.map((name, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Student ${index + 1}`}
                      value={name}
                      onChange={(e) => updateStudentName(index, e.target.value)}
                    />
                    {studentNames.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeStudent(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={addStudent}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wordList">Word List</Label>
              <Input
                id="wordList"
                placeholder="Enter words separated by commas"
                onChange={(e) => setWordList(e.target.value.split(",").map(word => word.trim()))}
              />
              <p className="text-sm text-muted-foreground">
                Enter words separated by commas (e.g., apple, banana, cherry)
              </p>
            </div>

            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <div className="grid grid-cols-3 gap-2">
                {["easy", "medium", "hard"].map((level) => (
                  <Button
                    key={level}
                    variant={difficulty === level ? "default" : "outline"}
                    className="capitalize"
                    onClick={() => setDifficulty(level)}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Button
          className="w-full"
          size="lg"
          onClick={handleStart}
          disabled={!studentNames[0] || wordList.length === 0}
        >
          <Book className="w-4 h-4 mr-2" />
          Start Assessment
        </Button>
      </div>
    </div>
  );
};

export default PreMatchSetup;
