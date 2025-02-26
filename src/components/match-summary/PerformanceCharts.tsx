import ScoreTrendChart from './ScoreTrendChart';
import ResponseTimeChart from './ResponseTimeChart';

interface ChartData {
  answerNumber: number;
  score: number;
  responseTime: number;
  answeredAt: Date;
}

interface PerformanceChartsProps {
  data: ChartData[];
}

const PerformanceCharts = ({ data }: PerformanceChartsProps) => {
  // If no data is available, show a message
  if (!data || data.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-6 text-muted-foreground">
          No chart data available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ScoreTrendChart data={data} />
      <ResponseTimeChart data={data} />
    </div>
  );
};

export default PerformanceCharts;
