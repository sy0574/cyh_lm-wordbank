import { useState, useEffect } from "react";
import { Student } from "@/types/match";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";

interface StudentListProps {
  availableStudents: Student[];
  onStudentsChange: (students: Student[]) => void;
}

export const StudentList = ({ availableStudents, onStudentsChange }: StudentListProps) => {
  const [selectedStudents, setSelectedStudents] = useState<Student[]>(availableStudents);

  // Update selected students when availableStudents changes
  useEffect(() => {
    setSelectedStudents(availableStudents);
    onStudentsChange(availableStudents);
  }, [availableStudents, onStudentsChange]);

  const handleStudentToggle = (checked: boolean, student: Student) => {
    let newSelectedStudents: Student[];
    if (checked) {
      newSelectedStudents = [...selectedStudents, student];
    } else {
      newSelectedStudents = selectedStudents.filter(s => s.id !== student.id);
    }
    setSelectedStudents(newSelectedStudents);
    onStudentsChange(newSelectedStudents);
  };

  if (availableStudents.length === 0) {
    return null;
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-3">Students in Class</h3>
      <ScrollArea className="h-[200px] rounded-md border p-2">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {availableStudents.map((student) => (
            <div
              key={student.id}
              className="flex items-center space-x-3 hover:bg-accent/50 rounded-lg p-2"
            >
              <Checkbox
                id={student.id}
                checked={selectedStudents.some(s => s.id === student.id)}
                onCheckedChange={(checked) => handleStudentToggle(checked as boolean, student)}
              />
              <Avatar className="h-8 w-8">
                <img src={student.avatar} alt={student.name} className="object-cover" />
              </Avatar>
              <label
                htmlFor={student.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer truncate"
              >
                {student.name}
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>
      <p className="text-sm text-muted-foreground mt-2">
        Selected: {selectedStudents.length} students
      </p>
    </Card>
  );
};

