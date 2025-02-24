
import ScoreTrendChart from './ScoreTrendChart';
import ResponseTimeChart from './ResponseTimeChart';

interface ChartData {
  answerNumber: number;
  score: number;
  responseTime: number;
}

interface PerformanceChartsProps {
  data: ChartData[];
}

const PerformanceCharts = ({ data }: PerformanceChartsProps) => {
  return (
    <div className="space-y-4">
      <ScoreTrendChart data={data} />
      <ResponseTimeChart data={data} />
    </div>
  );
};

export default PerformanceCharts;
