
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { wordData } from "@/data/wordData";

interface CategorySelectProps {
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
}

export const DifficultySelect = ({
  selectedCategories,
  onCategoryChange
}: CategorySelectProps) => {
  // Get unique categories and their word counts from wordData
  const categoryWordCounts = wordData.reduce((acc, word) => {
    acc[word.category] = (acc[word.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = Array.from(new Set(wordData.map(word => word.category)));

  return (
    <div className="space-y-2">
      <Label>WordBank (Select multiple)</Label>
      <div className="grid grid-cols-3 gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategories.includes(cat) ? "default" : "outline"}
            className="capitalize flex flex-col gap-1 h-auto py-2"
            onClick={() => onCategoryChange(cat)}
          >
            <span>{cat}</span>
            <span className="text-xs opacity-70">
              {categoryWordCounts[cat]} words
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};
