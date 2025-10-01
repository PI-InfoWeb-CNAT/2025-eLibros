import { elibrosApi, ApiResponse } from './api';
import { Livro, LivroCreateData, LivroUpdateData, LivroListResponse } from '@/types';

class LivroApiService {
  private endpoint = '/livros';

  async list(params?: {
    search?: string;
    categoria?: string;
    genero?: string;
    autor?: string;
    ordering?: string;
    page?: number;
  }): Promise<LivroListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.search) {
      searchParams.append('search', params.search);
    }
    if (params?.categoria) {
      searchParams.append('categoria', params.categoria);
    }
    if (params?.genero) {
      searchParams.append('genero', params.genero);
    }
    if (params?.autor) {
      searchParams.append('autor', params.autor);
    }
    if (params?.ordering) {
      searchParams.append('ordering', params.ordering);
    }
    if (params?.page) {
      searchParams.append('page', params.page.toString());
    }

    const url = searchParams.toString() 
      ? `${this.endpoint}/?${searchParams.toString()}`
      : `${this.endpoint}/`;

    return elibrosApi.makeRequest<LivroListResponse>(url, { skipAuth: true });
  }

  async get(id: number): Promise<Livro> {
    return elibrosApi.makeRequest<Livro>(`${this.endpoint}/${id}/`, { skipAuth: true });
  }

  async create(data: LivroCreateData): Promise<Livro> {
    return elibrosApi.makeRequest<Livro>(`${this.endpoint}/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createWithFile(formData: FormData): Promise<Livro> {
    return elibrosApi.makeRequest<Livro>(`${this.endpoint}/`, {
      method: 'POST',
      body: formData,
      headers: {}, // Sem Content-Type para FormData
    });
  }

  async update(id: number, data: LivroUpdateData): Promise<Livro> {
    return elibrosApi.makeRequest<Livro>(`${this.endpoint}/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async updateWithFile(id: number, formData: FormData): Promise<Livro> {
    return elibrosApi.makeRequest<Livro>(`${this.endpoint}/${id}/`, {
      method: 'PATCH',
      body: formData,
      headers: {}, // Sem Content-Type para FormData
    });
  }

  async delete(id: number): Promise<void> {
    return elibrosApi.makeRequest<void>(`${this.endpoint}/${id}/`, {
      method: 'DELETE',
    });
  }

  // Métodos específicos baseados nas actions do ViewSet
  async getLivros(page = 1, search?: string): Promise<ApiResponse<Livro>> {
    let endpoint = `/livros/?page=${page}`;
    if (search) {
      endpoint += `&search=${encodeURIComponent(search)}`;
    }
    return elibrosApi.makeRequest<ApiResponse<Livro>>(endpoint, { skipAuth: true });
  }

  async pesquisarLivros(
    busca?: string, 
    genero?: string, 
    autor?: string, 
    data?: string
  ): Promise<{
    livros: Livro[];
    generos: { id: number; nome: string }[];
    autores: { id: number; nome: string }[];
    termo_pesquisa: string;
  }> {
    const params = new URLSearchParams();
    if (busca) params.append('pesquisa', busca);
    if (genero) params.append('genero', genero);
    if (autor) params.append('autor', autor);
    if (data) params.append('data', data);
    
    const endpoint = `/livros/explorar/?${params.toString()}`;
    return elibrosApi.makeRequest(endpoint, { skipAuth: true });
  }

  async getLivro(id: number): Promise<Livro> {
    return this.get(id);
  }

  async getAcervo(): Promise<{
    lista_livros: Array<{
      categoria: { id: number; nome: string };
      livros: Livro[];
    }>;
    generos: { id: number; nome: string }[];
    autores: { id: number; nome: string }[];
  }> {
    return elibrosApi.makeRequest(`${this.endpoint}/acervo/`, { skipAuth: true });
  }

  async getDestaque(): Promise<Livro[]> {
    return elibrosApi.makeRequest(`${this.endpoint}/destaque/`, { skipAuth: true });
  }

  async getLancamentos(): Promise<Livro[]> {
    return elibrosApi.makeRequest(`${this.endpoint}/lancamentos/`, { skipAuth: true });
  }

  // Métodos auxiliares
  formatPreco(preco: string | number): string {
    const precoNum = typeof preco === 'string' ? parseFloat(preco) : preco;
    return `R$ ${precoNum.toFixed(2).replace('.', ',')}`;
  }

  formatDesconto(desconto?: string): string {
    if (!desconto) return '';
    const descontoNum = parseFloat(desconto);
    return `${descontoNum}% OFF`;
  }

  calcularPrecoComDesconto(preco: string, desconto?: string): number {
    const precoNum = parseFloat(preco);
    if (!desconto) return precoNum;
    const descontoNum = parseFloat(desconto);
    return precoNum * (1 - descontoNum / 100);
  }

  isDisponivel(livro: Livro): boolean {
    return livro.quantidade > 0;
  }
}

export const livroApi = new LivroApiService();