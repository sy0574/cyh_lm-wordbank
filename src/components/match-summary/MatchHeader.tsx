
import { Badge } from "@/components/ui/badge";
import { UserCircle2 } from "lucide-react";

const MatchHeader = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Results Summary</h1>
          <p className="text-muted-foreground">Multiple Student Performance Report</p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <UserCircle2 className="w-4 h-4" />
          Assessment Complete
        </Badge>
      </div>
    </div>
  );
};

export default MatchHeader;
