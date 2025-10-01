'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useCartAPI } from '../utils/cartAPI';
import { useAuth } from './AuthContext';
import { Livro } from '@/types/livro';
import { ItemCarrinho } from '@/types/itemCarrinho';

// Alias para melhor clareza
type CartItem = ItemCarrinho;

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (livro: Livro, quantidade?: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantidade: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  isLoading: boolean;
  canUseCart: boolean; // Novo: indica se o usuário pode usar o carrinho
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const { isAuthenticated, isInitialized } = useAuth();
  
  // Criar uma instância estável do cartAPI
  const cartAPI = useCartAPI();

  // Só pode usar carrinho se estiver autenticado
  const canUseCart = isAuthenticated;

  // DEBUG: Adicionar logs detalhados
  useEffect(() => {
    console.log('🛒 CartContext DEBUG:', {
      isAuthenticated,
      isInitialized,
      canUseCart,
      itemsCount: items.length,
      totalItems
    });
  }, [isAuthenticated, isInitialized, canUseCart, items.length, totalItems]);

  // Calcular totais baseado nos itens atuais
  const calculateTotals = (cartItems: CartItem[]) => {
    // Verificar se cartItems existe e é um array
    if (!cartItems || !Array.isArray(cartItems)) {
      setTotalItems(0);
      setTotalPrice(0);
      return;
    }

    const totalItemCount = cartItems.reduce((total, item) => total + item.quantidade, 0);
    const totalPriceCount = cartItems.reduce((total, item) => {
      const preco = parseFloat(item.livro.preco.replace(',', '.'));
      return total + (preco * item.quantidade);
    }, 0);
    
    setTotalItems(totalItemCount);
    setTotalPrice(totalPriceCount);
  };

    // Atualizar carrinho (APENAS SE AUTENTICADO)
  const refreshCart = useCallback(async () => {
    console.log('🔄 refreshCart chamado:', { isInitialized, isAuthenticated });
    
    if (!isInitialized) return;
    
    if (!isAuthenticated) {
      console.log('❌ Usuário não autenticado, limpando carrinho');
      // Limpar dados se não autenticado
      setItems([]);
      setTotalItems(0);
      setTotalPrice(0);
      return;
    }
    
    console.log('✅ Usuário autenticado, buscando carrinho...');
    setIsLoading(true);
    try {
      const cartItems = await cartAPI.fetchCart();
      console.log('📦 Items recebidos da API:', cartItems);
      setItems(cartItems || []); // Garantir que não seja undefined
      calculateTotals(cartItems || []);
    } catch (error) {
      console.error('❌ Erro ao atualizar carrinho:', error);
      
      // Se for erro de token, não limpar carrinho (deixar para AuthContext lidar)
      if (error instanceof Error && error.message.includes('token')) {
        console.log('🔑 Erro de token, AuthContext irá lidar com isso');
        // Não fazer nada, deixar o AuthContext limpar tudo
      } else {
        // Para outros erros, limpar carrinho
        setItems([]);
        setTotalItems(0);
        setTotalPrice(0);
      }
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, isAuthenticated]); // cartAPI removido intencionalmente para evitar loop

  // Adicionar item ao carrinho (APENAS SE AUTENTICADO)
  const addToCart = async (livro: Livro, quantidade: number = 1) => {
    console.log('➕ addToCart chamado:', { isAuthenticated, livro: livro?.titulo, quantidade });
    
    if (!isAuthenticated) {
      console.log('❌ Tentativa de adicionar sem autenticação');
      throw new Error('Faça login para adicionar itens ao carrinho');
    }

    setIsLoading(true);
    try {
      console.log('📡 Enviando para API...');
      await cartAPI.addToCart(livro, quantidade);
      console.log('✅ Item adicionado, atualizando carrinho...');
      await refreshCart();
    } catch (error) {
      console.error('❌ Erro ao adicionar ao carrinho:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Remover item do carrinho (APENAS SE AUTENTICADO)
  const removeFromCart = async (itemId: number) => {
    if (!isAuthenticated) {
      throw new Error('Usuário deve estar logado para remover itens do carrinho');
    }

    setIsLoading(true);
    try {
      await cartAPI.removeFromCart(itemId);
      await refreshCart();
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar quantidade (APENAS SE AUTENTICADO)
  const updateQuantity = async (itemId: number, quantidade: number) => {
    if (!isAuthenticated) {
      throw new Error('Usuário deve estar logado para atualizar o carrinho');
    }

    setIsLoading(true);
    try {
      await cartAPI.updateQuantity(itemId, quantidade);
      await refreshCart();
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Limpar carrinho (APENAS SE AUTENTICADO)
  const clearCart = async () => {
    if (!isAuthenticated) {
      throw new Error('Usuário deve estar logado para limpar o carrinho');
    }

    setIsLoading(true);
    try {
      await cartAPI.clearCart();
      await refreshCart();
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar carrinho quando o usuário fizer login
  useEffect(() => {
    if (!isInitialized) return;

    if (isAuthenticated) {
      refreshCart();
    } else {
      // Se não autenticado, limpar dados do carrinho
      setItems([]);
      setTotalItems(0);
      setTotalPrice(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isInitialized]); // refreshCart removido intencionalmente para evitar loop

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
    isLoading,
    canUseCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
