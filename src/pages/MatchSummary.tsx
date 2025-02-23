
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Award, Book, RotateCcw } from "lucide-react";

interface StudentStats {
  name: string;
  correct: number;
  total: number;
  averageResponseTime: number;
  words: Array<{
    word: string;
    correct: boolean;
    responseTime: number;
  }>;
}

const MatchSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentNames, results, difficulty } = location.state || {};

  // Calculate individual student statistics
  const studentStats: StudentStats[] = studentNames.map((name: string) => {
    const studentResults = results.filter((r: any) => r.student === name);
    const correct = studentResults.filter((r: any) => r.correct).length;
    const totalResponseTime = studentResults.reduce((acc: number, curr: any) => acc + curr.responseTime, 0);
    
    return {
      name,
      correct,
      total: studentResults.length,
      averageResponseTime: studentResults.length > 0 ? Math.round(totalResponseTime / studentResults.length) : 0,
      words: studentResults.map((r: any) => ({
        word: r.word,
        correct: r.correct,
        responseTime: r.responseTime
      }))
    };
  });

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  const getFeedback = (percentage: number) => {
    if (percentage >= 90) return "Outstanding performance!";
    if (percentage >= 70) return "Good job!";
    if (percentage >= 50) return "Keep practicing!";
    return "More practice needed";
  };

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <div className="space-y-8 slide-up">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
            <Award className="w-4 h-4 mr-2" />
            Assessment Complete
          </span>
          <h1 className="text-4xl font-bold tracking-tight">Results Summary</h1>
          <p className="text-muted-foreground">Multiple Student Performance Report</p>
        </div>

        {studentStats.map((stats) => {
          const percentage = Math.round((stats.correct / stats.total) * 100);
          
          return (
            <Card key={stats.name} className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{stats.name}</h2>
                  <span className="text-sm font-medium text-muted-foreground">
                    Level: {difficulty}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{percentage}%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.averageResponseTime}ms</div>
                    <div className="text-sm text-muted-foreground">Avg. Response Time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{getGrade(percentage)}</div>
                    <div className="text-sm text-muted-foreground">Grade</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Performance Details</div>
                  <div className="grid gap-2">
                    {stats.words.map((result, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded-md text-sm flex justify-between items-center ${
                          result.correct ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        <span>{result.word}</span>
                        <div className="flex items-center gap-4">
                          <span>{result.responseTime}ms</span>
                          <span>{result.correct ? "Correct" : "Incorrect"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-accent font-medium text-center">
                  {getFeedback(percentage)}
                </div>
              </div>
            </Card>
          );
        })}

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Assessment
          </Button>
          <Button onClick={() => window.print()}>
            <Book className="w-4 h-4 mr-2" />
            Save Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchSummary;
