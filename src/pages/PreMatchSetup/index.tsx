
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Book, GraduationCap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { wordData, WordData } from "@/data/wordData";
import { getStudentsByClass } from "@/data/studentData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Group } from "./types";
import { GroupList } from "./GroupList";
import { StudentList } from "./StudentList";
import { DifficultySelector } from "./DifficultySelector";
import { ClassSelector } from "./ClassSelector";

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
            <ClassSelector 
              selectedClass={selectedClass}
              onClassChange={setSelectedClass}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
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

              <GroupList 
                groups={groups}
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
                onAddGroup={addGroup}
                onRemoveGroup={removeGroup}
              />

              {groups.map((group) => (
                group.id === selectedGroup && (
                  <StudentList key={group.id} students={group.students} />
                )
              ))}
            </div>

            <DifficultySelector 
              difficulty={difficulty}
              setDifficulty={setDifficulty}
            />
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
