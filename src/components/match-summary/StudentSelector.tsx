
import { Student } from "@/types/match";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getStudentsByClass } from "@/utils/databaseQueries";

interface StudentSelectorProps {
  selectedClass: string;
  selectedStudentId: string | undefined;
  setSelectedStudentId: (id: string) => void;
  difficulty: string;
}

const StudentSelector = ({ selectedClass, selectedStudentId, setSelectedStudentId }: StudentSelectorProps) => {
  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students', selectedClass],
    queryFn: () => getStudentsByClass(selectedClass),
    enabled: !!selectedClass
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Label>Select Student</Label>
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-32 h-12 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

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
              <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${student.name}`} alt={student.name} />
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
