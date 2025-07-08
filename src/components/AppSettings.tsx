
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const AppSettings = () => {
  const { userRole } = useAuth();
  const { toast } = useToast();
  
  const [isoSettings, setIsoSettings] = useState({
    length_tolerance: 0.5,
    width_tolerance: 0.5,
    thickness_tolerance: 5.0,
    water_absorption_max: 3.0,
    breaking_strength_min: 1300,
    warping_max: 0.6
  });
  
  const [appSettings, setAppSettings] = useState({
    default_language: 'fr',
    measurement_unit: 'mm',
    date_format: 'dd/mm/yyyy',
    real_time_alerts: true,
    email_notifications: true,
    auto_backup: true
  });

  const [qualityStandards, setQualityStandards] = useState([]);

  useEffect(() => {
    loadQualityStandards();
    loadAppSettings();
  }, []);

  const loadQualityStandards = async () => {
    try {
      const { data, error } = await supabase
        .from('quality_standards')
        .select('*')
        .order('category');
      
      if (data) {
        setQualityStandards(data);
      }
    } catch (error) {
      console.error('Error loading standards:', error);
    }
  };

  const loadAppSettings = async () => {
    // Load saved settings from localStorage or database
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setAppSettings(JSON.parse(savedSettings));
    }
  };

  const handleIsoUpdate = async (field: string, value: number) => {
    setIsoSettings(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Update in database would go here
    toast({
      title: "Paramètre ISO mis à jour",
      description: `${field} modifié avec succès`,
    });
  };

  const handleAppSettingsUpdate = async (field: string, value: any) => {
    const newSettings = {
      ...appSettings,
      [field]: value
    };
    
    setAppSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
    
    toast({
      title: "Paramètre application",
      description: "Configuration mise à jour",
    });
  };

  const handleStandardUpdate = async (standardId: string, newTolerances: any) => {
    try {
      const { error } = await supabase
        .from('quality_standards')
        .update({
          tolerance_values: newTolerances,
          updated_at: new Date().toISOString()
        })
        .eq('id', standardId);
      
      if (error) throw error;
      
      toast({
        title: "Norme mise à jour",
        description: "Les tolérances ont été modifiées",
      });
      
      loadQualityStandards();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la norme",
      });
    }
  };

  const isAdmin = userRole === 'admin';

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">⚙️ Paramètres de l'Application</h1>
        {!isAdmin && (
          <Badge variant="secondary">Accès limité</Badge>
        )}
      </div>

      <Tabs defaultValue="iso-standards" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="iso-standards">📏 Normes ISO</TabsTrigger>
          <TabsTrigger value="app-config">🎛️ Configuration</TabsTrigger>
          <TabsTrigger value="notifications">🔔 Notifications</TabsTrigger>
          <TabsTrigger value="system">🖥️ Système</TabsTrigger>
        </TabsList>

        <TabsContent value="iso-standards">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tolérances ISO 13006 - Dimensions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tolérance longueur/largeur (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={isoSettings.length_tolerance}
                    onChange={(e) => handleIsoUpdate('length_tolerance', parseFloat(e.target.value))}
                    disabled={!isAdmin}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Tolérance épaisseur (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={isoSettings.thickness_tolerance}
                    onChange={(e) => handleIsoUpdate('thickness_tolerance', parseFloat(e.target.value))}
                    disabled={!isAdmin}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Gauchissement max (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={isoSettings.warping_max}
                    onChange={(e) => handleIsoUpdate('warping_max', parseFloat(e.target.value))}
                    disabled={!isAdmin}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tolérances ISO 10545 - Physique</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Absorption eau max (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={isoSettings.water_absorption_max}
                    onChange={(e) => handleIsoUpdate('water_absorption_max', parseFloat(e.target.value))}
                    disabled={!isAdmin}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Résistance rupture min (N)</Label>
                  <Input
                    type="number"
                    value={isoSettings.breaking_strength_min}
                    onChange={(e) => handleIsoUpdate('breaking_strength_min', parseInt(e.target.value))}
                    disabled={!isAdmin}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Normes configurées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {qualityStandards.map((standard: any) => (
                  <div key={standard.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{standard.standard_name}</h3>
                      <Badge variant="outline">{standard.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{standard.standard_code}</p>
                    <div className="text-xs text-gray-500">
                      <p>Unité: {standard.unit}</p>
                      <p>Actif: {standard.is_active ? '✅' : '❌'}</p>
                    </div>
                    {isAdmin && (
                      <Button variant="outline" size="sm" className="mt-2 w-full">
                        ✏️ Modifier
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="app-config">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration régionale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Langue par défaut</Label>
                  <Select 
                    value={appSettings.default_language} 
                    onValueChange={(value) => handleAppSettingsUpdate('default_language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">🇫🇷 Français</SelectItem>
                      <SelectItem value="ar">🇲🇦 العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Unité de mesure</Label>
                  <Select 
                    value={appSettings.measurement_unit} 
                    onValueChange={(value) => handleAppSettingsUpdate('measurement_unit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm">Millimètres (mm)</SelectItem>
                      <SelectItem value="cm">Centimètres (cm)</SelectItem>
                      <SelectItem value="in">Pouces (in)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Format de date</Label>
                  <Select 
                    value={appSettings.date_format} 
                    onValueChange={(value) => handleAppSettingsUpdate('date_format', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">JJ/MM/AAAA</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/JJ/AAAA</SelectItem>
                      <SelectItem value="yyyy-mm-dd">AAAA-MM-JJ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Préférences utilisateur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Alertes temps-réel</Label>
                  <Switch
                    checked={appSettings.real_time_alerts}
                    onCheckedChange={(checked) => handleAppSettingsUpdate('real_time_alerts', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Notifications email</Label>
                  <Switch
                    checked={appSettings.email_notifications}
                    onCheckedChange={(checked) => handleAppSettingsUpdate('email_notifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Sauvegarde automatique</Label>
                  <Switch
                    checked={appSettings.auto_backup}
                    onCheckedChange={(checked) => handleAppSettingsUpdate('auto_backup', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Alertes qualité</h3>
                  <div className="flex items-center justify-between">
                    <Label>Non-conformité détectée</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Seuil de défauts atteint</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Équipement à calibrer</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Notifications production</h3>
                  <div className="flex items-center justify-between">
                    <Label>Nouveau lot créé</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Lot terminé</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Rapport généré</Label>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations système</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Version:</span>
                  <Badge variant="outline">v2.1.0</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Base de données:</span>
                  <Badge variant="outline">Supabase</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Dernière sauvegarde:</span>
                  <span className="text-sm text-gray-600">Aujourd'hui 14:30</span>
                </div>
                <div className="flex justify-between">
                  <span>Utilisateurs actifs:</span>
                  <span className="text-sm font-medium">12</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions système</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" disabled={!isAdmin}>
                  🔄 Synchroniser données
                </Button>
                <Button className="w-full" variant="outline" disabled={!isAdmin}>
                  💾 Sauvegarder manuellement
                </Button>
                <Button className="w-full" variant="outline" disabled={!isAdmin}>
                  📊 Exporter configurations
                </Button>
                <Button className="w-full" variant="destructive" disabled={!isAdmin}>
                  🗑️ Nettoyer logs anciens
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppSettings;
