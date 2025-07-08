
-- Create enum types for better data integrity
CREATE TYPE public.test_status AS ENUM ('Conforme', 'Non-conforme', 'En cours');
CREATE TYPE public.defect_type AS ENUM ('none', 'crack', 'glaze', 'dimension', 'color', 'warping');
CREATE TYPE public.user_role AS ENUM ('admin', 'quality_technician', 'production_manager', 'operator');
CREATE TYPE public.energy_source AS ENUM ('electricity', 'gas', 'solar', 'other');
CREATE TYPE public.waste_type AS ENUM ('ceramic', 'glaze', 'packaging', 'chemical', 'water');

-- Users profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'operator',
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Production batches/lots table
CREATE TABLE public.production_lots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_number TEXT UNIQUE NOT NULL,
  production_date DATE NOT NULL,
  product_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  operator_id UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'In Production',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Quality control tests table
CREATE TABLE public.quality_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id UUID REFERENCES public.production_lots(id) NOT NULL,
  test_date DATE DEFAULT CURRENT_DATE,
  operator_id UUID REFERENCES public.profiles(id),
  length_mm DECIMAL(5,2),
  width_mm DECIMAL(5,2),
  thickness_mm DECIMAL(4,2),
  water_absorption_percent DECIMAL(4,2),
  break_resistance_n INTEGER,
  defect_type defect_type DEFAULT 'none',
  defect_count INTEGER DEFAULT 0,
  status test_status DEFAULT 'En cours',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Energy monitoring table
CREATE TABLE public.energy_consumption (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recorded_date DATE DEFAULT CURRENT_DATE,
  recorded_time TIME DEFAULT CURRENT_TIME,
  source energy_source NOT NULL,
  consumption_kwh DECIMAL(10,2) NOT NULL,
  cost_amount DECIMAL(10,2),
  equipment_name TEXT,
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Waste management table
CREATE TABLE public.waste_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recorded_date DATE DEFAULT CURRENT_DATE,
  waste_type waste_type NOT NULL,
  quantity_kg DECIMAL(10,2) NOT NULL,
  disposal_method TEXT,
  cost_amount DECIMAL(10,2),
  responsible_person_id UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Compliance documents table
CREATE TABLE public.compliance_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  issue_date DATE,
  expiry_date DATE,
  issuing_authority TEXT,
  status TEXT DEFAULT 'Active',
  file_url TEXT,
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Testing campaigns table
CREATE TABLE public.testing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  status TEXT DEFAULT 'Planning',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_consumption ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testing_campaigns ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for production_lots
CREATE POLICY "Everyone can view production lots" ON public.production_lots FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert production lots" ON public.production_lots FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update production lots" ON public.production_lots FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for quality_tests
CREATE POLICY "Everyone can view quality tests" ON public.quality_tests FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert quality tests" ON public.quality_tests FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update quality tests" ON public.quality_tests FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for energy_consumption
CREATE POLICY "Everyone can view energy consumption" ON public.energy_consumption FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert energy consumption" ON public.energy_consumption FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for waste_records
CREATE POLICY "Everyone can view waste records" ON public.waste_records FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert waste records" ON public.waste_records FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for compliance_documents
CREATE POLICY "Everyone can view compliance documents" ON public.compliance_documents FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert compliance documents" ON public.compliance_documents FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for testing_campaigns
CREATE POLICY "Everyone can view testing campaigns" ON public.testing_campaigns FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert testing campaigns" ON public.testing_campaigns FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Insert sample production lots
INSERT INTO public.production_lots (lot_number, production_date, product_type, quantity, status) VALUES
('LOT-2024-001', '2024-03-15', 'Carrelage Sol 60x60', 1000, 'Completed'),
('LOT-2024-002', '2024-03-14', 'Carrelage Mural 30x60', 800, 'Quality Control'),
('LOT-2024-003', '2024-03-14', 'Carrelage Sol 45x45', 1200, 'Completed'),
('LOT-2024-004', '2024-03-16', 'Carrelage Sol 60x60', 950, 'In Production'),
('LOT-2024-005', '2024-03-16', 'Carrelage Mural 20x50', 600, 'In Production'),
('LOT-2024-006', '2024-03-17', 'Carrelage Sol 80x80', 750, 'Planning');

-- Insert sample quality tests
INSERT INTO public.quality_tests (lot_id, test_date, length_mm, width_mm, thickness_mm, water_absorption_percent, break_resistance_n, defect_type, defect_count, status, notes) VALUES
((SELECT id FROM public.production_lots WHERE lot_number = 'LOT-2024-001'), '2024-03-15', 600.2, 599.8, 10.1, 2.1, 1350, 'none', 0, 'Conforme', 'Contrôle conforme aux normes ISO'),
((SELECT id FROM public.production_lots WHERE lot_number = 'LOT-2024-002'), '2024-03-14', 300.1, 599.5, 8.2, 3.2, 1250, 'glaze', 12, 'Non-conforme', 'Défauts d''émail détectés - Action corrective requise'),
((SELECT id FROM public.production_lots WHERE lot_number = 'LOT-2024-003'), '2024-03-14', 450.0, 449.8, 9.8, 1.8, 1400, 'none', 1, 'Conforme', 'Qualité excellente');

-- Insert sample energy consumption data
INSERT INTO public.energy_consumption (recorded_date, source, consumption_kwh, cost_amount, equipment_name, department) VALUES
('2024-03-15', 'electricity', 1250.5, 875.35, 'Four A1', 'Production'),
('2024-03-15', 'gas', 890.2, 623.14, 'Four B1', 'Production'),
('2024-03-15', 'electricity', 340.8, 238.56, 'Ligne Emaillage', 'Finition'),
('2024-03-14', 'electricity', 1180.3, 826.21, 'Four A1', 'Production'),
('2024-03-14', 'gas', 920.7, 644.49, 'Four B1', 'Production'),
('2024-03-16', 'solar', 450.2, 0.00, 'Panneaux Solaires', 'Général');

-- Insert sample waste records
INSERT INTO public.waste_records (recorded_date, waste_type, quantity_kg, disposal_method, cost_amount, notes) VALUES
('2024-03-15', 'ceramic', 125.5, 'Recyclage interne', 0.00, 'Déchets céramiques réutilisés'),
('2024-03-15', 'glaze', 45.2, 'Traitement spécialisé', 89.50, 'Déchets d''émail - traitement chimique'),
('2024-03-14', 'packaging', 78.9, 'Recyclage externe', 15.75, 'Cartons et emballages'),
('2024-03-16', 'water', 2340.0, 'Station d''épuration', 234.00, 'Eaux usées de production'),
('2024-03-15', 'chemical', 12.3, 'Traitement spécialisé', 156.80, 'Produits chimiques usagés');

-- Insert sample compliance documents
INSERT INTO public.compliance_documents (document_name, document_type, issue_date, expiry_date, issuing_authority, status) VALUES
('Certification ISO 13006', 'Certification Qualité', '2023-06-15', '2026-06-15', 'Bureau Veritas', 'Active'),
('Autorisation Environnementale', 'Permis Environnemental', '2022-01-10', '2027-01-10', 'Ministère de l''Environnement', 'Active'),
('Certificat CE Produits', 'Certification Produit', '2023-09-20', '2025-09-20', 'Organisme Notifié', 'Active'),
('Rapport Audit Sécurité', 'Audit Sécurité', '2024-01-15', '2025-01-15', 'Cabinet HSQE', 'Active');

-- Insert sample testing campaigns
INSERT INTO public.testing_campaigns (campaign_name, start_date, end_date, description, status) VALUES
('Contrôle Qualité Q1 2024', '2024-01-01', '2024-03-31', 'Campagne trimestrielle de contrôle qualité', 'Completed'),
('Tests Résistance Nouveaux Produits', '2024-03-01', '2024-03-31', 'Tests spéciaux pour nouvelle gamme', 'In Progress'),
('Audit ISO Préparatoire', '2024-04-01', '2024-04-15', 'Préparation audit certification ISO', 'Planning');

-- Create trigger function to automatically update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_production_lots_updated_at BEFORE UPDATE ON public.production_lots FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_quality_tests_updated_at BEFORE UPDATE ON public.quality_tests FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_compliance_documents_updated_at BEFORE UPDATE ON public.compliance_documents FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_testing_campaigns_updated_at BEFORE UPDATE ON public.testing_campaigns FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
