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
  status: 'PRO' | 'CAN' | 'CON' | 'ENV' | 'ENT' | 'pendente' | 'confirmado' | 'enviado' | 'entregue' | 'cancelado';  // Aceita ambos os formatos
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
  status?: Pedido['status'];  // 'PRO' | 'CAN' | 'CON' | 'ENV' | 'ENT'
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
    try {
      if (isAdmin) {
        // Para admin, usar endpoint específico de update
        await elibrosApi.makeRequest<Pedido>(`${this.adminEndpoint}/${id}/update_pedido_status/`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        });
        
        // Buscar o pedido completo após a atualização para garantir dados íntegros
        return await this.get(id, isAdmin);
      } else {
        // Para cliente normal, o endpoint já retorna o pedido completo
        return elibrosApi.makeRequest<Pedido>(`${this.endpoint}/${id}/`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      throw error;
    }
  }

  async updateStatus(id: number, status: Pedido['status'], isAdmin?: boolean): Promise<Pedido> {
    try {
      // Primeiro, atualiza o status
      await this.update(id, { status }, isAdmin);
      
      // Depois, busca o pedido completo para garantir que temos todos os dados
      const pedidoCompleto = await this.get(id, isAdmin);
      return pedidoCompleto;
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      throw error;
    }
  }

  async cancel(id: number, motivo?: string, isAdmin?: boolean): Promise<Pedido> {
    try {
      // Primeiro, cancela o pedido
      if (isAdmin) {
        await elibrosApi.makeRequest<Pedido>(`${this.adminEndpoint}/${id}/cancelar_pedido_admin/`, {
          method: 'PATCH',
          body: JSON.stringify({ motivo }),
        });
      } else {
        await elibrosApi.makeRequest<Pedido>(`${this.endpoint}/${id}/cancelar/`, {
          method: 'PATCH',
          body: JSON.stringify({ motivo }),
        });
      }
      
      // Depois, busca o pedido completo para garantir que temos todos os dados
      const pedidoCompleto = await this.get(id, isAdmin);
      return pedidoCompleto;
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      throw error;
    }
  }

  async getStats(isAdmin?: boolean): Promise<PedidoStats> {
    if (isAdmin) {
      return elibrosApi.makeRequest<PedidoStats>(`${this.adminEndpoint}/pedidos_estatisticas/`);
    }
    return elibrosApi.makeRequest<PedidoStats>(`${this.endpoint}/estatisticas/`);
  }

  // Métodos auxiliares
  formatStatus(status: Pedido['status'] | undefined | null): string {
    if (!status) {
      return 'Status desconhecido';
    }
    
    // DEBUG: Ver que status está chegando da API
    console.log('🔍 Status recebido:', status, 'Tipo:', typeof status);
    
    const statusMap = {
      'PRO': 'Em processamento',
      'CAN': 'Cancelado', 
      'CON': 'Confirmado',
      'ENV': 'Enviado',
      'ENT': 'Entregue',
      // Adicionar possíveis variações que podem vir da API
      'pendente': 'Em processamento',
      'confirmado': 'Confirmado',
      'enviado': 'Enviado',
      'entregue': 'Entregue',
      'cancelado': 'Cancelado'
    } as const;
    
    const resultado = statusMap[status as keyof typeof statusMap] || status;
    console.log('📋 Status formatado:', resultado);
    return resultado;
  }

  getStatusColor(status: Pedido['status']): string {
    const colorMap = {
      // Status do Django (códigos)
      'PRO': 'text-yellow-600 bg-yellow-100',      // Em processamento - amarelo
      'CON': 'text-blue-600 bg-blue-100',          // Confirmado - azul  
      'ENV': 'text-orange-600 bg-orange-100',      // Enviado - laranja
      'ENT': 'text-green-600 bg-green-100',        // Entregue - verde
      'CAN': 'text-red-600 bg-red-100',            // Cancelado - vermelho
      // Possíveis variações da API (por extenso)
      'pendente': 'text-yellow-600 bg-yellow-100',
      'confirmado': 'text-blue-600 bg-blue-100',
      'enviado': 'text-orange-600 bg-orange-100', 
      'entregue': 'text-green-600 bg-green-100',
      'cancelado': 'text-red-600 bg-red-100'
    } as const;
    return colorMap[status as keyof typeof colorMap] || 'text-gray-600 bg-gray-100';
  }

  formatValor(valor: number | undefined | null): string {
    if (valor === null || valor === undefined || isNaN(valor)) {
      return 'R$ 0,00';
    }
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  }

  formatData(dataString: string | undefined | null): string {
    if (!dataString) {
      return 'Data não disponível';
    }
    
    try {
      const date = new Date(dataString);
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
      
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Data inválida';
    }
  }

  formatDataSimples(dataString: string | undefined | null): string {
    if (!dataString) {
      return 'Data não disponível';
    }
    
    try {
      const date = new Date(dataString);
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
      
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return 'Data inválida';
    }
  }

  canEditStatus(status: Pedido['status']): boolean {
    return !['ENT', 'CAN', 'entregue', 'cancelado'].includes(status);  // Não pode editar se Entregue ou Cancelado
  }

  canCancel(status: Pedido['status']): boolean {
    return !['ENT', 'CAN', 'entregue', 'cancelado'].includes(status);  // Não pode cancelar se Entregue ou Cancelado
  }

  getNextStatuses(currentStatus: Pedido['status']): Pedido['status'][] {
    // Normalizar o status atual para os códigos do Django
    const normalizeStatus = (status: string): string => {
      const statusMap: Record<string, string> = {
        'pendente': 'PRO',
        'confirmado': 'CON', 
        'enviado': 'ENV',
        'entregue': 'ENT',
        'cancelado': 'CAN'
      };
      return statusMap[status] || status;
    };

    const normalized = normalizeStatus(currentStatus);
    
    const statusFlow: Record<string, string[]> = {
      'PRO': ['CON', 'CAN'],  // Em processamento -> Confirmado ou Cancelado
      'CON': ['ENV', 'CAN'],  // Confirmado -> Enviado ou Cancelado  
      'ENV': ['ENT'],         // Enviado -> Entregue
      'ENT': [],              // Entregue (final)
      'CAN': []               // Cancelado (final)
    };
    
    return (statusFlow[normalized] || []) as Pedido['status'][];
  }
}

export const pedidoApi = new PedidoApiService();