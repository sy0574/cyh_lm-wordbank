import { Student } from "@/types/match";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useStudentsByClass } from "@/utils/databaseQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

interface StudentSelectorProps {
  selectedClass: string;
  selectedStudentId: string | undefined;
  setSelectedStudentId: (id: string) => void;
  difficulty: string;
}

const StudentSelector = ({ selectedClass, selectedStudentId, setSelectedStudentId }: StudentSelectorProps) => {
  // If selectedClass is "all", we need to handle it specially
  const effectiveClass = selectedClass === "all" ? undefined : selectedClass;
  
  const { data: students = [], isLoading, refetch } = useStudentsByClass(effectiveClass);

  // Force refetch when selected class changes and immediately reset selection when empty
  useEffect(() => {
    console.log(`StudentSelector: Class changed to ${selectedClass}, effectiveClass: ${effectiveClass}`);
    
    // Clear the selected student ID if we're changing classes
    // This ensures we don't keep a student selected from a previous class
    if (selectedStudentId) {
      const studentExists = students.some(s => s.id === selectedStudentId);
      if (!studentExists) {
        console.log(`StudentSelector: Selected student ${selectedStudentId} not found in current class, clearing selection`);
        setSelectedStudentId(students.length > 0 ? students[0].id : '');
      }
    }
    
    // Forcefully refetch students for this class
    refetch();
  }, [selectedClass, effectiveClass, refetch, students, selectedStudentId, setSelectedStudentId]);

  // Auto-select the first student whenever students change
  useEffect(() => {
    if (students.length > 0) {
      // If no student is selected or the selected student is not in this class
      const studentExists = selectedStudentId && students.some(s => s.id === selectedStudentId);
      
      if (!studentExists) {
        console.log(`StudentSelector: Auto-selecting first student: ${students[0].name} (${students[0].id})`);
        setSelectedStudentId(students[0].id);
      }
    }
  }, [students, selectedStudentId, setSelectedStudentId]);

  // Log info for debugging
  useEffect(() => {
    console.log(`StudentSelector: ${students.length} students for class: ${selectedClass}`);
    console.log('StudentSelector: Available students:', students);
    console.log(`StudentSelector: Selected student ID: ${selectedStudentId}`);
  }, [students, selectedClass, selectedStudentId]);

  // Handle student selection
  const handleStudentSelect = (studentId: string) => {
    console.log(`StudentSelector: Selecting student: ${studentId}`);
    setSelectedStudentId(studentId);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Select Student</Label>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="space-y-2">
        <Label>Select Student</Label>
        <div className="p-4 text-center bg-muted rounded-md text-sm text-muted-foreground">
          {selectedClass === "all" ? "No students found" : `No students found in class ${selectedClass}`}
        </div>
      </div>
    );
  }

  // Sort students by name for consistent display
  const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-2">
      <Label>Select Student</Label>
      <div className="grid grid-cols-2 gap-2">
        {sortedStudents.map((student) => (
          <button
            key={student.id}
            onClick={() => handleStudentSelect(student.id)}
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
      {/* Debug info - remove in production */}
      <div className="text-xs text-muted-foreground">
        {students.length} students available
      </div>
    </div>
  );
};

export default StudentSelector;
