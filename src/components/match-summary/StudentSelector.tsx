
import { Student } from "@/types/match";
import { Label } from "@/components/ui/label";
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
      <div className="space-y-2">
        <Label>Select Student</Label>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-muted animate-pulse rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Select Student</Label>
      <div className="grid grid-cols-2 gap-2">
        {students.map((student) => (
          <button
            key={student.id}
            onClick={() => setSelectedStudentId(student.id)}
            className={cn(
              "px-3 py-1.5 text-sm rounded-md transition-all text-center",
              "hover:bg-accent/50",
              selectedStudentId === student.id
                ? "bg-accent/10 border-2 border-accent"
                : "bg-accent/5 border-2 border-transparent"
            )}
          >
            {student.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentSelector;
