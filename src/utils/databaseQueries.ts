
import { supabase } from "@/integrations/supabase/client";

export const getUniqueClasses = async () => {
  const { data, error } = await supabase
    .from('students')
    .select('class')
    .then(result => {
      if (result.error) throw result.error;
      // Get unique classes using Set
      const uniqueClasses = [...new Set(result.data.map(item => item.class))];
      return { data: uniqueClasses, error: null };
    });

  if (error) {
    console.error('Error fetching classes:', error);
    return [];
  }

  return data;
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
