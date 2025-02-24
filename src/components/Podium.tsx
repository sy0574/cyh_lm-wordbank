
import { Student } from "@/types/match";

interface PodiumProps {
  rankings: Array<{
    student: Student;
    score: number;
  }>;
}

const Podium = ({ rankings }: PodiumProps) => {
  return (
    <div className="relative h-48 flex items-end justify-center gap-4 mb-8">
      {/* Second Place */}
      {rankings[1] && (
        <div className="relative flex flex-col items-center">
          <img
            src={rankings[1].student.avatar}
            alt={rankings[1].student.name}
            className="w-12 h-12 rounded-full mb-2 border-2 border-silver"
          />
          <div className="bg-gray-300 w-20 h-28 flex items-center justify-center rounded-t-lg">
            <span className="text-sm font-semibold">{rankings[1].score}</span>
          </div>
          <span className="absolute -bottom-6 text-xs font-medium">2nd</span>
        </div>
      )}

      {/* First Place */}
      {rankings[0] && (
        <div className="relative flex flex-col items-center">
          <img
            src={rankings[0].student.avatar}
            alt={rankings[0].student.name}
            className="w-14 h-14 rounded-full mb-2 border-2 border-gold"
          />
          <div className="bg-yellow-400 w-20 h-36 flex items-center justify-center rounded-t-lg">
            <span className="text-sm font-semibold">{rankings[0].score}</span>
          </div>
          <span className="absolute -bottom-6 text-xs font-medium">1st</span>
        </div>
      )}

      {/* Third Place */}
      {rankings[2] && (
        <div className="relative flex flex-col items-center">
          <img
            src={rankings[2].student.avatar}
            alt={rankings[2].student.name}
            className="w-10 h-10 rounded-full mb-2 border-2 border-bronze"
          />
          <div className="bg-amber-700 w-20 h-24 flex items-center justify-center rounded-t-lg">
            <span className="text-sm font-semibold text-white">
              {rankings[2].score}
            </span>
          </div>
          <span className="absolute -bottom-6 text-xs font-medium">3rd</span>
        </div>
      )}
    </div>
  );
};

export default Podium;
