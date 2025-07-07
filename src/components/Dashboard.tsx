
import React from "react";
import MetricCard from "./MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const energyData = [
    { name: "Électricité", value: 85, color: "bg-blue-500" },
    { name: "Gaz", value: 72, color: "bg-orange-500" },
    { name: "Eau", value: 58, color: "bg-cyan-500" }
  ];

  const qualityMetrics = [
    { defect: "Fissures", count: 12, percentage: 2.1 },
    { defect: "Défauts émail", count: 8, percentage: 1.4 },
    { defect: "Dimensions", count: 5, percentage: 0.9 }
  ];

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Production Journalière"
          value="2,847"
          unit="m²"
          trend={5.2}
          icon="🏭"
          color="bg-primary"
          description="Objectif: 3,000 m²"
        />
        <MetricCard
          title="Taux de Qualité"
          value="96.8"
          unit="%"
          trend={1.2}
          icon="✅"
          color="bg-eco-green"
          description="Conforme ISO 13006"
        />
        <MetricCard
          title="Consommation Énergie"
          value="847"
          unit="kWh"
          trend={-3.1}
          icon="⚡"
          color="bg-energy-purple"
          description="Objectif: -12% annuel"
        />
        <MetricCard
          title="Recyclage Déchets"
          value="89.2"
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
            {energyData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-600">{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                💡 Récupération de chaleur active: <strong>42.3 kWh/h</strong>
              </p>
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
              <p className="text-sm text-blue-800">
                📋 Dernier audit ISO: <strong>Conforme</strong> - 15/03/2024
              </p>
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
              <p className="text-sm text-red-600">Vérifier système de refroidissement</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="font-medium text-yellow-800">Maintenance préventive</p>
              <p className="text-sm text-yellow-600">Broyeur pendulaire - Dans 3 jours</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="font-medium text-green-800">Objectif RSE atteint</p>
              <p className="text-sm text-green-600">Recyclage liquides: 100%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
