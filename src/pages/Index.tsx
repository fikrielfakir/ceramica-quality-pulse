
import React, { useState } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Dashboard from "../components/Dashboard";
import QualityControl from "../components/QualityControl";
import EnergyMonitoring from "../components/EnergyMonitoring";

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
        return (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🔄 Gestion des Déchets</h2>
            <p className="text-gray-600">Module en cours de développement...</p>
          </div>
        );
      case "reports":
        return (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📁 Rapports & Conformité</h2>
            <p className="text-gray-600">Module en cours de développement...</p>
          </div>
        );
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
