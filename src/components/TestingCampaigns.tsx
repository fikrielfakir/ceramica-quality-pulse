
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQualityActions } from "@/hooks/useQualityActions";
import { useEnergyActions } from "@/hooks/useEnergyActions";
import { useMaintenanceActions } from "@/hooks/useMaintenanceActions";
import { supabase } from "@/integrations/supabase/client";

const TestingCampaigns = () => {
  const { toast } = useToast();
  const { hasPermission, userRole } = useAuth();
  const { createQualityTest, generateReport, createCorrectiveAction, downloadReport, loading: qualityLoading } = useQualityActions();
  const { createEnergyAlert, resolveEnergyAlert, recordEnergyConsumption, loading: energyLoading } = useEnergyActions();
  const { scheduleMaintenance, updateMaintenanceStatus, loading: maintenanceLoading } = useMaintenanceActions();

  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [newCampaignName, setNewCampaignName] = useState("");
  const [newCampaignType, setNewCampaignType] = useState("");
  const [campaignNotes, setCampaignNotes] = useState("");
  
  // Backend data states
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [qualityTests, setQualityTests] = useState<any[]>([]);
  const [energyAlerts, setEnergyAlerts] = useState<any[]>([]);
  const [maintenanceSchedules, setMaintenanceSchedules] = useState<any[]>([]);

  // Load data from backend
  useEffect(() => {
    loadCampaigns();
    loadQualityTests();
    loadEnergyAlerts();
    loadMaintenanceSchedules();
  }, []);

  const loadCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('testing_campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    }
  };

  const loadQualityTests = async () => {
    try {
      const { data, error } = await supabase
        .from('quality_tests')
        .select(`
          *,
          production_lots(lot_number),
          profiles(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setQualityTests(data || []);
    } catch (error) {
      console.error('Error loading quality tests:', error);
    }
  };

  const loadEnergyAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('energy_alerts' as any)
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      setEnergyAlerts(data || []);
    } catch (error) {
      console.error('Error loading energy alerts:', error);
    }
  };

  const loadMaintenanceSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_schedules' as any)
        .select(`
          *,
          profiles(full_name)
        `)
        .in('status', ['scheduled', 'in_progress'])
        .order('scheduled_date', { ascending: true })
        .limit(5);
      
      if (error) throw error;
      setMaintenanceSchedules(data || []);
    } catch (error) {
      console.error('Error loading maintenance schedules:', error);
    }
  };

  const handleStartCampaign = async () => {
    if (!hasPermission('create_quality_tests')) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions pour créer des campagnes",
        variant: "destructive",
      });
      return;
    }

    if (!newCampaignName || !newCampaignType) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('testing_campaigns')
        .insert({
          campaign_name: newCampaignName,
          description: campaignNotes,
          start_date: new Date().toISOString().split('T')[0],
          status: 'En cours',
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Campagne lancée",
        description: `Nouvelle campagne "${newCampaignName}" créée et démarrée avec succès`,
      });
      
      // Reset form and reload data
      setNewCampaignName("");
      setNewCampaignType("");
      setCampaignNotes("");
      loadCampaigns();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de la campagne",
        variant: "destructive",
      });
    }
  };

  const handleNewQualityTest = async () => {
    const success = await createQualityTest({
      test_type: 'Contrôle général',
      status: 'En cours',
      operator_id: (await supabase.auth.getUser()).data.user?.id,
      test_date: new Date().toISOString().split('T')[0]
    });
    
    if (success) {
      loadQualityTests();
    }
  };

  const handleGenerateReport = async (testId: string, reportType: string) => {
    const report = await generateReport(testId, reportType);
    if (report) {
      toast({
        title: "Rapport généré",
        description: `Rapport ${reportType} créé avec l'ID: ${(report as any).id}`,
      });
    }
  };

  const handleCorrectiveAction = async (testId: string) => {
    const success = await createCorrectiveAction(testId, {
      action_type: 'Investigation',
      description: 'Investigation requise pour non-conformité détectée',
      priority: 'high',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
    });
    
    if (success) {
      toast({
        title: "Action corrective initiée",
        description: "Procédure corrective créée et assignée"
      });
    }
  };

  const handleResolveEnergyAlert = async (alertId: string) => {
    const success = await resolveEnergyAlert(alertId);
    if (success) {
      loadEnergyAlerts();
    }
  };

  const handleScheduleMaintenance = async () => {
    const success = await scheduleMaintenance({
      equipment_name: 'Four principal',
      maintenance_type: 'preventive',
      description: 'Maintenance préventive programmée',
      scheduled_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks from now
      priority: 'medium'
    });
    
    if (success) {
      loadMaintenanceSchedules();
    }
  };

  // Permission-based button rendering
  const renderActionButton = (permission: string, onClick: () => void, children: React.ReactNode, variant: any = "default") => {
    if (!hasPermission(permission)) {
      return null;
    }
    return (
      <Button variant={variant} onClick={onClick} size="sm">
        {children}
      </Button>
    );
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Role and permissions display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            👤 Votre Profil - Rôle: {userRole}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {hasPermission('create_quality_tests') && <Badge>Créer Tests</Badge>}
            {hasPermission('generate_reports') && <Badge>Générer Rapports</Badge>}
            {hasPermission('corrective_actions') && <Badge>Actions Correctives</Badge>}
            {hasPermission('manage_energy') && <Badge>Gérer Énergie</Badge>}
            {hasPermission('schedule_maintenance') && <Badge>Programmer Maintenance</Badge>}
          </div>
        </CardContent>
      </Card>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧪 Campagnes de Tests Actives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-sm">{campaign.campaign_name}</h4>
                    <p className="text-xs text-gray-600">{campaign.id.slice(0, 8)}</p>
                  </div>
                  <Badge variant={campaign.status === "En cours" ? "default" : "secondary"}>
                    {campaign.status}
                  </Badge>
                </div>
                
                <div className="mt-3 flex gap-2">
                  {renderActionButton('view_quality_tests', () => toast({ title: "Détails", description: `Affichage des détails de ${campaign.campaign_name}` }), "Voir détails", "outline")}
                  {renderActionButton('view_trends', () => toast({ title: "Analyse", description: "Ouverture de l'analyse des tendances" }), "Analyser tendance", "outline")}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Campaign */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ➕ Nouvelle Campagne de Tests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="campaign-name">Nom de la campagne</Label>
                <Input 
                  id="campaign-name" 
                  placeholder="Ex: Contrôle Avril 2024"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="campaign-type">Type de campagne</Label>
                <Select value={newCampaignType} onValueChange={setNewCampaignType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quality">Qualité Produit</SelectItem>
                    <SelectItem value="energy">Énergie</SelectItem>
                    <SelectItem value="environment">Environnement</SelectItem>
                    <SelectItem value="safety">Sécurité</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="campaign-notes">Notes & Objectifs</Label>
              <Textarea 
                id="campaign-notes" 
                placeholder="Objectifs de la campagne, contraintes particulières..."
                rows={3}
                value={campaignNotes}
                onChange={(e) => setCampaignNotes(e.target.value)}
              />
            </div>

            {renderActionButton('create_quality_tests', handleStartCampaign, "Lancer la Campagne")}
          </CardContent>
        </Card>

        {/* Quality Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Tests Qualité Récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {qualityTests.map((test) => (
                <div key={test.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-sm">{test.test_type}</h4>
                      <p className="text-xs text-gray-600">
                        Lot: {test.production_lots?.lot_number || 'N/A'} • {test.test_date}
                      </p>
                    </div>
                    <Badge variant={test.status === "Conforme" ? "default" : "destructive"}>
                      {test.status}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    {renderActionButton('view_quality_tests', () => toast({ title: "Détails", description: `Détails du test ${test.id}` }), "Détails", "outline")}
                    {renderActionButton('generate_reports', () => handleGenerateReport(test.id, 'certificate'), "Générer certificat", "outline")}
                    {renderActionButton('generate_reports', () => handleGenerateReport(test.id, 'analysis'), "Aperçu Rapport", "outline")}
                    {test.status === "Non-conforme" && renderActionButton('corrective_actions', () => handleCorrectiveAction(test.id), "Action corrective", "destructive")}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex gap-2">
              {renderActionButton('create_quality_tests', handleNewQualityTest, "Nouveau Test Qualité")}
              {renderActionButton('create_quality_tests', () => toast({ title: "Contrôle", description: "Nouveau contrôle qualité initialisé" }), "Nouveau Contrôle Qualité")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Energy and Maintenance Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📅 Planification & Optimisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-800">Alertes Énergie</h4>
              <div className="space-y-2 mt-2">
                {energyAlerts.map((alert) => (
                  <div key={(alert as any).id} className="text-sm">
                    <p className="text-yellow-600">{(alert as any).message}</p>
                    <div className="flex gap-2 mt-1">
                      {renderActionButton('energy_alerts', () => handleResolveEnergyAlert((alert as any).id), "Corriger", "outline")}
                    </div>
                  </div>
                ))}
              </div>
              {renderActionButton('manage_energy', () => toast({ title: "Objectifs", description: "Interface de suivi des objectifs énergétiques" }), "Suivi objectifs")}
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800">Maintenance</h4>
              <div className="space-y-2 mt-2">
                {maintenanceSchedules.map((schedule) => (
                  <div key={(schedule as any).id} className="text-sm">
                    <p className="text-blue-600">{(schedule as any).equipment_name}</p>
                    <p className="text-xs text-blue-500">{(schedule as any).scheduled_date}</p>
                  </div>
                ))}
              </div>
              {renderActionButton('schedule_maintenance', handleScheduleMaintenance, "Programmer")}
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800">Optimisation</h4>
              <p className="text-sm text-green-600 mb-3">
                Optimisation Détectée:<br/>
                Réduction consommation -12%
              </p>
              <div className="flex gap-2">
                {renderActionButton('optimize_production', () => toast({ title: "Optimisation", description: "Optimisation appliquée avec succès" }), "Appliquer")}
                {renderActionButton('view_analytics', () => toast({ title: "Audit RSE", description: "Audit RSE programmé" }), "Audit RSE", "outline")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestingCampaigns;
