import { elibrosApi } from './api';

import { 
  Cliente, 
  ClienteUpdateData, 
  ClienteListResponse, 
  ClienteStats,
} from '@/types/cliente';

// Configuração para URLs de media
const MEDIA_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1').replace('/api/v1', '');

// import { Usuario } from '@/types/usuario';

class ClienteApiService {
  private endpoint = '/cliente';

  // Função auxiliar para construir URL completa da foto
  private buildImageUrl(imagePath: string | null): string | undefined {
    if (!imagePath) return undefined;
    
    // Se já for uma URL completa, retorna como está
    if (imagePath.startsWith('http')) return imagePath;
    
    // Se o path já começa com /media/, usar diretamente
    if (imagePath.startsWith('/media/')) {
      return `${MEDIA_BASE_URL}${imagePath}`;
    }
    
    // Se não tem barra inicial, adicionar /media/
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${MEDIA_BASE_URL}/media/${cleanPath}`;
  }

  // Função auxiliar para mapear dados do backend para a interface Cliente
  private mapClienteData(clienteData: any): Cliente {
    // Debug temporário
    console.log('🐛 Raw foto_de_perfil:', clienteData.foto_de_perfil);
    console.log('🐛 MEDIA_BASE_URL:', MEDIA_BASE_URL);
    console.log('🐛 Built image URL:', this.buildImageUrl(clienteData.foto_de_perfil));
    
    return {
      id: clienteData.id,
      nome: clienteData.nome,
      email: clienteData.email,
      username: clienteData.username,
      cpf: clienteData.cpf,
      telefone: clienteData.telefone,
      data_nascimento: clienteData.data_nascimento,
      genero: clienteData.genero,
      data_cadastro: clienteData.data_cadastro,
      is_active: clienteData.is_active,
      foto_de_perfil: this.buildImageUrl(clienteData.foto_de_perfil),
      endereco: clienteData.endereco,
      // Mantendo compatibilidade com estrutura antiga
      user: {
        id: clienteData.id,
        email: clienteData.email,
        username: clienteData.username,
        nome: clienteData.nome,
        CPF: clienteData.cpf || '',
        telefone: clienteData.telefone || '',
        genero: clienteData.genero as any || 'NI',
        dt_nasc: clienteData.data_nascimento,
        date_joined: clienteData.data_cadastro,
        is_active: clienteData.is_active,
        email_is_verified: true, // Assumindo verificado
        is_staff: false,
        is_superuser: false,
        foto_de_perfil: this.buildImageUrl(clienteData.foto_de_perfil),
      }
    };
  }

  async list(params?: {
    search?: string;
    is_active?: boolean;
    ordering?: string;
    page?: number;
  }): Promise<ClienteListResponse> {
    // Para admin, usar o endpoint administrativo
    const clientesData = await elibrosApi.makeRequest<any[]>('/admin/clientes/');
    
    // Mapear dados para a estrutura esperada pelo frontend
    const clientes: Cliente[] = clientesData.map(clienteData => this.mapClienteData(clienteData));
    
    // Aplicar filtros localmente se necessário
    let filteredClientes = clientes;
    
    if (params?.search) {
      const search = params.search.toLowerCase();
      filteredClientes = filteredClientes.filter(cliente => 
        cliente.nome.toLowerCase().includes(search) ||
        cliente.email.toLowerCase().includes(search) ||
        cliente.username.toLowerCase().includes(search)
      );
    }
    
    if (params?.is_active !== undefined) {
      filteredClientes = filteredClientes.filter(cliente => 
        cliente.is_active === params.is_active
      );
    }
    
    if (params?.ordering) {
      const [field, direction] = params.ordering.startsWith('-') 
        ? [params.ordering.slice(1), 'desc'] 
        : [params.ordering, 'asc'];
      
      filteredClientes.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (field) {
          case 'nome':
            aValue = a.nome;
            bValue = b.nome;
            break;
          case 'email':
            aValue = a.email;
            bValue = b.email;
            break;
          case 'data_cadastro':
            aValue = new Date(a.data_cadastro);
            bValue = new Date(b.data_cadastro);
            break;
          default:
            aValue = a.id;
            bValue = b.id;
        }
        
        if (direction === 'desc') {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        } else {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        }
      });
    }
    
    return {
      count: filteredClientes.length,
      next: null,
      previous: null,
      results: filteredClientes
    };
  }

  async get(id: number): Promise<Cliente> {
    const clienteData = await elibrosApi.makeRequest<any>(`/admin/${id}/get_cliente/`);
    return this.mapClienteData(clienteData);
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
  async update(id: number, data: ClienteUpdateData | FormData): Promise<Cliente> {
    const options: RequestInit = {
      method: 'PUT',
    };

    if (data instanceof FormData) {
      // Se for FormData, não definir Content-Type (deixar o browser definir com boundary)
      options.body = data;
    } else {
      // Se for objeto, usar JSON
      options.body = JSON.stringify(data);
    }

    const clienteData = await elibrosApi.makeRequest<any>(`/admin/${id}/editar_cliente/`, options);
    return this.mapClienteData(clienteData);
  }

  /**
   * Desativa a conta do cliente (soft delete)
   */
  async deactivateAccount(id?: number): Promise<Cliente> {
    if (id) {
      // Para admin, usar endpoint administrativo
      await elibrosApi.makeRequest<{ message: string; is_active: boolean }>(`/admin/${id}/toggle_cliente_status/`, {
        method: 'POST',
      });
      
      // Retornar o cliente atualizado
      return this.get(id);
    } else {
      // Para cliente logado, usar endpoint de perfil
      return elibrosApi.makeRequest<Cliente>(`${this.endpoint}/editar_perfil/`, {
        method: 'PUT',
        body: JSON.stringify({
          user: {
            is_active: false
          }
        }),
      });
    }
  }

  /**
   * Reativa a conta do cliente
   */
  async reactivateAccount(id: number): Promise<Cliente> {
    // Para admin, usar endpoint administrativo
    await elibrosApi.makeRequest<{ message: string; is_active: boolean }>(`/admin/${id}/toggle_cliente_status/`, {
      method: 'POST',
    });
    
    // Retornar o cliente atualizado
    return this.get(id);
  }

  /**
   * Remove permanentemente um cliente (hard delete)
   */
  async delete(id: number): Promise<void> {
    return elibrosApi.makeRequest<void>(`/admin/${id}/delete_cliente/`, {
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