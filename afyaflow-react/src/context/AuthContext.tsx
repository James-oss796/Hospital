import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNotification } from './NotificationContext';
import { authApi } from '../services/api';
import { jwtDecode } from 'jwt-decode';

export type Role = 'Admin' | 'Receptionist' | 'Doctor' | 'USER';

export interface User {
  id: string;
  email: string;
  username: string;
  role: Role;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any, password: string) => Promise<boolean>;
  setSessionToken: (token: string) => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'afyaflow_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useNotification();

  const setSessionToken = useCallback((token: string) => {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    try {
        const decoded: any = jwtDecode(token);
        
        // Normalize role from backend (UPPERCASE) to frontend (PascalCase)
        const normalizeRole = (role: string): Role => {
            const r = role.toUpperCase();
            if (r === 'ADMIN') return 'Admin';
            if (r === 'DOCTOR') return 'Doctor';
            if (r === 'RECEPTIONIST') return 'Receptionist';
            return 'USER';
        };

        setUser({
            id: decoded.id || '',
            email: decoded.email || decoded.sub, // Fallbacks
            username: decoded.sub, 
            role: normalizeRole(decoded.role || 'USER'),
            department: decoded.department 
        });
    } catch {
        // bad token
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        setUser(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = () => {
      const storedToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
      if (storedToken) {
          setSessionToken(storedToken);
      }
      setLoading(false);
    };
    initAuth();
  }, [setSessionToken]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      if (response.data && response.data.token) {
          setSessionToken(response.data.token);
          notify(`Welcome back!`, 'success', 'Login Successful');
          setLoading(false);
          return true;
      }
      throw new Error();
    } catch (err: any) {
      setError('Invalid email or password');
      notify('Invalid email or password.', 'error', 'Login Failed');
      setLoading(false);
      return false;
    }
  }, [notify, setSessionToken]);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    notify('You have been securely signed out.', 'info', 'Signed Out');
  }, [notify]);

  const register = useCallback(async (userData: any, password: string): Promise<boolean> => {
    setError(null);
    try {
      await authApi.register({ 
        email: userData.username, 
        password,
        role: userData.role,
        department: userData.department
      });
      notify(`Account created successfully. You can now login.`, 'success', 'Staff Registered');
      return true;
    } catch (err: any) {
      setError('Registration failed');
      notify('An error occurred during registration. Please check inputs.', 'error', 'Registration Failed');
      return false;
    }
  }, [notify]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register, setSessionToken, loading, error }}>
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

