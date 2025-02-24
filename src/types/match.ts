
export interface Student {
  id: string;
  name: string;
  avatar: string;
}

export interface MatchResult {
  word: string;
  correct: boolean;
  student: Student;
  responseTime: number;
  pointsEarned: number;
  answerNumber: number;
}

export interface StudentScore {
  student: Student;
  score: number;
}

export interface StudentStats {
  name: string;
  avatar: string;
  correct: number;
  total: number;
  averageResponseTime: number;
  words: Array<{
    word: string;
    correct: boolean;
    responseTime: number;
    pointsEarned: number;
    answerNumber: number;
    answeredAt?: Date;
  }>;
}
