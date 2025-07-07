
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "dashboard", label: "📊 Tableau de Bord", color: "bg-blue-500" },
    { id: "quality", label: "✅ Contrôle Qualité", color: "bg-green-500" },
    { id: "energy", label: "🔋 Énergie & Ressources", color: "bg-purple-500" },
    { id: "waste", label: "🔄 Gestion Déchets", color: "bg-orange-500" },
    { id: "reports", label: "📁 Rapports & Conformité", color: "bg-indigo-500" }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-6">
      <div className="flex space-x-1 overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            className={`whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id 
                ? "bg-primary text-white shadow-sm" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
