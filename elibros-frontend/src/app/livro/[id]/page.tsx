"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header, Footer, BooksCarousel } from '../../../components';
import { elibrosApi, Livro } from '../../../services/api';
import { cartUtils } from '../../../utils/cart';

export default function LivroPage() {
  const params = useParams();
  const router = useRouter();
  const [livro, setLivro] = useState<Livro | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const livroId = typeof params.id === 'string' ? parseInt(params.id, 10) : null;

  useEffect(() => {
    const fetchLivro = async () => {
      if (!livroId) {
        setError('ID do livro inválido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await elibrosApi.getLivro(livroId);
        setLivro(response);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar livro';
        setError(errorMessage);
        console.error('Erro ao buscar livro:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLivro();
  }, [livroId]);

  const formatPreco = (preco: string) => {
    const [reais, centavos] = preco.split('.');
    return { reais, centavos: centavos || '00' };
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (livro?.quantidade || 99)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (livro) {
      cartUtils.addToCart(livro, quantity);
      alert(`${livro.titulo} adicionado ao carrinho!`);
    }
  };

  const handleBuyNow = () => {
    if (livro) {
      cartUtils.addToCart(livro, quantity);
      router.push('/carrinho');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFF5] font-['Poppins'] text-[#1C1607] flex flex-col">
        <Header />
        <main className="flex-1 flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD147] mx-auto mb-4"></div>
            <p>Carregando livro...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !livro) {
    return (
      <div className="min-h-screen bg-[#FFFFF5] font-['Poppins'] text-[#1C1607] flex flex-col">
        <Header />
        <main className="flex-1 flex justify-center items-center py-20">
          <div className="text-center">
            <p className="text-red-500 mb-4">
              {error || 'Livro não encontrado'}
            </p>
            <button 
              onClick={() => router.back()}
              className="text-sm text-[#1C1607] bg-[#FFD147] rounded-lg px-4 py-2 hover:bg-[#fac423] transition-colors"
            >
              Voltar
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const precoFormatado = formatPreco(livro.preco);

  return (
    <div className="min-h-screen bg-[#FFFFF5] font-['Poppins'] text-[#1C1607] flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 md:px-20 py-8">
        <section className="flex flex-col lg:flex-row gap-8 lg:gap-20 mt-12">
          {/* Imagem do livro */}
          <figure className="flex-shrink-0">
            <img 
              src={livro.capa || 'https://placehold.co/300x400/e0e0e0/808080?text=Sem+Imagem'} 
              alt={livro.titulo}
              className="w-72 h-auto rounded-lg object-cover mx-auto lg:mx-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/300x400/e0e0e0/808080?text=Sem+Imagem';
              }}
            />
          </figure>

          {/* Informações do livro */}
          <div className="flex-1">
            <div className="border-b border-black pb-4 mb-4">
              <h2 className="text-3xl font-medium mb-2">
                {livro.titulo}
                {livro.editora && livro.ano_de_publicacao && (
                  <span className="text-xl opacity-50 font-normal ml-2">
                    {livro.editora} - {livro.ano_de_publicacao}
                  </span>
                )}
              </h2>
              <p className="text-lg opacity-50">
                Escrito por {Array.isArray(livro.autores) ? livro.autores.join(', ') : livro.autores}
              </p>
            </div>

            {/* Descrição */}
            <div className="mb-8">
              <p className="text-base opacity-65 leading-relaxed">
                {livro.sinopse || 'Descrição não disponível.'}
              </p>
            </div>
          </div>

          {/* Seção de compra */}
          <div className="lg:w-80 border-8 border-[#D9D9D9] rounded-lg p-6">
            <div className="py-6 border-t border-b border-[#D9D9D9]">
              {/* Preço */}
              <div className="mb-4">
                <p className="mb-1">
                  <span className="text-xs opacity-50 align-top">R$</span>
                  <span className="text-2xl font-bold">
                    {precoFormatado.reais}
                  </span>
                  <span className="text-xs align-top font-bold">
                    ,{precoFormatado.centavos}
                  </span>
                </p>
              </div>

              {/* Opções de frete */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#5391AB] font-medium">eLibros econômico:</p>
                    <p className="text-xs text-gray-600">Chega entre XX - XX de Mês</p>
                  </div>
                  <span className="bg-[#3B362B] text-white text-xs px-2 py-1 rounded">
                    R$ XX,XX
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#FFB800] font-medium">eLibros Express:</p>
                    <p className="text-xs text-gray-600">Chega entre XX - XX de Mês</p>
                  </div>
                  <span className="bg-[#FFB800] text-white text-xs px-2 py-1 rounded">
                    R$ XX,XX
                  </span>
                </div>
              </div>

              {/* Local de entrega */}
              <div className="mb-4">
                <p className="text-sm flex items-center mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-2">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#5391AB"/>
                  </svg>
                  <a href="#" className="text-[#5391AB] hover:underline text-sm">
                    Entregando em ENDEREÇO. Atualizar local
                  </a>
                </p>
              </div>

              {/* Estoque */}
              <p className="text-sm text-[#3B362B] mb-4">
                Em estoque 
                <span className="text-xs font-light ml-1">
                  {livro.quantidade} restantes
                </span>
              </p>

              {/* Seletor de quantidade e botão adicionar */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex items-center">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="w-8 h-8 border border-gray-300 rounded-l bg-white hover:bg-gray-100 text-lg flex items-center justify-center"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (value >= 1 && value <= livro.quantidade) {
                        setQuantity(value);
                      }
                    }}
                    className="w-16 h-8 border-t border-b border-gray-300 text-center bg-white text-sm"
                    min="1"
                    max={livro.quantidade}
                  />
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    className="w-8 h-8 border border-gray-300 rounded-r bg-white hover:bg-gray-100 text-lg flex items-center justify-center"
                    disabled={quantity >= livro.quantidade}
                  >
                    +
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="bg-[#3B362B] hover:bg-[#2a241f] text-white rounded-lg px-4 py-2 transition-colors font-medium text-sm"
                >
                  Adicionar
                </button>
              </div>

              {/* Botão Comprar Agora */}
              <div className="mb-4">
                <button 
                  onClick={handleBuyNow}
                  className="w-full bg-[#FFD147] hover:bg-[#fac423] text-[#1C1607] rounded-lg px-4 py-3 transition-colors font-medium text-sm"
                >
                  Comprar Agora
                </button>
              </div>

              {/* Campo CEP */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Digite o seu CEP"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD147] focus:border-transparent"
                />
              </div>

              {/* Calcular frete */}
              <button className="w-3/4 mx-auto flex items-center justify-center gap-2 bg-[#3B362B] hover:bg-[#2a241f] text-white rounded-lg px-3 py-2 transition-colors font-medium text-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13"/>
                  <polygon points="16,6 20,6 23,11 23,18 20,18 20,15 16,15"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
                Calcular frete
              </button>
            </div>
          </div>
        </section>

        {/* Carrossel de livros do mesmo gênero */}
        {livro.generos && livro.generos.length > 0 && (
          <section className="mt-16">
            <div className="-mx-4 md:-mx-20">
              <BooksCarousel 
                title={`Outros do gênero ${Array.isArray(livro.generos) ? livro.generos[0] : livro.generos}`} 
              />
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
