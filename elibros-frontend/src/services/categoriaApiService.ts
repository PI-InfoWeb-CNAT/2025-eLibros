import { ApiResponse } from '@/services/api';
import { Categoria, CategoriaCreateInput, CategoriaUpdateInput } from '@/types/categoria';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export const categoriaApi = {
  getAll: async (): Promise<Categoria[]> => {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/categorias/`, { headers });
    if (!response.ok) throw new Error('Falha ao carregar categorias');
    const data: ApiResponse<Categoria> = await response.json();
    return data.results;
  },

  create: async (data: CategoriaCreateInput): Promise<Categoria> => {
    const headers = {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    };
    const response = await fetch(`${API_BASE_URL}/categorias/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Falha ao criar categoria');
    return response.json();
  },

  update: async (id: number, data: CategoriaUpdateInput): Promise<Categoria> => {
    const headers = {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    };
    const response = await fetch(`${API_BASE_URL}/categorias/${id}/`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Falha ao atualizar categoria');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/categorias/${id}/`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error('Falha ao excluir categoria');
  },
};