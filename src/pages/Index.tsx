
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import EnhancedQualityControl from "@/components/EnhancedQualityControl";
import EnergyMonitoring from "@/components/EnergyMonitoring";
import WasteManagement from "@/components/WasteManagement";
import ComplianceDocuments from "@/components/ComplianceDocuments";
import TestingCampaigns from "@/components/TestingCampaigns";
import UserProfile from "@/components/UserProfile";
import AppSettings from "@/components/AppSettings";
import AdminPanel from "@/components/AdminPanel";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

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
      case "admin":
        return <AdminPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <main className="flex-1">
            {renderContent()}
          </main>
          <Toaster />
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
};

export default Index;
