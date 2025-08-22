
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useQualityActions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createQualityTest = useMutation({
    mutationFn: async (testData: any) => {
      const { data, error } = await supabase
        .from('quality_tests')
        .insert(testData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Test créé",
        description: "Le test qualité a été créé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['quality-tests'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer le test : " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateQualityTest = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from('quality_tests')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Test mis à jour",
        description: "Le test qualité a été mis à jour avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['quality-tests'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le test : " + error.message,
        variant: "destructive",
      });
    },
  });

  const generateReport = useMutation({
    mutationFn: async ({ testId, reportType }: { testId: string; reportType: string }) => {
      const reportData = {
        lot_id: testId,
        report_type: reportType,
        report_data: {
          generated_at: new Date().toISOString(),
          type: reportType,
          test_id: testId
        },
        generated_by: (await supabase.auth.getUser()).data.user?.id
      };

      const { data, error } = await (supabase as any)
        .from('quality_reports')
        .insert(reportData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Rapport généré",
        description: "Le rapport a été généré avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['quality-reports'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de générer le rapport : " + error.message,
        variant: "destructive",
      });
    },
  });

  const downloadReport = async (reportId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('quality_reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (error || !data) throw new Error('Rapport non trouvé');

      // Create downloadable content
      const content = JSON.stringify((data as any).report_data, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-${(data as any).report_type}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Téléchargement démarré",
        description: "Le rapport a été téléchargé",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le rapport : " + error.message,
        variant: "destructive",
      });
    }
  };

  return {
    createQualityTest,
    updateQualityTest,
    generateReport,
    downloadReport
  };
};
