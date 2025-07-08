
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const { userRole } = useAuth();

  const navigationItems = [
    { id: "dashboard", label: "📊 Tableau de bord", icon: "📊", roles: ["admin", "quality_technician", "production_manager", "operator"] },
    { id: "quality", label: "🧪 Contrôle Qualité", icon: "🧪", roles: ["admin", "quality_technician", "operator"] },
    { id: "energy", label: "⚡ Énergie", icon: "⚡", roles: ["admin", "production_manager"] },
    { id: "waste", label: "♻️ Déchets", icon: "♻️", roles: ["admin", "production_manager"] },
    { id: "documents", label: "📋 Documents", icon: "📋", roles: ["admin", "quality_technician"] },
    { id: "testing", label: "🔬 Campagnes", icon: "🔬", roles: ["admin", "quality_technician"] },
    { id: "profile", label: "👤 Mon Profil", icon: "👤", roles: ["admin", "quality_technician", "production_manager", "operator"] },
    { id: "settings", label: "⚙️ Paramètres", icon: "⚙️", roles: ["admin", "quality_technician"] }
  ];

  const visibleItems = navigationItems.filter(item => 
    !userRole || item.roles.includes(userRole)
  );

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
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
