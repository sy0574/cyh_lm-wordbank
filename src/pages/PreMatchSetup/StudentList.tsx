
import { Users } from "lucide-react";
import { Student } from "./types";

interface StudentListProps {
  students: Student[];
}

export const StudentList = ({ students }: StudentListProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold flex items-center">
        <Users className="w-4 h-4 mr-2" />
        Students
      </h3>
      <div className="space-y-2">
        {students.map((student) => (
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
        {students.length === 0 && (
          <p className="text-muted-foreground text-sm">
            Please select a class to load students
          </p>
        )}
      </div>
    </div>
  );
};
