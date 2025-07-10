
-- Fix the ambiguous column reference in the assign_default_role function
CREATE OR REPLACE FUNCTION public.assign_default_role(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- First check if user already has any roles
  IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = target_user_id) THEN
    -- Assign default 'operator' role if none exists
    INSERT INTO user_roles (user_id, role_id)
    SELECT target_user_id, id 
    FROM roles 
    WHERE role_key = 'operator' AND is_active = true
    LIMIT 1
    ON CONFLICT DO NOTHING;
  END IF;
END;
$$;
