
import React from "react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", subtitle: "Vue d'ensemble", icon: "📊" },
    { id: "quality", label: "Contrôle Qualité", subtitle: "Inspection produits", icon: "✅" },
    { id: "energy", label: "Suivi Énergétique", subtitle: "Consommations", icon: "⚡" },
    { id: "waste", label: "Gestion Déchets", subtitle: "Recyclage & valorisation", icon: "♻️" },
    { id: "documents", label: "Documents", subtitle: "Conformité ISO", icon: "📁" },
    { id: "testing", label: "Tests & Mesures", subtitle: "Campagnes qualité", icon: "🧪" }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6">
        <div className="flex space-x-1 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center space-x-3 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === item.id
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <div className="text-left">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-gray-500">{item.subtitle}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
