
import { Button } from "@/components/ui/button";
import { RefreshCcw, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MatchActionsProps {
  onSaveReport: () => void;
}

const MatchActions = ({ onSaveReport }: MatchActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between w-full gap-4">
      <Button 
        variant="outline" 
        onClick={() => navigate("/")}
        className="flex items-center gap-2"
      >
        <RefreshCcw className="h-4 w-4" />
        New Assessment
      </Button>
      <Button 
        onClick={onSaveReport}
        className="flex items-center gap-2"
      >
        <Save className="h-4 w-4" />
        Save Report
      </Button>
    </div>
  );
};

export default MatchActions;
