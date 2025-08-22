
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useEnergyActions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createEnergyAlert = useMutation({
    mutationFn: async (alertData: any) => {
      const { data, error } = await (supabase as any)
        .from('energy_alerts')
        .insert(alertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Alerte créée",
        description: "L'alerte énergétique a été créée avec succès",
      });
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
      const { error } = await (supabase as any)
        .from('energy_alerts')
        .update({ 
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Alerte résolue",
        description: "L'alerte énergétique a été marquée comme résolue",
      });
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
      const { error } = await supabase
        .from('energy_consumption')
        .update(data)
        .eq('id', id);

      if (error) throw error;
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
