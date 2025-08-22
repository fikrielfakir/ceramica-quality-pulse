import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiService } from "@/services/api";
import { Calendar, Play, FileText } from "lucide-react";

const TestingCampaigns = () => {
  const { toast } = useToast();
  const { hasPermission } = useAuth();
  const [newCampaignName, setNewCampaignName] = useState("");
  
  // Sample campaigns data
  const campaigns = [
    {
      id: "1",
      campaign_name: "Contrôle Qualité Q1 2024",
      start_date: "2024-01-01",
      end_date: "2024-03-31",
      description: "Campagne trimestrielle de contrôle qualité",
      status: "Completed"
    },
    {
      id: "2", 
      campaign_name: "Tests Résistance Nouveaux Produits",
      start_date: "2024-03-01",
      end_date: "2024-03-31",
      description: "Tests spéciaux pour nouvelle gamme",
      status: "In Progress"
    }
  ];

  const handleCreateCampaign = async () => {
    if (!newCampaignName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un nom pour la campagne",
        variant: "destructive"
      });
      return;
    }

    try {
      const campaignData = {
        campaign_name: newCampaignName,
        start_date: new Date().toISOString().split('T')[0],
        description: "Nouvelle campagne de tests",
        status: "Planning"
      };

      await apiService.createTestingCampaign(campaignData);
      
      toast({
        title: "Succès",
        description: "Campagne créée avec succès",
      });
      
      setNewCampaignName("");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la campagne",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Completed': { variant: 'default', label: 'Terminé' },
      'In Progress': { variant: 'secondary', label: 'En cours' },
      'Planning': { variant: 'outline', label: 'Planifié' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline', label: status };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Campagnes de Tests</h1>
        <p className="text-gray-600">Gérez vos campagnes de contrôle qualité et de tests</p>
      </div>

      {/* Create New Campaign */}
      {hasPermission('create_testing_campaigns') && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="h-5 w-5 mr-2" />
              Nouvelle Campagne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Nom de la campagne"
                value={newCampaignName}
                onChange={(e) => setNewCampaignName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleCreateCampaign}>
                Créer la Campagne
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaigns List */}
      <div className="grid gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    {campaign.campaign_name}
                  </CardTitle>
                  <p className="text-gray-600 mt-2">{campaign.description}</p>
                </div>
                {getStatusBadge(campaign.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Date de début</span>
                  <p className="text-sm">{new Date(campaign.start_date).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Date de fin</span>
                  <p className="text-sm">
                    {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString('fr-FR') : 'Non définie'}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Statut</span>
                  <p className="text-sm">{campaign.status}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Voir Détails
                </Button>
                {hasPermission('edit_testing_campaigns') && (
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {campaigns.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune campagne</h3>
            <p className="text-gray-600 mb-4">Créez votre première campagne de tests pour commencer.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestingCampaigns;