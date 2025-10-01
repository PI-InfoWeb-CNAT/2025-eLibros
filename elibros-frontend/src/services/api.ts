// Configurações da API
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 10000, // 10 segundos
};

const API_BASE_URL = API_CONFIG.BASE_URL;


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

  // Método para limpar dados de autenticação
  private clearAuthData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  // Método para verificar se o token é válido
  async verifyToken(): Promise<boolean> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (!token) return false;

      const response = await fetch(`${API_BASE_URL}/auth/verify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  async makeRequest<T>(
    endpoint: string,
    options: RequestInit & { skipAuth?: boolean } = {}
  ): Promise<T> {
    // Verificar se estamos no lado do cliente
    if (typeof window === 'undefined') {
      throw new Error('API calls should only be made on the client side');
    }

    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.skipAuth ? {} : this.getAuthHeaders()),
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
        // Se for erro 401 (token inválido), limpar dados de auth
        if (response.status === 401 && !options.skipAuth) {
          console.log('🔑 Token inválido, limpando dados de autenticação');
          this.clearAuthData();
          // Recarregar a página para atualizar o estado de autenticação
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }

        // Tentar obter detalhes do erro
        let errorDetails = `${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorDetails = errorData.detail;
          } else if (errorData.error) {
            errorDetails = errorData.error;
          } else if (typeof errorData === 'object') {
            // Se houver erros de campo específicos
            const fieldErrors = Object.entries(errorData)
              .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
              .join('; ');
            if (fieldErrors) {
              errorDetails = fieldErrors;
            }
          }
        } catch {
          // Se não conseguir parsear o JSON, usar status original
          errorDetails = `${response.status} ${response.statusText}`;
        }
        throw new Error(`API Error: ${errorDetails}`);
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

}

// Instância singleton
export const elibrosApi = new ElibrosApiService();
