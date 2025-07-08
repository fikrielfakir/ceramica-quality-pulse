
import { useState, useEffect, createContext, useContext } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: string | null;
  userPermissions: any;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userPermissions, setUserPermissions] = useState<any>({});
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
              
              // Then fetch role
              const { data: roleData } = await supabase
                .from('user_roles')
                .select('role, permissions')
                .eq('user_id', session.user.id)
                .single();
              
              if (roleData) {
                setUserRole(roleData.role);
                setUserPermissions(roleData.permissions || {});
              } else {
                // Assign default role if none exists
                await assignDefaultRole(session.user.id);
                setUserRole('operator');
                setUserPermissions({});
              }
            } catch (error) {
              console.error('Error fetching user role:', error);
              // Fallback to default role
              setUserRole('operator');
              setUserPermissions({});
            }
          }, 100);
        } else {
          setUserRole(null);
          setUserPermissions({});
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
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'operator',
          permissions: { perform_tests: true, view_own_tests: true }
        });
      
      if (error) {
        console.error('Error assigning default role:', error);
      }
    } catch (error) {
      console.error('Error assigning default role:', error);
    }
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
      signOut
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
