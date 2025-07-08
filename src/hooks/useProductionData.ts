
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProductionData = () => {
  return useQuery({
    queryKey: ['production-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('production_lots')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useQualityTests = () => {
  return useQuery({
    queryKey: ['quality-tests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quality_tests')
        .select(`
          *,
          production_lots (
            lot_number,
            product_type
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};
