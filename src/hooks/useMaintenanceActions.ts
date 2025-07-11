
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useMaintenanceActions = () => {
  const { toast } = useToast();
  const { hasPermission } = useAuth();
  const [loading, setLoading] = useState(false);

  const scheduleMaintenance = async (maintenanceData: any) => {
    if (!hasPermission('schedule_maintenance')) {
      toast({ title: "Permission refusée", description: "Vous n'avez pas l'autorisation de programmer la maintenance", variant: "destructive" });
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('maintenance_schedules' as any)
        .insert({
          ...maintenanceData,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({ title: "Maintenance programmée", description: "La maintenance a été programmée avec succès" });
      return true;
    } catch (error) {
      console.error('Error scheduling maintenance:', error);
      toast({ title: "Erreur", description: "Erreur lors de la programmation", variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateMaintenanceStatus = async (scheduleId: string, status: string, notes?: string) => {
    if (!hasPermission('schedule_maintenance')) {
      toast({ title: "Permission refusée", description: "Vous n'avez pas l'autorisation de modifier la maintenance", variant: "destructive" });
      return false;
    }

    setLoading(true);
    try {
      const updateData: any = { status };
      if (notes) updateData.notes = notes;
      if (status === 'completed') updateData.actual_duration = new Date().getHours(); // Simple duration calc

      const { error } = await supabase
        .from('maintenance_schedules' as any)
        .update(updateData)
        .eq('id', scheduleId);

      if (error) throw error;

      toast({ title: "Statut mis à jour", description: `Maintenance marquée comme ${status}` });
      return true;
    } catch (error) {
      console.error('Error updating maintenance:', error);
      toast({ title: "Erreur", description: "Erreur lors de la mise à jour", variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    scheduleMaintenance,
    updateMaintenanceStatus,
    loading
  };
};
