
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const ComplianceDocuments = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const certifications = [
    { name: "ISO 9001:2015", status: "Active", expiry: "2025-12-15", progress: 100 },
    { name: "ISO 14001:2015", status: "Active", expiry: "2025-08-20", progress: 100 },
    { name: "ISO 45001", status: "En cours", expiry: "2024-06-30", progress: 75 },
    { name: "CGEM RSE", status: "Active", expiry: "2025-03-10", progress: 100 }
  ];

  const documents = [
    { 
      name: "Audit ISO 14001 - Mars 2024", 
      type: "Audit", 
      date: "15/03/2024", 
      status: "Validé",
      size: "2.3 MB"
    },
    { 
      name: "Rapport RSE Annuel 2023", 
      type: "RSE", 
      date: "31/12/2023", 
      status: "Publié",
      size: "5.7 MB"
    },
    { 
      name: "Plan Environnemental MED TEST", 
      type: "Environnement", 
      date: "10/03/2024", 
      status: "En révision",
      size: "1.8 MB"
    },
    { 
      name: "Certificat Qualité - Lot 2024-001", 
      type: "Qualité", 
      date: "14/03/2024", 
      status: "Validé",
      size: "0.5 MB"
    }
  ];

  const handleDownload = (docName: string) => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement de ${docName} initié`,
    });
  };

  const handleUpload = () => {
    toast({
      title: "Document ajouté",
      description: "Document téléversé avec succès",
    });
  };

  const handleCertificationRenewal = (certName: string) => {
    toast({
      title: "Renouvellement programmé",
      description: `Processus de renouvellement ${certName} initié`,
    });
  };

  const handleAuditSchedule = () => {
    toast({
      title: "Audit programmé",
      description: "Nouvel audit de conformité programmé",
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || doc.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Statut des certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏆 Certifications & Conformité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {certifications.map((cert, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{cert.name}</h4>
                  <Badge variant={cert.status === "Active" ? "default" : "secondary"}>
                    {cert.status}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-xs text-gray-600">
                  <div>Expire: {cert.expiry}</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        cert.progress === 100 ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${cert.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between">
                    <span>{cert.progress}% conforme</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCertificationRenewal(cert.name)}
                    >
                      {cert.status === "Active" ? "Renouveler" : "Finaliser"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-blue-900">Prochains Audits</h4>
                <p className="text-sm text-blue-700">ISO 45001 - Audit final prévu le 30/06/2024</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleAuditSchedule}
              >
                Programmer audit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bibliothèque de documents */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📁 Bibliothèque de Documents
            </CardTitle>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Rechercher</Label>
                <Input
                  id="search"
                  placeholder="Nom du document..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="filter">Filtrer par type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="audit">Audit</SelectItem>
                    <SelectItem value="rse">RSE</SelectItem>
                    <SelectItem value="environnement">Environnement</SelectItem>
                    <SelectItem value="qualité">Qualité</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{doc.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {doc.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {doc.date} • {doc.size}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={doc.status === "Validé" ? "default" : "secondary"}>
                      {doc.status}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(doc.name)}
                    >
                      Télécharger
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleUpload}
              >
                📤 Ajouter un document
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">⚡ Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => toast({
                title: "Rapport généré",
                description: "Rapport de conformité ISO généré",
              })}
            >
              📊 Rapport Conformité
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => toast({
                title: "Alerte programmée",
                description: "Rappel de renouvellement créé",
              })}
            >
              🔔 Alertes Renouvellement  
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => toast({
                title: "Export réalisé",
                description: "Archive complète exportée",
              })}
            >
              💾 Exporter Archive
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => toast({
                title: "Modèle téléchargé",
                description: "Modèle de rapport téléchargé",
              })}
            >
              📝 Modèles Rapports
            </Button>
            
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-800 text-sm">⚠️ Rappels</h4>
              <p className="text-xs text-yellow-600 mt-1">
                • ISO 45001: Audit final dans 45 jours<br/>
                • RSE: Rapport annuel à finaliser
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComplianceDocuments;
