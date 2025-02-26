import { useState, useEffect } from "react";
import StudentSelector from "./StudentSelector";
import ClassSelector from "./ClassSelector";
import TimeFilter, { TimeFilter as TimeFilterType } from "./TimeFilter";
import PerformanceMetrics from "./PerformanceMetrics";
import PerformanceCharts from "./PerformanceCharts";
import PerformanceDetails from "./PerformanceDetails";
import { Student, StudentStats } from "@/types/match";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

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

// Map between tab values and time filter values
const mapTabToTimeFilter = (tab: string): TimeFilterType => {
  switch (tab) {
    case "today":
      return "today";
    case "this-week":
      return "this-week";
    case "this-month":
      return "this-month";
    case "all":
      return "all";
    default:
      return "all"; // Default to "all" for "current" and any other tab
  }
};

// Map between time filter values and tab values
const mapTimeFilterToTab = (filter: TimeFilterType): string => {
  switch (filter) {
    case "today":
      return "today";
    case "this-week":
      return "this-week";
    case "this-month":
      return "this-month";
    case "all":
      return "all";
    default:
      return "current"; // Default "current" for any other filter
  }
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
  // Initialize activeTab based on current timeFilter
  const [activeTab, setActiveTab] = useState(mapTimeFilterToTab(timeFilter));

  // 当标签页改变时，更新时间过滤器
  useEffect(() => {
    const newTimeFilter = mapTabToTimeFilter(activeTab);
    console.log(`Tab changed to: ${activeTab}, setting time filter to: ${newTimeFilter}`);
    setTimeFilter(newTimeFilter);
  }, [activeTab, setTimeFilter]);

  // When timeFilter changes externally, sync the activeTab
  useEffect(() => {
    const mappedTab = mapTimeFilterToTab(timeFilter);
    if (mappedTab !== activeTab) {
      console.log(`Time filter changed to: ${timeFilter}, syncing tab to: ${mappedTab}`);
      setActiveTab(mappedTab);
    }
  }, [timeFilter, activeTab]);

  // When class changes, we need to keep the current active tab
  useEffect(() => {
    console.log(`Class changed to: ${selectedClass}, keeping current tab: ${activeTab}`);
  }, [selectedClass, activeTab]);

  const percentage = selectedStatsData ? Math.round((selectedStatsData.correct / (selectedStatsData.total || 1)) * 100) : 0;

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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="current">Current Assessment</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="this-week">This Week</TabsTrigger>
          <TabsTrigger value="this-month">This Month</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current">
          <Card>
            <CardContent className="space-y-6 pt-6">
              {!selectedStatsData || selectedStatsData.total === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  暂无数据
                </div>
              ) : (
                <>
                  <PerformanceMetrics
                    percentage={percentage}
                    averageResponseTime={selectedStatsData.averageResponseTime}
                  />
                  <PerformanceCharts data={scoreData} />
                  <PerformanceDetails words={selectedStatsData.words} />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="today">
          <Card>
            <CardContent className="space-y-6 pt-6">
              {!selectedStatsData || selectedStatsData.total === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  暂无历史数据
                </div>
              ) : (
                <>
                  <PerformanceMetrics
                    percentage={percentage}
                    averageResponseTime={selectedStatsData.averageResponseTime}
                  />
                  <PerformanceCharts data={scoreData} />
                  <PerformanceDetails words={selectedStatsData.words} />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="this-week">
          <Card>
            <CardContent className="space-y-6 pt-6">
              {!selectedStatsData || selectedStatsData.total === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  暂无历史数据
                </div>
              ) : (
                <>
                  <PerformanceMetrics
                    percentage={percentage}
                    averageResponseTime={selectedStatsData.averageResponseTime}
                  />
                  <PerformanceCharts data={scoreData} />
                  <PerformanceDetails words={selectedStatsData.words} />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="this-month">
          <Card>
            <CardContent className="space-y-6 pt-6">
              {!selectedStatsData || selectedStatsData.total === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  暂无历史数据
                </div>
              ) : (
                <>
                  <PerformanceMetrics
                    percentage={percentage}
                    averageResponseTime={selectedStatsData.averageResponseTime}
                  />
                  <PerformanceCharts data={scoreData} />
                  <PerformanceDetails words={selectedStatsData.words} />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all">
          <Card>
            <CardContent className="space-y-6 pt-6">
              {!selectedStatsData || selectedStatsData.total === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  暂无历史数据
                </div>
              ) : (
                <>
                  <PerformanceMetrics
                    percentage={percentage}
                    averageResponseTime={selectedStatsData.averageResponseTime}
                  />
                  <PerformanceCharts data={scoreData} />
                  <PerformanceDetails words={selectedStatsData.words} />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedStatsData && selectedStatsData.total > 0 && (
        <div className="text-accent font-medium text-center">
          {getFeedback(percentage)}
        </div>
      )}
    </div>
  );
};

export default StudentPerformanceContent;
