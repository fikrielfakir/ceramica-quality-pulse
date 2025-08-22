
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const { user, userRole, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">
              🏭 EcoQuality
            </h1>
            <span className="ml-3 text-sm text-gray-500">
              Système de gestion qualité céramique
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{user.email}</span>
                  {userRole && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs capitalize">
                      {userRole}
                    </span>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  onClick={signOut}
                  className="text-sm"
                >
                  Se déconnecter
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
