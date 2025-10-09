import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User { 
  id: string; 
  name: string; 
  email: string; 
  points?: number;
  streak?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: any){
  const [user, setUser] = useState<User|null>(null);
  const [token, setToken] = useState<string|null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('focusflow_token');
    const savedUser = localStorage.getItem('focusflow_user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      } catch (error) {
        console.error('Error restoring session:', error);
        localStorage.removeItem('focusflow_token');
        localStorage.removeItem('focusflow_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login for:', email);
      const res = await api.post('/auth/login', { email, password });
      console.log('✅ Login response:', res.data);
      
      const t = res.data.token;
      const userData = res.data.user;
      
      if (!t || !userData) {
        throw new Error('Invalid response from server');
      }
      
      setToken(t);
      setUser(userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
      
      // Save to localStorage
      localStorage.setItem('focusflow_token', t);
      localStorage.setItem('focusflow_user', JSON.stringify(userData));
      
      return res.data;
    } catch (error: any) {
      console.error('❌ Login error:', error);
      console.error('❌ Error response:', error.response?.data);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      console.log('📝 Attempting registration for:', { name, email });
      const res = await api.post('/auth/register', { name, email, password });
      console.log('✅ Registration response:', res.data);
      
      const t = res.data.token;
      const userData = res.data.user;
      
      if (!t || !userData) {
        throw new Error('Invalid response from server');
      }
      
      setToken(t);
      setUser(userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
      
      // Save to localStorage
      localStorage.setItem('focusflow_token', t);
      localStorage.setItem('focusflow_user', JSON.stringify(userData));
      
      return res.data;
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      console.error('❌ Error response:', error.response?.data);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('focusflow_token');
    localStorage.removeItem('focusflow_user');
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
