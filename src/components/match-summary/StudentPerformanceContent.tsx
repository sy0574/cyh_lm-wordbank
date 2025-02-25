
import { useState } from "react";
import StudentSelector from "./StudentSelector";
import ClassSelector from "./ClassSelector";
import TimeFilter, { TimeFilter as TimeFilterType, TIME_FILTERS } from "./TimeFilter";
import PerformanceMetrics from "./PerformanceMetrics";
import PerformanceCharts from "./PerformanceCharts";
import PerformanceDetails from "./PerformanceDetails";
import { Student, StudentStats } from "@/types/match";

interface StudentPerformanceContentProps {
  selectedClass: string;
  selectedStudentId: string | undefined;
  setSelectedStudentId: (id: string) => void;
  setSelectedClass: (className: string) => void;
  timeFilter: TimeFilterType;
  setTimeFilter: (filter: TimeFilterType) => void;
  selectedStatsData: StudentStats | undefined;
  difficulty: string;
}

const getFeedback = (percentage: number) => {
  if (percentage >= 90) return "Outstanding performance!";
  if (percentage >= 70) return "Good job!";
  if (percentage >= 50) return "Keep practicing!";
  return "More practice needed";
};

const StudentPerformanceContent = ({
  selectedClass,
  selectedStudentId,
  setSelectedStudentId,
  setSelectedClass,
  timeFilter,
  setTimeFilter,
  selectedStatsData,
  difficulty,
}: StudentPerformanceContentProps) => {
  const percentage = selectedStatsData ? Math.round((selectedStatsData.correct / selectedStatsData.total) * 100) : 0;

  const scoreData = selectedStatsData?.words.map(result => ({
    answerNumber: result.answerNumber,
    score: result.pointsEarned,
    responseTime: result.responseTime,
    answeredAt: result.answeredAt
  })) || [];

  return (
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
  );
};

export default StudentPerformanceContent;
