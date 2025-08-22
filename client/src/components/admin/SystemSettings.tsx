
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import { Settings, Save, AlertCircle } from "lucide-react";

const SystemSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch system settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-system-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("app_settings")
        .select("*")
        .order('category');
      
      if (error) throw error;
      return data;
    },
  });

  // Update setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { error } = await supabase
        .from("app_settings")
        .update({ 
          setting_value: value,
          updated_at: new Date().toISOString()
        })
        .eq("setting_key", key);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-system-settings"] });
      toast({
        title: "Paramètre Mis à Jour",
        description: "Le paramètre a été sauvegardé avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder : " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleSettingUpdate = (key: string, value: any) => {
    updateSettingMutation.mutate({ key, value });
  };

  const renderSettingInput = (setting: any) => {
    const value = setting.setting_value;

    switch (typeof value) {
      case 'boolean':
        return (
          <Switch
            checked={value}
            onCheckedChange={(checked) => handleSettingUpdate(setting.setting_key, checked)}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            defaultValue={value}
            onBlur={(e) => handleSettingUpdate(setting.setting_key, Number(e.target.value))}
          />
        );
      case 'string':
        return (
          <Input
            defaultValue={value}
            onBlur={(e) => handleSettingUpdate(setting.setting_key, e.target.value)}
          />
        );
      default:
        return (
          <Input
            defaultValue={JSON.stringify(value)}
            onBlur={(e) => {
              try {
                const parsedValue = JSON.parse(e.target.value);
                handleSettingUpdate(setting.setting_key, parsedValue);
              } catch {
                toast({
                  title: "Erreur",
                  description: "Format JSON invalide",
                  variant: "destructive",
                });
              }
            }}
          />
        );
    }
  };

  // Group settings by category
  const settingsByCategory = settings?.reduce((acc, setting) => {
    const category = setting.category || 'Général';
    if (!acc[category]) acc[category] = [];
    acc[category].push(setting);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Paramètres Système
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Chargement des paramètres...</div>
          ) : (
            <div className="space-y-6">
              {Object.entries(settingsByCategory || {}).map(([category, categorySettings]) => (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categorySettings.map((setting) => (
                      <div key={setting.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <label className="font-medium text-sm">
                              {setting.setting_key.replace(/_/g, ' ').toUpperCase()}
                            </label>
                            {setting.description && (
                              <p className="text-xs text-gray-500 mt-1">
                                {setting.description}
                              </p>
                            )}
                            {setting.is_system_setting && (
                              <div className="flex items-center gap-1 mt-1">
                                <AlertCircle className="w-3 h-3 text-yellow-500" />
                                <span className="text-xs text-yellow-600">
                                  Paramètre système - Modifier avec précaution
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="w-48">
                            {renderSettingInput(setting)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;
