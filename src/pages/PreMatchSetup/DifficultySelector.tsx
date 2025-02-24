
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface DifficultySelectorProps {
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
}

export const DifficultySelector = ({
  difficulty,
  setDifficulty
}: DifficultySelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Difficulty Level</Label>
      <div className="grid grid-cols-3 gap-2">
        {["easy", "medium", "hard"].map((level) => (
          <Button
            key={level}
            variant={difficulty === level ? "default" : "outline"}
            className="capitalize"
            onClick={() => setDifficulty(level)}
          >
            {level}
          </Button>
        ))}
      </div>
    </div>
  );
};
