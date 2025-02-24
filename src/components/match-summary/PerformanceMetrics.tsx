
interface PerformanceMetricsProps {
  percentage: number;
  averageResponseTime: number;
}

const getGrade = (percentage: number) => {
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
};

const PerformanceMetrics = ({ percentage, averageResponseTime }: PerformanceMetricsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 text-center">
      <div>
        <div className="text-2xl font-bold">{percentage}%</div>
        <div className="text-sm text-muted-foreground">Accuracy</div>
      </div>
      <div>
        <div className="text-2xl font-bold">{averageResponseTime}ms</div>
        <div className="text-sm text-muted-foreground">Avg. Response Time</div>
      </div>
      <div>
        <div className="text-2xl font-bold">{getGrade(percentage)}</div>
        <div className="text-sm text-muted-foreground">Grade</div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
