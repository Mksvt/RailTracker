'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import api from '../lib/api';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  full_name?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{ error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // No need to set the header here, the interceptor in api.ts does it
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token'); // Token might be invalid
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      // After setting the token, fetch the user profile
      const userResponse = await api.get('/auth/me');
      setUser(userResponse.data);
      return {};
    } catch (error: any) {
      return { error: error.response?.data?.message || 'Network error' };
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName?: string
  ) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        fullName,
      });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      // After setting the token, fetch the user profile
      const userResponse = await api.get('/auth/me');
      setUser(userResponse.data);
      return {};
    } catch (error: any) {
      return { error: error.response?.data?.message || 'Network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // No need to call a backend endpoint for logout in this JWT setup
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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
