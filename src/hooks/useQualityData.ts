
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useQualityStandards = () => {
  return useQuery({
    queryKey: ['quality-standards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quality_standards')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useDefectTypes = () => {
  return useQuery({
    queryKey: ['defect-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('defect_types')
        .select('*')
        .eq('is_active', true)
        .order('severity', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useEnhancedQualityTests = () => {
  return useQuery({
    queryKey: ['enhanced-quality-tests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quality_tests')
        .select(`
          *,
          production_lots (
            lot_number,
            product_type,
            quantity
          ),
          profiles (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useEquipmentCalibration = () => {
  return useQuery({
    queryKey: ['equipment-calibration'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment_calibration')
        .select('*')
        .order('next_calibration_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useQualityReports = () => {
  return useQuery({
    queryKey: ['quality-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quality_reports')
        .select(`
          *,
          production_lots (
            lot_number,
            product_type
          ),
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};
