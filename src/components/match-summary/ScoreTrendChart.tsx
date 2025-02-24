
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

interface ChartData {
  answerNumber: number;
  score: number;
}

interface ScoreTrendChartProps {
  data: ChartData[];
}

const ScoreTrendChart = ({ data }: ScoreTrendChartProps) => {
  const [animationPercent, setAnimationPercent] = useState<number>(0);

  useEffect(() => {
    // Reset animation when data changes
    setAnimationPercent(0);
    
    // Animate from 0 to 100%
    const timer = setTimeout(() => {
      setAnimationPercent(100);
    }, 100);

    return () => clearTimeout(timer);
  }, [data]);

  return (
    <div className="h-64 w-full">
      <h3 className="text-sm font-medium mb-2">Score Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="answerNumber" label={{ value: 'Answer Number', position: 'bottom' }} />
          <YAxis label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="score"
            name="Score"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
            animationBegin={0}
            animationDuration={1500}
            animationEasing="ease-in-out"
            strokeDasharray="2000"
            strokeDashoffset={((100 - animationPercent) / 100) * 2000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreTrendChart;
