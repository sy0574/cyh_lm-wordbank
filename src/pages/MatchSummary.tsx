
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Award, Book, RotateCcw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

// Simulate historical data - in a real app, this would come from a database
const generateHistoricalData = (studentName: string) => {
  const numberOfAssessments = 5; // Including the current one
  return Array.from({ length: numberOfAssessments }, (_, i) => ({
    assessmentNumber: i + 1,
    accuracy: Math.round(Math.random() * 30 + 70), // Random accuracy between 70-100%
    responseTime: Math.round(Math.random() * 1000 + 500), // Random response time between 500-1500ms
    student: studentName
  }));
};

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
          const historicalData = generateHistoricalData(stats.name);
          // Add current assessment data
          historicalData.push({
            assessmentNumber: historicalData.length + 1,
            accuracy: percentage,
            responseTime: stats.averageResponseTime,
            student: stats.name
          });
          
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

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={historicalData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="assessmentNumber" label={{ value: 'Assessment Number', position: 'bottom' }} />
                      <YAxis yAxisId="left" label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: 'Response Time (ms)', angle: 90, position: 'insideRight' }} />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="accuracy"
                        name="Accuracy"
                        stroke="#4f46e5"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="responseTime"
                        name="Response Time"
                        stroke="#10b981"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
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

