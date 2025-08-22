
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database, Table, Users, Activity } from "lucide-react";

const DatabaseConfig = () => {
  // Fetch database statistics
  const { data: stats } = useQuery({
    queryKey: ["admin-db-stats"],
    queryFn: async () => {
      const [users, qualityTests, energyConsumption, activityLogs] = await Promise.all([
        supabase.from("profiles").select("id", { count: 'exact', head: true }),
        supabase.from("quality_tests").select("id", { count: 'exact', head: true }),
        supabase.from("energy_consumption").select("id", { count: 'exact', head: true }),
        supabase.from("user_activity_logs").select("id", { count: 'exact', head: true })
      ]);

      return {
        users: users.count || 0,
        qualityTests: qualityTests.count || 0,
        energyConsumption: energyConsumption.count || 0,
        activityLogs: activityLogs.count || 0
      };
    },
  });

  const dbTables = [
    { name: "profiles", description: "Profils utilisateurs", records: stats?.users || 0 },
    { name: "quality_tests", description: "Tests qualité", records: stats?.qualityTests || 0 },
    { name: "energy_consumption", description: "Consommation énergétique", records: stats?.energyConsumption || 0 },
    { name: "user_activity_logs", description: "Journaux d'activité", records: stats?.activityLogs || 0 },
    { name: "production_lots", description: "Lots de production", records: 0 },
    { name: "roles", description: "Rôles système", records: 6 },
    { name: "permissions", description: "Permissions", records: 25 },
    { name: "user_roles", description: "Attribution des rôles", records: 0 }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Configuration Base de Données
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Database Stats */}
            <div>
              <h4 className="font-medium mb-3">Statistiques Générales</h4>
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-2xl font-bold">{stats?.users || 0}</p>
                    <p className="text-sm text-gray-600">Utilisateurs</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <p className="text-2xl font-bold">{stats?.qualityTests || 0}</p>
                    <p className="text-sm text-gray-600">Tests Qualité</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Database className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                    <p className="text-2xl font-bold">{stats?.energyConsumption || 0}</p>
                    <p className="text-sm text-gray-600">Données Énergie</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Table className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <p className="text-2xl font-bold">{stats?.activityLogs || 0}</p>
                    <p className="text-sm text-gray-600">Logs Activité</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Tables Overview */}
            <div>
              <h4 className="font-medium mb-3">Tables de la Base de Données</h4>
              <div className="space-y-2">
                {dbTables.map((table) => (
                  <div key={table.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Table className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="font-medium">{table.name}</p>
                        <p className="text-sm text-gray-500">{table.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {table.records.toLocaleString()} enregistrements
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Configuration Info */}
            <div>
              <h4 className="font-medium mb-3">Configuration Supabase</h4>
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Projet ID:</span>
                  <span className="text-sm font-mono">uvgegpzrchderhbjihch</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">URL:</span>
                  <span className="text-sm font-mono">*.supabase.co</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">RLS:</span>
                  <Badge variant="default">Activé</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Auth:</span>
                  <Badge variant="default">Configuré</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseConfig;
