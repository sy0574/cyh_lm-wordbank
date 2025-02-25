
import { Student } from "@/types/match";
import { useState } from "react";

interface StudentAvatarProps {
  student: Student;
  timerProgress: number;
  onToggleDefinition: () => void;
}

const StudentAvatar = ({ student, timerProgress, onToggleDefinition }: StudentAvatarProps) => {
  const timerCircumference = 2 * Math.PI * 32;
  const timerStrokeDashoffset = timerCircumference * (1 - timerProgress / 100);

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <button
        onClick={onToggleDefinition}
        className="group relative w-16 h-16 cursor-pointer focus:outline-none transition-transform hover:scale-105"
        title="Toggle translation"
      >
        <svg className="absolute -top-1 -left-1 w-[72px] h-[72px] -rotate-90">
          <circle
            cx="36"
            cy="36"
            r="32"
            className="fill-none stroke-muted/50 stroke-[3]"
          />
          <circle
            cx="36"
            cy="36"
            r="32"
            className="fill-none stroke-primary stroke-[3]"
            style={{
              strokeDasharray: timerCircumference,
              strokeDashoffset: timerStrokeDashoffset,
              transition: 'stroke-dashoffset 0.1s linear',
            }}
          />
        </svg>
        <img
          src={student.avatar}
          alt={`${student.name}'s avatar`}
          className="w-16 h-16 rounded-full relative z-10 transition-opacity group-hover:opacity-90 ring-2 ring-primary/20"
        />
      </button>
      <span className="font-medium text-base text-muted-foreground">{student.name}</span>
    </div>
  );
};

export default StudentAvatar;
