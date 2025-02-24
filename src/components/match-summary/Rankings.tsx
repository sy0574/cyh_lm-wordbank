
import { Student } from "@/types/match";
import { Card } from "@/components/ui/card";
import { Trophy, Timer } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RankingEntry {
  student: Student;
  score: number;
  averageResponseTime: number;
}

interface RankingsProps {
  rankings: RankingEntry[];
}

const Rankings = ({ rankings }: RankingsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">班级排名</h3>
      <div className="grid gap-3">
        {rankings.map((entry, index) => (
          <Card key={entry.student.id} className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent font-bold">
                {index + 1}
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src={entry.student.avatar} alt={entry.student.name} />
                <AvatarFallback>{entry.student.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="font-medium">{entry.student.name}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    {entry.score}分
                  </span>
                  <span className="flex items-center gap-1">
                    <Timer className="w-4 h-4" />
                    {entry.averageResponseTime}ms
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Rankings;
