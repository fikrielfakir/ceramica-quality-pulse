
import { useState, useEffect, createContext, useContext } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: string | null;
  userPermissions: string[];
  loading: boolean;
  signOut: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user role and permissions with a slight delay
          setTimeout(async () => {
            try {
              // First, ensure user profile exists
              await ensureUserProfile(session.user);
              
              // Then fetch role and permissions
              const { data: roleData } = await supabase
                .from('user_roles')
                .select(`
                  roles (
                    role_key,
                    role_name,
                    role_permissions (
                      permissions (
                        permission_key
                      )
                    )
                  )
                `)
                .eq('user_id', session.user.id)
                .single();
              
              if (roleData?.roles) {
                setUserRole(roleData.roles.role_key);
                const permissions = roleData.roles.role_permissions
                  ?.map((rp: any) => rp.permissions?.permission_key)
                  .filter(Boolean) || [];
                setUserPermissions(permissions);
              } else {
                // Assign default role if none exists
                await assignDefaultRole(session.user.id);
                setUserRole('operator');
                setUserPermissions(['view_dashboard', 'view_quality_control', 'create_quality_tests']);
              }
            } catch (error) {
              console.error('Error fetching user role:', error);
              // Fallback to default role
              setUserRole('operator');
              setUserPermissions(['view_dashboard', 'view_quality_control', 'create_quality_tests']);
            }
          }, 100);
        } else {
          setUserRole(null);
          setUserPermissions([]);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const ensureUserProfile = async (user: User) => {
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        // Create profile if it doesn't exist
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || '',
            created_at: new Date().toISOString()
          });
        
        if (error) {
          console.error('Error creating profile:', error);
        }
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
    }
  };

  const assignDefaultRole = async (userId: string) => {
    try {
      // Get the operator role
      const { data: operatorRole } = await supabase
        .from('roles')
        .select('id')
        .eq('role_key', 'operator')
        .single();

      if (operatorRole) {
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role_id: operatorRole.id
          });
        
        if (error) {
          console.error('Error assigning default role:', error);
        }
      }
    } catch (error) {
      console.error('Error assigning default role:', error);
    }
  };

  const hasPermission = (permission: string) => {
    return userPermissions.includes(permission) || userRole === 'admin';
  };

  const isAdmin = () => {
    return userRole === 'admin';
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/auth";
    } catch (error) {
      console.error('Error signing out:', error);
      window.location.href = "/auth";
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      userRole,
      userPermissions,
      loading,
      signOut,
      hasPermission,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
