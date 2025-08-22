
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Navigation = () => {
  const location = useLocation();
  const { isAdmin, hasPermission, userRole } = useAuth();

  const getNavItems = () => {
    const baseItems = [
      { path: "/", label: "Tableau de bord", icon: "🏠", permission: "view_dashboard" }
    ];

    const conditionalItems = [
      { path: "/quality-control", label: "Contrôle Qualité", icon: "🔬", permission: "view_quality_tests" },
      { path: "/enhanced-quality", label: "Tests & Mesures", icon: "🧪", permission: "create_quality_tests" },
      { path: "/energy", label: "Suivi Énergétique", icon: "⚡", permission: "view_energy" },
      { path: "/waste", label: "Gestion Déchets", icon: "♻️", permission: "view_production" },
      { path: "/documents", label: "Documents", icon: "📄", permission: "view_quality_tests" },
      { path: "/testing-campaigns", label: "Campagnes", icon: "🎯", permission: "view_quality_tests" },
      { path: "/profile", label: "Profil", icon: "👤", permission: null },
      { path: "/settings", label: "Paramètres", icon: "⚙️", permission: null }
    ];

    // Filter items based on permissions
    const filteredItems = conditionalItems.filter(item => 
      !item.permission || hasPermission(item.permission)
    );

    const allItems = [...baseItems, ...filteredItems];

    // Add admin panel for admins
    if (isAdmin()) {
      allItems.push({ path: "/admin", label: "🛠️ Administration", icon: "🛠️", permission: null });
    }

    return allItems;
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* Role indicator */}
          <div className="flex items-center">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {userRole}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
