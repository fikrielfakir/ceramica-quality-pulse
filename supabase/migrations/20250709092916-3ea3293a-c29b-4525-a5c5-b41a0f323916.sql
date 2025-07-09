
-- Create tables for the different types of control sheets

-- Table for resistance tests
CREATE TABLE public.resistance_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  version TEXT DEFAULT '1.0',
  test_date DATE NOT NULL DEFAULT CURRENT_DATE,
  rubber_thickness NUMERIC,
  format TEXT,
  roller_diameter NUMERIC,
  distance NUMERIC,
  span NUMERIC,
  controller_id UUID REFERENCES public.profiles(id),
  lot_id UUID REFERENCES public.production_lots(id),
  is_conform BOOLEAN,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for resistance test samples
CREATE TABLE public.resistance_test_samples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resistance_test_id UUID REFERENCES public.resistance_tests(id) ON DELETE CASCADE NOT NULL,
  sample_no INTEGER NOT NULL,
  thickness NUMERIC NOT NULL,
  width NUMERIC NOT NULL,
  load_n NUMERIC NOT NULL,
  force NUMERIC NOT NULL,
  rupture_resistance NUMERIC,
  modulus_of_rupture NUMERIC,
  is_conform BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for humidity controls
CREATE TABLE public.humidity_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  version TEXT DEFAULT '1.0',
  test_date DATE NOT NULL DEFAULT CURRENT_DATE,
  controller_id UUID REFERENCES public.profiles(id),
  section TEXT,
  humidity NUMERIC NOT NULL,
  spec_min NUMERIC NOT NULL,
  spec_max NUMERIC NOT NULL,
  silo_no TEXT,
  test_hour TIME,
  fnc_no TEXT,
  lot_id UUID REFERENCES public.production_lots(id),
  is_conform BOOLEAN,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for dimensional surface tests
CREATE TABLE public.dimensional_surface_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  version TEXT DEFAULT '1.0',
  test_date DATE NOT NULL DEFAULT CURRENT_DATE,
  controller_id UUID REFERENCES public.profiles(id),
  format TEXT,
  lighting_lux NUMERIC,
  surface_tested NUMERIC,
  defect_percent NUMERIC,
  lot_id UUID REFERENCES public.production_lots(id),
  is_conform BOOLEAN,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for dimensional surface measurements
CREATE TABLE public.dimensional_surface_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dimensional_test_id UUID REFERENCES public.dimensional_surface_tests(id) ON DELETE CASCADE NOT NULL,
  measurement_type TEXT NOT NULL, -- 'length', 'width', 'thickness', 'straightness', etc.
  tolerance NUMERIC NOT NULL,
  value_label TEXT,
  value_1 NUMERIC,
  value_2 NUMERIC,
  value_3 NUMERIC,
  value_4 NUMERIC,
  value_5 NUMERIC,
  value_6 NUMERIC,
  value_7 NUMERIC,
  value_8 NUMERIC,
  value_9 NUMERIC,
  value_10 NUMERIC,
  max_gap NUMERIC,
  is_conform BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for quality standards and ISO specifications
CREATE TABLE public.quality_standards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  standard_name TEXT NOT NULL,
  standard_code TEXT NOT NULL UNIQUE, -- e.g., 'ISO13006'
  category TEXT NOT NULL, -- 'resistance', 'humidity', 'dimensional'
  parameters JSONB NOT NULL, -- Store specification parameters
  tolerance_values JSONB NOT NULL, -- Store tolerance ranges
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for equipment calibration tracking
CREATE TABLE public.equipment_calibration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_name TEXT NOT NULL,
  equipment_type TEXT NOT NULL,
  serial_number TEXT,
  last_calibration_date DATE NOT NULL,
  next_calibration_date DATE NOT NULL,
  calibration_certificate TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.resistance_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resistance_test_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.humidity_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dimensional_surface_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dimensional_surface_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_calibration ENABLE ROW LEVEL SECURITY;

-- RLS policies for resistance tests
CREATE POLICY "Everyone can view resistance tests" ON public.resistance_tests 
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert resistance tests" ON public.resistance_tests 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update resistance tests" ON public.resistance_tests 
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS policies for resistance test samples
CREATE POLICY "Everyone can view resistance test samples" ON public.resistance_test_samples 
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage resistance test samples" ON public.resistance_test_samples 
  FOR ALL WITH CHECK (auth.uid() IS NOT NULL);

-- RLS policies for humidity controls
CREATE POLICY "Everyone can view humidity controls" ON public.humidity_controls 
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert humidity controls" ON public.humidity_controls 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update humidity controls" ON public.humidity_controls 
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS policies for dimensional surface tests
CREATE POLICY "Everyone can view dimensional surface tests" ON public.dimensional_surface_tests 
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert dimensional surface tests" ON public.dimensional_surface_tests 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update dimensional surface tests" ON public.dimensional_surface_tests 
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS policies for dimensional surface measurements
CREATE POLICY "Everyone can view dimensional surface measurements" ON public.dimensional_surface_measurements 
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage dimensional surface measurements" ON public.dimensional_surface_measurements 
  FOR ALL WITH CHECK (auth.uid() IS NOT NULL);

-- RLS policies for quality standards
CREATE POLICY "Everyone can view active quality standards" ON public.quality_standards 
  FOR SELECT USING (is_active = true);
CREATE POLICY "Quality managers can manage quality standards" ON public.quality_standards 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles ur 
            JOIN public.roles r ON ur.role_id = r.id 
            WHERE ur.user_id = auth.uid() AND r.role_key IN ('admin', 'quality_manager'))
  );

-- RLS policies for equipment calibration
CREATE POLICY "Everyone can view equipment calibration" ON public.equipment_calibration 
  FOR SELECT USING (true);
CREATE POLICY "Quality managers can manage equipment calibration" ON public.equipment_calibration 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles ur 
            JOIN public.roles r ON ur.role_id = r.id 
            WHERE ur.user_id = auth.uid() AND r.role_key IN ('admin', 'quality_manager'))
  );

-- Insert default ISO quality standards
INSERT INTO public.quality_standards (standard_name, standard_code, category, parameters, tolerance_values) VALUES
('ISO 13006 - Résistance à la flexion', 'ISO13006_RESISTANCE', 'resistance', 
 '{"min_modulus_rupture": 35, "test_conditions": "20°C ± 2°C, 65% ± 5% RH", "sample_size": 10}',
 '{"modulus_rupture_min": 35, "individual_min": 32}'),

('ISO 10545-3 - Absorption d''eau', 'ISO10545_3_HUMIDITY', 'humidity', 
 '{"max_absorption_percent": 3.0, "test_temperature": "110°C", "drying_time": "24h"}',
 '{"absorption_max": 3.0, "individual_max": 3.3}'),

('ISO 13006 - Dimensions et qualité de surface', 'ISO13006_DIMENSIONAL', 'dimensional', 
 '{"length_tolerance": 2.0, "width_tolerance": 2.0, "thickness_tolerance": 5.0, "surface_quality_min": 95.0}',
 '{"length_tolerance_mm": 2.0, "width_tolerance_mm": 2.0, "thickness_tolerance_percent": 5.0, "surface_defects_max_percent": 5.0}');

-- Insert sample equipment calibration records
INSERT INTO public.equipment_calibration (equipment_name, equipment_type, serial_number, last_calibration_date, next_calibration_date) VALUES
('Presse hydraulique ZWICK', 'Machine de flexion', 'ZW-2024-001', '2024-01-15', '2025-01-15'),
('Balance de précision SARTORIUS', 'Balance analytique', 'SAR-2023-045', '2024-02-01', '2025-02-01'),
('Four de séchage NABERTHERM', 'Four de séchage', 'NAB-2023-012', '2024-01-30', '2025-01-30'),
('Luxmètre KONICA MINOLTA', 'Instrument de mesure', 'KM-2023-088', '2024-03-01', '2025-03-01');

-- Create triggers for updated_at columns
CREATE TRIGGER update_resistance_tests_updated_at BEFORE UPDATE ON public.resistance_tests FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_humidity_controls_updated_at BEFORE UPDATE ON public.humidity_controls FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_dimensional_surface_tests_updated_at BEFORE UPDATE ON public.dimensional_surface_tests FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_quality_standards_updated_at BEFORE UPDATE ON public.quality_standards FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_equipment_calibration_updated_at BEFORE UPDATE ON public.equipment_calibration FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create function to calculate modulus of rupture
CREATE OR REPLACE FUNCTION public.calculate_modulus_of_rupture(
  force NUMERIC,
  width NUMERIC,
  thickness NUMERIC
) RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
BEGIN
  IF width IS NULL OR thickness IS NULL OR force IS NULL OR width = 0 OR thickness = 0 THEN
    RETURN NULL;
  END IF;
  
  -- Modulus of rupture = Force / (width * thickness²)
  RETURN force / (width * POWER(thickness, 2));
END;
$$;

-- Create function to check humidity conformity
CREATE OR REPLACE FUNCTION public.check_humidity_conformity(
  humidity NUMERIC,
  spec_min NUMERIC,
  spec_max NUMERIC
) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  IF humidity IS NULL OR spec_min IS NULL OR spec_max IS NULL THEN
    RETURN NULL;
  END IF;
  
  RETURN humidity >= spec_min AND humidity <= spec_max;
END;
$$;

-- Create function to check dimensional conformity (95% rule)
CREATE OR REPLACE FUNCTION public.check_dimensional_conformity(
  measurements NUMERIC[],
  tolerance NUMERIC
) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  conform_count INTEGER := 0;
  total_count INTEGER;
  measurement NUMERIC;
BEGIN
  IF measurements IS NULL OR array_length(measurements, 1) IS NULL OR tolerance IS NULL THEN
    RETURN NULL;
  END IF;
  
  total_count := array_length(measurements, 1);
  
  FOREACH measurement IN ARRAY measurements
  LOOP
    IF measurement IS NOT NULL AND ABS(measurement) <= tolerance THEN
      conform_count := conform_count + 1;
    END IF;
  END LOOP;
  
  -- 95% conformity rule
  RETURN (conform_count::NUMERIC / total_count::NUMERIC) >= 0.95;
END;
$$;
