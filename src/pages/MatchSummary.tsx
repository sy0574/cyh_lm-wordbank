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
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Student } from "@/types/match";

const MatchSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [difficulty, setDifficulty] = useState("medium");
  const [selectedStudentId, setSelectedStudentId] = useState<string>();
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);

  // Fetch all students from Supabase
  const { data: allStudents = [], isLoading: isLoadingAllStudents, refetch: refetchAllStudents } = useQuery({
    queryKey: ['all-students'],
    queryFn: async () => {
      try {
        console.log('Fetching all students from database');
        const { data, error } = await supabase
          .from('students')
          .select('*');
        
        if (error) throw error;
        
        console.log(`Found ${data?.length || 0} students in database`);
        return data || [];
      } catch (error) {
        console.error('Error fetching all students:', error);
        toast({
          title: "Error",
          description: "Failed to load student data",
          variant: "destructive",
        });
        return [];
      }
    },
    staleTime: 0, // Don't cache this data
  });

  // Filter students based on selected class
  const getStudentsForClass = (className: string, allStudentsList: Student[] = []) => {
    if (className === "all") return allStudentsList;
    return allStudentsList.filter(s => s.class === className);
  };

  // Set initial state from navigation or use all students from database
  useEffect(() => {
    if (isLoadingAllStudents) return;
    
    console.log("Location state:", location.state);
    console.log("All students from DB:", allStudents);
    
    // If we have location state with students, use those
    if (location.state?.students?.length > 0) {
      setStudents(location.state.students);
      setDifficulty(location.state.difficulty || "medium");
      
      if (!selectedStudentId && location.state.students.length > 0) {
        setSelectedStudentId(location.state.students[0].id);
      }
    } 
    // Otherwise use all students from database
    else if (allStudents?.length > 0) {
      // Here we need to filter students based on the selected class
      const studentsForClass = getStudentsForClass(selectedClass, allStudents);
      setStudents(studentsForClass);
      
      if (!selectedStudentId && studentsForClass.length > 0) {
        setSelectedStudentId(studentsForClass[0].id);
      }
    } 
    // No data available
    else if (!location.state?.students?.length && !allStudents?.length) {
      console.log("No student data available");
      toast({
        title: "No Data",
        description: "No student data available. Start a new assessment or check database connection.",
        variant: "destructive",
      });
    }
    
    setIsLoadingInitialData(false);
  }, [location.state, allStudents, isLoadingAllStudents, selectedStudentId, selectedClass]);

  // Handle class change
  const handleClassChange = async (newClass: string) => {
    console.log(`Changing class from ${selectedClass} to ${newClass}`);
    setSelectedClass(newClass);
    
    try {
      // Refetch all students to ensure we have the latest data
      await refetchAllStudents();
      
      // Get students for the selected class
      const studentsInClass = newClass === "all" 
        ? allStudents 
        : allStudents.filter(s => s.class === newClass);
      
      // Update the students state with the filtered students
      setStudents(studentsInClass);
      
      // Reset selected student when changing class
      if (studentsInClass.length > 0) {
        console.log(`Found ${studentsInClass.length} students in class ${newClass}`);
        setSelectedStudentId(studentsInClass[0].id);
      } else {
        console.log(`No students found in class ${newClass}`);
        setSelectedStudentId(undefined);
      }
    } catch (error) {
      console.error('Error handling class change:', error);
      toast({
        title: "Error",
        description: "Failed to update class data",
        variant: "destructive",
      });
    }
  };

  // Important: Pass allStudents to useStudentStats instead of the filtered students
  // This ensures useStudentStats has access to all students and can filter internally
  const { studentStats, timeFilter, setTimeFilter, loading: isLoadingStats, refetch: refetchStats } = useStudentStats(allStudents, selectedClass);
  const { getRankings } = useRankings(studentStats, allStudents);

  // Show loading state
  if (isLoadingInitialData || isLoadingAllStudents || isLoadingStats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Check if we have valid data
  if (!students || students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <h2 className="text-2xl font-semibold mb-4">No Data Available</h2>
        <p className="text-slate-500 mb-6">No student data was found. Please start a new assessment or check database connection.</p>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => navigate("/")}
        >
          Return to Home
        </button>
      </div>
    );
  }

  // Find the selected student's stats
  const selectedStatsData = studentStats.find(stats => {
    const student = allStudents.find(s => s.id === selectedStudentId);
    return stats.name === student?.name;
  });

  // Filter rankings by class
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
      const student = allStudents.find(s => s.name === stat.name);
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
          setSelectedClass={handleClassChange}
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
