
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface DifficultySelectProps {
  difficulty: string;
  onDifficultyChange: (level: string) => void;
}

export const DifficultySelect = ({
  difficulty,
  onDifficultyChange
}: DifficultySelectProps) => {
  return (
    <div className="space-y-2">
      <Label>Difficulty Level</Label>
      <div className="grid grid-cols-3 gap-2">
        {["easy", "medium", "hard"].map((level) => (
          <Button
            key={level}
            variant={difficulty === level ? "default" : "outline"}
            className="capitalize"
            onClick={() => onDifficultyChange(level)}
          >
            {level}
          </Button>
        ))}
      </div>
    </div>
  );
};
