import { elibrosApi } from '@/services/api';
import { Categoria, CategoriaCreateInput, CategoriaUpdateInput } from '@/types/categoria';

class CategoriaApiService {
  private endpoint = '/categorias';

  async getAll(): Promise<Categoria[]> {
    try {
      const response = await elibrosApi.makeRequest<{ results: Categoria[] }>(`${this.endpoint}/`);
      return response.results;
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      throw new Error('Falha ao carregar categorias');
    }
  }

  async create(data: CategoriaCreateInput): Promise<Categoria> {
    try {
      return await elibrosApi.makeRequest<Categoria>(`${this.endpoint}/`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw new Error('Falha ao criar categoria');
    }
  }

  async update(id: number, data: CategoriaUpdateInput): Promise<Categoria> {
    try {
      return await elibrosApi.makeRequest<Categoria>(`${this.endpoint}/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw new Error('Falha ao atualizar categoria');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await elibrosApi.makeRequest<void>(`${this.endpoint}/${id}/`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      throw new Error('Falha ao deletar categoria');
    }
  }
}

export const categoriaApi = new CategoriaApiService();