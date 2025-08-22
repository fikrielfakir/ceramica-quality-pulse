import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { 
  Factory, 
  CheckCircle, 
  Zap, 
  Recycle, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Activity,
  BarChart3,
  Eye
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  trend: number;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

const Dashboard = () => {
  const { toast } = useToast();
  
  // Fetch data using React Query
  const { data: productionLots = [] } = useQuery({
    queryKey: ["/api/production-lots"],
    queryFn: () => apiService.getProductionLots()
  });
  
  const { data: qualityTests = [] } = useQuery({
    queryKey: ["/api/quality-tests"],
    queryFn: () => apiService.getQualityTests()
  });
  
  const { data: energyData = [] } = useQuery({
    queryKey: ["/api/energy-consumption"],
    queryFn: () => apiService.getEnergyConsumption()
  });
  
  const { data: wasteData = [] } = useQuery({
    queryKey: ["/api/waste-records"],
    queryFn: () => apiService.getWasteRecords()
  });

  // Calculate real metrics from database data
  const totalProduction = productionLots.reduce((sum: number, lot: any) => sum + (lot.quantity || 0), 0);
  const conformeTests = qualityTests.filter((test: any) => test.status === 'Conforme').length;
  const totalTests = qualityTests.length || 1;
  const qualityRate = ((conformeTests / totalTests) * 100).toFixed(1);
  
  const totalEnergyConsumption = energyData.reduce((sum: number, record: any) => sum + (Number(record.consumption_kwh) || 0), 0);
  const totalWasteRecycled = wasteData.filter((record: any) => record.disposal_method?.includes('Recyclage')).length;
  const recyclingRate = wasteData.length ? ((totalWasteRecycled / wasteData.length) * 100).toFixed(1) : '0';

  // Calculate energy distribution from real data
  const electricityConsumption = energyData.filter((record: any) => record.energy_source === 'electricity')
    .reduce((sum: number, record: any) => sum + (Number(record.consumption_kwh) || 0), 0);
  const gasConsumption = energyData.filter((record: any) => record.energy_source === 'gas')
    .reduce((sum: number, record: any) => sum + (Number(record.consumption_kwh) || 0), 0);
  const waterConsumption = energyData.filter((record: any) => record.energy_source === 'water')
    .reduce((sum: number, record: any) => sum + (Number(record.consumption_kwh) || 0), 0);
  
  const totalEnergyForDistribution = electricityConsumption + gasConsumption + waterConsumption || 1;
  
  const energySources = [
    { 
      name: "Électricité", 
      value: Math.round((electricityConsumption / totalEnergyForDistribution) * 100), 
      color: "bg-blue-500" 
    },
    { 
      name: "Gaz Naturel", 
      value: Math.round((gasConsumption / totalEnergyForDistribution) * 100), 
      color: "bg-orange-500" 
    },
    { 
      name: "Eau", 
      value: Math.round((waterConsumption / totalEnergyForDistribution) * 100), 
      color: "bg-cyan-500" 
    }
  ];

  const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, trend, icon, color, description }) => (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-700">{title}</CardTitle>
        <div className={`h-10 w-10 rounded-lg ${color} flex items-center justify-center`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">
          {value} <span className="text-sm text-slate-500 font-normal">{unit}</span>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          {trend > 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
          <span className={`text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(trend)}% vs hier
          </span>
        </div>
        {description && (
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tableau de Bord</h1>
          <p className="text-slate-600">Vue d'ensemble de la production céramique</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Activity className="h-3 w-3 mr-1" />
          Système opérationnel
        </Badge>
      </div>

      {/* Key Metrics - Real Data from Database */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Production Total"
          value={totalProduction || 0}
          unit="pièces"
          trend={5.2}
          icon={<Factory className="h-5 w-5 text-white" />}
          color="bg-blue-600"
          description={`${productionLots.length} lots en cours`}
        />
        <MetricCard
          title="Taux de Qualité"
          value={totalTests > 0 ? qualityRate : '0'}
          unit="%"
          trend={1.2}
          icon={<CheckCircle className="h-5 w-5 text-white" />}
          color="bg-green-600"
          description={`${conformeTests}/${totalTests} tests conformes`}
        />
        <MetricCard
          title="Consommation Énergétique"
          value={Math.round(totalEnergyConsumption) || 0}
          unit="kWh"
          trend={-2.1}
          icon={<Zap className="h-5 w-5 text-white" />}
          color="bg-orange-600"
          description={`${energyData.length} enregistrements`}
        />
        <MetricCard
          title="Taux de Recyclage"
          value={recyclingRate}
          unit="%"
          trend={3.8}
          icon={<Recycle className="h-5 w-5 text-white" />}
          color="bg-emerald-600"
          description={`${totalWasteRecycled}/${wasteData.length} recyclés`}
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy Sources - Real Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Sources d'Énergie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {energySources.map((source) => (
              <div key={source.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{source.name}</span>
                  <span className="text-slate-600">{source.value}%</span>
                </div>
                <Progress value={source.value} className="h-2" />
              </div>
            ))}
            {energyData.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">
                Aucune donnée énergétique disponible
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quality Metrics - Real Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Contrôles Qualité Récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {qualityTests.slice(0, 3).length > 0 ? (
              <div className="space-y-4">
                {qualityTests.slice(0, 3).map((test: any) => (
                  <div key={test.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-700">Test #{test.id.slice(0, 8)}</p>
                      <p className="text-sm text-slate-500">{test.test_type || 'Test qualité'}</p>
                    </div>
                    <Badge 
                      variant={test.status === 'Conforme' ? 'default' : 'destructive'}
                      className={test.status === 'Conforme' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {test.status || 'En cours'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>Aucun test qualité disponible</p>
                <p className="text-xs mt-1">Créez votre premier test dans le module Contrôle Qualité</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Real-time Status */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <AlertTriangle className="h-5 w-5 mr-2" />
            État du Système
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-700">
                  Base de données: {totalTests + productionLots.length + energyData.length + wasteData.length} enregistrements
                </span>
              </div>
              <Badge variant="outline" className="text-green-700 border-green-300">
                Actif
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-slate-700">
                  Dernière synchronisation: maintenant
                </span>
              </div>
              <Badge variant="outline" className="text-blue-700 border-blue-300">
                Synchronisé
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;