
-- Insert admin user with full permissions
-- First, get the admin role ID
DO $$
DECLARE
    admin_role_id UUID;
    admin_user_id UUID := '5cc0cf73-62ec-43b5-9e2f-2268d4821cb9'; -- This should be replaced with actual admin user ID
BEGIN
    -- Get the admin role ID
    SELECT id INTO admin_role_id FROM roles WHERE role_key = 'admin' LIMIT 1;
    
    -- If admin role doesn't exist, create it
    IF admin_role_id IS NULL THEN
        INSERT INTO roles (role_name, role_key, description, is_system_role, is_active)
        VALUES ('Administrateur', 'admin', 'Accès complet à toutes les fonctionnalités du système', true, true)
        RETURNING id INTO admin_role_id;
        
        -- Grant ALL permissions to admin role
        INSERT INTO role_permissions (role_id, permission_id, granted)
        SELECT admin_role_id, id, true FROM permissions WHERE is_active = true;
    END IF;
    
    -- Insert admin user role if it doesn't exist
    INSERT INTO user_roles (user_id, role_id, assigned_by)
    VALUES (admin_user_id, admin_role_id, admin_user_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;
    
    -- Ensure admin user profile exists
    INSERT INTO profiles (id, email, full_name, department, role)
    VALUES (admin_user_id, 'admin@cedesa.com', 'Administrateur Système', 'IT', 'admin')
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        department = EXCLUDED.department,
        role = EXCLUDED.role;
        
END $$;

-- Also ensure we have a test admin user for development
INSERT INTO profiles (id, email, full_name, department, role)
VALUES ('d9a388f9-43ca-4015-81c2-54ab5ba42781', 'admin@test.com', 'Admin Test', 'Administration', 'admin')
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    department = EXCLUDED.department,
    role = EXCLUDED.role;

-- Assign admin role to test admin user
DO $$
DECLARE
    admin_role_id UUID;
    test_admin_user_id UUID := 'd9a388f9-43ca-4015-81c2-54ab5ba42781';
BEGIN
    SELECT id INTO admin_role_id FROM roles WHERE role_key = 'admin' LIMIT 1;
    
    IF admin_role_id IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role_id, assigned_by)
        VALUES (test_admin_user_id, admin_role_id, test_admin_user_id)
        ON CONFLICT (user_id, role_id) DO NOTHING;
    END IF;
END $$;
