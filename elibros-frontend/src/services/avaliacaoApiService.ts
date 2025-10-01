import { elibrosApi } from './api';

import { Avaliacao, AvaliacaoCreateRequest } from '@/types/avaliacao';


class AvaliacaoApiService {
    async getAvaliacoesLivro(livroId: number): Promise<Avaliacao[]> {
    return elibrosApi.makeRequest<Avaliacao[]>(`/avaliacoes/livro/${livroId}/`);
  }

  async criarAvaliacao(livroId: number, dados: AvaliacaoCreateRequest): Promise<Avaliacao> {
    return elibrosApi.makeRequest<Avaliacao>(`/avaliacoes/livro/${livroId}/`, {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  }

  async curtirAvaliacao(avaliacaoId: number): Promise<{ detail: string }> {
    return elibrosApi.makeRequest<{ detail: string }>(`/avaliacoes/${avaliacaoId}/curtir/`, {
      method: 'POST',
    });
  }

  async removerCurtidaAvaliacao(avaliacaoId: number): Promise<{ detail: string }> {
    return elibrosApi.makeRequest<{ detail: string }>(`/avaliacoes/${avaliacaoId}/curtir/`, {
      method: 'DELETE',
    });
  }
}

export const avaliacaoApi = new AvaliacaoApiService();