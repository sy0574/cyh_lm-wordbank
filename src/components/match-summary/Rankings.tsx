import { Student } from "@/types/match";
import { Card } from "@/components/ui/card";
import { Trophy, Timer } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Podium from "@/components/Podium";

interface RankingEntry {
  student: Student;
  score: number;
  averageResponseTime: number;
}

interface RankingsProps {
  rankings: RankingEntry[];
}

const Rankings = ({ rankings }: RankingsProps) => {
  // Prepare data for Podium component
  const podiumRankings = rankings.slice(0, 3).map(({ student, score }) => ({
    student,
    score
  }));

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">班级排名</h3>
      
      {/* Podium for top 3 students */}
      {rankings.length > 0 && (
        <div className="mx-auto">
          <Podium rankings={podiumRankings} />
        </div>
      )}
      
      {/* List view of all students */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">所有学生</h4>
        <ScrollArea className="h-[calc(100vh-450px)]">
          <div className="grid gap-3 pr-4">
            {rankings.length === 0 ? (
              <Card className="p-4">
                <div className="text-center text-muted-foreground">
                  暂无排名数据
                </div>
              </Card>
            ) : (
              rankings.map((entry, index) => (
                <Card key={entry.student.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`flex-none flex items-center justify-center w-8 h-8 rounded-full font-bold
                      ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                        index === 1 ? 'bg-gray-100 text-gray-600' :
                          index === 2 ? 'bg-orange-100 text-orange-600' :
                            'bg-accent/10 text-accent'}`}>
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
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Rankings;
