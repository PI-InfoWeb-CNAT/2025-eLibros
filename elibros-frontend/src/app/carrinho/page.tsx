"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '../../components';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { CartItem } from '../../utils/cartAPI';

export default function CarrinhoPage() {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuth();
  const { 
    items: cartItems, 
    isLoading: loading, 
    updateQuantity, 
    removeFromCart, 
    canUseCart 
  } = useCart();
  
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  // Mostrar loading enquanto não inicializou ou está carregando
  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen bg-[#FFFFF5] font-['Poppins'] text-[#1C1607] flex flex-col">
        <Header />
        <main className="flex-1 px-4 md:px-20 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Carrinho de Compras</h1>
            <div className="space-y-4">
              {/* Skeleton para lista de itens */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
                  <div className="flex space-x-4">
                    <div className="w-16 h-20 bg-gray-300 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    </div>
                    <div className="w-24 h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
              
              {/* Skeleton para resumo */}
              <div className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-300 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Se não pode usar carrinho, mostrar mensagem discreta (sem redirecionar)
  if (!canUseCart) {
    return (
      <div className="min-h-screen bg-[#FFFFF5] font-['Poppins'] text-[#1C1607] flex flex-col">
        <Header />
        <main className="flex-1 px-4 md:px-20 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Carrinho de Compras</h1>
            
            {/* Estado vazio elegante */}
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <div className="max-w-md mx-auto">
                {/* Ícone do carrinho */}
                <div className="w-20 h-20 mx-auto mb-6 text-gray-400">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                    <path d="M9 8V17H11V8H9ZM13 8V17H15V8H13Z"/>
                  </svg>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Seu carrinho está aguardando
                </h3>
                <p className="text-gray-600 mb-6">
                  Faça login para visualizar e gerenciar os itens do seu carrinho de compras.
                </p>
                
                <div className="space-y-3">
                  <Link 
                    href="/login" 
                    className="w-full bg-[#C5A572] text-white px-6 py-3 rounded-lg hover:bg-[#b8966a] transition-colors inline-block font-medium"
                  >
                    Entrar na minha conta
                  </Link>
                  <Link 
                    href="/register" 
                    className="w-full border border-[#C5A572] text-[#C5A572] px-6 py-3 rounded-lg hover:bg-[#C5A572] hover:text-white transition-colors inline-block font-medium"
                  >
                    Criar conta gratuita
                  </Link>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Continue navegando nossa{' '}
                    <Link href="/livros" className="text-[#C5A572] hover:underline">
                      coleção de livros
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatPreco = (preco: string) => {
    const [reais, centavos] = preco.split('.');
    return { reais, centavos: centavos || '00' };
  };

  const handleQuantityChange = async (itemId: number, delta: number) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      const newQuantity = item.quantidade + delta;
      if (newQuantity > 0) {
        try {
          await updateQuantity(itemId, newQuantity);
        } catch (error) {
          console.error('Erro ao atualizar quantidade:', error);
        }
      }
    }
  };

  const handleQuantityInput = async (itemId: number, value: string) => {
    const quantity = parseInt(value, 10);
    if (!isNaN(quantity) && quantity >= 1) {
      try {
        await updateQuantity(itemId, quantity);
      } catch (error) {
        console.error('Erro ao atualizar quantidade:', error);
      }
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId);
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    } catch (error) {
      console.error('Erro ao remover item:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(item => item.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (itemId: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const preco = parseFloat(item.livro.preco.replace(',', '.'));
      return total + (preco * item.quantidade);
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFF5] font-['Poppins'] text-[#1C1607] flex flex-col">
        <Header />
        <main className="flex-1 flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD147] mx-auto mb-4"></div>
            <p>Carregando carrinho...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFF5] font-['Poppins'] text-[#1C1607] flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 md:px-20 py-8">
        <section className="mt-12">
          {cartItems.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-3xl opacity-50 mb-8">Seu carrinho está vazio.</p>
              <Link 
                href="/acervo"
                className="text-lg text-[#1C1607] bg-[#FFD147] rounded-lg px-6 py-3 hover:bg-[#fac423] transition-colors"
              >
                Continuar comprando
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-medium mb-4">Meu Carrinho</h2>
              
              {/* Select All */}
              <div className="flex items-center mb-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border-2 rounded-sm mr-3 flex items-center justify-center ${
                    selectAll ? 'bg-[#FFD147] border-[#FFD147]' : 'border-gray-400'
                  }`}>
                    {selectAll && <div className="w-2 h-2 bg-[#1C1607] rounded-sm"></div>}
                  </div>
                  <span className="text-base">Selecionar tudo</span>
                </label>
              </div>

              {/* Cart Items */}
              <ul className="border-t border-black mt-4">
                {cartItems.map((item) => {
                  const precoFormatado = formatPreco(item.livro.preco);
                  const isSelected = selectedItems.has(item.id);

                  return (
                    <li key={item.id} className="flex items-center gap-8 border-b border-black py-8 relative">
                      {/* Checkbox */}
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectItem(item.id)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center ${
                          isSelected ? 'bg-[#FFD147] border-[#FFD147]' : 'border-gray-400'
                        }`}>
                          {isSelected && <div className="w-2 h-2 bg-[#1C1607] rounded-sm"></div>}
                        </div>
                      </label>

                      {/* Book Image */}
                      <figure className="flex-shrink-0">
                        <img 
                          src={item.livro.capa || 'https://placehold.co/300x400/e0e0e0/808080?text=Sem+Imagem'} 
                          alt={item.livro.titulo}
                          className="w-40 h-auto rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://placehold.co/300x400/e0e0e0/808080?text=Sem+Imagem';
                          }}
                        />
                      </figure>

                      {/* Book Info */}
                      <div className="flex-1 flex flex-col gap-6">
                        <div>
                          <h3 className="text-3xl font-medium pb-2 border-b border-[#D9D9D9] mb-4">
                            <Link 
                              href={`/livro/${item.livro.id}`}
                              className="hover:text-[#5B4F3D] transition-colors"
                            >
                              {item.livro.titulo}
                            </Link>
                          </h3>
                          <p className="text-lg opacity-60">
                            {Array.isArray(item.livro.autores) ? item.livro.autores.join(', ') : item.livro.autores}
                          </p>
                        </div>

                        <p className="text-xl">
                          <span className="text-lg opacity-50 align-top">R$</span>
                          <span className="text-2xl font-medium">
                            {precoFormatado.reais}
                          </span>
                          <span className="text-lg align-top">
                            ,{precoFormatado.centavos}
                          </span>
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <span className="text-base">Qnt:</span>
                          <div className="flex items-center">
                            <button 
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="w-8 h-8 border border-gray-300 rounded-l bg-white hover:bg-gray-100 text-lg"
                              disabled={item.quantidade <= 1}
                            >
                              -
                            </button>
                            <input 
                              type="number" 
                              value={item.quantidade}
                              onChange={(e) => handleQuantityInput(item.id, e.target.value)}
                              className="w-16 h-8 border-t border-b border-gray-300 text-center bg-white"
                              min="1"
                              max="99"
                            />
                            <button 
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="w-8 h-8 border border-gray-300 rounded-r bg-white hover:bg-gray-100 text-lg"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded transition-colors"
                        title="Remover item"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/>
                          <path d="M10 11v6M14 11v6"/>
                        </svg>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <Link
                  href="/acervo"
                  className="px-6 py-3 bg-white border-4 border-[#AFAFAF] rounded text-lg hover:bg-gray-50 transition-colors"
                >
                  Continuar comprando
                </Link>
                <button className="px-6 py-3 bg-[#FFD147] hover:bg-[#fac423] rounded text-lg transition-colors">
                  Finalizar compra
                </button>
              </div>

              {/* Total */}
              <div className="text-right mt-4">
                <p className="text-xl font-medium">
                  Total: R$ {getTotalPrice().toFixed(2).replace('.', ',')}
                </p>
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
