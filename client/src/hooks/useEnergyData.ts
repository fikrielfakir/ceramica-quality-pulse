
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";

export const useEnergyConsumption = () => {
  return useQuery({
    queryKey: ['energy-consumption'],
    queryFn: async () => {
      return await apiService.getEnergyConsumption();
    },
  });
};

export const useWasteRecords = () => {
  return useQuery({
    queryKey: ['waste-records'],
    queryFn: async () => {
      return await apiService.getWasteRecords();
    },
  });
};
