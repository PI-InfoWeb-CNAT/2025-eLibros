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

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

class ElibrosApiService {
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
}

// Instância singleton
export const elibrosApi = new ElibrosApiService();
