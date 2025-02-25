
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GameSettingsProps {
  questionsPerStudent: number;
  onQuestionsChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedLanguage: "English" | "Chinese";
  onLanguageChange: (value: "English" | "Chinese") => void;
}

export const GameSettings = ({
  questionsPerStudent,
  onQuestionsChange,
  selectedLanguage,
  onLanguageChange
}: GameSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Questions per Student</Label>
        <Input
          type="number"
          min="1"
          value={questionsPerStudent}
          onChange={onQuestionsChange}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Display Language</Label>
        <select
          className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value as "English" | "Chinese")}
        >
          <option value="English">English</option>
          <option value="Chinese">Chinese</option>
        </select>
      </div>
    </div>
  );
};
