
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEnhancedQualityTests, useQualityStandards, useEquipmentCalibration } from "@/hooks/useQualityData";
import { useToast } from "@/hooks/use-toast";
import QualityTestForm from "./QualityTestForm";

const EnhancedQualityControl = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const { data: qualityTests, isLoading: testsLoading } = useEnhancedQualityTests();
  const { data: qualityStandards } = useQualityStandards();
  const { data: equipment } = useEquipmentCalibration();
  const { toast } = useToast();

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'Conforme': return 'bg-green-100 text-green-800';
      case 'Non-conforme': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'major': return 'bg-orange-500';
      default: return 'bg-yellow-500';
    }
  };

  // Equipment needing calibration
  const equipmentNeedingCalibration = equipment?.filter(eq => {
    const nextCalibration = new Date(eq.next_calibration_date);
    const today = new Date();
    const daysUntilCalibration = Math.ceil((nextCalibration.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilCalibration <= 30;
  }) || [];

  const recentTests = qualityTests?.slice(0, 10) || [];
  const conformeTests = qualityTests?.filter(test => test.status === 'Conforme').length || 0;
  const totalTests = qualityTests?.length || 1;
  const conformityRate = ((conformeTests / totalTests) * 100).toFixed(1);

  // Handler functions for all buttons
  const handleViewDetails = (testId: string) => {
    toast({
      title: "Détails du test",
      description: `Affichage des détails pour le test ${testId}`,
    });
  };

  const handleGenerateReport = (type: string) => {
    toast({
      title: "Rapport généré",
      description: `Génération du rapport ${type} en cours...`,
    });
  };

  const handleScheduleCalibration = (equipmentId: string) => {
    toast({
      title: "Calibration programmée",
      description: "Calibration programmée avec succès",
    });
  };

  const handleViewAnalysis = () => {
    toast({
      title: "Analyse des tendances",
      description: "Ouverture de l'analyse des tendances qualité",
    });
  };

  const handleObjectiveTracking = () => {
    toast({
      title: "Suivi des objectifs",
      description: "Affichage du tableau de bord des objectifs qualité",
    });
  };

  if (activeView === "new-test") {
    return <QualityTestForm />;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🧪 Contrôle Qualité Avancé</h1>
          <p className="text-gray-600">Système ISO 13006 & ISO 10545 - Conformité IMANOR</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleViewAnalysis} variant="outline">
            📊 Voir Analyse
          </Button>
          <Button onClick={handleObjectiveTracking} variant="outline">
            🎯 Suivi Objectifs
          </Button>
          <Button onClick={() => setActiveView("new-test")} className="bg-blue-600 hover:bg-blue-700">
            ➕ Nouveau Test
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Taux de conformité</p>
                <p className="text-2xl font-bold text-green-600">{conformityRate}%</p>
                <p className="text-sm text-gray-500">{conformeTests}/{totalTests} tests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">🔬</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tests aujourd'hui</p>
                <p className="text-2xl font-bold text-blue-600">
                  {qualityTests?.filter(test => {
                    const testDate = new Date(test.test_date);
                    const today = new Date();
                    return testDate.toDateString() === today.toDateString();
                  }).length || 0}
                </p>
                <p className="text-sm text-gray-500">Contrôles effectués</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-full">
                <span className="text-2xl">⚙️</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Équipements</p>
                <p className="text-2xl font-bold text-orange-600">{equipmentNeedingCalibration.length}</p>
                <p className="text-sm text-gray-500">Calibration requise</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Standards ISO</p>
                <p className="text-2xl font-bold text-purple-600">{qualityStandards?.length || 0}</p>
                <p className="text-sm text-gray-500">Normes actives</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent-tests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recent-tests">📊 Tests récents</TabsTrigger>
          <TabsTrigger value="standards">📏 Normes ISO</TabsTrigger>
          <TabsTrigger value="equipment">⚙️ Équipements</TabsTrigger>
          <TabsTrigger value="reports">📈 Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="recent-tests">
          <Card>
            <CardHeader>
              <CardTitle>Tests de qualité récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testsLoading ? (
                  <p>Chargement des tests...</p>
                ) : (
                  recentTests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">
                            {test.production_lots?.lot_number} - {test.production_lots?.product_type}
                          </h3>
                          <Badge className={getComplianceColor(test.status || 'En cours')}>
                            {test.status || 'En cours'}
                          </Badge>
                          <Badge variant="outline">
                            {test.defect_type || 'Test général'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          {test.length_mm && (
                            <div>Longueur: {test.length_mm}mm</div>
                          )}
                          {test.width_mm && (
                            <div>Largeur: {test.width_mm}mm</div>
                          )}
                          {test.water_absorption_percent && (
                            <div>Absorption: {test.water_absorption_percent}%</div>
                          )}
                          {test.break_resistance_n && (
                            <div>Résistance: {test.break_resistance_n}N</div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>👤 {test.profiles?.full_name}</span>
                          <span>📅 {new Date(test.test_date).toLocaleDateString('fr-FR')}</span>
                          {test.defect_count > 0 && (
                            <span>❌ {test.defect_count} défauts</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(test.id)}>
                          📄 Détails
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleGenerateReport(test.id)}>
                          📋 Rapport
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="standards">
          <Card>
            <CardHeader>
              <CardTitle>Normes ISO actives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {qualityStandards?.map((standard) => (
                  <div key={standard.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{standard.standard_name}</h3>
                      <Badge variant="secondary">{standard.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{standard.standard_code}</p>
                    <div className="text-xs text-gray-500">
                      <p>Paramètres: {JSON.stringify(standard.parameters)}</p>
                      <p>Tolérances: {JSON.stringify(standard.tolerance_values)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment">
          <Card>
            <CardHeader>
              <CardTitle>État des équipements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equipment?.map((eq) => {
                  const nextCalibration = new Date(eq.next_calibration_date);
                  const today = new Date();
                  const daysUntilCalibration = Math.ceil((nextCalibration.getTime() - today.getTime()) / (1000 * 3600 * 24));
                  const needsCalibration = daysUntilCalibration <= 30;
                  
                  return (
                    <div key={eq.id} className={`p-4 border rounded-lg ${needsCalibration ? 'border-orange-300 bg-orange-50' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{eq.equipment_name}</h3>
                          <p className="text-sm text-gray-600">{eq.equipment_type} - {eq.serial_number}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>Dernière calibration: {new Date(eq.last_calibration_date).toLocaleDateString('fr-FR')}</span>
                            <span>Prochaine: {nextCalibration.toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={needsCalibration ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}>
                            {needsCalibration ? `${daysUntilCalibration} jours` : 'OK'}
                          </Badge>
                          {needsCalibration && (
                            <Button variant="outline" size="sm" onClick={() => handleScheduleCalibration(eq.id)}>
                              📅 Programmer
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Génération de rapports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">📊 Rapport de lot</h3>
                  <p className="text-sm text-gray-600 mb-4">Génère un rapport complet pour un lot de production</p>
                  <Button className="w-full" onClick={() => handleGenerateReport('lot')}>
                    Générer PDF
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">🏆 Certificat IMANOR</h3>
                  <p className="text-sm text-gray-600 mb-4">Certificat de conformité aux normes marocaines</p>
                  <Button className="w-full" onClick={() => handleGenerateReport('certificate')}>
                    Générer certificat
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">📈 Analyse des défauts</h3>
                  <p className="text-sm text-gray-600 mb-4">Tendances et analyse des défauts détectés</p>
                  <Button className="w-full" onClick={() => handleGenerateReport('defects')}>
                    Générer analyse
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">📋 Rapport mensuel</h3>
                  <p className="text-sm text-gray-600 mb-4">Synthèse mensuelle de la qualité</p>
                  <Button className="w-full" onClick={() => handleGenerateReport('monthly')}>
                    Générer rapport
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">🔄 Suivi équipements</h3>
                  <p className="text-sm text-gray-600 mb-4">État et planification des calibrations</p>
                  <Button className="w-full" onClick={() => handleGenerateReport('equipment')}>
                    Générer planning
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">🎯 Indicateurs KPI</h3>
                  <p className="text-sm text-gray-600 mb-4">Tableau de bord des performances qualité</p>
                  <Button className="w-full" onClick={() => handleGenerateReport('kpi')}>
                    Générer dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedQualityControl;
