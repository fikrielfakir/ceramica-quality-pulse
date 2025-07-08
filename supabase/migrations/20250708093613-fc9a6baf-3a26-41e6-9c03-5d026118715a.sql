
-- Create user roles table for flexible role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create quality standards table for flexible ISO parameters
CREATE TABLE public.quality_standards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  standard_name TEXT NOT NULL,
  standard_code TEXT NOT NULL,
  category TEXT NOT NULL, -- 'dimensional', 'physical', 'visual'
  parameters JSONB NOT NULL, -- flexible parameters storage
  tolerance_values JSONB NOT NULL, -- min/max values, percentages
  unit TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create defect types table for visual inspection
CREATE TABLE public.defect_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_fr TEXT NOT NULL,
  name_ar TEXT,
  category TEXT NOT NULL, -- 'surface', 'dimensional', 'structural'
  severity TEXT NOT NULL, -- 'minor', 'major', 'critical'
  description_fr TEXT,
  description_ar TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced quality tests table with more detailed tracking
DROP TABLE IF EXISTS public.quality_tests;
CREATE TABLE public.quality_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id UUID REFERENCES public.production_lots(id) NOT NULL,
  test_date DATE DEFAULT CURRENT_DATE,
  test_time TIME DEFAULT CURRENT_TIME,
  operator_id UUID REFERENCES public.profiles(id),
  test_type TEXT NOT NULL, -- 'dimensional', 'physical', 'visual'
  
  -- Dimensional measurements
  length_mm DECIMAL(8,3),
  width_mm DECIMAL(8,3),
  thickness_mm DECIMAL(8,3),
  warping_percent DECIMAL(5,3),
  bending_percent DECIMAL(5,3),
  
  -- Physical properties
  water_absorption_percent DECIMAL(5,3),
  breaking_strength_n INTEGER,
  abrasion_resistance_pei INTEGER,
  thermal_shock_cycles INTEGER,
  frost_resistance_result TEXT,
  
  -- Visual inspection
  surface_quality_grade TEXT,
  color_consistency_grade TEXT,
  glaze_quality_grade TEXT,
  
  -- Test results
  test_results JSONB, -- flexible storage for all test data
  defects JSONB, -- array of defect records
  photos JSONB, -- array of photo URLs with annotations
  
  -- Compliance
  iso_compliance JSONB, -- compliance status for each standard
  overall_status TEXT DEFAULT 'En cours', -- 'Conforme', 'Non-conforme', 'En cours'
  
  -- Equipment and method
  equipment_used TEXT,
  test_method TEXT,
  calibration_date DATE,
  
  -- Notes and actions
  notes TEXT,
  corrective_actions TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create reports table for generated documentation
CREATE TABLE public.quality_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id UUID REFERENCES public.production_lots(id),
  report_type TEXT NOT NULL, -- 'batch_summary', 'compliance_certificate', 'defect_analysis'
  report_data JSONB NOT NULL,
  generated_by UUID REFERENCES public.profiles(id),
  file_url TEXT,
  language TEXT DEFAULT 'fr', -- 'fr', 'ar'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create equipment calibration tracking
CREATE TABLE public.equipment_calibration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_name TEXT NOT NULL,
  equipment_type TEXT NOT NULL, -- 'caliper', 'scale', 'strength_tester'
  serial_number TEXT,
  last_calibration_date DATE,
  next_calibration_date DATE,
  calibration_certificate_url TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'needs_calibration', 'out_of_service'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.defect_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_calibration ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- RLS policies for quality_standards (admin-only management)
CREATE POLICY "Everyone can view quality standards" ON public.quality_standards FOR SELECT USING (true);
CREATE POLICY "Admins can manage quality standards" ON public.quality_standards FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- RLS policies for defect_types
CREATE POLICY "Everyone can view defect types" ON public.defect_types FOR SELECT USING (true);
CREATE POLICY "Quality technicians can manage defect types" ON public.defect_types FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'quality_technician'))
);

-- RLS policies for enhanced quality_tests
CREATE POLICY "Everyone can view quality tests" ON public.quality_tests FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert quality tests" ON public.quality_tests FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Operators can update their own tests" ON public.quality_tests FOR UPDATE USING (
  auth.uid() = operator_id OR 
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'quality_technician'))
);

-- RLS policies for quality_reports
CREATE POLICY "Everyone can view quality reports" ON public.quality_reports FOR SELECT USING (true);
CREATE POLICY "Authenticated users can generate reports" ON public.quality_reports FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS policies for equipment_calibration
CREATE POLICY "Everyone can view equipment calibration" ON public.equipment_calibration FOR SELECT USING (true);
CREATE POLICY "Quality technicians can manage equipment" ON public.equipment_calibration FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'quality_technician'))
);

-- Insert default user roles
INSERT INTO public.user_roles (user_id, role, permissions) VALUES
-- Note: These will need actual user IDs after users sign up
('00000000-0000-0000-0000-000000000001', 'admin', '{"manage_users": true, "manage_standards": true, "view_all_reports": true}'),
('00000000-0000-0000-0000-000000000002', 'quality_technician', '{"manage_tests": true, "generate_reports": true, "calibrate_equipment": true}'),
('00000000-0000-0000-0000-000000000003', 'production_manager', '{"view_reports": true, "manage_lots": true}'),
('00000000-0000-0000-0000-000000000004', 'operator', '{"perform_tests": true, "view_own_tests": true}');

-- Insert ISO quality standards
INSERT INTO public.quality_standards (standard_name, standard_code, category, parameters, tolerance_values, unit) VALUES
-- ISO 13006 Dimensional standards
('Longueur carrelage sol', 'ISO-13006-DIM-L', 'dimensional', 
 '{"measurement_type": "length", "tile_type": "floor", "method": "caliper"}',
 '{"tolerance_percent": 0.5, "min_mm": 595, "max_mm": 605}', 'mm'),

('Largeur carrelage sol', 'ISO-13006-DIM-W', 'dimensional',
 '{"measurement_type": "width", "tile_type": "floor", "method": "caliper"}',
 '{"tolerance_percent": 0.5, "min_mm": 595, "max_mm": 605}', 'mm'),

('Épaisseur carrelage', 'ISO-13006-DIM-T', 'dimensional',
 '{"measurement_type": "thickness", "tile_type": "all", "method": "caliper"}',
 '{"tolerance_percent": 5, "min_mm": 9.5, "max_mm": 10.5}', 'mm'),

('Gauchissement rectifié', 'ISO-13006-WARP', 'dimensional',
 '{"measurement_type": "warping", "tile_type": "rectified", "method": "surface_plate"}',
 '{"max_percent": 0.6}', '%'),

-- ISO 10545 Physical standards
('Absorption eau grès cérame', 'ISO-10545-3', 'physical',
 '{"test_type": "water_absorption", "material": "porcelain", "method": "boiling"}',
 '{"max_percent": 3.0}', '%'),

('Résistance flexion sol', 'ISO-10545-4', 'physical',
 '{"test_type": "breaking_strength", "tile_type": "floor", "method": "3_point_bending"}',
 '{"min_n": 1300}', 'N'),

('Résistance abrasion PEI', 'ISO-10545-7', 'physical',
 '{"test_type": "abrasion_resistance", "method": "PEI_test"}',
 '{"min_pei": 3, "max_pei": 5}', 'PEI'),

('Résistance gel', 'ISO-10545-12', 'physical',
 '{"test_type": "frost_resistance", "method": "freeze_thaw_cycles"}',
 '{"min_cycles": 100}', 'cycles');

-- Insert common defect types
INSERT INTO public.defect_types (name_fr, name_ar, category, severity, description_fr, description_ar) VALUES
('Fissure', 'شق', 'structural', 'critical', 'Fissure visible sur la surface', 'شق مرئي على السطح'),
('Défaut émail', 'عيب المينا', 'surface', 'major', 'Problème de glaçure ou émail', 'مشكلة في الطلاء الزجاجي'),
('Variation couleur', 'تغير اللون', 'surface', 'minor', 'Différence de couleur par rapport au standard', 'اختلاف في اللون عن المعيار'),
('Hors dimension', 'خارج الأبعاد', 'dimensional', 'major', 'Dimensions hors tolérances ISO', 'أبعاد خارج التسامح'),
('Gauchissement', 'انحناء', 'dimensional', 'major', 'Déformation de la surface', 'تشويه السطح'),
('Éclat', 'شظية', 'structural', 'major', 'Éclat ou ébréchure sur les bords', 'رقاقة أو نتوء على الحواف'),
('Bulle émail', 'فقاعة المينا', 'surface', 'minor', 'Bulles dans le glaçage', 'فقاعات في الطلاء الزجاجي'),
('Tache', 'بقعة', 'surface', 'minor', 'Tache ou salissure sur la surface', 'بقعة أو اتساخ على السطح');

-- Insert equipment calibration records
INSERT INTO public.equipment_calibration (equipment_name, equipment_type, serial_number, last_calibration_date, next_calibration_date) VALUES
('Pied à coulisse digital A1', 'caliper', 'CAL-2024-001', '2024-01-15', '2024-07-15'),
('Balance précision B2', 'scale', 'BAL-2024-002', '2024-02-01', '2024-08-01'),
('Machine flexion MF-300', 'strength_tester', 'MF-300-001', '2024-01-10', '2024-07-10'),
('Plaque de surface PS-1', 'surface_plate', 'PS-2024-001', '2024-03-01', '2024-09-01');

-- Create triggers for updated_at
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_quality_standards_updated_at BEFORE UPDATE ON public.quality_standards FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_quality_tests_updated_at BEFORE UPDATE ON public.quality_tests FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
