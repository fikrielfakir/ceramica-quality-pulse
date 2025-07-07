
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const { toast } = useToast();

  const handleSettingsClick = () => {
    toast({
      title: "Paramètres",
      description: "Ouverture du panneau de configuration",
    });
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dersa EcoQuality</h1>
              <p className="text-xs text-gray-500">Contrôle Qualité & Performance Environnementale</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Ceramica Dersa</p>
            <p className="text-xs text-gray-500">Tétouan, Maroc</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSettingsClick}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
