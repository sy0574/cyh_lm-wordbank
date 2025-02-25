
import { supabase } from "@/integrations/supabase/client";

export const getUniqueClasses = async () => {
  const { data, error } = await supabase
    .from('students')
    .select('class')
    .distinct();

  if (error) {
    console.error('Error fetching classes:', error);
    return [];
  }

  return data.map(item => item.class);
};

export const getStudentsByClass = async (className: string) => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('class', className);

  if (error) {
    console.error('Error fetching students:', error);
    return [];
  }

  // Transform the data to include an avatar field
  return data.map(student => ({
    ...student,
    avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=${student.id}` // Using DiceBear for avatars
  }));
};
