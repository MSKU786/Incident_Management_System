import React, {createContext, useContext, useState, useEffect} from 'react';
import {
  isAuthenticated as checkAuth,
  logout as clearAuth,
} from '../utility/auth';

const AuthContext = createContext(null);

export function AuthProvider({children}) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = async () => {
    // Call API logout if needed (optional)
    try {
      const {api} = await import('../Api/api');
      await api.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAuth();
      setToken(null);
    }
  };

  const isAuthenticated = () => {
    return checkAuth() && !!token;
  };

  const value = {
    token,
    login,
    logout,
    isAuthenticated,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
