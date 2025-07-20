// Utilitários para gerenciar o carrinho no localStorage

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

export const cartUtils = {
  // Obter itens do carrinho
  getCartItems(): CartItem[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const cartData = localStorage.getItem('elibros_cart');
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error('Erro ao obter itens do carrinho:', error);
      return [];
    }
  },

  // Salvar itens no carrinho
  saveCartItems(items: CartItem[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('elibros_cart', JSON.stringify(items));
      // Disparar evento personalizado para atualizar outros componentes
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Erro ao salvar itens do carrinho:', error);
    }
  },

  // Adicionar item ao carrinho
  addToCart(livro: any, quantidade: number = 1): void {
    const items = this.getCartItems();
    const existingItemIndex = items.findIndex(item => item.livro.id === livro.id);

    if (existingItemIndex >= 0) {
      // Se já existe, atualiza a quantidade
      items[existingItemIndex].quantidade += quantidade;
    } else {
      // Se não existe, adiciona novo item
      const newItem: CartItem = {
        id: Date.now(), // ID temporário
        livro: {
          id: livro.id,
          titulo: livro.titulo,
          capa: livro.capa,
          preco: livro.preco,
          autores: livro.autores,
        },
        quantidade,
      };
      items.push(newItem);
    }

    this.saveCartItems(items);
  },

  // Remover item do carrinho
  removeFromCart(itemId: number): void {
    const items = this.getCartItems();
    const filteredItems = items.filter(item => item.id !== itemId);
    this.saveCartItems(filteredItems);
  },

  // Atualizar quantidade de um item
  updateQuantity(itemId: number, quantidade: number): void {
    const items = this.getCartItems();
    const itemIndex = items.findIndex(item => item.id === itemId);

    if (itemIndex >= 0) {
      if (quantidade <= 0) {
        // Se quantidade é 0 ou negativa, remove o item
        this.removeFromCart(itemId);
      } else {
        items[itemIndex].quantidade = quantidade;
        this.saveCartItems(items);
      }
    }
  },

  // Limpar carrinho
  clearCart(): void {
    this.saveCartItems([]);
  },

  // Obter total de itens
  getTotalItems(): number {
    return this.getCartItems().reduce((total, item) => total + item.quantidade, 0);
  },

  // Obter total do preço
  getTotalPrice(): number {
    return this.getCartItems().reduce((total, item) => {
      const preco = parseFloat(item.livro.preco.replace(',', '.'));
      return total + (preco * item.quantidade);
    }, 0);
  }
};
