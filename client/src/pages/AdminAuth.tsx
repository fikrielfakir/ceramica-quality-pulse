
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Shield } from "lucide-react";

const AdminAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { signIn } = useAuth();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await signIn(email, password);
      
      if (success) {
        // Get user data from localStorage to check role
        const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        if (userData.role === 'admin') {
          toast({
            title: "Connexion Administrateur Réussie",
            description: "Redirection vers le tableau de bord administrateur",
          });
          window.location.href = "/admin-dashboard";
        } else {
          // Sign out non-admin user
          localStorage.removeItem('currentUser');
          throw new Error("Accès refusé - Privilèges administrateur requis");
        }
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de Connexion",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-800">
            🔐 Accès Administrateur
          </CardTitle>
          <p className="text-red-600">
            Connexion sécurisée pour administrateurs système
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Administrateur</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@exemple.com"
                required
                className="border-red-200 focus:border-red-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-red-200 focus:border-red-400"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700" 
              disabled={loading}
            >
              {loading ? "Vérification..." : "Connexion Administrateur"}
            </Button>
            
            <div className="text-center pt-4">
              <Button
                type="button"
                variant="ghost"
                className="text-gray-600 text-sm"
                onClick={() => window.location.href = "/auth"}
              >
                ← Retour à la connexion normale
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
