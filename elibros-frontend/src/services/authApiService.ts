import { elibrosApi } from './api';

import { Usuario } from '@/types/usuario';
import { LoginRequest, LoginResponse, RegisterRequest } from '@/types/auth';

class AuthApiService {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await elibrosApi.makeRequest<LoginResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Salvar tokens no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<Usuario> {
    return elibrosApi.makeRequest<Usuario>('/usuarios/', {
      method: 'POST',
      body: JSON.stringify(userData),
      skipAuth: true
    });
  }

  async logout(): Promise<void> {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
    
    if (refreshToken) {
      try {
        await elibrosApi.makeRequest('/usuarios/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh: refreshToken }),
        });
      } catch (error) {
        console.warn('Erro ao fazer logout no servidor:', error);
      }
    }
    
    // Limpar dados locais sempre
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  async refreshToken(): Promise<string> {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await elibrosApi.makeRequest<{ access: string }>('/auth/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.access);
    }

    return response.access;
  }

 
  

  // Verificar se o usuário está logado
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('access_token');
  }

  // Obter dados do usuário atual
  getCurrentUser(): Usuario | null {
    if (typeof window === 'undefined') return null;
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
}

export const authApi = new AuthApiService();