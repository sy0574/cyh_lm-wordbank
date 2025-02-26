import { useState, useEffect } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { fetchMatchData, type Student, type RankingData, type MatchData } from '@/lib/api-client';

// Create a QueryClient instance - this is now created at component level to avoid server/client mismatch
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
    },
  },
});

// Separate component to handle query logic
function MatchSummaryContent() {
  // Start with 'test' as the default selected class
  const [selectedClass, setSelectedClass] = useState<string>('test');
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [dataVersion, setDataVersion] = useState<number>(0);
  const [isClassSwitching, setIsClassSwitching] = useState(false);

  // Use a single query for all match data with proper configuration
  const { 
    data: matchData,
    isLoading,
    error,
    refetch,
    status,
    isFetching
  } = useQuery({
    queryKey: ['match-summary', selectedClass, dataVersion],
    queryFn: () => fetchMatchData(selectedClass),
    enabled: !!selectedClass
  });

  // Reset the class switching state when data is loaded
  useEffect(() => {
    if (!isLoading && !isFetching) {
      setIsClassSwitching(false);
    }
  }, [isLoading, isFetching]);

  // Handle class change with robust error handling
  const handleClassChange = (value: string) => {
    console.log(`[Component] Class changed from ${selectedClass} to ${value}`);
    
    if (value !== selectedClass) {
      setIsClassSwitching(true);
      setSelectedClass(value);
      setSelectedStudent(null); // Reset selected student using null
      
      // Force a new query by incrementing the version
      setDataVersion(prev => prev + 1);
      
      // Invalidate the query cache for the new class
      queryClient.invalidateQueries({ queryKey: ['match-summary', value] });
      
      // Refetch immediately
      refetch();
    }
  };

  // Select the first student when data changes
  useEffect(() => {
    if (matchData?.students?.length > 0 && selectedStudent === null && !isClassSwitching) {
      setSelectedStudent(matchData.students[0].id);
      console.log(`[Component] Auto-selected student: ${matchData.students[0].id} (${matchData.students[0].name})`);
    }
  }, [matchData, selectedStudent, isClassSwitching]);

  // Get current student data with safety checks
  const currentStudentData = matchData?.students?.find(
    (student: Student) => student.id === selectedStudent
  );

  // Debug logging for component state
  useEffect(() => {
    console.log('[Component] Current state:', {
      selectedClass,
      selectedStudent,
      dataVersion,
      queryStatus: status,
      isLoading,
      hasError: !!error,
      hasData: !!matchData,
      studentCount: matchData?.students?.length || 0,
      rankingsCount: matchData?.rankings?.length || 0
    });
  }, [selectedClass, selectedStudent, matchData, dataVersion, status, isLoading, error]);

  // Error display component
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="flex items-center p-4 my-4 text-red-800 border border-red-300 rounded-lg bg-red-50">
      <AlertCircle className="w-5 h-5 mr-2" />
      <span>{message}</span>
    </div>
  );

  // Render chart only when we have valid data
  const renderChart = () => {
    if (!currentStudentData?.scoreHistory?.length) {
      return null;
    }

    return (
      <div>
        <h3 className="font-medium mb-4">Score Trend</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentStudentData.scoreHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 200]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#4f46e5" 
                activeDot={{ r: 8 }}
                isAnimationActive={!isClassSwitching} // Disable animation during class switching
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Render student metrics
  const renderMetrics = () => {
    if (isLoading || isFetching || isClassSwitching) {
      return (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      );
    }

    if (!currentStudentData) {
      return (
        <p className="text-center text-slate-500 py-10">
          {matchData?.students?.length ? '请选择学生' : '暂无数据'}
        </p>
      );
    }

    return (
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl">{currentStudentData.accuracy || '0'}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">Accuracy</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl">{currentStudentData.responseTime || '0'}ms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">Avg. Response Time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl">{currentStudentData.grade || 'N/A'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">Grade</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render rankings
  const renderRankings = () => {
    if (isLoading || isFetching || isClassSwitching) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      );
    }

    if (!matchData?.rankings?.length) {
      return <p className="text-center text-slate-500 py-10">暂无排名数据</p>;
    }

    return (
      <div className="space-y-4">
        {matchData.rankings.map((rank: RankingData, index: number) => (
          <div key={rank.id} className="flex items-center p-3 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-4">
              {index + 1}
            </div>
            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white mr-4">
              {rank.avatar || rank.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-medium">{rank.name}</p>
              <div className="flex items-center text-sm text-slate-500">
                <span className="mr-4">{rank.score}分</span>
                <span>{rank.responseTime}ms</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold">Results Summary</h1>
        <p className="text-slate-500 mb-6">Multiple Student Performance Report</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">班级</h2>
              <div className="relative">
                <Select
                  value={selectedClass}
                  onValueChange={handleClassChange}
                  disabled={isClassSwitching}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test">test</SelectItem>
                    <SelectItem value="G7-Sat">G7-Sat</SelectItem>
                  </SelectContent>
                </Select>
                {/* Debug info - remove in production */}
                <div className="text-xs text-gray-500 mt-1">
                  Status: {status}, Class: {selectedClass}, Loading: {(isLoading || isFetching || isClassSwitching) ? 'Yes' : 'No'}
                </div>
              </div>
            </div>

            {error && (
              <ErrorMessage message={`Error loading data: ${(error as Error).message}`} />
            )}

            <div className="mb-6">
              <h2 className="text-lg font-medium mb-4">Select Student</h2>
              <div className="flex flex-wrap gap-2">
                {isLoading || isFetching || isClassSwitching ? (
                  <div className="space-x-2">
                    <Skeleton className="h-10 w-20 rounded-full" />
                    <Skeleton className="h-10 w-20 rounded-full" />
                    <Skeleton className="h-10 w-20 rounded-full" />
                  </div>
                ) : !matchData?.students?.length ? (
                  <p className="text-slate-500 py-2">No students found for this class</p>
                ) : (
                  matchData.students.map((student: Student) => (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudent(student.id)}
                      className={`px-4 py-2 rounded-full text-sm ${
                        selectedStudent === student.id
                          ? 'bg-blue-600 text-white border border-blue-600'
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                      disabled={isClassSwitching}
                    >
                      {student.name}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="mb-4">
              <Tabs defaultValue="current">
                <TabsList className="w-full flex justify-center mb-4">
                  <TabsTrigger value="current" className="flex-1">Current Assessment</TabsTrigger>
                  <TabsTrigger value="today" className="flex-1">Today</TabsTrigger>
                  <TabsTrigger value="week" className="flex-1">This Week</TabsTrigger>
                  <TabsTrigger value="month" className="flex-1">This Month</TabsTrigger>
                  <TabsTrigger value="alltime" className="flex-1">All Time</TabsTrigger>
                </TabsList>
                
                <TabsContent value="current">
                  {renderMetrics()}
                  {renderChart()}
                </TabsContent>
                
                <TabsContent value="today">
                  <p className="text-center text-slate-500 py-10">Today's data will be displayed here</p>
                </TabsContent>
                
                <TabsContent value="week">
                  <p className="text-center text-slate-500 py-10">This week's data will be displayed here</p>
                </TabsContent>
                
                <TabsContent value="month">
                  <p className="text-center text-slate-500 py-10">This month's data will be displayed here</p>
                </TabsContent>
                
                <TabsContent value="alltime">
                  <p className="text-center text-slate-500 py-10">All time historical data will be displayed here</p>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">班级排名</h2>
            {renderRankings()}
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper component to provide query client - this helps avoid hydration issues
export default function MatchSummary() {
  // Only render the component client-side to avoid hydration issues
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold">Results Summary</h1>
          <p className="text-slate-500 mb-6">Multiple Student Performance Report</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
              <Skeleton className="h-10 w-full mb-6" />
              <Skeleton className="h-20 w-full mb-6" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <Skeleton className="h-10 w-full mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <MatchSummaryContent />
    </QueryClientProvider>
  );
} 