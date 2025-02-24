
import { Award } from "lucide-react";

const MatchHeader = () => {
  return (
    <div className="text-center space-y-2">
      <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
        <Award className="w-4 h-4 mr-2" />
        Assessment Complete
      </span>
      <h1 className="text-4xl font-bold tracking-tight">Results Summary</h1>
      <p className="text-muted-foreground">Multiple Student Performance Report</p>
    </div>
  );
};

export default MatchHeader;
