import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save, AlertCircle } from "lucide-react";

const SystemSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    app_language: "fr",
    quality_alerts_enabled: true,
    auto_export_enabled: false,
    measurement_units: "metric",
    iso_tolerances: {
      length_tolerance_mm: "2.0",
      width_tolerance_mm: "2.0", 
      thickness_tolerance_percent: "5.0",
      water_absorption_max_percent: "3.0",
      breaking_strength_min_n: "1300"
    }
  });

  const handleSaveSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));

    toast({
      title: "Paramètre mis à jour",
      description: `Le paramètre ${key} a été sauvegardé`,
    });
  };

  const handleSaveTolerances = () => {
    toast({
      title: "Tolérances ISO mises à jour",
      description: "Les nouvelles tolérances ont été sauvegardées",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Paramètres Système</h2>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Configuration Avancée
        </Button>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Paramètres Généraux
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Langue de l'application</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={settings.app_language}
                onChange={(e) => handleSaveSetting('app_language', e.target.value)}
              >
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Unités de mesure</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={settings.measurement_units}
                onChange={(e) => handleSaveSetting('measurement_units', e.target.value)}
              >
                <option value="metric">Métrique</option>
                <option value="imperial">Impérial</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Alertes qualité en temps réel</label>
                <p className="text-sm text-gray-500">Activer les notifications pour les non-conformités</p>
              </div>
              <Switch 
                checked={settings.quality_alerts_enabled}
                onCheckedChange={(checked) => handleSaveSetting('quality_alerts_enabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Export automatique des rapports</label>
                <p className="text-sm text-gray-500">Génération automatique des rapports quotidiens</p>
              </div>
              <Switch 
                checked={settings.auto_export_enabled}
                onCheckedChange={(checked) => handleSaveSetting('auto_export_enabled', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ISO Tolerances */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Tolérances ISO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Tolérance longueur (mm)</label>
              <Input
                type="number"
                value={settings.iso_tolerances.length_tolerance_mm}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  iso_tolerances: {
                    ...prev.iso_tolerances,
                    length_tolerance_mm: e.target.value
                  }
                }))}
                step="0.1"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Tolérance largeur (mm)</label>
              <Input
                type="number"
                value={settings.iso_tolerances.width_tolerance_mm}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  iso_tolerances: {
                    ...prev.iso_tolerances,
                    width_tolerance_mm: e.target.value
                  }
                }))}
                step="0.1"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Tolérance épaisseur (%)</label>
              <Input
                type="number"
                value={settings.iso_tolerances.thickness_tolerance_percent}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  iso_tolerances: {
                    ...prev.iso_tolerances,
                    thickness_tolerance_percent: e.target.value
                  }
                }))}
                step="0.1"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Absorption eau max (%)</label>
              <Input
                type="number"
                value={settings.iso_tolerances.water_absorption_max_percent}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  iso_tolerances: {
                    ...prev.iso_tolerances,
                    water_absorption_max_percent: e.target.value
                  }
                }))}
                step="0.1"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Résistance min (N)</label>
              <Input
                type="number"
                value={settings.iso_tolerances.breaking_strength_min_n}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  iso_tolerances: {
                    ...prev.iso_tolerances,
                    breaking_strength_min_n: e.target.value
                  }
                }))}
                step="1"
              />
            </div>
          </div>

          <Button onClick={handleSaveTolerances} className="mt-4">
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder les Tolérances
          </Button>
        </CardContent>
      </Card>

      {/* Database Info */}
      <Card>
        <CardHeader>
          <CardTitle>Information Base de Données</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">Local</div>
              <div className="text-sm text-gray-600">Type de base</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">PostgreSQL</div>
              <div className="text-sm text-gray-600">Moteur</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">Active</div>
              <div className="text-sm text-gray-600">Statut</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;