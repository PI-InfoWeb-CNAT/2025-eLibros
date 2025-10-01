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

export interface AdminUserInfo {
  id: number;
  email: string;
  username: string;
  nome: string;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
  admin_record: {
    id: number;
    rg: string;
  } | null;
}

class AdminApiService {
  
  async getStats(): Promise<AdminStats> {
    return elibrosApi.makeRequest<AdminStats>('/admin/dashboard_stats/');
  }

   async getUserInfo(): Promise<AdminUserInfo> {
    return elibrosApi.makeRequest<AdminUserInfo>('/admin/user_info/');
  }
   async isCurrentUserAdmin(): Promise<boolean> {
    try {
      const userInfo = await this.getUserInfo();
      return userInfo.is_staff || userInfo.is_superuser || !!userInfo.admin_record;
    } catch (error) {
      console.error('Erro ao verificar status de admin:', error);
      return false;
    }
  }

}

export const adminApi = new AdminApiService();