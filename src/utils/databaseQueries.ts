import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const getUniqueClasses = async () => {
  try {
    console.log('Fetching unique classes from database');
    const { data, error } = await supabase
      .from('students')
      .select('class');

    if (error) {
      console.error('Error fetching classes:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('No classes found in database');
      return [];
    }

    // Get unique classes using Set
    const uniqueClasses = [...new Set(data.map(item => item.class).filter(Boolean))];
    console.log(`Found ${uniqueClasses.length} unique classes:`, uniqueClasses);
    
    return uniqueClasses;
  } catch (error) {
    console.error('Unexpected error fetching classes:', error);
    return [];
  }
};

export const useStudentsByClass = (className?: string) => {
  return useQuery({
    queryKey: ['students', className || 'all'],
    queryFn: async () => {
      try {
        console.log(`Fetching students for class: ${className || 'all'}`);
        
        let query = supabase.from('students').select('*');
        
        // Only apply the filter if a specific class is selected
        if (className) {
          query = query.eq('class', className);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching students:', error);
          return [];
        }
        
        console.log(`Found ${data?.length || 0} students for class: ${className || 'all'}`);
        
        return (data || []).map(student => ({
          ...student,
          avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=${student.id}`
        }));
      } catch (error) {
        console.error('Unexpected error fetching students:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in garbage collection for 30 minutes
  });
};

export const getStudentsByClass = async (className: string) => {
  try {
    console.log(`Directly fetching students for class: ${className || 'all'}`);
    
    let query = supabase.from('students').select('*');
    
    // Only apply the filter if a specific class is selected
    if (className && className !== 'all') {
      query = query.eq('class', className);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching students:', error);
      return [];
    }
    
    console.log(`Found ${data?.length || 0} students for class: ${className || 'all'}`);
    
    return (data || []).map(student => ({
      ...student,
      avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=${student.id}`
    }));
  } catch (error) {
    console.error('Unexpected error directly fetching students:', error);
    return [];
  }
};
