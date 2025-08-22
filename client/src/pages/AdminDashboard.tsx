
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Settings, Users, Shield, Database, LogOut } from "lucide-react";
import UserManagement from "@/components/admin/UserManagement";
import RolePermissions from "@/components/admin/RolePermissions";
import SystemSettings from "@/components/admin/SystemSettings";
import DatabaseConfig from "@/components/admin/DatabaseConfig";

const AdminDashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const [activeSection, setActiveSection] = useState("users");

  // Redirect if not admin
  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Accès Refusé</h2>
          <p className="text-gray-600">Vous devez être administrateur pour accéder à cette page.</p>
          <Button onClick={() => window.location.href = "/"} className="mt-4">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: "users", label: "Gestion Utilisateurs", icon: Users },
    { id: "roles", label: "Rôles & Permissions", icon: Shield },
    { id: "settings", label: "Paramètres Système", icon: Settings },
    { id: "database", label: "Configuration BDD", icon: Database },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "users":
        return <UserManagement />;
      case "roles":
        return <RolePermissions />;
      case "settings":
        return <SystemSettings />;
      case "database":
        return <DatabaseConfig />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-red-600" />
              <h1 className="text-xl font-bold text-gray-900">
                🔧 Panneau d'Administration
              </h1>
              <Badge variant="destructive" className="ml-2">
                ADMIN
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user?.email}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 space-y-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeSection === item.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection(item.id)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
