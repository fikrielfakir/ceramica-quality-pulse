import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useEnhancedQualityTests, useQualityStandards, useEquipmentCalibration } from "@/hooks/useQualityData";

const QualityTestForm = () => {
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    test_type: 'dimensional',
    length_mm: '',
    width_mm: '',
    thickness_mm: '',
    water_absorption_percent: '',
    breaking_strength_n: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Test enregistré",
      description: "Le test de qualité a été ajouté avec succès",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">🧪 Nouveau Test Qualité</h1>
        <Button variant="outline" onClick={() => window.history.back()}>
          ← Retour
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="dimensional" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dimensional">🔍 Dimensionnel</TabsTrigger>
            <TabsTrigger value="physical">🧪 Physique</TabsTrigger>
            <TabsTrigger value="visual">👀 Visuel</TabsTrigger>
          </TabsList>

          <TabsContent value="dimensional">
            <Card>
              <CardHeader>
                <CardTitle>Tests dimensionnels ISO 13006</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="length">Longueur (mm)</Label>
                    <Input
                      id="length"
                      type="number"
                      step="0.1"
                      value={formData.length_mm}
                      onChange={(e) => handleInputChange('length_mm', e.target.value)}
                      placeholder="600.0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="width">Largeur (mm)</Label>
                    <Input
                      id="width"
                      type="number"
                      step="0.1"
                      value={formData.width_mm}
                      onChange={(e) => handleInputChange('width_mm', e.target.value)}
                      placeholder="600.0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="thickness">Épaisseur (mm)</Label>
                    <Input
                      id="thickness"
                      type="number"
                      step="0.1"
                      value={formData.thickness_mm}
                      onChange={(e) => handleInputChange('thickness_mm', e.target.value)}
                      placeholder="10.0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="physical">
            <Card>
              <CardHeader>
                <CardTitle>Tests physiques ISO 10545</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="absorption">Absorption eau (%)</Label>
                    <Input
                      id="absorption"
                      type="number"
                      step="0.1"
                      value={formData.water_absorption_percent}
                      onChange={(e) => handleInputChange('water_absorption_percent', e.target.value)}
                      placeholder="2.5"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="strength">Résistance rupture (N)</Label>
                    <Input
                      id="strength"
                      type="number"
                      value={formData.breaking_strength_n}
                      onChange={(e) => handleInputChange('breaking_strength_n', e.target.value)}
                      placeholder="1500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visual">
            <Card>
              <CardHeader>
                <CardTitle>Inspection visuelle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Observations</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Décrivez les défauts observés..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            💾 Enregistrer Test
          </Button>
          <Button type="button" variant="outline">
            📋 Aperçu Rapport
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QualityTestForm;
