
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useQualityActions = () => {
  const { toast } = useToast();
  const { hasPermission } = useAuth();
  const [loading, setLoading] = useState(false);

  const createQualityTest = async (testData: any) => {
    if (!hasPermission('create_quality_tests')) {
      toast({ title: "Permission refusée", description: "Vous n'avez pas l'autorisation de créer des tests", variant: "destructive" });
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('quality_tests')
        .insert(testData);

      if (error) throw error;

      toast({ title: "Test créé", description: "Le test qualité a été créé avec succès" });
      return true;
    } catch (error) {
      console.error('Error creating quality test:', error);
      toast({ title: "Erreur", description: "Erreur lors de la création du test", variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (testId: string, reportType: string) => {
    if (!hasPermission('generate_reports')) {
      toast({ title: "Permission refusée", description: "Vous n'avez pas l'autorisation de générer des rapports", variant: "destructive" });
      return null;
    }

    setLoading(true);
    try {
      const { data: test } = await supabase
        .from('quality_tests')
        .select('*')
        .eq('id', testId)
        .single();

      if (!test) throw new Error('Test non trouvé');

      const reportData = {
        test_id: testId,
        report_type: reportType,
        report_data: {
          test_details: test,
          generated_at: new Date().toISOString(),
          status: test.status
        },
        generated_by: (await supabase.auth.getUser()).data.user?.id
      };

      const { data, error } = await supabase
        .from('quality_reports' as any)
        .insert(reportData)
        .select()
        .single();

      if (error) throw error;

      toast({ title: "Rapport généré", description: `Rapport ${reportType} créé avec succès` });
      return data;
    } catch (error) {
      console.error('Error generating report:', error);
      toast({ title: "Erreur", description: "Erreur lors de la génération du rapport", variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createCorrectiveAction = async (testId: string, actionData: any) => {
    if (!hasPermission('corrective_actions')) {
      toast({ title: "Permission refusée", description: "Vous n'avez pas l'autorisation de créer des actions correctives", variant: "destructive" });
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('corrective_actions' as any)
        .insert({
          test_id: testId,
          ...actionData,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({ title: "Action corrective créée", description: "L'action corrective a été initiée avec succès" });
      return true;
    } catch (error) {
      console.error('Error creating corrective action:', error);
      toast({ title: "Erreur", description: "Erreur lors de la création de l'action corrective", variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (reportId: string) => {
    try {
      const { data } = await supabase
        .from('quality_reports' as any)
        .select('*')
        .eq('id', reportId)
        .single();

      if (!data) throw new Error('Rapport non trouvé');

      // Create downloadable content
      const content = JSON.stringify(data.report_data, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-${data.report_type}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({ title: "Téléchargement", description: "Rapport téléchargé avec succès" });
    } catch (error) {
      console.error('Error downloading report:', error);
      toast({ title: "Erreur", description: "Erreur lors du téléchargement", variant: "destructive" });
    }
  };

  return {
    createQualityTest,
    generateReport,
    createCorrectiveAction,
    downloadReport,
    loading
  };
};
