
-- Create enhanced roles and permissions system
INSERT INTO roles (role_key, role_name, description, is_active, is_system_role) VALUES
('operator', 'Opérateur', 'Opérateur de production avec accès limité', true, true),
('technician', 'Technicien', 'Technicien avec accès aux contrôles qualité', true, true),
('quality_controller', 'Contrôleur Qualité', 'Contrôleur qualité avec accès complet aux tests', true, true),
('production_manager', 'Responsable Production', 'Gestionnaire de production avec accès étendu', true, true),
('quality_manager', 'Responsable Qualité', 'Gestionnaire qualité avec tous les droits qualité', true, true)
ON CONFLICT (role_key) DO UPDATE SET
  role_name = EXCLUDED.role_name,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active;

-- Create detailed permissions for each module
INSERT INTO permissions (permission_key, permission_name, description, module_id, is_active) VALUES
-- Dashboard permissions
('view_dashboard', 'Voir Tableau de Bord', 'Accès au tableau de bord principal', (SELECT id FROM app_modules WHERE module_key = 'dashboard' LIMIT 1), true),
('view_analytics', 'Voir Analyses', 'Accès aux analyses et statistiques', (SELECT id FROM app_modules WHERE module_key = 'dashboard' LIMIT 1), true),

-- Quality Control permissions
('view_quality_tests', 'Voir Tests Qualité', 'Consulter les tests qualité', (SELECT id FROM app_modules WHERE module_key = 'quality' LIMIT 1), true),
('create_quality_tests', 'Créer Tests Qualité', 'Créer nouveaux tests qualité', (SELECT id FROM app_modules WHERE module_key = 'quality' LIMIT 1), true),
('edit_quality_tests', 'Modifier Tests Qualité', 'Modifier les tests qualité', (SELECT id FROM app_modules WHERE module_key = 'quality' LIMIT 1), true),
('delete_quality_tests', 'Supprimer Tests Qualité', 'Supprimer les tests qualité', (SELECT id FROM app_modules WHERE module_key = 'quality' LIMIT 1), true),
('generate_reports', 'Générer Rapports', 'Générer rapports et certificats', (SELECT id FROM app_modules WHERE module_key = 'quality' LIMIT 1), true),
('corrective_actions', 'Actions Correctives', 'Initier actions correctives', (SELECT id FROM app_modules WHERE module_key = 'quality' LIMIT 1), true),
('view_trends', 'Analyser Tendances', 'Accès aux analyses de tendances', (SELECT id FROM app_modules WHERE module_key = 'quality' LIMIT 1), true),

-- Production permissions
('view_production', 'Voir Production', 'Consulter données production', (SELECT id FROM app_modules WHERE module_key = 'production' LIMIT 1), true),
('manage_production', 'Gérer Production', 'Gérer les lots de production', (SELECT id FROM app_modules WHERE module_key = 'production' LIMIT 1), true),
('optimize_production', 'Optimiser Production', 'Accès aux optimisations', (SELECT id FROM app_modules WHERE module_key = 'production' LIMIT 1), true),

-- Energy permissions
('view_energy', 'Voir Énergie', 'Consulter consommation énergétique', (SELECT id FROM app_modules WHERE module_key = 'energy' LIMIT 1), true),
('manage_energy', 'Gérer Énergie', 'Gérer paramètres énergétiques', (SELECT id FROM app_modules WHERE module_key = 'energy' LIMIT 1), true),
('energy_alerts', 'Alertes Énergie', 'Gérer alertes énergétiques', (SELECT id FROM app_modules WHERE module_key = 'energy' LIMIT 1), true),

-- Maintenance permissions
('view_maintenance', 'Voir Maintenance', 'Consulter planning maintenance', (SELECT id FROM app_modules WHERE module_key = 'maintenance' LIMIT 1), true),
('schedule_maintenance', 'Programmer Maintenance', 'Programmer interventions maintenance', (SELECT id FROM app_modules WHERE module_key = 'maintenance' LIMIT 1), true),

-- Admin permissions
('manage_users', 'Gérer Utilisateurs', 'Gestion des utilisateurs', (SELECT id FROM app_modules WHERE module_key = 'admin' LIMIT 1), true),
('manage_roles', 'Gérer Rôles', 'Gestion des rôles et permissions', (SELECT id FROM app_modules WHERE module_key = 'admin' LIMIT 1), true),
('system_settings', 'Paramètres Système', 'Configuration système', (SELECT id FROM app_modules WHERE module_key = 'admin' LIMIT 1), true)
ON CONFLICT (permission_key) DO NOTHING;

-- Create role-permission mappings
-- Operator permissions (basic access)
INSERT INTO role_permissions (role_id, permission_id, granted) 
SELECT r.id, p.id, true
FROM roles r, permissions p
WHERE r.role_key = 'operator' 
AND p.permission_key IN ('view_dashboard', 'view_quality_tests', 'create_quality_tests', 'view_production');

-- Technician permissions (extended access)
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, true
FROM roles r, permissions p
WHERE r.role_key = 'technician'
AND p.permission_key IN ('view_dashboard', 'view_analytics', 'view_quality_tests', 'create_quality_tests', 'edit_quality_tests', 'generate_reports', 'view_production', 'view_energy', 'view_maintenance');

-- Quality Controller permissions (quality focused)
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, true
FROM roles r, permissions p
WHERE r.role_key = 'quality_controller'
AND p.permission_key IN ('view_dashboard', 'view_analytics', 'view_quality_tests', 'create_quality_tests', 'edit_quality_tests', 'delete_quality_tests', 'generate_reports', 'corrective_actions', 'view_trends', 'view_production');

-- Production Manager permissions (production focused)
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, true
FROM roles r, permissions p
WHERE r.role_key = 'production_manager'
AND p.permission_key IN ('view_dashboard', 'view_analytics', 'view_quality_tests', 'create_quality_tests', 'generate_reports', 'view_production', 'manage_production', 'optimize_production', 'view_energy', 'manage_energy', 'view_maintenance', 'schedule_maintenance');

-- Quality Manager permissions (full quality access)
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, true
FROM roles r, permissions p
WHERE r.role_key = 'quality_manager'
AND p.permission_key IN ('view_dashboard', 'view_analytics', 'view_quality_tests', 'create_quality_tests', 'edit_quality_tests', 'delete_quality_tests', 'generate_reports', 'corrective_actions', 'view_trends', 'view_production', 'manage_production', 'view_energy', 'energy_alerts', 'view_maintenance', 'schedule_maintenance');

-- Create tables for enhanced functionality
CREATE TABLE IF NOT EXISTS public.quality_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES quality_tests(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL, -- 'certificate', 'analysis', 'corrective_action'
  report_data JSONB NOT NULL,
  generated_by UUID REFERENCES profiles(id),
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.corrective_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES quality_tests(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  assigned_to UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  due_date DATE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.energy_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL, -- 'high_consumption', 'equipment_issue', 'target_exceeded'
  equipment_name TEXT,
  threshold_value NUMERIC,
  current_value NUMERIC,
  severity TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  status TEXT DEFAULT 'active', -- 'active', 'acknowledged', 'resolved'
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES profiles(id)
);

CREATE TABLE IF NOT EXISTS public.maintenance_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_name TEXT NOT NULL,
  maintenance_type TEXT NOT NULL, -- 'preventive', 'corrective', 'calibration'
  description TEXT,
  scheduled_date DATE NOT NULL,
  assigned_to UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
  priority TEXT DEFAULT 'medium',
  estimated_duration INTEGER, -- in hours
  actual_duration INTEGER,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.quality_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corrective_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_schedules ENABLE ROW LEVEL SECURITY;

-- RLS policies for quality_reports
CREATE POLICY "Users can view quality reports" ON public.quality_reports FOR SELECT USING (true);
CREATE POLICY "Quality controllers can manage reports" ON public.quality_reports FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles ur JOIN roles r ON ur.role_id = r.id 
          WHERE ur.user_id = auth.uid() AND r.role_key IN ('quality_controller', 'quality_manager', 'admin'))
);

-- RLS policies for corrective_actions
CREATE POLICY "Users can view corrective actions" ON public.corrective_actions FOR SELECT USING (true);
CREATE POLICY "Quality staff can manage corrective actions" ON public.corrective_actions FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles ur JOIN roles r ON ur.role_id = r.id 
          WHERE ur.user_id = auth.uid() AND r.role_key IN ('quality_controller', 'quality_manager', 'production_manager', 'admin'))
);

-- RLS policies for energy_alerts
CREATE POLICY "Users can view energy alerts" ON public.energy_alerts FOR SELECT USING (true);
CREATE POLICY "Managers can manage energy alerts" ON public.energy_alerts FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles ur JOIN roles r ON ur.role_id = r.id 
          WHERE ur.user_id = auth.uid() AND r.role_key IN ('production_manager', 'quality_manager', 'admin'))
);

-- RLS policies for maintenance_schedules
CREATE POLICY "Users can view maintenance schedules" ON public.maintenance_schedules FOR SELECT USING (true);
CREATE POLICY "Managers can manage maintenance schedules" ON public.maintenance_schedules FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles ur JOIN roles r ON ur.role_id = r.id 
          WHERE ur.user_id = auth.uid() AND r.role_key IN ('production_manager', 'quality_manager', 'technician', 'admin'))
);

-- Update triggers for timestamp columns
CREATE TRIGGER update_corrective_actions_updated_at 
  BEFORE UPDATE ON public.corrective_actions 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_maintenance_schedules_updated_at 
  BEFORE UPDATE ON public.maintenance_schedules 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
