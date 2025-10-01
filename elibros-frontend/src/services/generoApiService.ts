import { elibrosApi } from './api';
import { GeneroLiterario } from '@/types/generoLiterario';

export interface GeneroCreateInput {
  nome: string;
}

export interface GeneroUpdateInput {
  nome: string;
}

export const generoApi = {
  // Listar todos os gêneros
  list: async (): Promise<GeneroLiterario[]> => {
    const response = await elibrosApi.makeRequest<{ results: GeneroLiterario[] }>('/generos/');
    return response.results || [];
  },

  // Buscar gênero por ID
  get: async (id: number): Promise<GeneroLiterario> => {
    return await elibrosApi.makeRequest<GeneroLiterario>(`/generos/${id}/`);
  },

  // Criar novo gênero
  create: async (data: GeneroCreateInput): Promise<GeneroLiterario> => {
    return await elibrosApi.makeRequest<GeneroLiterario>('/generos/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Atualizar gênero
  update: async (id: number, data: GeneroUpdateInput): Promise<GeneroLiterario> => {
    return await elibrosApi.makeRequest<GeneroLiterario>(`/generos/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Deletar gênero
  delete: async (id: number): Promise<void> => {
    await elibrosApi.makeRequest<void>(`/generos/${id}/`, {
      method: 'DELETE',
    });
  },

  // Buscar gêneros com filtros
  search: async (params: {
    search?: string;
    ordering?: string;
  }): Promise<{ results: GeneroLiterario[]; count: number }> => {
    const queryParams = new URLSearchParams();
    
    if (params.search) {
      queryParams.append('search', params.search);
    }
    
    if (params.ordering) {
      queryParams.append('ordering', params.ordering);
    }

    const response = await elibrosApi.makeRequest<{ results: GeneroLiterario[]; count: number }>(
      `/generos/?${queryParams.toString()}`
    );
    return response;
  }
};