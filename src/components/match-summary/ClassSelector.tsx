
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUniqueClasses } from "@/data/studentData";

interface ClassSelectorProps {
  selectedClass: string;
  onClassChange: (value: string) => void;
}

const ClassSelector = ({ selectedClass, onClassChange }: ClassSelectorProps) => {
  const classes = getUniqueClasses();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">班级</label>
      <Select value={selectedClass} onValueChange={onClassChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="选择班级" />
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

export default ClassSelector;
