// Hook para carrinho com API apenas para usuários autenticados
import { useAuth } from '../contexts/AuthContext';
import { elibrosApi } from '../services/api';

export interface CartItem {
  id: number;
  livro: {
    id: number;
    titulo: string;
    capa: string;
    preco: string;
    autores: string[];
  };
  quantidade: number;
}

export interface CarrinhoAPI {
  id: number;
  cliente: number;
  criado_em: string;
  atualizado_em: string;
  itens: CartItem[];
}

export const useCartAPI = () => {
  const { isAuthenticated } = useAuth();

  // Buscar carrinho do usuário autenticado (APENAS SE LOGADO)
  const fetchCart = async (): Promise<CartItem[]> => {
    console.log('🔍 fetchCart - isAuthenticated:', isAuthenticated);
    
    if (!isAuthenticated) {
      throw new Error('Usuário deve estar logado para usar o carrinho');
    }

    try {
      console.log('📡 Fazendo request para getCarrinho...');
      const response = await elibrosApi.getCarrinho();
      console.log('📦 Resposta da API:', response);

      if (response.results && response.results.length > 0) {
        const carrinho = response.results[0] as CarrinhoAPI;
        console.log('✅ Carrinho encontrado:', carrinho);
        console.log('📦 Itens do carrinho:', carrinho.itens);
        
        // Garantir que itens seja sempre um array
        const itens = carrinho.itens || [];
        console.log('✅ Carrinho encontrado com', itens.length, 'itens');
        return itens;
      }

      console.log('ℹ️ Nenhum carrinho encontrado, retornando array vazio');
      return [];
    } catch (error) {
      console.error('❌ Erro ao buscar carrinho:', error);
      throw error;
    }
  };

  // Adicionar item ao carrinho (APENAS SE LOGADO)
  const addToCart = async (livro: CartItem['livro'], quantidade: number = 1): Promise<void> => {
    console.log('➕ cartAPI.addToCart - isAuthenticated:', isAuthenticated);
    console.log('📚 Livro:', { id: livro.id, titulo: livro.titulo });
    console.log('📊 Quantidade:', quantidade);
    
    if (!isAuthenticated) {
      throw new Error('Faça login para adicionar itens ao carrinho');
    }

    try {
      console.log('📡 Enviando para atualizarCarrinho...');
      const result = await elibrosApi.atualizarCarrinho({
        livro_id: livro.id,
        quantidade: quantidade,
        acao: 'adicionar'
      });
      console.log('✅ Resposta do servidor:', result);
    } catch (error) {
      console.error('❌ Erro ao adicionar item ao carrinho:', error);
      throw error;
    }
  };

  // Atualizar quantidade de item no carrinho (APENAS SE LOGADO)
  const updateQuantity = async (itemId: number, quantidade: number): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('Usuário deve estar logado para atualizar o carrinho');
    }

    try {
      if (quantidade <= 0) {
        // Remover item
        await elibrosApi.atualizarCarrinho({
          item_id: itemId,
          acao: 'remover'
        });
      } else {
        // Atualizar quantidade
        await elibrosApi.atualizarCarrinho({
          item_id: itemId,
          quantidade: quantidade,
          acao: 'atualizar'
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar item do carrinho:', error);
      throw error;
    }
  };

  // Remover item do carrinho (APENAS SE LOGADO)
  const removeFromCart = async (itemId: number): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('Usuário deve estar logado para remover itens do carrinho');
    }

    try {
      await elibrosApi.atualizarCarrinho({
        item_id: itemId,
        acao: 'remover'
      });
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
      throw error;
    }
  };

  // Limpar carrinho (APENAS SE LOGADO)
  const clearCart = async (): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('Usuário deve estar logado para limpar o carrinho');
    }

    try {
      await elibrosApi.atualizarCarrinho({
        acao: 'limpar'
      });
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      throw error;
    }
  };

  return {
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
};
