import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Factory, User } from "lucide-react";

const Header = () => {
  const { user, userRole, signOut } = useAuth();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700 border-red-200';
      case 'quality_manager': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'quality_controller': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'production_manager': return 'bg-green-100 text-green-700 border-green-200';
      case 'technician': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'quality_manager': return 'Chef Qualité';
      case 'quality_controller': return 'Contrôleur Qualité';
      case 'production_manager': return 'Chef Production';
      case 'technician': return 'Technicien';
      default: return 'Opérateur';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Factory className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">EcoQuality</h1>
                <p className="text-xs text-slate-500 leading-none">Ceramic Quality Management</p>
              </div>
            </div>
          </div>
          
          {/* User Info and Actions */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-sm bg-slate-100">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-700">{user.fullName || user.email}</p>
                  {userRole && (
                    <Badge variant="outline" className={`text-xs ${getRoleColor(userRole)}`}>
                      {getRoleLabel(userRole)}
                    </Badge>
                  )}
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={signOut}
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;