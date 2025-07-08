
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Hook for enhanced quality tests
export const useEnhancedQualityTests = () => {
  return useQuery({
    queryKey: ["enhanced-quality-tests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quality_tests")
        .select(`
          *,
          production_lots (
            lot_number,
            product_type,
            production_date,
            quantity
          ),
          profiles (
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Mock data for quality standards since table doesn't exist yet
export const useQualityStandards = () => {
  return useQuery({
    queryKey: ["quality-standards"],
    queryFn: async () => {
      // Return mock data for now
      return [
        {
          id: "1",
          standard_name: "ISO 13006",
          standard_code: "ISO 13006:2018",
          category: "Carreaux céramiques",
          parameters: { length: "±2mm", width: "±2mm", thickness: "±0.5mm" },
          tolerance_values: { water_absorption: "≤3%", break_resistance: "≥1300N" },
          is_active: true
        },
        {
          id: "2",
          standard_name: "ISO 10545-3",
          standard_code: "ISO 10545-3:2018",
          category: "Absorption d'eau",
          parameters: { test_method: "Immersion 24h", temperature: "20°C±2°C" },
          tolerance_values: { max_absorption: "3%" },
          is_active: true
        },
        {
          id: "3",
          standard_name: "ISO 10545-4",
          standard_code: "ISO 10545-4:2019",
          category: "Résistance à la rupture",
          parameters: { load_rate: "1N/s", specimen_size: ">=200cm²" },
          tolerance_values: { min_resistance: "1300N" },
          is_active: true
        }
      ];
    },
  });
};

// Mock data for defect types
export const useDefectTypes = () => {
  return useQuery({
    queryKey: ["defect-types"],
    queryFn: async () => {
      return [
        { id: "1", name: "Fissure", severity: "critical", description: "Fissure visible sur la surface", is_active: true },
        { id: "2", name: "Défaut émail", severity: "major", description: "Défaut dans l'application de l'émail", is_active: true },
        { id: "3", name: "Variation couleur", severity: "minor", description: "Variation de couleur non conforme", is_active: true },
        { id: "4", name: "Gauchissement", severity: "major", description: "Déformation de la pièce", is_active: true }
      ];
    },
  });
};

// Mock data for equipment calibration
export const useEquipmentCalibration = () => {
  return useQuery({
    queryKey: ["equipment-calibration"],
    queryFn: async () => {
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
      const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
      
      return [
        {
          id: "1",
          equipment_name: "Presse hydraulique A1",
          equipment_type: "Presse",
          serial_number: "PH-001-2023",
          last_calibration_date: "2024-02-15",
          next_calibration_date: nextWeek.toISOString().split('T')[0],
          status: "needs_calibration"
        },
        {
          id: "2",
          equipment_name: "Balance de précision B2",
          equipment_type: "Balance",
          serial_number: "BP-002-2023",
          last_calibration_date: "2024-01-20",
          next_calibration_date: nextMonth.toISOString().split('T')[0],
          status: "ok"
        },
        {
          id: "3",
          equipment_name: "Four de séchage C1",
          equipment_type: "Four",
          serial_number: "FS-003-2023",
          last_calibration_date: "2024-03-01",
          next_calibration_date: "2024-05-01",
          status: "ok"
        }
      ];
    },
  });
};

// Mock data for quality reports
export const useQualityReports = () => {
  return useQuery({
    queryKey: ["quality-reports"],
    queryFn: async () => {
      return [
        {
          id: "1",
          report_name: "Rapport mensuel Mars 2024",
          report_type: "monthly",
          created_at: "2024-03-31T00:00:00Z",
          status: "completed",
          profiles: {
            full_name: "Ahmed Bennani",
            email: "ahmed@cedesa.com"
          }
        },
        {
          id: "2",
          report_name: "Analyse défauts LOT-2024-015",
          report_type: "defect_analysis",
          created_at: "2024-03-15T00:00:00Z",
          status: "completed",
          profiles: {
            full_name: "Fatima Alami",
            email: "fatima@cedesa.com"
          }
        }
      ];
    },
  });
};
