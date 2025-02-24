
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
import { format } from "date-fns";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
    answeredAt?: Date;
  }>;
}

const getFeedback = (percentage: number) => {
  if (percentage >= 90) return "Outstanding performance!";
  if (percentage >= 70) return "Good job!";
  if (percentage >= 50) return "Keep practicing!";
  return "More practice needed";
};

const TIME_FILTERS = {
  TODAY: "today",
  THIS_WEEK: "this-week",
  THIS_MONTH: "this-month",
  ALL: "all"
} as const;

type TimeFilter = typeof TIME_FILTERS[keyof typeof TIME_FILTERS];

const MatchSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { students = [], results = [], difficulty = "medium" } = location.state || {};
  const [selectedStudentId, setSelectedStudentId] = useState<string>();
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(TIME_FILTERS.ALL);

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

  const filterResultsByTime = (results: any[]) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return results.filter(result => {
      const resultDate = new Date(result.answeredAt || Date.now());
      switch (timeFilter) {
        case TIME_FILTERS.TODAY:
          return resultDate >= startOfDay;
        case TIME_FILTERS.THIS_WEEK:
          return resultDate >= startOfWeek;
        case TIME_FILTERS.THIS_MONTH:
          return resultDate >= startOfMonth;
        default:
          return true;
      }
    });
  };

  const studentStats: StudentStats[] = students.map((student: any) => {
    const studentResults = filterResultsByTime(
      results.filter((r: any) => r.student.id === student.id)
    );
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
        answerNumber: r.answerNumber,
        answeredAt: r.answeredAt || new Date()
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
    responseTime: result.responseTime,
    answeredAt: result.answeredAt
  })) || [];

  const getRankings = () => {
    return studentStats
      .map(stats => ({
        student: students.find(s => s.name === stats.name)!,
        score: stats.words.reduce((acc, word) => acc + word.pointsEarned, 0),
        averageResponseTime: stats.averageResponseTime
      }))
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.averageResponseTime - b.averageResponseTime;
      });
  };

  const handleSaveReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Unable to open print window. Please allow popups for this site.",
        variant: "destructive"
      });
      return;
    }

    const filteredStats = studentStats.filter(stat => {
      const student = students.find(s => s.name === stat.name);
      const studentData = getStudentsByClass("");
      return selectedClass === "" || studentData.find(s => s.id === student?.id)?.class === selectedClass;
    });

    const htmlContent = `
      <html>
        <head>
          <title>Performance Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .student-data { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
            .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px; }
            .metric { background: #f5f5f5; padding: 10px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Performance Report</h1>
            <p>Class: ${selectedClass || 'All Classes'}</p>
            <p>Time Period: ${timeFilter.replace('-', ' ').toUpperCase()}</p>
            <p>Generated on: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}</p>
          </div>
          ${filteredStats.map(stat => `
            <div class="student-data">
              <h2>${stat.name}</h2>
              <div class="metrics">
                <div class="metric">
                  <strong>Accuracy:</strong> ${Math.round((stat.correct / stat.total) * 100)}%
                </div>
                <div class="metric">
                  <strong>Correct Answers:</strong> ${stat.correct}/${stat.total}
                </div>
                <div class="metric">
                  <strong>Avg Response Time:</strong> ${stat.averageResponseTime}ms
                </div>
              </div>
            </div>
          `).join('')}
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
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

                <div className="flex justify-center">
                  <ToggleGroup type="single" value={timeFilter} onValueChange={(value: TimeFilter) => setTimeFilter(value || TIME_FILTERS.ALL)}>
                    <ToggleGroupItem value={TIME_FILTERS.TODAY}>Today</ToggleGroupItem>
                    <ToggleGroupItem value={TIME_FILTERS.THIS_WEEK}>This Week</ToggleGroupItem>
                    <ToggleGroupItem value={TIME_FILTERS.THIS_MONTH}>This Month</ToggleGroupItem>
                    <ToggleGroupItem value={TIME_FILTERS.ALL}>All Time</ToggleGroupItem>
                  </ToggleGroup>
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
          <Button onClick={handleSaveReport}>
            <Book className="w-4 h-4 mr-2" />
            Save Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchSummary;

