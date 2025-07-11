
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useEnergyActions = () => {
  const { toast } = useToast();
  const { hasPermission } = useAuth();
  const [loading, setLoading] = useState(false);

  const createEnergyAlert = async (alertData: any) => {
    if (!hasPermission('energy_alerts')) {
      toast({ title: "Permission refusée", description: "Vous n'avez pas l'autorisation de gérer les alertes énergie", variant: "destructive" });
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('energy_alerts' as any)
        .insert(alertData);

      if (error) throw error;

      toast({ title: "Alerte créée", description: "L'alerte énergétique a été créée avec succès" });
      return true;
    } catch (error) {
      console.error('Error creating energy alert:', error);
      toast({ title: "Erreur", description: "Erreur lors de la création de l'alerte", variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resolveEnergyAlert = async (alertId: string) => {
    if (!hasPermission('energy_alerts')) {
      toast({ title: "Permission refusée", description: "Vous n'avez pas l'autorisation de résoudre les alertes", variant: "destructive" });
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('energy_alerts' as any)
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', alertId);

      if (error) throw error;

      toast({ title: "Alerte résolue", description: "L'alerte a été marquée comme résolue" });
      return true;
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast({ title: "Erreur", description: "Erreur lors de la résolution de l'alerte", variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const recordEnergyConsumption = async (consumptionData: any) => {
    if (!hasPermission('manage_energy')) {
      toast({ title: "Permission refusée", description: "Vous n'avez pas l'autorisation d'enregistrer la consommation", variant: "destructive" });
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('energy_consumption')
        .insert(consumptionData);

      if (error) throw error;

      toast({ title: "Consommation enregistrée", description: "Les données de consommation ont été enregistrées" });
      return true;
    } catch (error) {
      console.error('Error recording consumption:', error);
      toast({ title: "Erreur", description: "Erreur lors de l'enregistrement", variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createEnergyAlert,
    resolveEnergyAlert,
    recordEnergyConsumption,
    loading
  };
};
