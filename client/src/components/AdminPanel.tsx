import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const AdminPanel = () => {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");

  if (!isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Accès Refusé</h3>
            <p className="text-gray-600">Vous n'avez pas les permissions pour accéder à cette section.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sample data
  const users = [
    {
      id: "1",
      email: "admin@example.com",
      full_name: "Admin User",
      department: "IT",
      role: "admin"
    }
  ];

  const roles = [
    { id: "1", role_name: "Administrateur", role_key: "admin" },
    { id: "2", role_name: "Opérateur", role_key: "operator" },
    { id: "3", role_name: "Technicien", role_key: "technician" }
  ];

  const handleAssignRole = () => {
    if (!selectedUser || !selectedRole) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un utilisateur et un rôle",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Rôle assigné avec succès",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Panel Administrateur</h1>
        <p className="text-gray-600">Gérez les utilisateurs et les permissions du système</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>Gestion des Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Utilisateur</label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un utilisateur" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Rôle</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.role_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAssignRole} className="w-full">
                Assigner le Rôle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User List */}
        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs du Système</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{user.full_name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.department}</div>
                  </div>
                  <Badge variant="secondary">
                    {user.role}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center py-4">
            <div className="text-2xl font-bold text-blue-600">1</div>
            <div className="text-sm text-gray-600">Utilisateurs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-4">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-gray-600">Rôles</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-4">
            <div className="text-2xl font-bold text-purple-600">Active</div>
            <div className="text-sm text-gray-600">Base de données</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-4">
            <div className="text-2xl font-bold text-orange-600">Local</div>
            <div className="text-sm text-gray-600">Mode</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;