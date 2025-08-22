import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, 
  Microscope, 
  TestTube2, 
  Zap, 
  Recycle, 
  FileText, 
  Target, 
  User, 
  Settings,
  Shield
} from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const { isAdmin, hasPermission } = useAuth();

  const getNavItems = () => {
    const baseItems = [
      { path: "/", label: "Tableau de bord", icon: LayoutDashboard, permission: "view_dashboard" }
    ];

    const conditionalItems = [
      { path: "/quality-control", label: "Contrôle Qualité", icon: Microscope, permission: "view_quality_tests" },
      { path: "/enhanced-quality", label: "Tests & Mesures", icon: TestTube2, permission: "create_quality_tests" },
      { path: "/energy", label: "Suivi Énergétique", icon: Zap, permission: "view_energy" },
      { path: "/waste", label: "Gestion Déchets", icon: Recycle, permission: "view_production" },
      { path: "/documents", label: "Documents", icon: FileText, permission: "view_quality_tests" },
      { path: "/testing-campaigns", label: "Campagnes", icon: Target, permission: "view_quality_tests" },
      { path: "/profile", label: "Profil", icon: User, permission: null },
      { path: "/settings", label: "Paramètres", icon: Settings, permission: null }
    ];

    // Filter items based on permissions
    const filteredItems = conditionalItems.filter(item => 
      !item.permission || hasPermission(item.permission)
    );

    const allItems = [...baseItems, ...filteredItems];

    // Add admin panel for admins
    if (isAdmin()) {
      allItems.push({ path: "/admin", label: "Administration", icon: Shield, permission: null });
    }

    return allItems;
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white border-b border-slate-200 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center h-full overflow-x-auto scrollbar-hide">
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }
                  `}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      
    </nav>
  );
};

export default Navigation;