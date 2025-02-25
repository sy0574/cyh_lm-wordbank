
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useStudentStats } from "@/hooks/useStudentStats";
import { useRankings } from "@/hooks/useRankings";
import MatchLayout from "@/components/match-summary/MatchLayout";
import MatchHeader from "@/components/match-summary/MatchHeader";
import MatchActions from "@/components/match-summary/MatchActions";
import Rankings from "@/components/match-summary/Rankings";
import StudentPerformanceContent from "@/components/match-summary/StudentPerformanceContent";
import { generateReportHtml } from "@/utils/reportGenerator";

const MatchSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [difficulty, setDifficulty] = useState("medium");
  const [selectedStudentId, setSelectedStudentId] = useState<string>();
  const [selectedClass, setSelectedClass] = useState<string>("all");

  useEffect(() => {
    console.log("Location state:", location.state);
    
    if (!location.state || !location.state.students || location.state.students.length === 0) {
      console.log("Invalid state detected");
      toast({
        title: "Invalid Access",
        description: "Please start a new assessment from the home page.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setStudents(location.state.students);
    setDifficulty(location.state.difficulty || "medium");

    if (location.state.students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(location.state.students[0].id);
      setSelectedClass("all");
    }
  }, [location.state, navigate, selectedStudentId]);

  const { studentStats, timeFilter, setTimeFilter, loading } = useStudentStats(students, selectedClass);
  const { getRankings } = useRankings(studentStats, students);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return null;
  }

  const selectedStatsData = studentStats.find(stats => 
    stats.name === students.find(s => s.id === selectedStudentId)?.name
  );

  const filteredRankings = getRankings().filter(ranking => 
    selectedClass === "all" || ranking.student.class === selectedClass
  );

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
      return selectedClass === "all" || student?.class === selectedClass;
    });

    const htmlContent = generateReportHtml(filteredStats, selectedClass, timeFilter);
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 1000);
  };

  return (
    <MatchLayout
      header={<MatchHeader />}
      mainContent={
        <StudentPerformanceContent
          selectedClass={selectedClass}
          selectedStudentId={selectedStudentId}
          setSelectedStudentId={setSelectedStudentId}
          setSelectedClass={setSelectedClass}
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          selectedStatsData={selectedStatsData}
          difficulty={difficulty}
        />
      }
      sideContent={<Rankings rankings={filteredRankings} />}
      actions={<MatchActions onSaveReport={handleSaveReport} />}
    />
  );
};

export default MatchSummary;
