
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { getUniqueClasses } from "@/utils/databaseQueries";

interface ClassSelectProps {
  selectedClass: string;
  onClassChange: (className: string) => void;
}

export const ClassSelect = ({
  selectedClass,
  onClassChange
}: ClassSelectProps) => {
  const { data: classes = [] } = useQuery({
    queryKey: ['uniqueClasses'],
    queryFn: getUniqueClasses,
  });

  return (
    <div className="space-y-2">
      <Label>Class Selection</Label>
      <Select value={selectedClass} onValueChange={onClassChange}>
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
  );
};
