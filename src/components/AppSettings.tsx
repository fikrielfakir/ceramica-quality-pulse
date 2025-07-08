
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const AppSettings = () => {
  const { toast } = useToast();
  
  // Settings state
  const [toleranceSettings, setToleranceSettings] = useState({
    maxThickness: "10.5",
    maxWaterAbsorption: "3.0",
    minBreakResistance: "1300",
    dimensionalTolerance: "2.0"
  });

  const [regionSettings, setRegionSettings] = useState({
    language: "fr",
    units: "metric",
    dateFormat: "dd/mm/yyyy",
    timezone: "UTC+1"
  });

  const [alertSettings, setAlertSettings] = useState({
    realTimeAlerts: true,
    emailNotifications: true,
    defectAlerts: true,
    calibrationReminders: true
  });

  const handleSaveTolerances = () => {
    // Mock save - would normally save to database
    toast({
      title: "Paramètres sauvegardés",
      description: "Les valeurs de tolérance ISO ont été mises à jour",
    });
  };

  const handleSaveRegionalSettings = () => {
    toast({
      title: "Paramètres régionaux",
      description: "Les paramètres de langue et région ont été sauvegardés",
    });
  };

  const handleSaveAlerts = () => {
    toast({
      title: "Alertes configurées",
      description: "Les paramètres d'alertes ont été mis à jour",
    });
  };

  const handleExportSettings = () => {
    toast({
      title: "Export des paramètres",
      description: "Configuration exportée vers fichier JSON",
    });
  };

  const handleImportSettings = () => {
    toast({
      title: "Import des paramètres",
      description: "Configuration importée avec succès",
    });
  };

  const handleResetDefaults = () => {
    toast({
      title: "Remise à zéro",
      description: "Paramètres remis aux valeurs par défaut",
    });
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">⚙️ Paramètres Application</h1>
          <p className="text-gray-600">Configuration système et personnalisation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportSettings}>
            📤 Exporter
          </Button>
          <Button variant="outline" onClick={handleImportSettings}>
            📥 Importer
          </Button>
          <Button variant="destructive" onClick={handleResetDefaults}>
            🔄 Défaut
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tolerances" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tolerances">📏 Tolérances ISO</TabsTrigger>
          <TabsTrigger value="regional">🌍 Région & Langue</TabsTrigger>
          <TabsTrigger value="alerts">🔔 Alertes</TabsTrigger>
          <TabsTrigger value="system">🖥️ Système</TabsTrigger>
        </TabsList>

        <TabsContent value="tolerances">
          <Card>
            <CardHeader>
              <CardTitle>Valeurs de Tolérance ISO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="thickness">Épaisseur maximale (mm)</Label>
                    <Input
                      id="thickness"
                      type="number"
                      step="0.1"
                      value={toleranceSettings.maxThickness}
                      onChange={(e) => setToleranceSettings({...toleranceSettings, maxThickness: e.target.value})}
                    />
                    <p className="text-xs text-gray-600 mt-1">ISO 13006 - Tolérance dimensionnelle</p>
                  </div>

                  <div>
                    <Label htmlFor="water">Absorption d'eau max (%)</Label>
                    <Input
                      id="water"
                      type="number"
                      step="0.1"
                      value={toleranceSettings.maxWaterAbsorption}
                      onChange={(e) => setToleranceSettings({...toleranceSettings, maxWaterAbsorption: e.target.value})}
                    />
                    <p className="text-xs text-gray-600 mt-1">ISO 10545-3 - Absorption d'eau</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="resistance">Résistance rupture min (N)</Label>
                    <Input
                      id="resistance"
                      type="number"
                      value={toleranceSettings.minBreakResistance}
                      onChange={(e) => setToleranceSettings({...toleranceSettings, minBreakResistance: e.target.value})}
                    />
                    <p className="text-xs text-gray-600 mt-1">ISO 10545-4 - Résistance à la flexion</p>
                  </div>

                  <div>
                    <Label htmlFor="dimensional">Tolérance dimensionnelle (mm)</Label>
                    <Input
                      id="dimensional"
                      type="number"
                      step="0.1"
                      value={toleranceSettings.dimensionalTolerance}
                      onChange={(e) => setToleranceSettings({...toleranceSettings, dimensionalTolerance: e.target.value})}
                    />
                    <p className="text-xs text-gray-600 mt-1">Longueur/Largeur ±</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">📋 Normes IMANOR Maroc</h4>
                <p className="text-sm text-blue-700">
                  Les valeurs configurées respectent les normes marocaines IMANOR 
                  basées sur les standards internationaux ISO.
                </p>
              </div>

              <Button onClick={handleSaveTolerances} className="w-full">
                Sauvegarder les Tolérances
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Régionaux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="language">Langue</Label>
                    <Select value={regionSettings.language} onValueChange={(value) => setRegionSettings({...regionSettings, language: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">🇫🇷 Français</SelectItem>
                        <SelectItem value="ar">🇲🇦 العربية</SelectItem>
                        <SelectItem value="en">🇬🇧 English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="units">Système d'unités</Label>
                    <Select value={regionSettings.units} onValueChange={(value) => setRegionSettings({...regionSettings, units: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Métrique (mm, kg, °C)</SelectItem>
                        <SelectItem value="imperial">Impérial (in, lb, °F)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dateFormat">Format de date</Label>
                    <Select value={regionSettings.dateFormat} onValueChange={(value) => setRegionSettings({...regionSettings, dateFormat: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <Select value={regionSettings.timezone} onValueChange={(value) => setRegionSettings({...regionSettings, timezone: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC+1">UTC+1 (Maroc)</SelectItem>
                        <SelectItem value="UTC+0">UTC+0 (GMT)</SelectItem>
                        <SelectItem value="UTC+2">UTC+2 (Europe Est)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveRegionalSettings} className="w-full">
                Sauvegarder Paramètres Régionaux
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des Alertes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Alertes temps réel</h4>
                    <p className="text-sm text-gray-600">Notifications instantanées des événements</p>
                  </div>
                  <Switch
                    checked={alertSettings.realTimeAlerts}
                    onCheckedChange={(checked) => setAlertSettings({...alertSettings, realTimeAlerts: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Notifications email</h4>
                    <p className="text-sm text-gray-600">Envoi d'emails pour les événements importants</p>
                  </div>
                  <Switch
                    checked={alertSettings.emailNotifications}
                    onCheckedChange={(checked) => setAlertSettings({...alertSettings, emailNotifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Alertes défauts</h4>
                    <p className="text-sm text-gray-600">Signalement automatique des non-conformités</p>
                  </div>
                  <Switch
                    checked={alertSettings.defectAlerts}
                    onCheckedChange={(checked) => setAlertSettings({...alertSettings, defectAlerts: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Rappels calibration</h4>
                    <p className="text-sm text-gray-600">Notifications avant échéance calibration</p>
                  </div>
                  <Switch
                    checked={alertSettings.calibrationReminders}
                    onCheckedChange={(checked) => setAlertSettings({...alertSettings, calibrationReminders: checked})}
                  />
                </div>
              </div>

              <Button onClick={handleSaveAlerts} className="w-full">
                Sauvegarder Configuration Alertes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Système</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Version Application</h4>
                  <p className="text-sm text-gray-600">CEDESA Quality Control v2.1.0</p>
                  <p className="text-xs text-gray-500">Dernière mise à jour: 08/07/2025</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Base de données</h4>
                  <p className="text-sm text-gray-600">Supabase PostgreSQL</p>
                  <p className="text-xs text-gray-500">Statut: ✅ Connecté</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Stockage</h4>
                  <p className="text-sm text-gray-600">12.3 MB utilisés / 100 MB</p>
                  <p className="text-xs text-gray-500">Documents et rapports</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Sécurité</h4>
                  <p className="text-sm text-gray-600">SSL/TLS activé</p>
                  <p className="text-xs text-gray-500">Authentification sécurisée</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1">
                  🔍 Diagnostic Système
                </Button>
                <Button variant="outline" className="flex-1">
                  📊 Logs Application
                </Button>
                <Button variant="outline" className="flex-1">
                  🔒 Sauvegarde BD
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppSettings;
