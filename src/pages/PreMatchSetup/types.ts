
import { Student } from "@/types/match";

export interface Group {
  id: string;
  name: string;
  students: Student[];
}

export interface DifficultyLevel {
  value: "easy" | "medium" | "hard";
  label: string;
}
