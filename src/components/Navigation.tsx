
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Navigation = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const navItems = [
    { path: "/", label: "Tableau de bord", icon: "🏠" },
    { path: "/quality-control", label: "Contrôle Qualité", icon: "🔬" },
    { path: "/enhanced-quality", label: "Tests & Mesures", icon: "🧪" },
    { path: "/energy", label: "Suivi Énergétique", icon: "⚡" },
    { path: "/waste", label: "Gestion Déchets", icon: "♻️" },
    { path: "/documents", label: "Documents", icon: "📄" },
    { path: "/testing-campaigns", label: "Campagnes", icon: "🎯" },
    { path: "/profile", label: "Profil", icon: "👤" },
    { path: "/settings", label: "Paramètres", icon: "⚙️" },
  ];

  // Add admin panel for admins
  if (isAdmin()) {
    navItems.push({ path: "/admin", label: "🛠️ Administration", icon: "🛠️" });
  }

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
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
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
