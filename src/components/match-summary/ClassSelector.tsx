
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getUniqueClasses } from "@/utils/databaseQueries";

interface ClassSelectorProps {
  selectedClass: string;
  onClassChange: (value: string) => void;
}

const ClassSelector = ({ selectedClass, onClassChange }: ClassSelectorProps) => {
  const { data: classes = [], isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: getUniqueClasses
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">班级</label>
        <div className="w-[200px] h-10 bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">班级</label>
      <Select value={selectedClass} onValueChange={onClassChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="选择班级" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Classes</SelectItem>
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
