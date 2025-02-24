
export interface StudentData {
  id: string;
  name: string;
  class: string;
}

export const studentData: StudentData[] = [
  { id: '1', name: 'Carl', class: 'test' },
  { id: '2', name: 'Jenny', class: 'test1' },
  { id: '3', name: 'Forrest', class: 'test' },
  { id: '4', name: 'Jack', class: 'test' },
  { id: '5', name: 'Rose', class: 'test' },
  { id: '6', name: 'Jane', class: 'test' },
  { id: '7', name: 'Mickey', class: 'G9_Fri' },
  { id: '8', name: 'Jerry', class: 'G9_Fri' },
  { id: '9', name: 'Harry', class: 'G9_Fri' },
  { id: '10', name: 'Robin', class: 'G9_Fri' },
  { id: '11', name: 'Mark', class: 'G9_Fri' },
  { id: '12', name: 'Jackie', class: 'G9_Fri' },
  { id: '13', name: 'Hanna', class: 'G9_Sun' },
  { id: '14', name: 'Kiki', class: 'G9_Fri' },
  { id: '15', name: 'Susan', class: 'G9_Sun' },
  { id: '16', name: 'Alisa', class: 'G9_Sun' },
  { id: '17', name: 'Terry', class: 'G9_Sun' },
  { id: '18', name: 'Demi', class: 'G9_Sun' },
  { id: '19', name: 'Snow', class: 'G9_Sun' },
  { id: '20', name: 'Zhou', class: 'G9_Sun' },
  { id: '21', name: 'Bob', class: 'G9_Sun' },
  { id: '22', name: 'TinaZ', class: 'G7-Sat' },
  { id: '23', name: 'CiciS', class: 'G7-Sun1' },
  { id: '24', name: 'Felix', class: 'G7-Sat' },
  { id: '25', name: 'LucasZ', class: 'G7-Sat' },
  { id: '26', name: 'Nancy', class: 'G7-Sat' },
  { id: '27', name: 'Martin', class: 'G7-Sat' },
  { id: '28', name: 'Lola', class: 'G7-Sat' },
  { id: '29', name: 'Jacky', class: 'G7-Sat' },
  { id: '30', name: 'William', class: 'G7-Sat' }
];

export const getUniqueClasses = () => {
  const classes = new Set(studentData.map(student => student.class));
  return Array.from(classes);
};

export const getStudentsByClass = (className: string) => {
  return studentData.filter(student => student.class === className);
};
