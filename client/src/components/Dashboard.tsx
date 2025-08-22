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

const Dashboard = () => {
  const { toast } = useToast();
  
  // Fetch data using React Query
  const { data: productionLots } = useQuery({
    queryKey: ["/api/production-lots"],
    queryFn: () => apiService.getProductionLots()
  });
  
  const { data: qualityTests } = useQuery({
    queryKey: ["/api/quality-tests"],
    queryFn: () => apiService.getQualityTests()
  });
  
  const { data: energyData } = useQuery({
    queryKey: ["/api/energy-consumption"],
    queryFn: () => apiService.getEnergyConsumption()
  });
  
  const { data: wasteData } = useQuery({
    queryKey: ["/api/waste-records"],
    queryFn: () => apiService.getWasteRecords()
  });

  // Calculate metrics
  const totalProduction = productionLots?.reduce((sum, lot) => sum + lot.quantity, 0) || 0;
  const conformeTests = qualityTests?.filter(test => test.status === 'Conforme').length || 0;
  const totalTests = qualityTests?.length || 1;
  const qualityRate = ((conformeTests / totalTests) * 100).toFixed(1);
  
  const totalEnergyConsumption = energyData?.reduce((sum, record) => sum + Number(record.consumption_kwh), 0) || 0;
  const totalWasteRecycled = wasteData?.filter(record => record.disposal_method?.includes('Recyclage')).length || 0;
  const recyclingRate = wasteData?.length ? ((totalWasteRecycled / wasteData.length) * 100).toFixed(1) : '0';

  const MetricCard = ({ title, value, unit, trend, icon, color, description }: any) => (
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
    <div className="space-y-8">
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Production Journalière"
          value={totalProduction}
          unit="pièces"
          trend={5.2}
          icon={<Factory className="h-5 w-5 text-white" />}
          color="bg-blue-600"
          description="Objectif: 3,000 pièces"
        />
        <MetricCard
          title="Taux de Qualité"
          value={qualityRate}
          unit="%"
          trend={1.2}
          icon={<CheckCircle className="h-5 w-5 text-white" />}
          color="bg-green-600"
          description="Objectif: > 95%"
        />
        <MetricCard
          title="Consommation Énergétique"
          value={Math.round(totalEnergyConsumption)}
          unit="kWh"
          trend={-2.1}
          icon={<Zap className="h-5 w-5 text-white" />}
          color="bg-orange-600"
          description="Réduction de 2.1%"
        />
        <MetricCard
          title="Taux de Recyclage"
          value={recyclingRate}
          unit="%"
          trend={3.8}
          icon={<Recycle className="h-5 w-5 text-white" />}
          color="bg-emerald-600"
          description="Objectif: 85%"
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Sources d'Énergie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Électricité", value: 85, color: "bg-blue-500" },
              { name: "Gaz Naturel", value: 72, color: "bg-orange-500" },
              { name: "Eau", value: 58, color: "bg-cyan-500" }
            ].map((source) => (
              <div key={source.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{source.name}</span>
                  <span className="text-slate-600">{source.value}%</span>
                </div>
                <Progress value={source.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quality Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Contrôles Qualité Récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {qualityTests?.slice(0, 3).length ? (
              <div className="space-y-4">
                {qualityTests.slice(0, 3).map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-700">Lot #{test.lot_number}</p>
                      <p className="text-sm text-slate-500">{test.test_type}</p>
                    </div>
                    <Badge 
                      variant={test.status === 'Conforme' ? 'default' : 'destructive'}
                      className={test.status === 'Conforme' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {test.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>Aucun test récent</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-800">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Alertes et Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-700">
                  Température du four légèrement élevée - Zone B
                </span>
              </div>
              <Badge variant="outline" className="text-orange-700 border-orange-300">
                Modéré
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-slate-700">
                  Maintenance préventive programmée pour demain
                </span>
              </div>
              <Badge variant="outline" className="text-green-700 border-green-300">
                Planifié
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;