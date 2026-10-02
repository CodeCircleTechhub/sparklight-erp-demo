import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  phone?: string;
  department?: string;
  staffId?: string;
  patientId?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      connectSocket();
    }
    setLoading(false);
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      const isStaffId = /^S\d+$/.test(identifier);
      const isPatientId = /^PT-\d+$/i.test(identifier.trim());
      const payload: Record<string, string> = { password };
      if (isPatientId) {
        payload.patientId = identifier.trim().toUpperCase();
      } else if (isStaffId) {
        payload.staffId = identifier;
      } else {
        payload.email = identifier;
      }
      const { data } = await api.post('/auth/login', payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      connectSocket();
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, error: message };
    }
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/auth/profile');
      const updatedUser = {
        id: data.user._id,
        fullName: data.user.fullName,
        email: data.user.email,
        role: data.user.role,
        phone: data.user.phone,
        department: data.user.department,
        staffId: data.user.staffId,
        patientId: data.user.patientId,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch {
      // ignore
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    disconnectSocket();
    api.post('/auth/logout').catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
