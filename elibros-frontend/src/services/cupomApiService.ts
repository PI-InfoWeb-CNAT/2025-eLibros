import { elibrosApi } from './api';

import { Cupom, CupomCreateData, CupomUpdateData, CupomListResponse, CupomStats } from '@/types/cupom';

class CupomApiService {
  private endpoint = '/cupons';

  async list(params?: {
    search?: string;
    ativo?: boolean;
    ordering?: string;
    page?: number;
  }): Promise<CupomListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.search) {
      searchParams.append('search', params.search);
    }
    if (params?.ativo !== undefined) {
      searchParams.append('ativo', params.ativo.toString());
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

    // DEBUG: Ver URL sendo chamada
    console.log('🔗 URL da API cupons:', url);

    return elibrosApi.makeRequest<CupomListResponse>(url);
  }

  async get(id: number): Promise<Cupom> {
    return elibrosApi.makeRequest<Cupom>(`${this.endpoint}/${id}/`);
  }

  async create(data: CupomCreateData): Promise<Cupom> {
    return elibrosApi.makeRequest<Cupom>(`${this.endpoint}/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(id: number, data: CupomUpdateData): Promise<Cupom> {
    return elibrosApi.makeRequest<Cupom>(`${this.endpoint}/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(id: number): Promise<void> {
    return elibrosApi.makeRequest<void>(`${this.endpoint}/${id}/`, {
      method: 'DELETE',
    });
  }

  async toggleStatus(id: number): Promise<Cupom> {
    return elibrosApi.makeRequest<Cupom>(`${this.endpoint}/${id}/toggle_status/`, {
      method: 'PATCH',
    });
  }

  async getStats(): Promise<CupomStats> {
    return elibrosApi.makeRequest<CupomStats>(`${this.endpoint}/estatisticas/`);
  }

  // Métodos auxiliares
  formatTipoValor(tipo: '1' | '2'): string {
    return tipo === '1' ? 'Porcentagem' : 'Valor Fixo';
  }

  formatValor(cupom: Cupom): string {
    if (cupom.tipo_valor === '1') {
      return `${cupom.valor}%`;
    }
    return `R$ ${cupom.valor.toFixed(2)}`;
  }

  formatDescricao(cupom: Cupom): string {
    const valorFormatado = this.formatValor(cupom);
    return `${cupom.codigo} - ${valorFormatado} de desconto`;
  }

  isExpired(cupom: Cupom): boolean {
    return new Date() > new Date(cupom.data_fim);
  }

  isActive(cupom: Cupom): boolean {
    const now = new Date();
    const inicio = new Date(cupom.data_inicio);
    const fim = new Date(cupom.data_fim);
    
    return cupom.ativo && now >= inicio && now <= fim;
  }
}

export const cupomApi = new CupomApiService();