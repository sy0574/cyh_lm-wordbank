
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ClassSelectProps {
  selectedClass: string;
  classes: string[];
  onClassChange: (className: string) => void;
}

export const ClassSelect = ({
  selectedClass,
  classes,
  onClassChange
}: ClassSelectProps) => {
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
