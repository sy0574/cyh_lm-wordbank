
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  answerNumber: number;
  responseTime: number;
}

interface ResponseTimeChartProps {
  data: ChartData[];
}

const ResponseTimeChart = ({ data }: ResponseTimeChartProps) => {
  return (
    <div className="h-64 w-full">
      <h3 className="text-sm font-medium mb-2">Response Time Trend</h3>
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
          <YAxis label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="responseTime"
            name="Response Time"
            stroke="#10b981"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResponseTimeChart;
