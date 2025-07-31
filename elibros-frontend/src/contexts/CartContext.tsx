'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartUtils, CartItem } from '../utils/cart';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (livro: any, quantidade?: number) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantidade: number) => void;
  clearCart: () => void;
  refreshCart: () => void;
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

  const refreshCart = () => {
    const cartItems = cartUtils.getCartItems();
    setItems(cartItems);
    setTotalItems(cartUtils.getTotalItems());
    setTotalPrice(cartUtils.getTotalPrice());
  };

  const addToCart = (livro: any, quantidade: number = 1) => {
    cartUtils.addToCart(livro, quantidade);
    refreshCart();
  };

  const removeFromCart = (itemId: number) => {
    cartUtils.removeFromCart(itemId);
    refreshCart();
  };

  const updateQuantity = (itemId: number, quantidade: number) => {
    cartUtils.updateQuantity(itemId, quantidade);
    refreshCart();
  };

  const clearCart = () => {
    cartUtils.clearCart();
    refreshCart();
  };

  useEffect(() => {
    // Carrega os dados do carrinho ao inicializar
    refreshCart();

    // Escuta eventos de atualização do carrinho
    const handleCartUpdate = () => {
      refreshCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
