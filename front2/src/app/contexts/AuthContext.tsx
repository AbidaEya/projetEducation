import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiGet } from '../services/api';

export type UserRole = 'admin' | 'enseignant' | 'etudiant';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  address?: string;
  isActive?: boolean;
  // enseignant
  specialite?: string;
  departement?: { id: number; nomDepartement: string };
  // etudiant
  niveau?: string;
  groupe?: { id: number; nomGroupe: string };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const STORAGE_KEY = 'edu_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapBackendRole(raw: string): UserRole {
  const lower = (raw ?? '').toLowerCase();
  if (lower.includes('admin')) return 'admin';
  if (lower.includes('enseignant')) return 'enseignant';
  return 'etudiant';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // Determine which endpoint to query based on role
      const endpoints: Record<UserRole, string> = {
        admin: '/admins',
        enseignant: '/enseignants',
        etudiant: '/etudiants',
      };

      const endpoint = endpoints[role];
      // Fetch by email from the backend
      const data = await apiGet<{ id: number; email: string; password: string; firstName: string; lastName: string; role?: string; userType?: string; specialite?: string; niveau?: string; departement?: { id: number; nomDepartement: string }; groupe?: { id: number; nomGroupe: string }; phoneNumber?: string; address?: string; isActive?: boolean } | null>(`${endpoint}/by-email/${encodeURIComponent(email)}`);

      if (!data) return false;

      // Plain text password comparison (matches backend behavior)
      if (data.password !== password) return false;

      const mappedUser: User = {
        id: data.id,
        email: data.email,
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
        role: role,
        phoneNumber: data.phoneNumber,
        address: data.address,
        isActive: data.isActive,
        specialite: data.specialite,
        niveau: data.niveau,
        departement: data.departement,
        groupe: data.groupe,
      };

      setUser(mappedUser);
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
