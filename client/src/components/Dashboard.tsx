
import React from "react";
import MetricCard from "./MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useProductionData, useQualityTests } from "@/hooks/useProductionData";
import { useEnergyConsumption, useWasteRecords } from "@/hooks/useEnergyData";

const Dashboard = () => {
  const { toast } = useToast();
  const { data: productionLots, isLoading: productionLoading } = useProductionData();
  const { data: qualityTests, isLoading: qualityLoading } = useQualityTests();
  const { data: energyData, isLoading: energyLoading } = useEnergyConsumption();
  const { data: wasteData, isLoading: wasteLoading } = useWasteRecords();

  // Calculate metrics from real data
  const totalProduction = productionLots?.reduce((sum, lot) => sum + lot.quantity, 0) || 0;
  const conformeTests = qualityTests?.filter(test => test.status === 'Conforme').length || 0;
  const totalTests = qualityTests?.length || 1;
  const qualityRate = ((conformeTests / totalTests) * 100).toFixed(1);
  
  const totalEnergyConsumption = energyData?.reduce((sum, record) => sum + Number(record.consumption_kwh), 0) || 0;
  const totalWasteRecycled = wasteData?.filter(record => record.disposal_method?.includes('Recyclage')).length || 0;
  const recyclingRate = wasteData?.length ? ((totalWasteRecycled / wasteData.length) * 100).toFixed(1) : '0';

  const energySources = [
    { name: "Électricité", value: 85, color: "bg-blue-500" },
    { name: "Gaz", value: 72, color: "bg-orange-500" },
    { name: "Eau", value: 58, color: "bg-cyan-500" }
  ];

  const qualityMetrics = qualityTests?.slice(0, 3).map(test => ({
    defect: test.defect_type || 'none',
    count: test.defect_count || 0,
    percentage: test.defect_count ? ((test.defect_count / 100) * 100).toFixed(1) : '0'
  })) || [];

  const handleAlertAction = (alertType: string) => {
    toast({
      title: "Action initiée",
      description: `Traitement de l'alerte: ${alertType}`,
    });
  };

  const handleOptimizationAction = () => {
    toast({
      title: "Optimisation appliquée",
      description: "Le système a programmé l'optimisation énergétique",
    });
  };

  if (productionLoading || qualityLoading || energyLoading || wasteLoading) {
    return <div className="p-6">Chargement des données...</div>;
  }

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Production Journalière"
          value={totalProduction.toString()}
          unit="pcs"
          trend={5.2}
          icon="🏭"
          color="bg-primary"
          description="Objectif: 3,000 pcs"
        />
        <MetricCard
          title="Taux de Qualité"
          value={qualityRate}
          unit="%"
          trend={1.2}
          icon="✅"
          color="bg-eco-green"
          description="Conforme ISO 13006"
        />
        <MetricCard
          title="Consommation Énergie"
          value={Math.round(totalEnergyConsumption).toString()}
          unit="kWh"
          trend={-3.1}
          icon="⚡"
          color="bg-energy-purple"
          description="Objectif: -12% annuel"
        />
        <MetricCard
          title="Recyclage Déchets"
          value={recyclingRate}
          unit="%"
          trend={8.5}
          icon="♻️"
          color="bg-warning-orange"
          description="Objectif: 100%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consommation énergétique */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔋 Consommation Énergétique en Temps Réel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {energySources.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-600">{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center">
                <p className="text-sm text-green-800">
                  💡 Récupération de chaleur active: <strong>42.3 kWh/h</strong>
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleOptimizationAction}
                >
                  Optimiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contrôle qualité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 Analyse Défauts - Dernières 24h
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {qualityMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{metric.defect}</p>
                    <p className="text-xs text-gray-600">{metric.count} défauts détectés</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{metric.percentage}%</p>
                    <p className="text-xs text-gray-500">du total</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <p className="text-sm text-blue-800">
                  📋 Dernier audit ISO: <strong>Conforme</strong> - 15/03/2024
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast({
                    title: "Rapport généré",
                    description: "Le rapport d'audit a été téléchargé",
                  })}
                >
                  Télécharger
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes et notifications */}
      <Card className="border-l-4 border-l-warning-orange">
        <CardHeader>
          <CardTitle className="text-warning-orange">🚨 Alertes & Actions Prioritaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="font-medium text-red-800">Four B2 - Température élevée</p>
              <p className="text-sm text-red-600 mb-2">Vérifier système de refroidissement</p>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleAlertAction("Four B2 - Température")}
              >
                Traiter
              </Button>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="font-medium text-yellow-800">Maintenance préventive</p>
              <p className="text-sm text-yellow-600 mb-2">Broyeur pendulaire - Dans 3 jours</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleAlertAction("Maintenance préventive")}
              >
                Programmer
              </Button>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="font-medium text-green-800">Objectif RSE atteint</p>
              <p className="text-sm text-green-600 mb-2">Recyclage liquides: 100%</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast({
                  title: "Rapport RSE",
                  description: "Rapport de performance RSE généré",
                })}
              >
                Voir rapport
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
