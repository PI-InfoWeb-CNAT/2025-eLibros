'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { elibrosApi} from '../services/api';
import { authApi } from '../services/authApiService';
import { Usuario } from '@/types/usuario';
import { LoginRequest, RegisterRequest } from '@/types/auth';

interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  isAdmin: boolean;
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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Verificar se há um usuário logado ao carregar a página
    const checkAuth = async () => {
      try {
        const currentUser = authApi.getCurrentUser();
        const isAuth = authApi.isAuthenticated();

        console.log('🔐 AuthContext DEBUG:', {
          currentUser: currentUser?.username || 'null',
          isAuth,
          hasToken: !!localStorage.getItem('access_token')
        });
        
        if (currentUser && isAuth) {
          setUser(currentUser);
          setIsAuthenticated(true);
          // Verificar se é admin (staff ou superuser)
          const adminStatus = currentUser.is_staff || currentUser.is_superuser || false;
          setIsAdmin(adminStatus);
          console.log('✅ Usuário autenticado:', currentUser.username, 'Admin:', adminStatus);
        } else {
          // Limpar estados
          setUser(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
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
      const response = await authApi.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      await authApi.register(userData);
      // Após o registro, fazer login automaticamente
      await login({ email: userData.email, password: userData.password });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshUser = () => {
    const currentUser = authApi.getCurrentUser();
    setUser(currentUser);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    isAdmin,
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
