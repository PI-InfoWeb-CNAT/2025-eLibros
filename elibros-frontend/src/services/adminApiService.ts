// Serviço para operações administrativas
import { elibrosApi } from './api';

export interface AdminStats {
  total_livros: number;
  total_clientes: number;
  total_pedidos: number;
  total_generos: number;
  total_categorias: number;
  total_administradores: number;
}


class AdminApiService {
  
  async getStats(): Promise<AdminStats> {
    return elibrosApi.makeRequest<AdminStats>('/admin/dashboard_stats/');
  }

}

export const adminApi = new AdminApiService();