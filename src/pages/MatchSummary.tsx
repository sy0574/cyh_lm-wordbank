
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import StudentSelector from "@/components/match-summary/StudentSelector";
import PerformanceMetrics from "@/components/match-summary/PerformanceMetrics";
import PerformanceCharts from "@/components/match-summary/PerformanceCharts";
import PerformanceDetails from "@/components/match-summary/PerformanceDetails";
import ClassSelector from "@/components/match-summary/ClassSelector";
import Rankings from "@/components/match-summary/Rankings";
import MatchHeader from "@/components/match-summary/MatchHeader";
import MatchActions from "@/components/match-summary/MatchActions";
import TimeFilter from "@/components/match-summary/TimeFilter";
import { generateReportHtml } from "@/utils/reportGenerator";
import { useStudentStats } from "@/hooks/useStudentStats";
import { useRankings } from "@/hooks/useRankings";

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

  const { studentStats, timeFilter, setTimeFilter } = useStudentStats(students, results);
  const { getRankings } = useRankings(studentStats, students);

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
      setSelectedClass(firstStudent.class || "");
    }
  }, [location.state, students, selectedStudentId, navigate]);

  if (!location.state || students.length === 0) {
    return null;
  }

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
      return selectedClass === "" || student?.class === selectedClass;
    });

    const htmlContent = generateReportHtml(filteredStats, selectedClass, timeFilter);
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 1000);
  };

  return (
    <div className="container max-w-[90rem] mx-auto py-12 px-4">
      <div className="space-y-8 slide-up">
        <MatchHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <StudentSelector
                    selectedClass={selectedClass}
                    selectedStudentId={selectedStudentId}
                    setSelectedStudentId={setSelectedStudentId}
                    difficulty={difficulty}
                  />
                  <ClassSelector
                    selectedClass={selectedClass}
                    onClassChange={setSelectedClass}
                  />
                </div>

                <TimeFilter value={timeFilter} onChange={setTimeFilter} />

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

        <MatchActions onSaveReport={handleSaveReport} />
      </div>
    </div>
  );
};

export default MatchSummary;

