import { elibrosApi, ApiResponse } from './api';
import { Livro } from '@/types';

class LivroApiService {

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
    return elibrosApi.makeRequest<Livro>(`/livros/${id}/`, { skipAuth: true });
  }
}

export const livroApi = new LivroApiService();