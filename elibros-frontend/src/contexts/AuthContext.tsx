'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { elibrosApi, Usuario, LoginRequest, RegisterRequest } from '../services/api';

interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Verificar se há um usuário logado ao carregar a página
    const checkAuth = async () => {
      try {
        const currentUser = elibrosApi.getCurrentUser();
        const isAuth = elibrosApi.isAuthenticated();
        
        console.log('🔐 AuthContext DEBUG:', {
          currentUser: currentUser?.username || 'null',
          isAuth,
          hasToken: !!localStorage.getItem('access_token')
        });
        
        if (currentUser && isAuth) {
          setUser(currentUser);
          setIsAuthenticated(true);
          console.log('✅ Usuário autenticado:', currentUser.username);
        } else {
          // Limpar estados
          setUser(null);
          setIsAuthenticated(false);
          console.log('❌ Usuário não autenticado');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // Limpar dados corrompidos
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
        console.log('🏁 AuthContext inicializado');
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await elibrosApi.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      const newUser = await elibrosApi.register(userData);
      // Após o registro, fazer login automaticamente
      await login({ email: userData.email, password: userData.password });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await elibrosApi.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshUser = () => {
    const currentUser = elibrosApi.getCurrentUser();
    setUser(currentUser);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
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
