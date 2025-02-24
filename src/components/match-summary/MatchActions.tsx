
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Book, RotateCcw } from "lucide-react";

interface MatchActionsProps {
  onSaveReport: () => void;
}

const MatchActions = ({ onSaveReport }: MatchActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="outline" onClick={() => navigate("/")}>
        <RotateCcw className="w-4 h-4 mr-2" />
        New Assessment
      </Button>
      <Button onClick={onSaveReport}>
        <Book className="w-4 h-4 mr-2" />
        Save Report
      </Button>
    </div>
  );
};

export default MatchActions;
