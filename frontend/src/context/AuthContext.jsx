import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // checking session on mount

  // Restore session on app load using the httpOnly refresh cookie
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await authApi.refresh();
        window.__accessToken__ = data.accessToken;
        setUser(data.user ?? { restored: true });
      } catch {
        window.__accessToken__ = null;
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await authApi.login(email, password);
    window.__accessToken__ = data.accessToken;
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await authApi.register(name, email, password);
    // Don't set token or user after signup - user must login
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      window.__accessToken__ = null;
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
