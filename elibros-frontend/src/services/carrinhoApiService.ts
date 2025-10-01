import { elibrosApi } from './api';
import { ItemCarrinho } from '@/types/itemCarrinho';


class CarrinhoApiService {
    async getCarrinho(): Promise<{ results: unknown[] }> {
    return elibrosApi.makeRequest('/carrinhos/');
  }

  async atualizarCarrinho(dados: {
    livro_id?: number;
    item_id?: number;
    quantidade?: number;
    acao: 'adicionar' | 'remover' | 'atualizar' | 'limpar';
  }): Promise<ItemCarrinho> {
    return elibrosApi.makeRequest('/carrinhos/atualizar_carrinho/', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  }
}

export const carrinhoApi = new CarrinhoApiService();