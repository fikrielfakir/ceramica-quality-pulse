
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import MetricCard from "./MetricCard";

const EnergyMonitoring = () => {
  const { toast } = useToast();

  const energySources = [
    { name: "Électricité Réseau", current: 245, max: 300, unit: "kW", color: "bg-blue-500" },
    { name: "Gaz Naturel", current: 180, max: 250, unit: "m³/h", color: "bg-orange-500" },
    { name: "Eau Industrielle", current: 42, max: 60, unit: "m³/h", color: "bg-cyan-500" }
  ];

  const heatRecovery = [
    { equipment: "Four Principal A1", recovery: 89, efficiency: 92 },
    { equipment: "Four Séchage B1", recovery: 67, efficiency: 85 },
    { equipment: "Broyeur Pendulaire", recovery: 34, efficiency: 78 }
  ];

  const handleOptimizationSuggestion = () => {
    toast({
      title: "Optimisation appliquée",
      description: "Le décalage du broyage a été programmé pour les heures creuses",
    });
  };

  const handleEquipmentAction = (equipment: string) => {
    toast({
      title: "Maintenance programmée",
      description: `Maintenance préventive programmée pour ${equipment}`,
    });
  };

  const handleAlert = (alertType: string) => {
    toast({
      title: "Alerte traitée",
      description: `Action corrective initiée pour ${alertType}`,
    });
  };

  const handleObjectiveTracking = () => {
    toast({
      title: "Suivi des objectifs",
      description: "Rapport de progression MED TEST généré",
    });
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Métriques énergétiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Consommation Totale"
          value="847"
          unit="kWh"
          trend={-3.1}
          icon="⚡"
          color="bg-energy-purple"
          description="Dernières 24h"
        />
        <MetricCard
          title="Récupération Chaleur"
          value="42.3"
          unit="kWh/h"
          trend={12.8}
          icon="🔥"
          color="bg-warning-orange"
          description="511 MWh/an économisés"
        />
        <MetricCard
          title="Efficacité Énergétique"
          value="87.2"
          unit="%"
          trend={2.4}
          icon="📊"
          color="bg-eco-green"
          description="Objectif: 90%"
        />
        <MetricCard
          title="Émissions CO₂"
          value="125"
          unit="kg/t"
          trend={-8.5}
          icon="🌱"
          color="bg-primary"
          description="Réduction 12%/an"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consommation en temps réel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Consommation en Temps Réel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {energySources.map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{source.name}</span>
                  <div className="text-right">
                    <span className="font-bold">{source.current}</span>
                    <span className="text-gray-500 text-sm">/{source.max} {source.unit}</span>
                  </div>
                </div>
                <Progress value={(source.current / source.max) * 100} className="h-3" />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Utilisation: {Math.round((source.current / source.max) * 100)}%</span>
                  <span className={source.current > source.max * 0.8 ? 'text-red-600' : 'text-green-600'}>
                    {source.current > source.max * 0.8 ? '⚠️ Élevé' : '✅ Normal'}
                  </span>
                </div>
              </div>
            ))}
            
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">💡 Optimisation Intelligente</h4>
              <p className="text-sm text-gray-700 mb-3">
                Le système a détecté une opportunité d'économie de <strong>15 kWh</strong> 
                en décalant le broyage de 2h pendant les heures creuses.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleOptimizationSuggestion}
              >
                Appliquer optimisation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Récupération de chaleur */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔥 Système de Récupération de Chaleur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {heatRecovery.map((equipment, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm">{equipment.equipment}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {equipment.efficiency}% efficace
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEquipmentAction(equipment.equipment)}
                    >
                      Maintenance
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Récupération: {equipment.recovery} kWh/h</span>
                    <span className="text-green-600 font-medium">
                      +{Math.round(equipment.recovery * 0.15)}€/h économisés
                    </span>
                  </div>
                  <Progress value={equipment.efficiency} className="h-2" />
                </div>
              </div>
            ))}
            
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-700">Total récupéré:</span>
                  <div className="font-bold text-lg text-green-800">511 MWh/an</div>
                </div>
                <div>
                  <span className="text-green-700">Économies annuelles:</span>
                  <div className="font-bold text-lg text-green-800">76,650€</div>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast({
                    title: "Rapport économies",
                    description: "Rapport détaillé des économies énergétiques téléchargé",
                  })}
                >
                  Rapport détaillé
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analyses et objectifs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">🎯 Objectifs MED TEST</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Réduction énergétique</span>
                  <span className="font-medium">8.2% / 12%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Récupération chaleur</span>
                  <span className="font-medium text-green-600">511 / 511 MWh</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </div>
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleObjectiveTracking}
              >
                Suivi objectifs
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">📈 Tendance Mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">↓ 12.5%</div>
              <p className="text-sm text-gray-600">vs mois précédent</p>
              <div className="mt-2 text-xs text-gray-500">
                Excellente performance énergétique
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                onClick={() => toast({
                  title: "Analyse de tendance",
                  description: "Rapport de tendance mensuelle généré",
                })}
              >
                Voir analyse
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">⚠️ Alertes Énergie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-2 bg-yellow-50 rounded text-xs">
                <span className="font-medium text-yellow-800">Four B1:</span>
                <span className="text-yellow-700"> Surconsommation +15%</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-1 w-full"
                  onClick={() => handleAlert("Four B1")}
                >
                  Corriger
                </Button>
              </div>
              <div className="p-2 bg-green-50 rounded text-xs">
                <span className="font-medium text-green-800">Récupération:</span>
                <span className="text-green-700"> Fonctionnement optimal</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-1 w-full"
                  onClick={() => toast({
                    title: "Rapport système",
                    description: "Rapport de fonctionnement du système de récupération",
                  })}
                >
                  Rapport
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnergyMonitoring;
