import { elibrosApi } from './api';
import type { Cliente } from '../types/cliente';

export interface EnderecoEntrega {
  id: number;
  nome?: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado?: string;
  uf?: string;
}

export interface ItemPedido {
  id: number;
  livro: {
    id: number;
    titulo: string;
    preco: number;
    imagem_capa?: string;
  };
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  numero_pedido: string;
  cliente: Cliente;
  endereco_entrega: EnderecoEntrega;
  status: 'pendente' | 'confirmado' | 'preparando' | 'enviado' | 'entregue' | 'cancelado';
  valor_subtotal: number;
  valor_frete: number;
  valor_desconto: number;
  valor_total: number;
  data_pedido: string;
  data_atualizacao: string;
  metodo_pagamento: string;
  observacoes?: string;
  cupom_usado?: {
    id: number;
    codigo: string;
    valor_desconto: number;
  };
  itens: ItemPedido[];
}

export interface PedidoCreateData {
  cliente_id: number;
  endereco_entrega_id: number;
  metodo_pagamento: string;
  observacoes?: string;
  cupom_codigo?: string;
  itens: Array<{
    livro_id: number;
    quantidade: number;
  }>;
}

export interface PedidoUpdateData {
  status?: Pedido['status'];
  observacoes?: string;
  endereco_entrega_id?: number;
}

export interface PedidoListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pedido[];
}

export interface PedidoStats {
  total_pedidos: number;
  pedidos_pendentes: number;
  pedidos_confirmados: number;
  pedidos_preparando: number;
  pedidos_enviados: number;
  pedidos_entregues: number;
  pedidos_cancelados: number;
  valor_total_vendas: number;
}

class PedidoApiService {
  private endpoint = '/pedidos';
  private adminEndpoint = '/admin';

  async list(params?: {
    search?: string;
    status?: string;
    cliente?: string;
    data_inicio?: string;
    data_fim?: string;
    ordering?: string;
    page?: number;
    isAdmin?: boolean;
  }): Promise<PedidoListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.search) {
      searchParams.append('search', params.search);
    }
    if (params?.status) {
      searchParams.append('status', params.status);
    }
    if (params?.cliente) {
      searchParams.append('cliente', params.cliente);
    }
    if (params?.data_inicio) {
      searchParams.append('data_inicio', params.data_inicio);
    }
    if (params?.data_fim) {
      searchParams.append('data_fim', params.data_fim);
    }
    if (params?.ordering) {
      searchParams.append('ordering', params.ordering);
    }
    if (params?.page) {
      searchParams.append('page', params.page.toString());
    }

    // Usar endpoint do admin se for admin
    const baseEndpoint = params?.isAdmin ? `${this.adminEndpoint}/pedidos` : this.endpoint;
    const url = searchParams.toString() 
      ? `${baseEndpoint}/?${searchParams.toString()}`
      : `${baseEndpoint}/`;

    return elibrosApi.makeRequest<PedidoListResponse>(url);
  }

  async get(id: number, isAdmin?: boolean): Promise<Pedido> {
    if (isAdmin) {
      return elibrosApi.makeRequest<Pedido>(`${this.adminEndpoint}/${id}/get_pedido/`);
    }
    return elibrosApi.makeRequest<Pedido>(`${this.endpoint}/${id}/`);
  }

  async create(data: PedidoCreateData): Promise<Pedido> {
    return elibrosApi.makeRequest<Pedido>(`${this.endpoint}/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(id: number, data: PedidoUpdateData, isAdmin?: boolean): Promise<Pedido> {
    if (isAdmin) {
      // Para admin, usar endpoint específico de update (formato correto: /admin/{id}/action/)
      return elibrosApi.makeRequest<Pedido>(`${this.adminEndpoint}/${id}/update_pedido_status/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    }
    return elibrosApi.makeRequest<Pedido>(`${this.endpoint}/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async updateStatus(id: number, status: Pedido['status'], isAdmin?: boolean): Promise<Pedido> {
    // Redirecionar para o método update com apenas o status
    return this.update(id, { status }, isAdmin);
  }

  async cancel(id: number, motivo?: string, isAdmin?: boolean): Promise<Pedido> {
    if (isAdmin) {
      return elibrosApi.makeRequest<Pedido>(`${this.adminEndpoint}/${id}/cancelar_pedido_admin/`, {
        method: 'PATCH',
        body: JSON.stringify({ motivo }),
      });
    }
    return elibrosApi.makeRequest<Pedido>(`${this.endpoint}/${id}/cancelar/`, {
      method: 'PATCH',
      body: JSON.stringify({ motivo }),
    });
  }

  async getStats(isAdmin?: boolean): Promise<PedidoStats> {
    if (isAdmin) {
      return elibrosApi.makeRequest<PedidoStats>(`${this.adminEndpoint}/pedidos_estatisticas/`);
    }
    return elibrosApi.makeRequest<PedidoStats>(`${this.endpoint}/estatisticas/`);
  }

  // Métodos auxiliares
  formatStatus(status: Pedido['status']): string {
    const statusMap = {
      'pendente': 'Pendente',
      'confirmado': 'Confirmado',
      'preparando': 'Preparando',
      'enviado': 'Enviado',
      'entregue': 'Entregue',
      'cancelado': 'Cancelado'
    };
    return statusMap[status] || status;
  }

  getStatusColor(status: Pedido['status']): string {
    const colorMap = {
      'pendente': 'text-yellow-600 bg-yellow-100',
      'confirmado': 'text-blue-600 bg-blue-100',
      'preparando': 'text-purple-600 bg-purple-100',
      'enviado': 'text-orange-600 bg-orange-100',
      'entregue': 'text-green-600 bg-green-100',
      'cancelado': 'text-red-600 bg-red-100'
    };
    return colorMap[status] || 'text-gray-600 bg-gray-100';
  }

  formatValor(valor: number): string {
    return `R$ ${valor.toFixed(2)}`;
  }

  formatData(dataString: string): string {
    return new Date(dataString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDataSimples(dataString: string): string {
    return new Date(dataString).toLocaleDateString('pt-BR');
  }

  canEditStatus(status: Pedido['status']): boolean {
    return !['entregue', 'cancelado'].includes(status);
  }

  canCancel(status: Pedido['status']): boolean {
    return !['entregue', 'cancelado'].includes(status);
  }

  getNextStatuses(currentStatus: Pedido['status']): Pedido['status'][] {
    const statusFlow: Record<Pedido['status'], Pedido['status'][]> = {
      'pendente': ['confirmado', 'cancelado'],
      'confirmado': ['preparando', 'cancelado'],
      'preparando': ['enviado', 'cancelado'],
      'enviado': ['entregue'],
      'entregue': [],
      'cancelado': []
    };
    return statusFlow[currentStatus] || [];
  }
}

export const pedidoApi = new PedidoApiService();