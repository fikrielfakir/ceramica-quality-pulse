
-- Create a security definer function for assigning default roles
CREATE OR REPLACE FUNCTION public.assign_default_role(user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- First check if user already has any roles
  IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = assign_default_role.user_id) THEN
    -- Assign default 'operator' role if none exists
    INSERT INTO user_roles (user_id, role_id)
    SELECT assign_default_role.user_id, id 
    FROM roles 
    WHERE role_key = 'operator' AND is_active = true
    LIMIT 1
    ON CONFLICT DO NOTHING;
  END IF;
END;
$$;

-- Update the user_roles RLS policy to allow default role assignment
DROP POLICY IF EXISTS "Allow default role assignment" ON public.user_roles;

CREATE POLICY "Allow default role assignment" ON public.user_roles
  FOR INSERT WITH CHECK (
    role_id IN (SELECT id FROM roles WHERE role_key = 'operator') 
    AND NOT EXISTS (
      SELECT 1 FROM user_roles ur2 
      WHERE ur2.user_id = auth.uid() AND ur2.role_id = user_roles.role_id
    )
  );

-- Ensure the admin user has admin role
DO $$
DECLARE
    admin_role_id UUID;
    admin_user_id UUID := 'd9a388f9-43ca-4015-81c2-54ab5ba42781';
BEGIN
    -- Get admin role ID
    SELECT id INTO admin_role_id FROM roles WHERE role_key = 'admin' LIMIT 1;
    
    -- Insert admin role for the admin user if it doesn't exist
    IF admin_role_id IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role_id)
        VALUES (admin_user_id, admin_role_id)
        ON CONFLICT (user_id, role_id) DO NOTHING;
    END IF;
END $$;
