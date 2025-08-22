
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";

export const useProductionData = () => {
  return useQuery({
    queryKey: ['production-data'],
    queryFn: async () => {
      return await apiService.getProductionLots();
    },
  });
};

export const useQualityTests = () => {
  return useQuery({
    queryKey: ['quality-tests'],
    queryFn: async () => {
      return await apiService.getQualityTests();
    },
  });
};
