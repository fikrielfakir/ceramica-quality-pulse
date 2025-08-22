
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Users, Settings } from "lucide-react";

const RolePermissions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Fetch roles with permissions
  const { data: roles } = useQuery({
    queryKey: ["admin-roles-permissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roles")
        .select(`
          *,
          role_permissions (
            granted,
            permissions (
              permission_key,
              permission_name,
              description,
              app_modules (
                module_name
              )
            )
          )
        `)
        .eq("is_active", true)
        .order('role_name');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch all permissions
  const { data: allPermissions } = useQuery({
    queryKey: ["admin-all-permissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("permissions")
        .select(`
          *,
          app_modules (
            module_name
          )
        `)
        .eq("is_active", true)
        .order('permission_name');
      
      if (error) throw error;
      return data;
    },
  });

  // Update permission mutation
  const updatePermissionMutation = useMutation({
    mutationFn: async ({ roleId, permissionId, granted }: { roleId: string; permissionId: string; granted: boolean }) => {
      if (granted) {
        // Add permission
        const { error } = await supabase
          .from("role_permissions")
          .upsert({
            role_id: roleId,
            permission_id: permissionId,
            granted: true
          });
        if (error) throw error;
      } else {
        // Remove permission
        const { error } = await supabase
          .from("role_permissions")
          .delete()
          .eq("role_id", roleId)
          .eq("permission_id", permissionId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles-permissions"] });
      toast({
        title: "Permission Mise à Jour",
        description: "Les permissions ont été mises à jour avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la permission : " + error.message,
        variant: "destructive",
      });
    },
  });

  const handlePermissionChange = (roleId: string, permissionId: string, granted: boolean) => {
    updatePermissionMutation.mutate({ roleId, permissionId, granted });
  };

  const getRoleIcon = (roleKey: string) => {
    switch (roleKey) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'quality_manager': return <Users className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getRoleColor = (roleKey: string) => {
    switch (roleKey) {
      case 'admin': return 'destructive';
      case 'quality_manager': return 'default';
      case 'quality_controller': return 'secondary';
      default: return 'outline';
    }
  };

  const hasPermission = (role: any, permissionKey: string) => {
    if (role.role_key === 'admin') return true; // Admin has all permissions
    return role.role_permissions?.some((rp: any) => 
      rp.permissions?.permission_key === permissionKey && rp.granted
    );
  };

  // Group permissions by module
  const permissionsByModule = allPermissions?.reduce((acc, permission) => {
    const moduleName = permission.app_modules?.module_name || 'Général';
    if (!acc[moduleName]) acc[moduleName] = [];
    acc[moduleName].push(permission);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Gestion des Rôles et Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Roles Overview */}
            <div>
              <h4 className="font-medium mb-3">Rôles Disponibles</h4>
              <div className="grid gap-3">
                {roles?.map((role) => (
                  <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getRoleIcon(role.role_key)}
                      <div>
                        <p className="font-medium">{role.role_name}</p>
                        <p className="text-sm text-gray-500">{role.description}</p>
                      </div>
                    </div>
                    <Badge variant={getRoleColor(role.role_key)}>
                      {role.role_key}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Permissions Matrix */}
            <div>
              <h4 className="font-medium mb-3">Matrice des Permissions</h4>
              <div className="space-y-4">
                {Object.entries(permissionsByModule || {}).map(([moduleName, permissions]) => (
                  <Card key={moduleName}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{moduleName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {permissions.map((permission) => (
                          <div key={permission.id} className="space-y-2">
                            <div className="font-medium text-sm">{permission.permission_name}</div>
                            <div className="grid grid-cols-6 gap-2">
                              {roles?.map((role) => (
                                <div key={role.id} className="flex items-center space-x-2">
                                  {role.role_key === 'admin' ? (
                                    <Badge variant="destructive" className="text-xs">
                                      Tous droits
                                    </Badge>
                                  ) : (
                                    <>
                                      <Checkbox
                                        id={`${role.id}-${permission.id}`}
                                        checked={hasPermission(role, permission.permission_key)}
                                        onCheckedChange={(checked) => 
                                          handlePermissionChange(role.id, permission.id, checked as boolean)
                                        }
                                        disabled={updatePermissionMutation.isPending}
                                      />
                                      <label 
                                        htmlFor={`${role.id}-${permission.id}`}
                                        className="text-xs text-gray-600"
                                      >
                                        {role.role_name}
                                      </label>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RolePermissions;
