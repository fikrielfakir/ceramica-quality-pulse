
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useMaintenanceActions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const scheduleMaintenanceTask = useMutation({
    mutationFn: async (taskData: any) => {
      const { data, error } = await (supabase as any)
        .from('maintenance_schedules')
        .insert(taskData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Maintenance programmée",
        description: "La tâche de maintenance a été programmée avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['maintenance-schedules'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de programmer la maintenance : " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateMaintenanceTask = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await (supabase as any)
        .from('maintenance_schedules')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Maintenance mise à jour",
        description: "La tâche de maintenance a été mise à jour",
      });
      queryClient.invalidateQueries({ queryKey: ['maintenance-schedules'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la maintenance : " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    scheduleMaintenanceTask,
    updateMaintenanceTask
  };
};
