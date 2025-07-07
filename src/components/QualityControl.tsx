
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const QualityControl = () => {
  const [selectedBatch, setSelectedBatch] = useState("");
  const [testResults, setTestResults] = useState({
    length: "",
    width: "",
    thickness: "",
    waterAbsorption: "",
    breakResistance: "",
    defectType: "",
    notes: ""
  });

  const recentTests = [
    { 
      id: "LOT-2024-001", 
      date: "15/03/2024", 
      status: "Conforme", 
      defects: 2,
      operator: "A. Bennani"
    },
    { 
      id: "LOT-2024-002", 
      date: "14/03/2024", 
      status: "Non-conforme", 
      defects: 12,
      operator: "M. Alami"
    },
    { 
      id: "LOT-2024-003", 
      date: "14/03/2024", 
      status: "Conforme", 
      defects: 1,
      operator: "S. Tazi"
    }
  ];

  const handleSubmitTest = () => {
    console.log("Nouveau test qualité:", testResults);
    // Réinitialiser le formulaire
    setTestResults({
      length: "",
      width: "",
      thickness: "",
      waterAbsorption: "",
      breakResistance: "",
      defectType: "",
      notes: ""
    });
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire de contrôle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🧪 Nouveau Contrôle Qualité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="batch">Numéro de Lot</Label>
                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un lot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOT-2024-004">LOT-2024-004</SelectItem>
                    <SelectItem value="LOT-2024-005">LOT-2024-005</SelectItem>
                    <SelectItem value="LOT-2024-006">LOT-2024-006</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Date de Production</Label>
                <Input type="date" id="date" />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">📐 Contrôles Dimensionnels (ISO 13006)</h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="length">Longueur (mm)</Label>
                  <Input 
                    id="length" 
                    type="number" 
                    placeholder="600±3"
                    value={testResults.length}
                    onChange={(e) => setTestResults({...testResults, length: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="width">Largeur (mm)</Label>
                  <Input 
                    id="width" 
                    type="number" 
                    placeholder="600±3"
                    value={testResults.width}
                    onChange={(e) => setTestResults({...testResults, width: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="thickness">Épaisseur (mm)</Label>
                  <Input 
                    id="thickness" 
                    type="number" 
                    placeholder="10±0.5"
                    value={testResults.thickness}
                    onChange={(e) => setTestResults({...testResults, thickness: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">🔬 Tests Physiques</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="absorption">Absorption d'eau (%)</Label>
                  <Input 
                    id="absorption" 
                    type="number" 
                    placeholder="≤3% (ISO 10545-3)"
                    value={testResults.waterAbsorption}
                    onChange={(e) => setTestResults({...testResults, waterAbsorption: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="resistance">Résistance rupture (N)</Label>
                  <Input 
                    id="resistance" 
                    type="number" 
                    placeholder="≥1300N (ISO 10545-4)"
                    value={testResults.breakResistance}
                    onChange={(e) => setTestResults({...testResults, breakResistance: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="defects">Type de Défaut Observé</Label>
              <Select value={testResults.defectType} onValueChange={(value) => setTestResults({...testResults, defectType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Aucun défaut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun défaut</SelectItem>
                  <SelectItem value="crack">Fissure</SelectItem>
                  <SelectItem value="glaze">Défaut émail</SelectItem>
                  <SelectItem value="dimension">Hors dimension</SelectItem>
                  <SelectItem value="color">Variation couleur</SelectItem>
                  <SelectItem value="warping">Gauchissement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Observations</Label>
              <Textarea 
                id="notes" 
                placeholder="Notes techniques, observations particulières..."
                value={testResults.notes}
                onChange={(e) => setTestResults({...testResults, notes: e.target.value})}
              />
            </div>

            <Button onClick={handleSubmitTest} className="w-full">
              Enregistrer le Contrôle
            </Button>
          </CardContent>
        </Card>

        {/* Historique des tests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📋 Historique des Contrôles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTests.map((test, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">{test.id}</div>
                    <Badge variant={test.status === "Conforme" ? "default" : "destructive"}>
                      {test.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>📅 {test.date}</div>
                    <div>👤 {test.operator}</div>
                    <div>❌ {test.defects} défauts</div>
                    <div>
                      <Button variant="outline" size="sm">
                        Voir détails
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">📊 Statistiques Mensuelles</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Tests réalisés:</span>
                  <span className="font-bold ml-2">127</span>
                </div>
                <div>
                  <span className="text-blue-700">Taux conformité:</span>
                  <span className="font-bold ml-2 text-green-600">96.8%</span>
                </div>
                <div>
                  <span className="text-blue-700">Défauts moyens/lot:</span>
                  <span className="font-bold ml-2">2.1</span>
                </div>
                <div>
                  <span className="text-blue-700">Certification ISO:</span>
                  <span className="font-bold ml-2 text-green-600">✓ Active</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes qualité */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="text-red-600">⚠️ Alertes Qualité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="font-medium text-red-800">LOT-2024-002 - Non-conforme</p>
              <p className="text-sm text-red-600">12 défauts détectés - Action corrective requise</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="font-medium text-yellow-800">Tendance dimensionnelle</p>
              <p className="text-sm text-yellow-600">Légère dérive sur épaisseur - Surveiller four B1</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityControl;
