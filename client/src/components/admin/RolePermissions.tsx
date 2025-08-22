import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Shield, Users, Settings } from "lucide-react";

const RolePermissions = () => {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Sample roles and permissions data
  const roles = [
    {
      id: "1",
      role_name: "Administrateur",
      role_key: "admin",
      description: "Accès complet au système",
      is_active: true,
      role_permissions: []
    },
    {
      id: "2", 
      role_name: "Opérateur",
      role_key: "operator",
      description: "Accès de base aux fonctionnalités",
      is_active: true,
      role_permissions: []
    },
    {
      id: "3",
      role_name: "Technicien", 
      role_key: "technician",
      description: "Accès aux tests et mesures",
      is_active: true,
      role_permissions: []
    }
  ];

  const modules = [
    {
      id: "1",
      module_name: "Tableau de bord",
      permissions: [
        { id: "1", permission_key: "view_dashboard", permission_name: "Voir Tableau de Bord", granted: false },
        { id: "2", permission_key: "view_analytics", permission_name: "Voir Analyses", granted: false }
      ]
    },
    {
      id: "2", 
      module_name: "Contrôle Qualité",
      permissions: [
        { id: "3", permission_key: "view_quality_tests", permission_name: "Voir Tests Qualité", granted: false },
        { id: "4", permission_key: "create_quality_tests", permission_name: "Créer Tests Qualité", granted: false },
        { id: "5", permission_key: "edit_quality_tests", permission_name: "Modifier Tests Qualité", granted: false },
        { id: "6", permission_key: "delete_quality_tests", permission_name: "Supprimer Tests Qualité", granted: false }
      ]
    },
    {
      id: "3",
      module_name: "Production", 
      permissions: [
        { id: "7", permission_key: "view_production", permission_name: "Voir Production", granted: false },
        { id: "8", permission_key: "manage_production", permission_name: "Gérer Production", granted: false }
      ]
    },
    {
      id: "4",
      module_name: "Administration",
      permissions: [
        { id: "9", permission_key: "manage_users", permission_name: "Gérer Utilisateurs", granted: false },
        { id: "10", permission_key: "manage_roles", permission_name: "Gérer Rôles", granted: false },
        { id: "11", permission_key: "system_settings", permission_name: "Paramètres Système", granted: false }
      ]
    }
  ];

  const handlePermissionChange = (permissionId: string, granted: boolean) => {
    toast({
      title: "Permission mise à jour",
      description: `Permission ${granted ? 'accordée' : 'révoquée'} avec succès`,
    });
  };

  const handleSaveRole = () => {
    if (!selectedRole) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un rôle",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Permissions du rôle sauvegardées",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Rôles et Permissions</h2>
        <Button>
          <Shield className="h-4 w-4 mr-2" />
          Nouveau Rôle
        </Button>
      </div>

      {/* Role Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Sélectionner un Rôle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedRole === role.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{role.role_name}</h3>
                  <Badge variant={role.is_active ? "default" : "secondary"}>
                    {role.is_active ? "Actif" : "Inactif"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{role.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permissions Management */}
      {selectedRole && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Permissions pour {roles.find(r => r.id === selectedRole)?.role_name}
              </div>
              <Button onClick={handleSaveRole}>
                Sauvegarder les Permissions
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {modules.map((module) => (
                <div key={module.id} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    {module.module_name}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {module.permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                        <Checkbox
                          id={permission.id}
                          checked={permission.granted}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission.id, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={permission.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                        >
                          {permission.permission_name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedRole && (
        <Card>
          <CardContent className="text-center py-8">
            <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionner un Rôle</h3>
            <p className="text-gray-600">Choisissez un rôle ci-dessus pour gérer ses permissions.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RolePermissions;