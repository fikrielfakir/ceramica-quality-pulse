
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useAppSettings = () => {
  return useQuery({
    queryKey: ["app-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("app_settings")
        .select("*")
        .order("category", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateAppSetting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, setting_value }: { id: string; setting_value: any }) => {
      const { error } = await supabase
        .from("app_settings")
        .update({ 
          setting_value,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);
      
      if (error) throw error;
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
      const { data, error } = await supabase
        .from("user_activity_logs")
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin(),
  });
};

export const useLogActivity = () => {
  return useMutation({
    mutationFn: async ({ action, module, details }: { 
      action: string; 
      module?: string; 
      details?: any 
    }) => {
      const { error } = await supabase
        .from("user_activity_logs")
        .insert({
          action,
          module,
          details,
        });
      
      if (error) throw error;
    },
  });
};

export const useRolesAndPermissions = () => {
  const { isAdmin } = useAuth();
  
  return useQuery({
    queryKey: ["roles-permissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roles")
        .select(`
          *,
          role_permissions (
            granted,
            permissions (
              permission_name,
              permission_key,
              app_modules (
                module_name
              )
            )
          )
        `)
        .eq("is_active", true);
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin(),
  });
};

export const useAppModules = () => {
  return useQuery({
    queryKey: ["app-modules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("app_modules")
        .select("*")
        .eq("is_active", true)
        .order("module_name", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};
