
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { wordData } from "@/data/wordData";

interface CategorySelectProps {
  category: string;
  onCategoryChange: (category: string) => void;
}

export const DifficultySelect = ({
  category,
  onCategoryChange
}: CategorySelectProps) => {
  // Get unique categories from wordData
  const categories = Array.from(new Set(wordData.map(word => word.category)));

  return (
    <div className="space-y-2">
      <Label>WordBank</Label>
      <div className="grid grid-cols-3 gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={category === cat ? "default" : "outline"}
            className="capitalize"
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>
    </div>
  );
};
