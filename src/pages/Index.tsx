
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Dashboard from "../components/Dashboard";
import EnhancedQualityControl from "../components/EnhancedQualityControl";
import EnergyMonitoring from "../components/EnergyMonitoring";
import WasteManagement from "../components/WasteManagement";
import ComplianceDocuments from "../components/ComplianceDocuments";
import TestingCampaigns from "../components/TestingCampaigns";
import UserProfile from "../components/UserProfile";
import AppSettings from "../components/AppSettings";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, userRole } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "quality":
        return <EnhancedQualityControl />;
      case "energy":
        return <EnergyMonitoring />;
      case "waste":
        return <WasteManagement />;
      case "documents":
        return <ComplianceDocuments />;
      case "testing":
        return <TestingCampaigns />;
      case "profile":
        return <UserProfile />;
      case "settings":
        return <AppSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="min-h-[calc(100vh-8rem)]">
          {renderContent()}
        </main>
        
        {/* User info display */}
        {user && (
          <div className="fixed bottom-4 right-4 bg-white p-3 rounded-lg shadow-md border">
            <div className="text-sm">
              <p className="font-medium">{user.email}</p>
              {userRole && (
                <p className="text-gray-600 capitalize">Rôle: {userRole}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Index;
