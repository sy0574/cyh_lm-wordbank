
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Award, Book, RotateCcw } from "lucide-react";

const MatchSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentName, score, total, results, difficulty } = location.state || {};

  const percentage = Math.round((score / total) * 100);

  const getFeedback = () => {
    if (percentage >= 90) return "Outstanding performance!";
    if (percentage >= 70) return "Good job!";
    if (percentage >= 50) return "Keep practicing!";
    return "More practice needed";
  };

  const getGrade = () => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
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
          <p className="text-muted-foreground">{studentName}'s Performance Report</p>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">{percentage}%</div>
              <div className="text-2xl font-semibold text-muted-foreground">
                Grade: {getGrade()}
              </div>
              <div className="mt-2 text-accent font-medium">{getFeedback()}</div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{score}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{total - score}</div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
              <div>
                <div className="text-2xl font-bold capitalize">{difficulty}</div>
                <div className="text-sm text-muted-foreground">Level</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-medium">Word Review</div>
              <div className="grid gap-2">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-md text-sm flex justify-between items-center ${
                      result.correct ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    <span>{result.word}</span>
                    <span>{result.correct ? "Correct" : "Incorrect"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

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
