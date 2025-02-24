
export interface Student {
  id: string;
  name: string;
  avatar: string;
}

export interface Group {
  id: string;
  name: string;
  students: Student[];
}
