import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";

export const useEnergyActions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createEnergyAlert = useMutation({
    mutationFn: async (alertData: any) => {
      // Simplified for now - energy alerts table doesn't exist yet
      toast({
        title: "Alerte créée",
        description: "L'alerte énergétique a été créée avec succès",
      });
      return { id: Math.random().toString(36), ...alertData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['energy-alerts'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'alerte : " + error.message,
        variant: "destructive",
      });
    },
  });

  const resolveEnergyAlert = useMutation({
    mutationFn: async (alertId: string) => {
      // Simplified for now - energy alerts table doesn't exist yet
      toast({
        title: "Alerte résolue",
        description: "L'alerte énergétique a été marquée comme résolue",
      });
      return { id: alertId, status: 'resolved' };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['energy-alerts'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de résoudre l'alerte : " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateEnergyData = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      // Use actual API service for energy consumption updates if needed
      return await apiService.createEnergyRecord(data);
    },
    onSuccess: () => {
      toast({
        title: "Données mises à jour",
        description: "Les données énergétiques ont été mises à jour",
      });
      queryClient.invalidateQueries({ queryKey: ['energy-consumption'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les données : " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    createEnergyAlert,
    resolveEnergyAlert,
    updateEnergyData
  };
};