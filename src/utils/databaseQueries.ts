
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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

export const useStudentsByClass = (className: string) => {
  return useQuery({
    queryKey: ['students', className],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('class', className);

      if (error) {
        console.error('Error fetching students:', error);
        return [];
      }

      return data.map(student => ({
        ...student,
        avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=${student.id}`
      }));
    },
    enabled: !!className,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in garbage collection for 30 minutes
  });
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

  return data.map(student => ({
    ...student,
    avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=${student.id}`
  }));
};
