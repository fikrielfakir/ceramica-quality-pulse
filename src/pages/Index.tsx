
import React, { useState } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Dashboard from "../components/Dashboard";
import QualityControl from "../components/QualityControl";
import EnergyMonitoring from "../components/EnergyMonitoring";
import WasteManagement from "../components/WasteManagement";
import ComplianceDocuments from "../components/ComplianceDocuments";
import TestingCampaigns from "../components/TestingCampaigns";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "quality":
        return <QualityControl />;
      case "energy":
        return <EnergyMonitoring />;
      case "waste":
        return <WasteManagement />;
      case "documents":
        return <ComplianceDocuments />;
      case "testing":
        return <TestingCampaigns />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="min-h-[calc(100vh-8rem)]">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
