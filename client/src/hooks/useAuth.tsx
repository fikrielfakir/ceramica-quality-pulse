
import { useState, useEffect, createContext, useContext } from "react";
import { apiService } from "@/services/api";

interface User {
  id: string;
  email: string;
  fullName?: string;
  role?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  userRole: string | null;
  userPermissions: string[];
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<boolean>;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setUserRole(parsedUser.role || 'operator');
        setUserPermissions(getDefaultPermissions(parsedUser.role || 'operator'));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const getDefaultPermissions = (role: string): string[] => {
    switch (role) {
      case 'admin':
        return ['*']; // All permissions
      case 'quality_manager':
        return ['view_dashboard', 'view_quality_control', 'create_quality_tests', 'edit_quality_tests', 'generate_reports'];
      case 'quality_controller':
        return ['view_dashboard', 'view_quality_control', 'create_quality_tests', 'edit_quality_tests'];
      case 'production_manager':
        return ['view_dashboard', 'view_production', 'manage_production', 'view_energy', 'view_waste'];
      default:
        return ['view_dashboard', 'view_quality_control', 'create_quality_tests'];
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login(email, password);
      const userData = response.user;
      
      setUser(userData);
      setUserRole(userData.role || 'operator');
      setUserPermissions(getDefaultPermissions(userData.role || 'operator'));
      
      // Store user in localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      return true;
    } catch (error) {
      console.error('Error signing in:', error);
      return false;
    }
  };

  const hasPermission = (permission: string) => {
    return userPermissions.includes('*') || userPermissions.includes(permission) || userRole === 'admin';
  };

  const isAdmin = () => {
    return userRole === 'admin';
  };

  const signOut = async () => {
    try {
      setUser(null);
      setUserRole(null);
      setUserPermissions([]);
      localStorage.removeItem('currentUser');
      window.location.href = "/auth";
    } catch (error) {
      console.error('Error signing out:', error);
      window.location.href = "/auth";
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userRole,
      userPermissions,
      loading,
      signIn,
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
