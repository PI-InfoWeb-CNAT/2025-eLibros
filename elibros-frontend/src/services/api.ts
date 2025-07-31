// Serviço simplificado para comunicação com a API Django

// Configurações da API
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 10000, // 10 segundos
};

const API_BASE_URL = API_CONFIG.BASE_URL;

// Tipos TypeScript baseados na API Django
export interface Livro {
  id: number;
  titulo: string;
  subtitulo?: string;
  autores: string[];
  editora: string;
  ISBN: string;
  data_de_publicacao?: string;
  ano_de_publicacao?: number;
  capa: string;
  sinopse?: string;
  generos: string[];
  categorias: string[];
  preco: string;
  desconto?: string;
  quantidade: number;
  qtd_vendidos: number;
}

export interface Usuario {
  id: number;
  email: string;
  username: string;
  nome: string;
  CPF: string;
  telefone: string;
  genero?: string;
  dt_nasc?: string;
  date_joined: string;
  is_active: boolean;
  email_is_verified: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: Usuario;
  refresh: string;
  access: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  nome: string;
  CPF: string;
  telefone: string;
  genero?: string;
  dt_nasc?: string;
  password: string;
  password_confirm: string;
}

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

class ElibrosApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Verificar se estamos no lado do cliente
    if (typeof window === 'undefined') {
      throw new Error('API calls should only be made on the client side');
    }

    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...(options.headers as Record<string, string>),
    };

    try {
      // Criar controller para timeout manual
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Timeout: A requisição demorou muito para responder');
        }
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
          throw new Error('Erro de conexão: Verifique se a API está rodando');
        }
      }
      throw error;
    }
  }

  // ==================== LIVROS ====================
  async getLivros(page = 1, search?: string): Promise<ApiResponse<Livro>> {
    let endpoint = `/livros/?page=${page}`;
    if (search) {
      endpoint += `&search=${encodeURIComponent(search)}`;
    }
    return this.makeRequest<ApiResponse<Livro>>(endpoint);
  }

  async getLivro(id: number): Promise<Livro> {
    return this.makeRequest<Livro>(`/livros/${id}/`);
  }

  // ==================== AUTENTICAÇÃO ====================
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.makeRequest<LoginResponse>('/auth/login/', {
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
    return this.makeRequest<Usuario>('/usuarios/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<void> {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
    
    if (refreshToken) {
      try {
        await this.makeRequest('/usuarios/logout/', {
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

    const response = await this.makeRequest<{ access: string }>('/auth/refresh/', {
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

// Instância singleton
export const elibrosApi = new ElibrosApiService();
