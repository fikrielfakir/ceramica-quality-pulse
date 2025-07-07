
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const TestingCampaigns = () => {
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState("");

  const activeCampaigns = [
    { 
      id: "CAMP-2024-001", 
      name: "Contrôle Qualité Mars", 
      type: "Qualité Produit",
      progress: 75, 
      tests: 48, 
      totalTests: 64,
      status: "En cours"
    },
    { 
      id: "CAMP-2024-002", 
      name: "Audit Énergétique", 
      type: "Énergie",
      progress: 40, 
      tests: 12, 
      totalTests: 30,
      status: "En cours"
    },
    { 
      id: "CAMP-2024-003", 
      name: "Tests Environnementaux", 
      type: "Environnement",
      progress: 90, 
      tests: 27, 
      totalTests: 30,
      status: "Finalisation"
    }
  ];

  const testProtocols = [
    { name: "ISO 13006 - Carreaux céramiques", category: "Qualité", duration: "2h" },
    { name: "ISO 10545-3 - Absorption d'eau", category: "Physique", duration: "24h" },
    { name: "ISO 10545-4 - Résistance flexion", category: "Mécanique", duration: "1h" },
    { name: "Analyse émissions COV", category: "Environnement", duration: "4h" },
    { name: "Efficacité énergétique fours", category: "Énergie", duration: "8h" }
  ];

  const recentResults = [
    { 
      test: "Résistance flexion", 
      lot: "LOT-2024-015", 
      result: "Conforme", 
      value: "1450 N",
      operator: "A. Bennani",
      date: "15/03/2024"
    },
    { 
      test: "Absorption eau", 
      lot: "LOT-2024-014", 
      result: "Non-conforme", 
      value: "3.2%",
      operator: "M. Alami",
      date: "14/03/2024"
    },
    { 
      test: "Dimensions", 
      lot: "LOT-2024-013", 
      result: "Conforme", 
      value: "600.2mm",
      operator: "S. Tazi",
      date: "14/03/2024"
    }
  ];

  const handleStartCampaign = () => {
    toast({
      title: "Campagne lancée",
      description: "Nouvelle campagne de tests créée et démarrée",
    });
  };

  const handleScheduleTest = (protocol: string) => {
    toast({
      title: "Test programmé",
      description: `Test ${protocol} ajouté à la planification`,
    });
  };

  const handleViewResults = (campaignId: string) => {
    toast({
      title: "Résultats",
      description: `Ouverture des résultats pour ${campaignId}`,
    });
  };

  const handleCorrectiveAction = (lotId: string) => {
    toast({
      title: "Action corrective",
      description: `Procédure corrective initiée pour ${lotId}`,
    });
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Campagnes actives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧪 Campagnes de Tests Actives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeCampaigns.map((campaign, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-sm">{campaign.name}</h4>
                    <p className="text-xs text-gray-600">{campaign.id}</p>
                  </div>
                  <Badge variant={campaign.status === "En cours" ? "default" : "secondary"}>
                    {campaign.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progression</span>
                    <span>{campaign.tests}/{campaign.totalTests} tests</span>
                  </div>
                  <Progress value={campaign.progress} className="h-2" />
                  <div className="text-xs text-gray-600">{campaign.progress}% terminé</div>
                </div>
                
                <div className="mt-3 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewResults(campaign.id)}
                  >
                    Voir résultats
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nouvelle campagne */}
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
                <Input id="campaign-name" placeholder="Ex: Contrôle Avril 2024" />
              </div>
              <div>
                <Label htmlFor="campaign-type">Type de campagne</Label>
                <Select>
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
              <Label htmlFor="protocols">Protocoles de test à inclure</Label>
              <div className="mt-2 space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                {testProtocols.map((protocol, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex-1">
                      <span className="text-sm font-medium">{protocol.name}</span>
                      <div className="text-xs text-gray-600">{protocol.category} • {protocol.duration}</div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleScheduleTest(protocol.name)}
                    >
                      Ajouter
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="campaign-notes">Notes & Objectifs</Label>
              <Textarea 
                id="campaign-notes" 
                placeholder="Objectifs de la campagne, contraintes particulières..."
                rows={3}
              />
            </div>

            <Button 
              onClick={handleStartCampaign}
              className="w-full"
            >
              Lancer la Campagne
            </Button>
          </CardContent>
        </Card>

        {/* Résultats récents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Résultats Récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentResults.map((result, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-sm">{result.test}</h4>
                      <p className="text-xs text-gray-600">
                        {result.lot} • {result.operator} • {result.date}
                      </p>
                    </div>
                    <Badge variant={result.result === "Conforme" ? "default" : "destructive"}>
                      {result.result}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Valeur: {result.value}</span>
                    {result.result === "Non-conforme" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCorrectiveAction(result.lot)}
                      >
                        Action corrective
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">📈 Statistiques du Mois</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Tests réalisés:</span>
                  <span className="font-bold ml-2">156</span>
                </div>
                <div>
                  <span className="text-blue-700">Taux conformité:</span>
                  <span className="font-bold ml-2 text-green-600">94.2%</span>
                </div>
                <div>
                  <span className="text-blue-700">Protocoles actifs:</span>
                  <span className="font-bold ml-2">12</span>
                </div>
                <div>
                  <span className="text-blue-700">Opérateurs:</span>
                  <span className="font-bold ml-2">8</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Planification et alertes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📅 Planification & Alertes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-800">Tests Programmés</h4>
              <p className="text-sm text-yellow-600 mb-3">
                ISO 10545-4 - Demain 9h00<br/>
                Analyse COV - Vendredi 14h00
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast({
                  title: "Planning modifié",
                  description: "Planning des tests mis à jour",
                })}
              >
                Modifier planning
              </Button>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-800">Actions Requises</h4>
              <p className="text-sm text-red-600 mb-3">
                LOT-2024-014: Non-conformité<br/>
                Calibrage équipement requis
              </p>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => toast({
                  title: "Actions traitées",
                  description: "Procédures correctives initiées",
                })}
              >
                Traiter actions
              </Button>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800">Certifications</h4>
              <p className="text-sm text-green-600 mb-3">
                ISO 13006: Conforme<br/>
                Prochaine révision: Mai 2024
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast({
                  title: "Certification",
                  description: "Planning de révision mis à jour",
                })}
              >
                Programmer révision
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestingCampaigns;
