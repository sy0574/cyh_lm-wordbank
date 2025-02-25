
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
      sideContent={<Rankings rankings={getRankings()} />}
      actions={<MatchActions onSaveReport={handleSaveReport} />}
    />
  );
};

export default MatchSummary;
