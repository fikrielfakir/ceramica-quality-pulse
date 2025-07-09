
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

// Enhanced Quality Tests Hook
export const useEnhancedQualityTests = () => {
  return useQuery({
    queryKey: ["enhanced-quality-tests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quality_tests")
        .select(`
          *,
          production_lots (
            lot_number,
            product_type,
            production_date
          ),
          profiles (
            full_name,
            email
          )
        `)
        .order("test_date", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Quality Standards Hook
export const useQualityStandards = () => {
  return useQuery({
    queryKey: ["quality-standards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quality_standards")
        .select("*")
        .eq("is_active", true)
        .order("standard_name");
      
      if (error) throw error;
      return data;
    },
  });
};

// Equipment Calibration Hook
export const useEquipmentCalibration = () => {
  return useQuery({
    queryKey: ["equipment-calibration"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipment_calibration")
        .select("*")
        .eq("is_active", true)
        .order("next_calibration_date");
      
      if (error) throw error;
      return data;
    },
  });
};

// Resistance Tests Hook
export const useResistanceTests = () => {
  return useQuery({
    queryKey: ["resistance-tests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resistance_tests")
        .select(`
          *,
          production_lots (
            lot_number,
            product_type
          ),
          profiles!resistance_tests_controller_id_fkey (
            full_name
          ),
          resistance_test_samples (
            *
          )
        `)
        .order("test_date", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Humidity Controls Hook
export const useHumidityControls = () => {
  return useQuery({
    queryKey: ["humidity-controls"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("humidity_controls")
        .select(`
          *,
          production_lots (
            lot_number,
            product_type
          ),
          profiles!humidity_controls_controller_id_fkey (
            full_name
          )
        `)
        .order("test_date", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Dimensional Surface Tests Hook
export const useDimensionalSurfaceTests = () => {
  return useQuery({
    queryKey: ["dimensional-surface-tests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dimensional_surface_tests")
        .select(`
          *,
          production_lots (
            lot_number,
            product_type
          ),
          profiles!dimensional_surface_tests_controller_id_fkey (
            full_name
          ),
          dimensional_surface_measurements (
            *
          )
        `)
        .order("test_date", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Mutation to create resistance test
export const useCreateResistanceTest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (testData: any) => {
      const { data, error } = await supabase
        .from("resistance_tests")
        .insert({
          ...testData,
          created_by: user?.id,
          controller_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resistance-tests"] });
    },
  });
};

// Mutation to create humidity control
export const useCreateHumidityControl = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (controlData: any) => {
      const { data, error } = await supabase
        .from("humidity_controls")
        .insert({
          ...controlData,
          created_by: user?.id,
          controller_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["humidity-controls"] });
    },
  });
};

// Mutation to create dimensional surface test
export const useCreateDimensionalSurfaceTest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (testData: any) => {
      const { data, error } = await supabase
        .from("dimensional_surface_tests")
        .insert({
          ...testData,
          created_by: user?.id,
          controller_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dimensional-surface-tests"] });
    },
  });
};
