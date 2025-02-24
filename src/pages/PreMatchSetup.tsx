
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Book, GraduationCap, UserPlus, X, Users, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { wordData, WordData } from "@/data/wordData";
import { studentData, getUniqueClasses, getStudentsByClass } from "@/data/studentData";

interface Student {
  id: string;
  name: string;
  avatar: string;
}

interface Group {
  id: string;
  name: string;
  students: Student[];
}

const PreMatchSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([{
    id: '1',
    name: 'Group 1',
    students: []
  }]);
  const [difficulty, setDifficulty] = useState("medium");
  const [selectedGroup, setSelectedGroup] = useState<string>('1');
  const [selectedClass, setSelectedClass] = useState<string>("");
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

      setGroups(prevGroups => 
        prevGroups.map(group => 
          group.id === selectedGroup 
            ? { ...group, students: classStudents }
            : group
        )
      );
    }
  }, [selectedClass, selectedGroup]);

  const addGroup = () => {
    const newGroupId = String(groups.length + 1);
    setGroups([...groups, {
      id: newGroupId,
      name: `Group ${newGroupId}`,
      students: []
    }]);
  };

  const removeGroup = (groupId: string) => {
    if (groups.length === 1) {
      toast({
        title: "Cannot remove last group",
        description: "At least one group is required.",
        variant: "destructive",
      });
      return;
    }
    const newGroups = groups.filter(g => g.id !== groupId);
    setGroups(newGroups);
    if (selectedGroup === groupId) {
      setSelectedGroup(newGroups[0].id);
    }
  };

  const handleStart = () => {
    const currentGroup = groups.find(g => g.id === selectedGroup);
    if (!currentGroup) return;
    
    const validStudents = currentGroup.students.filter(s => s.name.trim());
    if (validStudents.length === 0) {
      toast({
        title: "Invalid setup",
        description: "Please select a class and ensure there are students.",
        variant: "destructive",
      });
      return;
    }

    // Create a filtered list of words based on difficulty
    const filteredWords = wordData.filter((word: WordData) => {
      switch (difficulty) {
        case "easy":
          return word.frequency === "high";
        case "medium":
          return true; // Include all words
        case "hard":
          return word.frequency === "low";
        default:
          return true;
      }
    });

    navigate("/match-arena", { 
      state: { 
        students: validStudents,
        wordList: filteredWords,
        difficulty 
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
            <div className="space-y-2">
              <Label>Class Selection</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Group Selection</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addGroup}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Group
                </Button>
              </div>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {groups.map((group) => (
              group.id === selectedGroup && (
                <div key={group.id} className="space-y-4 border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {group.name}
                    </h3>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeGroup(group.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {group.students.map((student) => (
                      <div key={student.id} className="flex items-center gap-2">
                        {student.avatar && (
                          <img
                            src={student.avatar}
                            alt={`${student.name}'s avatar`}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <div className="flex-1 px-3 py-2 bg-muted rounded-md">
                          {student.name}
                        </div>
                      </div>
                    ))}
                    {group.students.length === 0 && (
                      <p className="text-muted-foreground text-sm">
                        Please select a class to load students
                      </p>
                    )}
                  </div>
                </div>
              )
            ))}

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
          disabled={!selectedClass || groups[0].students.length === 0}
        >
          <Book className="w-4 h-4 mr-2" />
          Start Assessment
        </Button>
      </div>
    </div>
  );
};

export default PreMatchSetup;
