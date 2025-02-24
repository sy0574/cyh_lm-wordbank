
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface ChartData {
  answerNumber: number;
  responseTime: number;
  answeredAt?: Date;
}

interface ResponseTimeChartProps {
  data: ChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="text-sm font-medium">Answer #{label}</p>
        <p className="text-sm text-green-600">Response Time: {data.responseTime}ms</p>
        {data.answeredAt && (
          <p className="text-xs text-gray-500">
            {format(new Date(data.answeredAt), 'yyyy-MM-dd HH:mm:ss')}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const ResponseTimeChart = ({ data }: ResponseTimeChartProps) => {
  const [key, setKey] = useState(0);
  const [animationPercent, setAnimationPercent] = useState<number>(0);

  useEffect(() => {
    setKey(prev => prev + 1);
    setAnimationPercent(0);
    
    const timer = setTimeout(() => {
      setAnimationPercent(100);
    }, 100);

    return () => clearTimeout(timer);
  }, [data]);

  return (
    <div className="h-64 w-full">
      <h3 className="text-sm font-medium mb-2">Response Time Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          key={key}
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
          <YAxis label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="responseTime"
            name="Response Time"
            stroke="#10b981"
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

export default ResponseTimeChart;

