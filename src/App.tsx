import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthProvider } from "@/hooks/useAuth"; // Add this import
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import QualityControl from "@/components/QualityControl";
import EnhancedQualityControl from "@/components/EnhancedQualityControl";
import EnergyMonitoring from "@/components/EnergyMonitoring";
import WasteManagement from "@/components/WasteManagement";
import ComplianceDocuments from "@/components/ComplianceDocuments";
import TestingCampaigns from "@/components/TestingCampaigns";
import UserProfile from "@/components/UserProfile";
import AppSettings from "@/components/AppSettings";
import AdminPanel from "@/components/AdminPanel";

const queryClient = new QueryClient();

// Create a separate component for the app content
const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BrowserRouter>
        {user && (
          <>
            <Header />
            <Navigation />
          </>
        )}
        <main className={user ? "pt-4" : ""}>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quality-control"
              element={
                <ProtectedRoute>
                  <QualityControl />
                </ProtectedRoute>
              }
            />
            <Route
              path="/enhanced-quality"
              element={
                <ProtectedRoute>
                  <EnhancedQualityControl />
                </ProtectedRoute>
              }
            />
            <Route
              path="/energy"
              element={
                <ProtectedRoute>
                  <EnergyMonitoring />
                </ProtectedRoute>
              }
            />
            <Route
              path="/waste"
              element={
                <ProtectedRoute>
                  <WasteManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  <ComplianceDocuments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/testing-campaigns"
              element={
                <ProtectedRoute>
                  <TestingCampaigns />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AppSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </div>
  );
};

// Main App component that provides the AuthProvider
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
