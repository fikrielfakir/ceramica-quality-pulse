import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Table, Users, Activity } from "lucide-react";

const DatabaseConfig = () => {
  const dbTables = [
    { name: "profiles", description: "Profils utilisateurs", records: 0 },
    { name: "quality_tests", description: "Tests qualité", records: 0 },
    { name: "energy_consumption", description: "Consommation énergétique", records: 0 },
    { name: "production_lots", description: "Lots de production", records: 0 },
    { name: "waste_records", description: "Gestion des déchets", records: 0 },
    { name: "compliance_documents", description: "Documents conformité", records: 0 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Configuration Base de Données</h2>
        <Badge variant="outline" className="bg-green-50 text-green-700">
          PostgreSQL Local
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Database className="h-4 w-4 mr-2" />
              État Base
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Table className="h-4 w-4 mr-2" />
              Tables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbTables.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Connexions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">1</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Optimale</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tables de la Base de Données</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dbTables.map((table) => (
              <div key={table.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Table className="h-4 w-4 mr-3 text-gray-500" />
                  <div>
                    <div className="font-medium">{table.name}</div>
                    <div className="text-sm text-gray-500">{table.description}</div>
                  </div>
                </div>
                <Badge variant="secondary">
                  {table.records} enregistrements
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseConfig;