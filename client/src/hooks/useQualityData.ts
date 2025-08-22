import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { useAuth } from "./useAuth";

// Enhanced Quality Tests Hook - Fixed to work with updated database schema
export const useEnhancedQualityTests = () => {
  return useQuery({
    queryKey: ["enhanced-quality-tests"],
    queryFn: async () => {
      return await apiService.getQualityTests();
    },
  });
};

// Quality Standards Hook - Simplified for migration
export const useQualityStandards = () => {
  return useQuery({
    queryKey: ["quality-standards"],
    queryFn: async () => {
      // Return empty array for now, implement when standards table is added
      return [];
    },
  });
};

// Equipment Calibration Hook - Simplified for migration  
export const useEquipmentCalibration = () => {
  return useQuery({
    queryKey: ["equipment-calibration"],
    queryFn: async () => {
      // Return empty array for now, implement when calibration table is added
      return [];
    },
  });
};

// Resistance Tests Hook - Simplified for migration
export const useResistanceTests = () => {
  return useQuery({
    queryKey: ["resistance-tests"],
    queryFn: async () => {
      // Return empty array for now, implement when resistance tests table is added
      return [];
    },
  });
};

// Humidity Controls Hook - Simplified for migration
export const useHumidityControls = () => {
  return useQuery({
    queryKey: ["humidity-controls"],
    queryFn: async () => {
      // Return empty array for now, implement when humidity controls table is added
      return [];
    },
  });
};

// Dimensional Measurements Hook - Simplified for migration
export const useDimensionalMeasurements = () => {
  return useQuery({
    queryKey: ["dimensional-measurements"],
    queryFn: async () => {
      // Return empty array for now, implement when dimensional measurements table is added
      return [];
    },
  });
};

// Testing Campaigns Hook
export const useTestingCampaigns = () => {
  return useQuery({
    queryKey: ["testing-campaigns"],
    queryFn: async () => {
      return await apiService.getTestingCampaigns();
    },
  });
};

// Create Quality Test Mutation
export const useCreateQualityTest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (testData: any) => {
      return await apiService.createQualityTest(testData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quality-tests"] });
      queryClient.invalidateQueries({ queryKey: ["enhanced-quality-tests"] });
    },
  });
};

// Update Quality Test Mutation
export const useUpdateQualityTest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, testData }: { id: string; testData: any }) => {
      return await apiService.updateQualityTest(id, testData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quality-tests"] });
      queryClient.invalidateQueries({ queryKey: ["enhanced-quality-tests"] });
    },
  });
};

// Create Testing Campaign Mutation
export const useCreateTestingCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (campaignData: any) => {
      return await apiService.createTestingCampaign(campaignData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testing-campaigns"] });
    },
  });
};