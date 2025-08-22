import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

// Simplified admin data hooks for local database
export const useAppSettings = () => {
  return useQuery({
    queryKey: ["app-settings"],
    queryFn: async () => {
      // Return default settings for now
      return [
        {
          id: "1",
          setting_key: "iso_tolerances",
          setting_value: {
            length_tolerance_mm: 2.0,
            width_tolerance_mm: 2.0,
            thickness_tolerance_percent: 5.0,
            water_absorption_max_percent: 3.0,
            breaking_strength_min_n: 1300
          },
          category: "quality",
          description: "Tolérances ISO pour les tests qualité"
        },
        {
          id: "2",
          setting_key: "app_language",
          setting_value: "fr",
          category: "general",
          description: "Langue par défaut de l'application"
        }
      ];
    },
  });
};

export const useUpdateAppSetting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, setting_value }: { id: string; setting_value: any }) => {
      // Simulate API call
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app-settings"] });
    },
  });
};

export const useUserActivityLogs = () => {
  const { isAdmin } = useAuth();
  
  return useQuery({
    queryKey: ["user-activity-logs"],
    queryFn: async () => {
      if (!isAdmin()) return [];
      
      // Return sample activity logs
      return [
        {
          id: "1",
          action: "login",
          module: "auth",
          created_at: new Date().toISOString(),
          profiles: {
            full_name: "Admin User",
            email: "admin@example.com"
          }
        }
      ];
    },
    enabled: isAdmin(),
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      // Return sample users
      return [
        {
          id: "1",
          email: "admin@example.com",
          full_name: "Admin User",
          department: "IT",
          role: "admin",
          created_at: new Date().toISOString()
        }
      ];
    },
  });
};

export const useRoles = () => {
  return useQuery({
    queryKey: ["admin-roles"],
    queryFn: async () => {
      return [
        { id: "1", role_name: "Administrateur", role_key: "admin", is_active: true },
        { id: "2", role_name: "Opérateur", role_key: "operator", is_active: true },
        { id: "3", role_name: "Technicien", role_key: "technician", is_active: true }
      ];
    },
  });
};