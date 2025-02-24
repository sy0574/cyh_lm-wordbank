
import { Student } from "@/types/match";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StudentSelectorProps {
  students: Student[];
  selectedStudentId: string | undefined;
  setSelectedStudentId: (id: string) => void;
  difficulty: string;
}

const StudentSelector = ({ students, selectedStudentId, setSelectedStudentId, difficulty }: StudentSelectorProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <Label>Select Student</Label>
        <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a student" />
          </SelectTrigger>
          <SelectContent>
            {students.map((student) => (
              <SelectItem
                key={student.id}
                value={student.id}
                className="flex items-center gap-2"
              >
                <img
                  src={student.avatar}
                  alt={`${student.name}'s avatar`}
                  className="w-6 h-6 rounded-full inline mr-2"
                />
                {student.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <span className="text-sm font-medium text-muted-foreground">
        Level: {difficulty}
      </span>
    </div>
  );
};

export default StudentSelector;
