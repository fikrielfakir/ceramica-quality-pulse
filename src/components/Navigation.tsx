
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const { userRole, hasPermission, isAdmin } = useAuth();

  const navigationItems = [
    { 
      id: "dashboard", 
      label: "📊 Tableau de bord", 
      icon: "📊", 
      permission: "view_dashboard"
    },
    { 
      id: "quality", 
      label: "🧪 Contrôle Qualité", 
      icon: "🧪", 
      permission: "view_quality_control"
    },
    { 
      id: "energy", 
      label: "⚡ Énergie", 
      icon: "⚡", 
      permission: "view_energy_monitoring"
    },
    { 
      id: "waste", 
      label: "♻️ Déchets", 
      icon: "♻️", 
      permission: "view_waste_management"
    },
    { 
      id: "documents", 
      label: "📋 Documents", 
      icon: "📋", 
      permission: "view_documents"
    },
    { 
      id: "testing", 
      label: "🔬 Campagnes", 
      icon: "🔬", 
      permission: "view_testing_campaigns"
    },
    { 
      id: "profile", 
      label: "👤 Mon Profil", 
      icon: "👤", 
      permission: null // Always visible
    },
    { 
      id: "settings", 
      label: "⚙️ Paramètres", 
      icon: "⚙️", 
      permission: "view_settings"
    },
    { 
      id: "admin", 
      label: "🛠️ Administration", 
      icon: "🛠️", 
      permission: "manage_users",
      adminOnly: true
    }
  ];

  const visibleItems = navigationItems.filter(item => {
    if (item.adminOnly && !isAdmin()) return false;
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex space-x-1 overflow-x-auto">
          {visibleItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={`whitespace-nowrap flex items-center gap-2 ${
                activeTab === item.id 
                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <span>{item.icon}</span>
              <span className="hidden sm:inline">{item.label.replace(/^[^\s]+ /, '')}</span>
            </Button>
          ))}
          
          {/* Role indicator */}
          {userRole && (
            <div className="flex items-center ml-4 px-3 py-1 bg-gray-100 rounded-full">
              <span className="text-xs font-medium text-gray-600">
                {userRole === 'admin' ? '🛠️ Admin' : 
                 userRole === 'quality_manager' ? '👨‍💼 Chef Qualité' :
                 userRole === 'quality_controller' ? '🔍 Contrôleur' :
                 userRole === 'technician' ? '🔧 Technicien' :
                 userRole === 'production_manager' ? '🏭 Chef Prod.' :
                 '👤 Opérateur'}
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
