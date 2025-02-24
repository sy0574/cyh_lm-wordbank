
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const TIME_FILTERS = {
  TODAY: "today",
  THIS_WEEK: "this-week",
  THIS_MONTH: "this-month",
  ALL: "all"
} as const;

export type TimeFilter = typeof TIME_FILTERS[keyof typeof TIME_FILTERS];

interface TimeFilterProps {
  value: TimeFilter;
  onChange: (value: TimeFilter) => void;
}

const TimeFilter = ({ value, onChange }: TimeFilterProps) => {
  return (
    <div className="flex justify-center">
      <ToggleGroup 
        type="single" 
        value={value} 
        onValueChange={(value: TimeFilter) => onChange(value || TIME_FILTERS.ALL)}
      >
        <ToggleGroupItem value={TIME_FILTERS.TODAY}>Today</ToggleGroupItem>
        <ToggleGroupItem value={TIME_FILTERS.THIS_WEEK}>This Week</ToggleGroupItem>
        <ToggleGroupItem value={TIME_FILTERS.THIS_MONTH}>This Month</ToggleGroupItem>
        <ToggleGroupItem value={TIME_FILTERS.ALL}>All Time</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default TimeFilter;
