import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Edit, Trash2, Search } from "lucide-react";

const UserManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Sample users data
  const users = [
    {
      id: "1",
      email: "admin@example.com", 
      full_name: "Admin User",
      department: "IT",
      role: "admin",
      created_at: new Date().toISOString(),
      user_roles: [
        {
          roles: {
            role_name: "Administrateur",
            role_key: "admin"
          }
        }
      ]
    }
  ];

  const roles = [
    { id: "1", role_name: "Administrateur", role_key: "admin", is_active: true },
    { id: "2", role_name: "Opérateur", role_key: "operator", is_active: true },
    { id: "3", role_name: "Technicien", role_key: "technician", is_active: true }
  ];

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = () => {
    toast({
      title: "Succès",
      description: "Utilisateur créé avec succès",
    });
  };

  const handleDeleteUser = (userId: string) => {
    toast({
      title: "Succès", 
      description: "Utilisateur supprimé avec succès",
    });
  };

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestion des Utilisateurs</h2>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter Utilisateur
        </Button>
      </div>

      {/* Search and Role Assignment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rechercher Utilisateur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assigner Rôle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner utilisateur" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner rôle" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.role_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleAssignRole} className="w-full">
                Assigner Rôle
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h4 className="font-medium">{user.full_name}</h4>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.department}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <Badge variant="secondary">
                      {user.user_roles[0]?.roles.role_name || 'Aucun rôle'}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">
                      Créé le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun utilisateur trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;