
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useEnergyConsumption = () => {
  return useQuery({
    queryKey: ['energy-consumption'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('energy_consumption')
        .select('*')
        .order('recorded_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useWasteRecords = () => {
  return useQuery({
    queryKey: ['waste-records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('waste_records')
        .select('*')
        .order('recorded_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};
