import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getUniqueClasses } from "@/utils/databaseQueries";
import { useEffect } from "react";

interface ClassSelectorProps {
  selectedClass: string;
  onClassChange: (value: string) => void;
}

const ClassSelector = ({ selectedClass, onClassChange }: ClassSelectorProps) => {
  const { data: classes = [], isLoading, refetch } = useQuery({
    queryKey: ['classes'],
    queryFn: getUniqueClasses,
    staleTime: 0 // Always fetch the latest classes
  });

  // Force a refetch when component mounts
  useEffect(() => {
    console.log('ClassSelector: Forcing refetch of classes');
    refetch();
  }, [refetch]);

  // Log available classes for debugging
  useEffect(() => {
    console.log(`ClassSelector: ${classes.length} classes available:`, classes);
    console.log(`ClassSelector: Currently selected class: ${selectedClass}`);
  }, [classes, selectedClass]);

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
      <Select 
        value={selectedClass} 
        onValueChange={(value) => {
          console.log(`ClassSelector: Changing class to: ${value}`);
          onClassChange(value);
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="选择班级" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Classes</SelectItem>
          {classes.map((className) => (
            <SelectItem key={className} value={className}>
              {className}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Debug info - remove in production */}
      <div className="text-xs text-muted-foreground">
        {classes.length} classes available
      </div>
    </div>
  );
};

export default ClassSelector;

