
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import MetricCard from "./MetricCard";

const WasteManagement = () => {
  const { toast } = useToast();

  const wasteCategories = [
    { name: "Carton & Papier", collected: 2840, target: 3000, recycled: 98.5, unit: "kg" },
    { name: "Plastiques", collected: 156, target: 200, recycled: 89.2, unit: "kg" },
    { name: "Métaux (Ferraille)", collected: 420, target: 500, recycled: 100, unit: "kg" },
    { name: "Déchets Céramiques", collected: 1250, target: 1500, recycled: 75.8, unit: "kg" }
  ];

  const liquidWaste = [
    { type: "Eau de lavage", volume: 12500, recycled: 11875, percentage: 95 },
    { type: "Émulsion huileuse", volume: 340, recycled: 340, percentage: 100 },
    { type: "Eaux usées process", volume: 8900, recycled: 8455, percentage: 95 }
  ];

  const handleCollectionAction = (category: string) => {
    toast({
      title: "Collecte programmée",
      description: `Collecte programmée pour ${category}`,
    });
  };

  const handleRecyclingReport = () => {
    toast({
      title: "Rapport généré",
      description: "Rapport de recyclage mensuel téléchargé",
    });
  };

  const handleOptimization = () => {
    toast({
      title: "Optimisation appliquée",
      description: "Plan d'optimisation de la gestion des déchets activé",
    });
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Déchets Collectés"
          value="4,666"
          unit="kg"
          trend={8.5}
          icon="♻️"
          color="bg-eco-green"
          description="Ce mois"
        />
        <MetricCard
          title="Taux de Recyclage"
          value="89.2"
          unit="%"
          trend={12.3}
          icon="🔄"
          color="bg-primary"
          description="Objectif: 100%"
        />
        <MetricCard
          title="Valorisation"
          value="3,456"
          unit="€"
          trend={15.7}
          icon="💰"
          color="bg-warning-orange"
          description="Gains mensuels"
        />
        <MetricCard
          title="Réduction CO₂"
          value="2.3"
          unit="tonnes"
          trend={18.2}
          icon="🌱"
          color="bg-energy-purple"
          description="Impact environnemental"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gestion déchets solides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🗂️ Déchets Solides - Tri & Valorisation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {wasteCategories.map((category, index) => (
              <div key={index} className="space-y-3 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{category.name}</span>
                  <Badge variant={category.recycled > 90 ? "default" : "secondary"}>
                    {category.recycled}% recyclé
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Collecté: {category.collected} {category.unit}</span>
                    <span>Objectif: {category.target} {category.unit}</span>
                  </div>
                  <Progress value={(category.collected / category.target) * 100} className="h-2" />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Valorisation: +{Math.round(category.collected * 0.45)}€
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCollectionAction(category.name)}
                  >
                    Programmer collecte
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">📊 Performance Mensuelle</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-700">Total valorisé:</span>
                  <span className="font-bold ml-2">3,456€</span>
                </div>
                <div>
                  <span className="text-green-700">CO₂ évité:</span>
                  <span className="font-bold ml-2">2.3 tonnes</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Déchets liquides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💧 Déchets Liquides - Recyclage & Traitement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {liquidWaste.map((liquid, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{liquid.type}</span>
                  <Badge variant={liquid.percentage === 100 ? "default" : "secondary"}>
                    {liquid.percentage}%
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Volume traité: {liquid.volume} L</span>
                    <span>Recyclé: {liquid.recycled} L</span>
                  </div>
                  <Progress value={liquid.percentage} className="h-2" />
                </div>

                <div className="mt-2 text-xs text-gray-600">
                  Économie d'eau: {liquid.recycled} L/mois
                </div>
              </div>
            ))}
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-blue-900">Objectif MED TEST</h4>
                  <p className="text-sm text-blue-700">Recyclage liquides: 100% atteint</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRecyclingReport}
                >
                  Rapport détaillé
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Planification et optimisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📋 Planification & Optimisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-800">Collecte Programmée</h4>
              <p className="text-sm text-yellow-600 mb-3">Carton & Plastique - Demain 14h</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast({
                  title: "Collecte modifiée",
                  description: "Horaire de collecte mis à jour",
                })}
              >
                Modifier
              </Button>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800">Optimisation Détectée</h4>
              <p className="text-sm text-green-600 mb-3">Potentiel +12% recyclage métaux</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleOptimization}
              >
                Appliquer
              </Button>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800">Audit RSE</h4>
              <p className="text-sm text-blue-600 mb-3">Prochaine évaluation dans 15 jours</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast({
                  title: "Audit programmé",
                  description: "Rappel d'audit RSE créé",
                })}
              >
                Programmer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WasteManagement;
