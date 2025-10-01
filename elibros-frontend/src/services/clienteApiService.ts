import { elibrosApi } from './api';

import { 
  Cliente, 
  ClienteUpdateData, 
  ClienteListResponse, 
  ClienteStats,
} from '@/types/cliente';

// import { Usuario } from '@/types/usuario';

class ClienteApiService {
  private endpoint = '/clientes';

  async list(params?: {
    search?: string;
    is_active?: boolean;
    ordering?: string;
    page?: number;
  }): Promise<ClienteListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.search) {
      searchParams.append('search', params.search);
    }
    if (params?.is_active !== undefined) {
      searchParams.append('is_active', params.is_active.toString());
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

    return elibrosApi.makeRequest<ClienteListResponse>(url);
  }

  async get(id: number): Promise<Cliente> {
    return elibrosApi.makeRequest<Cliente>(`${this.endpoint}/${id}/`);
  }

  /**
   * Obtém o perfil do cliente logado
   */
  async getPerfil(): Promise<Cliente> {
    return elibrosApi.makeRequest<Cliente>(`${this.endpoint}/perfil/`);
  }

  /**
   * Atualiza o perfil do cliente logado
   */
  async updatePerfil(data: ClienteUpdateData): Promise<Cliente> {
    return elibrosApi.makeRequest<Cliente>(`${this.endpoint}/editar_perfil/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Atualiza um cliente específico (para admin)
   */
  async update(id: number, data: ClienteUpdateData): Promise<Cliente> {
    return elibrosApi.makeRequest<Cliente>(`${this.endpoint}/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Desativa a conta do cliente (soft delete)
   */
  async deactivateAccount(id?: number): Promise<Cliente> {
    const endpoint = id 
      ? `${this.endpoint}/${id}/` 
      : `${this.endpoint}/editar_perfil/`;
    
    return elibrosApi.makeRequest<Cliente>(endpoint, {
      method: id ? 'PATCH' : 'PUT',
      body: JSON.stringify({
        user: {
          is_active: false
        }
      }),
    });
  }

  /**
   * Reativa a conta do cliente
   */
  async reactivateAccount(id: number): Promise<Cliente> {
    return elibrosApi.makeRequest<Cliente>(`${this.endpoint}/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        user: {
          is_active: true
        }
      }),
    });
  }

  /**
   * Remove permanentemente um cliente (hard delete)
   */
  async delete(id: number): Promise<void> {
    return elibrosApi.makeRequest<void>(`${this.endpoint}/${id}/`, {
      method: 'DELETE',
    });
  }

  /**
   * Obtém estatísticas dos clientes (para admin)
   */
  async getStats(): Promise<ClienteStats> {
    return elibrosApi.makeRequest<ClienteStats>(`${this.endpoint}/estatisticas/`);
  }

  // Métodos auxiliares
  formatNome(cliente: Cliente): string {
    return cliente.user.nome || cliente.user.username;
  }

  formatTelefone(telefone: string): string {
    // Remove caracteres não numéricos
    const cleaned = telefone.replace(/\D/g, '');
    
    // Formata conforme o padrão brasileiro
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    
    return telefone;
  }

  formatCPF(cpf: string): string {
    // Remove caracteres não numéricos
    const cleaned = cpf.replace(/\D/g, '');
    
    // Formata CPF
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
    }
    
    return cpf;
  }

  formatGenero(genero: string): string {
    const generos: Record<string, string> = {
      'F': 'Feminino',
      'M': 'Masculino',
      'NB': 'Não-binário',
      'PND': 'Prefiro não dizer',
      'NI': 'Não informado'
    };
    
    return generos[genero] || 'Não informado';
  }

  formatEndereco(cliente: Cliente): string {
    if (!cliente.endereco) return 'Endereço não informado';
    
    const { endereco } = cliente;
    return `${endereco.rua}, ${endereco.numero}${endereco.complemento ? ` - ${endereco.complemento}` : ''}, ${endereco.bairro}, ${endereco.cidade}/${endereco.uf}`;
  }

  formatEnderecoCompleto(cliente: Cliente): string | null {
    if (!cliente.endereco) return null;
    
    const { endereco } = cliente;
    return `${endereco.rua}, ${endereco.numero}${endereco.complemento ? ` - ${endereco.complemento}` : ''}\n${endereco.bairro}, ${endereco.cidade}/${endereco.uf}\nCEP: ${endereco.cep}`;
  }

  isActive(cliente: Cliente): boolean {
    return cliente.user.is_active;
  }

  hasAddress(cliente: Cliente): boolean {
    return cliente.endereco !== null;
  }

  isEmailVerified(cliente: Cliente): boolean {
    return cliente.user.email_is_verified;
  }

  getAccountAge(cliente: Cliente): number {
    const joinDate = new Date(cliente.user.date_joined);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // dias
  }
}

export const clienteApi = new ClienteApiService();