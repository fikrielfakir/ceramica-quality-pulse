
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProductionData } from "@/hooks/useProductionData";
import { useQualityStandards, useDefectTypes } from "@/hooks/useQualityData";
import { useAuth } from "@/hooks/useAuth";

const QualityTestForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: productionLots } = useProductionData();
  const { data: qualityStandards } = useQualityStandards();
  const { data: defectTypes } = useDefectTypes();
  
  const [formData, setFormData] = useState({
    lot_id: "",
    test_type: "dimensional",
    // Dimensional measurements
    length_mm: "",
    width_mm: "",
    thickness_mm: "",
    warping_percent: "",
    // Physical properties
    water_absorption_percent: "",
    breaking_strength_n: "",
    abrasion_resistance_pei: "",
    // Visual inspection
    surface_quality_grade: "",
    color_consistency_grade: "",
    glaze_quality_grade: "",
    // Equipment and method
    equipment_used: "",
    test_method: "",
    notes: "",
    corrective_actions: ""
  });
  
  const [selectedDefects, setSelectedDefects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateAgainstStandards = () => {
    const results: any = {};
    const compliance: any = {};
    
    if (!qualityStandards) return { results, compliance };
    
    qualityStandards.forEach(standard => {
      const { standard_code, tolerance_values, category } = standard;
      const tolerances = tolerance_values as any;
      
      if (category === 'dimensional') {
        if (standard_code === 'ISO-13006-DIM-L' && formData.length_mm) {
          const length = parseFloat(formData.length_mm);
          const isCompliant = length >= tolerances.min_mm && length <= tolerances.max_mm;
          compliance[standard_code] = isCompliant;
          results[standard_code] = { value: length, compliant: isCompliant };
        }
        
        if (standard_code === 'ISO-13006-DIM-W' && formData.width_mm) {
          const width = parseFloat(formData.width_mm);
          const isCompliant = width >= tolerances.min_mm && width <= tolerances.max_mm;
          compliance[standard_code] = isCompliant;
          results[standard_code] = { value: width, compliant: isCompliant };
        }
        
        if (standard_code === 'ISO-13006-WARP' && formData.warping_percent) {
          const warping = parseFloat(formData.warping_percent);
          const isCompliant = warping <= tolerances.max_percent;
          compliance[standard_code] = isCompliant;
          results[standard_code] = { value: warping, compliant: isCompliant };
        }
      }
      
      if (category === 'physical') {
        if (standard_code === 'ISO-10545-3' && formData.water_absorption_percent) {
          const absorption = parseFloat(formData.water_absorption_percent);
          const isCompliant = absorption <= tolerances.max_percent;
          compliance[standard_code] = isCompliant;
          results[standard_code] = { value: absorption, compliant: isCompliant };
        }
        
        if (standard_code === 'ISO-10545-4' && formData.breaking_strength_n) {
          const strength = parseInt(formData.breaking_strength_n);
          const isCompliant = strength >= tolerances.min_n;
          compliance[standard_code] = isCompliant;
          results[standard_code] = { value: strength, compliant: isCompliant };
        }
      }
    });
    
    return { results, compliance };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { results, compliance } = validateAgainstStandards();
      const overallCompliant = Object.values(compliance).every(c => c === true);
      
      const testData = {
        ...formData,
        operator_id: user.id,
        length_mm: formData.length_mm ? parseFloat(formData.length_mm) : null,
        width_mm: formData.width_mm ? parseFloat(formData.width_mm) : null,
        thickness_mm: formData.thickness_mm ? parseFloat(formData.thickness_mm) : null,
        warping_percent: formData.warping_percent ? parseFloat(formData.warping_percent) : null,
        water_absorption_percent: formData.water_absorption_percent ? parseFloat(formData.water_absorption_percent) : null,
        breaking_strength_n: formData.breaking_strength_n ? parseInt(formData.breaking_strength_n) : null,
        abrasion_resistance_pei: formData.abrasion_resistance_pei ? parseInt(formData.abrasion_resistance_pei) : null,
        test_results: results,
        defects: selectedDefects,
        iso_compliance: compliance,
        overall_status: overallCompliant ? 'Conforme' : 'Non-conforme'
      };
      
      const { error } = await supabase
        .from('quality_tests')
        .insert([testData]);
      
      if (error) throw error;
      
      toast({
        title: "Test de qualité enregistré",
        description: `Statut: ${overallCompliant ? 'Conforme ✅' : 'Non-conforme ❌'}`,
      });
      
      // Reset form
      setFormData({
        lot_id: "",
        test_type: "dimensional",
        length_mm: "",
        width_mm: "",
        thickness_mm: "",
        warping_percent: "",
        water_absorption_percent: "",
        breaking_strength_n: "",
        abrasion_resistance_pei: "",
        surface_quality_grade: "",
        color_consistency_grade: "",
        glaze_quality_grade: "",
        equipment_used: "",
        test_method: "",
        notes: "",
        corrective_actions: ""
      });
      setSelectedDefects([]);
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const addDefect = (defectTypeId: string, count: number, description: string) => {
    const defectType = defectTypes?.find(d => d.id === defectTypeId);
    if (defectType) {
      setSelectedDefects(prev => [
        ...prev,
        {
          defect_type_id: defectTypeId,
          name_fr: defectType.name_fr,
          name_ar: defectType.name_ar,
          severity: defectType.severity,
          count,
          description
        }
      ]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧪 Nouveau Test de Qualité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lot_id">Lot de production *</Label>
                <Select value={formData.lot_id} onValueChange={(value) => handleInputChange('lot_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un lot" />
                  </SelectTrigger>
                  <SelectContent>
                    {productionLots?.map((lot) => (
                      <SelectItem key={lot.id} value={lot.id}>
                        {lot.lot_number} - {lot.product_type} ({lot.quantity} pcs)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="test_type">Type de test</Label>
                <Select value={formData.test_type} onValueChange={(value) => handleInputChange('test_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dimensional">🔍 Contrôle dimensionnel</SelectItem>
                    <SelectItem value="physical">🧪 Tests physiques</SelectItem>
                    <SelectItem value="visual">👀 Inspection visuelle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs value={formData.test_type} onValueChange={(value) => handleInputChange('test_type', value)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="dimensional">🔍 Dimensionnel</TabsTrigger>
                <TabsTrigger value="physical">🧪 Physique</TabsTrigger>
                <TabsTrigger value="visual">👀 Visuel</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dimensional" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="length_mm">Longueur (mm)</Label>
                    <Input
                      id="length_mm"
                      type="number"
                      step="0.001"
                      value={formData.length_mm}
                      onChange={(e) => handleInputChange('length_mm', e.target.value)}
                      placeholder="600.000"
                    />
                    <p className="text-xs text-gray-500">ISO 13006: 595-605mm</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="width_mm">Largeur (mm)</Label>
                    <Input
                      id="width_mm"
                      type="number"
                      step="0.001"
                      value={formData.width_mm}
                      onChange={(e) => handleInputChange('width_mm', e.target.value)}
                      placeholder="600.000"
                    />
                    <p className="text-xs text-gray-500">ISO 13006: 595-605mm</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="thickness_mm">Épaisseur (mm)</Label>
                    <Input
                      id="thickness_mm"
                      type="number"
                      step="0.001"
                      value={formData.thickness_mm}
                      onChange={(e) => handleInputChange('thickness_mm', e.target.value)}
                      placeholder="10.000"
                    />
                    <p className="text-xs text-gray-500">Tolérance: ±5%</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="warping_percent">Gauchissement (%)</Label>
                    <Input
                      id="warping_percent"
                      type="number"
                      step="0.001"
                      value={formData.warping_percent}
                      onChange={(e) => handleInputChange('warping_percent', e.target.value)}
                      placeholder="0.300"
                    />
                    <p className="text-xs text-gray-500">Max: 0.6% (rectifié)</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="physical" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="water_absorption_percent">Absorption eau (%)</Label>
                    <Input
                      id="water_absorption_percent"
                      type="number"
                      step="0.01"
                      value={formData.water_absorption_percent}
                      onChange={(e) => handleInputChange('water_absorption_percent', e.target.value)}
                      placeholder="1.50"
                    />
                    <p className="text-xs text-gray-500">ISO 10545-3: ≤3% (grès cérame)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="breaking_strength_n">Résistance flexion (N)</Label>
                    <Input
                      id="breaking_strength_n"
                      type="number"
                      value={formData.breaking_strength_n}
                      onChange={(e) => handleInputChange('breaking_strength_n', e.target.value)}
                      placeholder="1500"
                    />
                    <p className="text-xs text-gray-500">ISO 10545-4: ≥1300N (sol)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="abrasion_resistance_pei">Résistance abrasion (PEI)</Label>
                    <Select value={formData.abrasion_resistance_pei} onValueChange={(value) => handleInputChange('abrasion_resistance_pei', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Classe PEI" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">PEI 1 - Usage léger</SelectItem>
                        <SelectItem value="2">PEI 2 - Usage modéré</SelectItem>
                        <SelectItem value="3">PEI 3 - Usage intense</SelectItem>
                        <SelectItem value="4">PEI 4 - Usage commercial</SelectItem>
                        <SelectItem value="5">PEI 5 - Usage industriel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="visual" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="surface_quality_grade">Qualité surface</Label>
                    <Select value={formData.surface_quality_grade} onValueChange={(value) => handleInputChange('surface_quality_grade', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Note qualité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A - Excellent</SelectItem>
                        <SelectItem value="B">B - Bon</SelectItem>
                        <SelectItem value="C">C - Acceptable</SelectItem>
                        <SelectItem value="D">D - Défaillant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="color_consistency_grade">Consistance couleur</Label>
                    <Select value={formData.color_consistency_grade} onValueChange={(value) => handleInputChange('color_consistency_grade', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Note couleur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A - Uniforme</SelectItem>
                        <SelectItem value="B">B - Légère variation</SelectItem>
                        <SelectItem value="C">C - Variation notable</SelectItem>
                        <SelectItem value="D">D - Variation excessive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="glaze_quality_grade">Qualité émail</Label>
                    <Select value={formData.glaze_quality_grade} onValueChange={(value) => handleInputChange('glaze_quality_grade', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Note émail" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A - Parfait</SelectItem>
                        <SelectItem value="B">B - Bon</SelectItem>
                        <SelectItem value="C">C - Défauts mineurs</SelectItem>
                        <SelectItem value="D">D - Défauts majeurs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Defect Selection */}
                <div className="space-y-4">
                  <Label>Défauts détectés</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {defectTypes?.map((defect) => (
                      <div key={defect.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{defect.name_fr}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            defect.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            defect.severity === 'major' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {defect.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{defect.description_fr}</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addDefect(defect.id, 1, defect.description_fr || '')}
                        >
                          Ajouter défaut
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Selected Defects */}
                {selectedDefects.length > 0 && (
                  <div className="space-y-2">
                    <Label>Défauts sélectionnés</Label>
                    <div className="space-y-2">
                      {selectedDefects.map((defect, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>{defect.name_fr} ({defect.severity})</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedDefects(prev => prev.filter((_, i) => i !== index))}
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Equipment and Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="equipment_used">Équipement utilisé</Label>
                <Input
                  id="equipment_used"
                  value={formData.equipment_used}
                  onChange={(e) => handleInputChange('equipment_used', e.target.value)}
                  placeholder="Pied à coulisse digital A1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="test_method">Méthode de test</Label>
                <Input
                  id="test_method"
                  value={formData.test_method}
                  onChange={(e) => handleInputChange('test_method', e.target.value)}
                  placeholder="ISO 13006 - Mesure manuelle"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Observations et remarques..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="corrective_actions">Actions correctives</Label>
              <Textarea
                id="corrective_actions"
                value={formData.corrective_actions}
                onChange={(e) => handleInputChange('corrective_actions', e.target.value)}
                placeholder="Actions à entreprendre en cas de non-conformité..."
                rows={3}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading || !formData.lot_id}>
              {loading ? "Enregistrement..." : "🧪 Enregistrer le test"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityTestForm;
