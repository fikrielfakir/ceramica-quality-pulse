
-- Create table for managing app modules
CREATE TABLE public.app_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_name TEXT NOT NULL UNIQUE,
  module_key TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for permissions
CREATE TABLE public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permission_name TEXT NOT NULL,
  permission_key TEXT NOT NULL UNIQUE,
  module_id UUID REFERENCES public.app_modules(id),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for roles
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name TEXT NOT NULL UNIQUE,
  role_key TEXT NOT NULL UNIQUE,
  description TEXT,
  is_system_role BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create junction table for role permissions
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
  granted BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

-- Update user_roles table to reference new roles table
DROP TABLE IF EXISTS public.user_roles;
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role_id)
);

-- Create table for user activity logs
CREATE TABLE public.user_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  module TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for app settings
CREATE TABLE public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  category TEXT,
  description TEXT,
  is_system_setting BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.app_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for app_modules
CREATE POLICY "Everyone can view active modules" ON public.app_modules 
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage modules" ON public.app_modules 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles ur 
            JOIN public.roles r ON ur.role_id = r.id 
            WHERE ur.user_id = auth.uid() AND r.role_key = 'admin')
  );

-- RLS policies for permissions
CREATE POLICY "Everyone can view active permissions" ON public.permissions 
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage permissions" ON public.permissions 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles ur 
            JOIN public.roles r ON ur.role_id = r.id 
            WHERE ur.user_id = auth.uid() AND r.role_key = 'admin')
  );

-- RLS policies for roles
CREATE POLICY "Everyone can view active roles" ON public.roles 
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage roles" ON public.roles 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles ur 
            JOIN public.roles r ON ur.role_id = r.id 
            WHERE ur.user_id = auth.uid() AND r.role_key = 'admin')
  );

-- RLS policies for role_permissions
CREATE POLICY "Everyone can view role permissions" ON public.role_permissions 
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage role permissions" ON public.role_permissions 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles ur 
            JOIN public.roles r ON ur.role_id = r.id 
            WHERE ur.user_id = auth.uid() AND r.role_key = 'admin')
  );

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all user roles" ON public.user_roles 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles ur 
            JOIN public.roles r ON ur.role_id = r.id 
            WHERE ur.user_id = auth.uid() AND r.role_key = 'admin')
  );

-- RLS policies for user_activity_logs
CREATE POLICY "Users can view their own activity" ON public.user_activity_logs 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all activity" ON public.user_activity_logs 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles ur 
            JOIN public.roles r ON ur.role_id = r.id 
            WHERE ur.user_id = auth.uid() AND r.role_key = 'admin')
  );
CREATE POLICY "Authenticated users can log activity" ON public.user_activity_logs 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS policies for app_settings
CREATE POLICY "Everyone can view non-system settings" ON public.app_settings 
  FOR SELECT USING (is_system_setting = false OR 
    EXISTS (SELECT 1 FROM public.user_roles ur 
            JOIN public.roles r ON ur.role_id = r.id 
            WHERE ur.user_id = auth.uid() AND r.role_key = 'admin')
  );
CREATE POLICY "Admins can manage all settings" ON public.app_settings 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles ur 
            JOIN public.roles r ON ur.role_id = r.id 
            WHERE ur.user_id = auth.uid() AND r.role_key = 'admin')
  );

-- Insert default modules
INSERT INTO public.app_modules (module_name, module_key, description) VALUES
('Tableau de bord', 'dashboard', 'Vue d''ensemble des indicateurs'),
('Contrôle Qualité', 'quality_control', 'Tests et contrôles qualité'),
('Inspection Produits', 'product_inspection', 'Inspection des produits finis'),
('Suivi Énergétique', 'energy_monitoring', 'Monitoring de la consommation énergétique'),
('Gestion Déchets', 'waste_management', 'Gestion et recyclage des déchets'),
('Documents', 'documents', 'Gestion documentaire et conformité'),
('Tests & Mesures', 'testing_campaigns', 'Campagnes de tests et mesures'),
('Profil Utilisateur', 'user_profile', 'Gestion du profil personnel'),
('Paramètres', 'settings', 'Configuration de l''application'),
('Administration', 'admin', 'Gestion des utilisateurs et permissions');

-- Insert default permissions
INSERT INTO public.permissions (permission_name, permission_key, module_id, description) VALUES
-- Dashboard permissions
('Voir tableau de bord', 'view_dashboard', (SELECT id FROM public.app_modules WHERE module_key = 'dashboard'), 'Accès au tableau de bord'),
('Export données dashboard', 'export_dashboard', (SELECT id FROM public.app_modules WHERE module_key = 'dashboard'), 'Exporter les données du dashboard'),

-- Quality Control permissions
('Voir contrôle qualité', 'view_quality_control', (SELECT id FROM public.app_modules WHERE module_key = 'quality_control'), 'Accès au module contrôle qualité'),
('Créer tests qualité', 'create_quality_tests', (SELECT id FROM public.app_modules WHERE module_key = 'quality_control'), 'Créer des tests qualité'),
('Modifier tests qualité', 'edit_quality_tests', (SELECT id FROM public.app_modules WHERE module_key = 'quality_control'), 'Modifier les tests qualité'),
('Supprimer tests qualité', 'delete_quality_tests', (SELECT id FROM public.app_modules WHERE module_key = 'quality_control'), 'Supprimer des tests qualité'),
('Voir analyse qualité', 'view_quality_analysis', (SELECT id FROM public.app_modules WHERE module_key = 'quality_control'), 'Voir les analyses qualité'),
('Export rapports qualité', 'export_quality_reports', (SELECT id FROM public.app_modules WHERE module_key = 'quality_control'), 'Exporter les rapports qualité'),

-- Energy Monitoring permissions
('Voir suivi énergétique', 'view_energy_monitoring', (SELECT id FROM public.app_modules WHERE module_key = 'energy_monitoring'), 'Accès au suivi énergétique'),
('Modifier données énergétiques', 'edit_energy_data', (SELECT id FROM public.app_modules WHERE module_key = 'energy_monitoring'), 'Modifier les données énergétiques'),

-- Waste Management permissions
('Voir gestion déchets', 'view_waste_management', (SELECT id FROM public.app_modules WHERE module_key = 'waste_management'), 'Accès à la gestion des déchets'),
('Programmer collecte', 'schedule_waste_collection', (SELECT id FROM public.app_modules WHERE module_key = 'waste_management'), 'Programmer les collectes'),
('Modifier données déchets', 'edit_waste_data', (SELECT id FROM public.app_modules WHERE module_key = 'waste_management'), 'Modifier les données de déchets'),

-- Documents permissions
('Voir documents', 'view_documents', (SELECT id FROM public.app_modules WHERE module_key = 'documents'), 'Accès aux documents'),
('Uploader documents', 'upload_documents', (SELECT id FROM public.app_modules WHERE module_key = 'documents'), 'Téléverser des documents'),
('Modifier documents', 'edit_documents', (SELECT id FROM public.app_modules WHERE module_key = 'documents'), 'Modifier les documents'),

-- Testing Campaigns permissions
('Voir campagnes tests', 'view_testing_campaigns', (SELECT id FROM public.app_modules WHERE module_key = 'testing_campaigns'), 'Accès aux campagnes de tests'),
('Créer campagnes tests', 'create_testing_campaigns', (SELECT id FROM public.app_modules WHERE module_key = 'testing_campaigns'), 'Créer des campagnes'),
('Modifier campagnes tests', 'edit_testing_campaigns', (SELECT id FROM public.app_modules WHERE module_key = 'testing_campaigns'), 'Modifier les campagnes'),

-- Settings permissions
('Voir paramètres', 'view_settings', (SELECT id FROM public.app_modules WHERE module_key = 'settings'), 'Accès aux paramètres'),
('Modifier paramètres ISO', 'edit_iso_settings', (SELECT id FROM public.app_modules WHERE module_key = 'settings'), 'Modifier les paramètres ISO'),
('Modifier paramètres globaux', 'edit_global_settings', (SELECT id FROM public.app_modules WHERE module_key = 'settings'), 'Modifier les paramètres globaux'),

-- Admin permissions
('Gestion utilisateurs', 'manage_users', (SELECT id FROM public.app_modules WHERE module_key = 'admin'), 'Gérer les utilisateurs'),
('Gestion rôles', 'manage_roles', (SELECT id FROM public.app_modules WHERE module_key = 'admin'), 'Gérer les rôles et permissions'),
('Voir logs activité', 'view_activity_logs', (SELECT id FROM public.app_modules WHERE module_key = 'admin'), 'Voir les logs d''activité'),
('Gestion modules', 'manage_modules', (SELECT id FROM public.app_modules WHERE module_key = 'admin'), 'Gérer les modules de l''application'),
('Archiver données', 'archive_data', (SELECT id FROM public.app_modules WHERE module_key = 'admin'), 'Archiver et supprimer des données'),
('Génération certificats', 'generate_certificates', (SELECT id FROM public.app_modules WHERE module_key = 'admin'), 'Générer des certificats IMANOR');

-- Insert default roles
INSERT INTO public.roles (role_name, role_key, description, is_system_role) VALUES
('Administrateur', 'admin', 'Accès complet à toutes les fonctionnalités', true),
('Chef Qualité', 'quality_manager', 'Gestion complète du contrôle qualité', true),
('Contrôleur Qualité', 'quality_controller', 'Contrôle et tests qualité', true),
('Technicien', 'technician', 'Exécution des tests et mesures', true),
('Chef Production', 'production_manager', 'Gestion de la production', true),
('Opérateur', 'operator', 'Opérations de base', true);

-- Grant ALL permissions to Admin role
INSERT INTO public.role_permissions (role_id, permission_id, granted)
SELECT 
  (SELECT id FROM public.roles WHERE role_key = 'admin'),
  id,
  true
FROM public.permissions;

-- Grant specific permissions to other roles
-- Quality Manager permissions
INSERT INTO public.role_permissions (role_id, permission_id, granted)
SELECT 
  (SELECT id FROM public.roles WHERE role_key = 'quality_manager'),
  id,
  true
FROM public.permissions 
WHERE permission_key IN (
  'view_dashboard', 'export_dashboard',
  'view_quality_control', 'create_quality_tests', 'edit_quality_tests', 'view_quality_analysis', 'export_quality_reports',
  'view_documents', 'upload_documents', 'edit_documents',
  'view_testing_campaigns', 'create_testing_campaigns', 'edit_testing_campaigns',
  'view_settings', 'edit_iso_settings'
);

-- Quality Controller permissions
INSERT INTO public.role_permissions (role_id, permission_id, granted)
SELECT 
  (SELECT id FROM public.roles WHERE role_key = 'quality_controller'),
  id,
  true
FROM public.permissions 
WHERE permission_key IN (
  'view_dashboard',
  'view_quality_control', 'create_quality_tests', 'edit_quality_tests', 'view_quality_analysis',
  'view_documents',
  'view_testing_campaigns'
);

-- Technician permissions
INSERT INTO public.role_permissions (role_id, permission_id, granted)
SELECT 
  (SELECT id FROM public.roles WHERE role_key = 'technician'),
  id,
  true
FROM public.permissions 
WHERE permission_key IN (
  'view_dashboard',
  'view_quality_control', 'create_quality_tests',
  'view_documents',
  'view_testing_campaigns'
);

-- Production Manager permissions
INSERT INTO public.role_permissions (role_id, permission_id, granted)
SELECT 
  (SELECT id FROM public.roles WHERE role_key = 'production_manager'),
  id,
  true
FROM public.permissions 
WHERE permission_key IN (
  'view_dashboard', 'export_dashboard',
  'view_quality_control', 'view_quality_analysis', 'export_quality_reports',
  'view_energy_monitoring', 'edit_energy_data',
  'view_waste_management', 'schedule_waste_collection', 'edit_waste_data',
  'view_documents'
);

-- Operator permissions
INSERT INTO public.role_permissions (role_id, permission_id, granted)
SELECT 
  (SELECT id FROM public.roles WHERE role_key = 'operator'),
  id,
  true
FROM public.permissions 
WHERE permission_key IN (
  'view_dashboard',
  'view_quality_control', 'create_quality_tests',
  'view_waste_management'
);

-- Insert default app settings
INSERT INTO public.app_settings (setting_key, setting_value, category, description, is_system_setting) VALUES
('iso_tolerances', '{"length_tolerance_mm": 2.0, "width_tolerance_mm": 2.0, "thickness_tolerance_percent": 5.0, "water_absorption_max_percent": 3.0, "breaking_strength_min_n": 1300}', 'quality', 'Tolérances ISO pour les tests qualité', false),
('app_language', '"fr"', 'general', 'Langue par défaut de l''application', false),
('measurement_units', '{"length": "mm", "weight": "kg", "force": "N", "percentage": "%"}', 'general', 'Unités de mesure par défaut', false),
('quality_alerts_enabled', 'true', 'notifications', 'Activer les alertes qualité en temps réel', false),
('auto_export_enabled', 'false', 'reports', 'Export automatique des rapports', false),
('offline_mode_enabled', 'false', 'general', 'Mode hors ligne activé', true);

-- Create triggers for updated_at
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON public.app_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
