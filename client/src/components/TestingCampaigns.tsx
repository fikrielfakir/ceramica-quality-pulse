
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { useQualityActions } from "@/hooks/useQualityActions";
import { useEnergyActions } from "@/hooks/useEnergyActions";
import { useMaintenanceActions } from "@/hooks/useMaintenanceActions";
import { Calendar, Play, FileText, AlertTriangle, Wrench } from "lucide-react";

const TestingCampaigns = () => {
  const { toast } = useToast();
  const { hasPermission } = useAuth();
  const [newCampaignName, setNewCampaignName] = useState("");
  
  const { generateReport, downloadReport } = useQualityActions();
  const { resolveEnergyAlert } = useEnergyActions();
  const { scheduleMaintenanceTask } = useMaintenanceActions();

  // Fetch testing campaigns
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["testing-campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testing_campaigns")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch energy alerts
  const { data: energyAlerts = [] } = useQuery({
    queryKey: ["energy-alerts"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('energy_alerts')
        .select('*')
        .eq('status', 'active')
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch maintenance schedules
  const { data: maintenanceSchedules = [] } = useQuery({
    queryKey: ["maintenance-schedules"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('maintenance_schedules')
        .select('*')
        .eq('status', 'scheduled')
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
  });

  const createCampaign = async () => {
    if (!newCampaignName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un nom de campagne",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("testing_campaigns")
        .insert({
          campaign_name: newCampaignName,
          description: `Campagne créée le ${new Date().toLocaleDateString()}`,
          start_date: new Date().toISOString().split('T')[0],
          status: "Planning"
        });

      if (error) throw error;

      toast({
        title: "Campagne créée",
        description: `La campagne "${newCampaignName}" a été créée avec succès`,
      });
      
      setNewCampaignName("");
      // Refresh the campaigns list
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la campagne : " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleGenerateReport = async (reportType: string) => {
    try {
      const result = await generateReport.mutateAsync({ 
        testId: "sample-test-id", 
        reportType 
      });
      
      if (result && typeof result === 'object') {
        toast({
          title: "Rapport généré",
          description: `Rapport ${reportType} créé avec l'ID: ${(result as any).id}`,
        });
      }
    } catch (error) {
      // Error is already handled in the mutation
    }
  };

  const handleResolveEnergyAlert = async (alertId: string) => {
    try {
      await resolveEnergyAlert.mutateAsync(alertId);
    } catch (error) {
      // Error is already handled in the mutation
    }
  };

  const handleScheduleMaintenance = async (equipmentName: string) => {
    try {
      await scheduleMaintenanceTask.mutateAsync({
        equipment_name: equipmentName,
        maintenance_type: 'preventive',
        description: `Maintenance préventive pour ${equipmentName}`,
        scheduled_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        assigned_to: null,
        status: 'scheduled',
        priority: 'medium',
        created_by: (await supabase.auth.getUser()).data.user?.id
      });
    } catch (error) {
      // Error is already handled in the mutation
    }
  };

  // Permission checking helper
  const renderActionButton = (permission: string, action: () => void, label: string, variant: "default" | "outline" | "destructive" = "default") => {
    if (!hasPermission(permission)) return null;
    
    return (
      <Button 
        variant={variant} 
        size="sm" 
        onClick={action}
        className="text-xs"
      >
        {label}
      </Button>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des campagnes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">🎯 Campagnes de Tests</h1>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          {campaigns?.length || 0} Campagnes Actives
        </Badge>
      </div>

      {/* Create New Campaign */}
      {hasPermission('create_testing_campaigns') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Nouvelle Campagne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Nom de la campagne de tests..."
                value={newCampaignName}
                onChange={(e) => setNewCampaignName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={createCampaign}>
                Créer Campagne
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <FileText className="w-5 h-5" />
              Actions Qualité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {renderActionButton('generate_reports', () => handleGenerateReport('compliance'), "Rapport Conformité", "outline")}
            {renderActionButton('generate_reports', () => handleGenerateReport('analysis'), "Analyse Qualité", "outline")}
            {renderActionButton('view_trends', () => toast({ title: "Analyse", description: "Analyse des tendances lancée" }), "Analyser Tendances", "outline")}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <AlertTriangle className="w-5 h-5" />
              Alertes Énergie
            </CardTitle>
          </CardHeader>
          <CardContent>
            {energyAlerts.length > 0 ? (
              <div className="space-y-2">
                <h4 className="font-medium text-yellow-800">Alertes Énergie</h4>
                <div className="space-y-2 mt-2">
                  {energyAlerts.map((alert: any) => (
                    <div key={alert?.id} className="text-sm">
                      <p className="text-yellow-600">{alert?.message || 'Alerte énergétique'}</p>
                      <div className="flex gap-2 mt-1">
                        {renderActionButton('energy_alerts', () => handleResolveEnergyAlert(alert?.id), "Corriger", "outline")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Aucune alerte active</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Wrench className="w-5 h-5" />
              Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {maintenanceSchedules.length > 0 ? (
              <div className="space-y-2">
                <h4 className="font-medium text-blue-800">Maintenance</h4>
                <div className="space-y-2 mt-2">
                  {maintenanceSchedules.map((schedule: any) => (
                    <div key={schedule?.id} className="text-sm">
                      <p className="text-blue-600">{schedule?.equipment_name || 'Équipement'}</p>
                      <p className="text-xs text-blue-500">{schedule?.scheduled_date}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Aucune maintenance planifiée</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <CardTitle>Campagnes de Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns?.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune campagne de tests trouvée</p>
                <p className="text-sm text-gray-400">Créez votre première campagne ci-dessus</p>
              </div>
            ) : (
              campaigns?.map((campaign) => (
                <div key={campaign.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{campaign.campaign_name}</h3>
                      <p className="text-sm text-gray-600">{campaign.description}</p>
                      <p className="text-xs text-gray-400">
                        Démarré le {new Date(campaign.start_date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={campaign.status === 'Planning' ? 'outline' : 'default'}
                      >
                        {campaign.status}
                      </Badge>
                      {renderActionButton('edit_testing_campaigns', () => {}, "Modifier", "outline")}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestingCampaigns;
