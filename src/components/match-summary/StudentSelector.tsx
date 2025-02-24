
import { Student } from "@/types/match";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface StudentSelectorProps {
  students: Student[];
  selectedStudentId: string | undefined;
  setSelectedStudentId: (id: string) => void;
  difficulty: string;
}

const StudentSelector = ({ students, selectedStudentId, setSelectedStudentId }: StudentSelectorProps) => {
  return (
    <div className="space-y-4">
      <Label>Select Student</Label>
      <div className="flex flex-wrap gap-3">
        {students.map((student) => (
          <button
            key={student.id}
            onClick={() => setSelectedStudentId(student.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
              "hover:bg-accent/50",
              "border-2",
              selectedStudentId === student.id
                ? "border-accent bg-accent/10"
                : "border-transparent bg-accent/5"
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={student.avatar} alt={student.name} />
              <AvatarFallback>{student.name[0]}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{student.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentSelector;
