import { elibrosApi } from './api';
import { Autor } from '@/types/autor';

export interface AutorCreateInput {
  nome: string;
}

export interface AutorUpdateInput {
  nome: string;
}

export const autorApi = {
  // Listar todos os autores
  list: async (): Promise<Autor[]> => {
    const response = await elibrosApi.makeRequest<{ results: Autor[] }>('/autores/');
    return response.results || [];
  },

  // Buscar autor por ID
  get: async (id: number): Promise<Autor> => {
    return await elibrosApi.makeRequest<Autor>(`/autores/${id}/`);
  },

  // Criar novo autor
  create: async (data: AutorCreateInput): Promise<Autor> => {
    return await elibrosApi.makeRequest<Autor>('/autores/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Atualizar autor
  update: async (id: number, data: AutorUpdateInput): Promise<Autor> => {
    return await elibrosApi.makeRequest<Autor>(`/autores/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Deletar autor
  delete: async (id: number): Promise<void> => {
    await elibrosApi.makeRequest<void>(`/autores/${id}/`, {
      method: 'DELETE',
    });
  },

  // Buscar autores com filtros
  search: async (params: {
    search?: string;
    ordering?: string;
  }): Promise<{ results: Autor[]; count: number }> => {
    const queryParams = new URLSearchParams();
    
    if (params.search) {
      queryParams.append('search', params.search);
    }
    
    if (params.ordering) {
      queryParams.append('ordering', params.ordering);
    }

    const response = await elibrosApi.makeRequest<{ results: Autor[]; count: number }>(
      `/autores/?${queryParams.toString()}`
    );
    return response;
  }
};
