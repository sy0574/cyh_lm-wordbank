
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Award, Book, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import StudentSelector from "@/components/match-summary/StudentSelector";
import PerformanceMetrics from "@/components/match-summary/PerformanceMetrics";
import PerformanceCharts from "@/components/match-summary/PerformanceCharts";
import PerformanceDetails from "@/components/match-summary/PerformanceDetails";
import ClassSelector from "@/components/match-summary/ClassSelector";
import Rankings from "@/components/match-summary/Rankings";
import { getStudentsByClass } from "@/data/studentData";

interface StudentStats {
  name: string;
  avatar: string;
  correct: number;
  total: number;
  averageResponseTime: number;
  words: Array<{
    word: string;
    correct: boolean;
    responseTime: number;
    pointsEarned: number;
    answerNumber: number;
  }>;
}

const getFeedback = (percentage: number) => {
  if (percentage >= 90) return "Outstanding performance!";
  if (percentage >= 70) return "Good job!";
  if (percentage >= 50) return "Keep practicing!";
  return "More practice needed";
};

const MatchSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { students = [], results = [], difficulty = "medium" } = location.state || {};
  const [selectedStudentId, setSelectedStudentId] = useState<string>();
  const [selectedClass, setSelectedClass] = useState<string>("");

  useEffect(() => {
    if (!location.state) {
      toast({
        title: "Invalid Access",
        description: "Please start a new assessment from the home page.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }

    // 自动设置初始班级
    if (students.length > 0) {
      const firstStudent = students[0];
      const studentData = getStudentsByClass("");
      const studentClass = studentData.find(s => s.id === firstStudent.id)?.class || "";
      setSelectedClass(studentClass);
    }
  }, [location.state, students, selectedStudentId, navigate]);

  if (!location.state || students.length === 0) {
    return null;
  }

  const studentStats: StudentStats[] = students.map((student: any) => {
    const studentResults = results.filter((r: any) => r.student.id === student.id);
    const correct = studentResults.filter((r: any) => r.correct).length;
    const totalResponseTime = studentResults.reduce((acc: number, curr: any) => acc + curr.responseTime, 0);
    
    return {
      name: student.name,
      avatar: student.avatar,
      correct,
      total: studentResults.length,
      averageResponseTime: studentResults.length > 0 ? Math.round(totalResponseTime / studentResults.length) : 0,
      words: studentResults.map((r: any) => ({
        word: r.word,
        correct: r.correct,
        responseTime: r.responseTime,
        pointsEarned: r.pointsEarned,
        answerNumber: r.answerNumber
      }))
    };
  });

  const selectedStatsData = studentStats.find(stats => 
    stats.name === students.find(s => s.id === selectedStudentId)?.name
  );
  
  const percentage = selectedStatsData ? Math.round((selectedStatsData.correct / selectedStatsData.total) * 100) : 0;

  const scoreData = selectedStatsData?.words.map(result => ({
    answerNumber: result.answerNumber,
    score: result.pointsEarned,
    responseTime: result.responseTime
  })) || [];

  // 获取班级学生的排名
  const getRankings = () => {
    return studentStats
      .map(stats => ({
        student: students.find(s => s.name === stats.name)!,
        score: stats.words.reduce((acc, word) => acc + word.pointsEarned, 0),
        averageResponseTime: stats.averageResponseTime
      }))
      .sort((a, b) => {
        // 首先按分数排序
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        // 分数相同时按响应时间排序
        return a.averageResponseTime - b.averageResponseTime;
      });
  };

  return (
    <div className="container max-w-[90rem] mx-auto py-12 px-4">
      <div className="space-y-8 slide-up">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
            <Award className="w-4 h-4 mr-2" />
            Assessment Complete
          </span>
          <h1 className="text-4xl font-bold tracking-tight">Results Summary</h1>
          <p className="text-muted-foreground">Multiple Student Performance Report</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <StudentSelector
                    students={students}
                    selectedStudentId={selectedStudentId}
                    setSelectedStudentId={setSelectedStudentId}
                    difficulty={difficulty}
                  />
                  <ClassSelector
                    selectedClass={selectedClass}
                    onClassChange={setSelectedClass}
                  />
                </div>

                {selectedStatsData && (
                  <>
                    <PerformanceMetrics
                      percentage={percentage}
                      averageResponseTime={selectedStatsData.averageResponseTime}
                    />

                    <PerformanceCharts data={scoreData} />

                    <PerformanceDetails words={selectedStatsData.words} />

                    <div className="text-accent font-medium text-center">
                      {getFeedback(percentage)}
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6">
              <Rankings rankings={getRankings()} />
            </Card>
          </div>
        </div>

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
