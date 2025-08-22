
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiService } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const AdminPanel = () => {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Fetch users with their roles
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          user_roles!inner (
            roles!inner (
              role_name,
              role_key
            )
          )
        `);
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin(),
  });

  // Fetch available roles
  const { data: roles } = useQuery({
    queryKey: ["admin-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roles")
        .select("*")
        .eq("is_active", true);
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin(),
  });

  // Fetch permissions for role management
  const { data: permissions } = useQuery({
    queryKey: ["admin-permissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("permissions")
        .select(`
          *,
          app_modules (
            module_name
          )
        `)
        .eq("is_active", true);
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin(),
  });

  // Fetch activity logs - simplified query without profiles join
  const { data: activityLogs } = useQuery({
    queryKey: ["admin-activity-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin(),
  });

  // Fetch user details separately for activity logs
  const { data: userProfiles } = useQuery({
    queryKey: ["user-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email");
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin() && activityLogs?.length > 0,
  });

  // Mutation to assign role to user
  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string; roleId: string }) => {
      // First, remove existing roles
      await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      // Then assign new role
      const { error } = await supabase
        .from("user_roles")
        .insert({
          user_id: userId,
          role_id: roleId
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Rôle attribué",
        description: "Le rôle a été attribué avec succès à l'utilisateur.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'attribuer le rôle : " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleAssignRole = () => {
    if (selectedUser && selectedRole) {
      assignRoleMutation.mutate({ userId: selectedUser, roleId: selectedRole });
      setSelectedUser("");
      setSelectedRole("");
    }
  };

  const logActivity = async (action: string, details: any) => {
    await supabase
      .from("user_activity_logs")
      .insert({
        action,
        module: "admin",
        details,
      });
  };

  // Helper function to get user profile by ID
  const getUserProfile = (userId: string) => {
    return userProfiles?.find(profile => profile.id === userId) || { full_name: "Utilisateur inconnu", email: "" };
  };

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h2>
          <p className="text-gray-600">Vous devez être administrateur pour accéder à cette section.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">🛠️ Panneau d'Administration</h1>
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          Admin Access
        </Badge>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            👥 Gestion des Utilisateurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Role Assignment */}
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium">Utilisateur</label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un utilisateur" />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Rôle</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles?.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.role_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAssignRole} disabled={!selectedUser || !selectedRole}>
                Attribuer
              </Button>
            </div>

            {/* Users List */}
            <div className="space-y-2">
              <h4 className="font-medium">Utilisateurs Actifs</h4>
              <div className="grid gap-2">
                {users?.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">{user.full_name || "Sans nom"}</span>
                      <span className="text-sm text-gray-500 ml-2">{user.email}</span>
                    </div>
                    <Badge variant="outline">
                      {Array.isArray(user.user_roles) && user.user_roles.length > 0 
                        ? user.user_roles[0]?.roles?.role_name || "Aucun rôle"
                        : "Aucun rôle"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔐 Aperçu des Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {roles?.map((role) => (
              <div key={role.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{role.role_name}</h4>
                  <Badge variant={role.role_key === 'admin' ? 'default' : 'secondary'}>
                    {role.role_key}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                {role.role_key === 'admin' && (
                  <Badge variant="destructive" className="text-xs">
                    Tous les droits
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📋 Journaux d'Activité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {activityLogs?.map((log) => {
              const userProfile = log.user_id ? getUserProfile(log.user_id) : null;
              return (
                <div key={log.id} className="flex items-center justify-between p-2 border-b">
                  <div>
                    <span className="font-medium">
                      {userProfile?.full_name || "Utilisateur inconnu"}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">{log.action}</span>
                    {log.module && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {log.module}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(log.created_at).toLocaleString('fr-FR')}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
