import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Select } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Fetch student data for a specific class
const fetchStudentData = async (classId: string) => {
  if (!classId) return null;
  
  // Replace with your actual API call
  const response = await fetch(`/api/students?classId=${classId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch student data');
  }
  return response.json();
};

// Fetch class rankings
const fetchClassRankings = async (classId: string) => {
  if (!classId) return null;
  
  // Replace with your actual API call
  const response = await fetch(`/api/rankings?classId=${classId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch rankings');
  }
  return response.json();
};

export default function StudentDashboard() {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');

  // Use React Query to fetch data with proper caching and refetching
  const { 
    data: studentData,
    isLoading: isLoadingStudents,
    error: studentError
  } = useQuery({
    queryKey: ['students', selectedClass],
    queryFn: () => fetchStudentData(selectedClass),
    enabled: !!selectedClass, // Only fetch when a class is selected
  });

  const { 
    data: rankingData,
    isLoading: isLoadingRankings,
    error: rankingError
  } = useQuery({
    queryKey: ['rankings', selectedClass],
    queryFn: () => fetchClassRankings(selectedClass),
    enabled: !!selectedClass, // Only fetch when a class is selected
  });

  // Handle class change
  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setSelectedStudent(''); // Reset selected student when changing class
  };

  // Select the first student when student data changes
  useEffect(() => {
    if (studentData?.students?.length > 0 && !selectedStudent) {
      setSelectedStudent(studentData.students[0].id);
    }
  }, [studentData, selectedStudent]);

  // Get current student data
  const currentStudentData = studentData?.students?.find(
    (student: any) => student.id === selectedStudent
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold">Results Summary</h1>
        <p className="text-slate-500 mb-6">Multiple Student Performance Report</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-4">Select Student</h2>
              <div className="flex flex-wrap gap-2">
                {isLoadingStudents ? (
                  <p>Loading students...</p>
                ) : studentError ? (
                  <p>Error loading students</p>
                ) : !studentData?.students?.length ? (
                  <p>No students found</p>
                ) : (
                  studentData.students.map((student: any) => (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudent(student.id)}
                      className={`px-4 py-2 rounded-full text-sm ${
                        selectedStudent === student.id
                          ? 'bg-blue-600 text-white border border-blue-600'
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      {student.name}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">班级</h2>
              <Select
                value={selectedClass}
                onValueChange={handleClassChange}
                placeholder="Select class"
              >
                <option value="test">test</option>
                <option value="G7-Sat">G7-Sat</option>
                {/* Add more class options as needed */}
              </Select>
            </div>

            <Tabs defaultValue="current">
              <TabsList className="mb-4">
                <TabsTrigger value="current">Current Assessment</TabsTrigger>
                <TabsTrigger value="historical">Historical Data</TabsTrigger>
              </TabsList>
              
              <TabsContent value="current">
                {!selectedClass ? (
                  <p className="text-center text-slate-500 py-10">Please select a class</p>
                ) : isLoadingStudents ? (
                  <p className="text-center text-slate-500 py-10">Loading data...</p>
                ) : !currentStudentData ? (
                  <p className="text-center text-slate-500 py-10">暂无数据</p>
                ) : (
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
                )}

                {currentStudentData?.scoreHistory && (
                  <div>
                    <h3 className="font-medium mb-4">Score Trend</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={currentStudentData.scoreHistory}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 200]} />
                          <Tooltip />
                          <Line type="monotone" dataKey="score" stroke="#4f46e5" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="historical">
                <p className="text-center text-slate-500 py-10">Historical data will be displayed here</p>
              </TabsContent>
            </Tabs>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">班级排名</h2>
            
            {!selectedClass ? (
              <p className="text-center text-slate-500 py-10">Please select a class</p>
            ) : isLoadingRankings ? (
              <p className="text-center text-slate-500 py-10">Loading rankings...</p>
            ) : rankingError ? (
              <p className="text-center text-slate-500 py-10">Error loading rankings</p>
            ) : !rankingData?.rankings?.length ? (
              <p className="text-center text-slate-500 py-10">暂无排名数据</p>
            ) : (
              <div className="space-y-4">
                {rankingData.rankings.map((rank: any, index: number) => (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 