
-- Fix the infinite recursion in user_roles RLS policies
-- Drop the problematic policies first
DROP POLICY IF EXISTS "Admins can manage all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow read access to user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their assigned roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create a security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = $1 AND r.role_key = 'admin'
  );
$$;

-- Create new RLS policies without recursion
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all user roles" ON public.user_roles
  FOR ALL USING (public.is_admin_user());

-- Fix the roles table policies to avoid conflicts
DROP POLICY IF EXISTS "Allow read access to roles" ON public.roles;
DROP POLICY IF EXISTS "Everyone can view active roles" ON public.roles;
DROP POLICY IF EXISTS "Public read access to active roles" ON public.roles;

-- Recreate roles policies without conflicts
CREATE POLICY "Everyone can view active roles" ON public.roles
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage roles" ON public.roles
  FOR ALL USING (public.is_admin_user());

-- Fix role_permissions policies
DROP POLICY IF EXISTS "Admins can manage role permissions" ON public.role_permissions;

CREATE POLICY "Admins can manage role permissions" ON public.role_permissions
  FOR ALL USING (public.is_admin_user());

-- Add missing columns to quality_tests table that are being queried
ALTER TABLE public.quality_tests ADD COLUMN IF NOT EXISTS test_type TEXT DEFAULT 'general';

-- Update the quality_tests table to match the expected structure
UPDATE public.quality_tests SET test_type = 'dimensional' WHERE length_mm IS NOT NULL OR width_mm IS NOT NULL;
UPDATE public.quality_tests SET test_type = 'resistance' WHERE break_resistance_n IS NOT NULL;
UPDATE public.quality_tests SET test_type = 'absorption' WHERE water_absorption_percent IS NOT NULL;

-- Fix any remaining policies that might cause issues
DROP POLICY IF EXISTS "Admins can manage modules" ON public.app_modules;
DROP POLICY IF EXISTS "Admins can manage permissions" ON public.permissions;

-- Recreate them with the security definer function
CREATE POLICY "Admins can manage modules" ON public.app_modules
  FOR ALL USING (public.is_admin_user());

CREATE POLICY "Admins can manage permissions" ON public.permissions
  FOR ALL USING (public.is_admin_user());

-- Fix app_settings policies
DROP POLICY IF EXISTS "Admins can manage all settings" ON public.app_settings;
DROP POLICY IF EXISTS "Everyone can view non-system settings" ON public.app_settings;

CREATE POLICY "Everyone can view non-system settings" ON public.app_settings
  FOR SELECT USING (is_system_setting = false OR public.is_admin_user());

CREATE POLICY "Admins can manage all settings" ON public.app_settings
  FOR ALL USING (public.is_admin_user());

-- Fix user_activity_logs policies
DROP POLICY IF EXISTS "Admins can view all activity" ON public.user_activity_logs;

CREATE POLICY "Admins can view all activity" ON public.user_activity_logs
  FOR SELECT USING (public.is_admin_user());
