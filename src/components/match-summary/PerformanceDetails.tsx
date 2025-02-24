
interface WordResult {
  word: string;
  correct: boolean;
  responseTime: number;
  pointsEarned: number;
}

interface PerformanceDetailsProps {
  words: WordResult[];
}

const PerformanceDetails = ({ words }: PerformanceDetailsProps) => {
  return (
    <div>
      <div className="text-sm font-medium mb-2">Performance Details</div>
      <div className="grid gap-2">
        {words.map((result, index) => (
          <div
            key={index}
            className={`p-2 rounded-md text-sm flex justify-between items-center ${
              result.correct ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
            }`}
          >
            <span>{result.word}</span>
            <div className="flex items-center gap-4">
              <span>{result.responseTime}ms</span>
              <span>{result.pointsEarned} points</span>
              <span>{result.correct ? "Correct" : "Incorrect"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceDetails;
