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
              <p className="mb-2">
                <span className="text-xs opacity-50 align-top">R$</span>
                <span className="text-2xl font-medium">
                  {precoFormatado.reais}
                </span>
                <span className="text-xs align-top">
                  ,{precoFormatado.centavos}
                </span>
              </p>

              {/* Entrega */}
              <p className="text-xs mb-2">
                <span className="text-[#5391AB]">Entrega GRÁTIS:</span> Chega entre XX - XX de Mês
              </p>

              {/* Local */}
              <p className="text-xs mb-2 flex items-center">
                <img src="/icons/local.svg" alt="Local" className="w-4 h-4 mr-2" />
                <a href="#" className="text-[#5391AB] hover:underline">
                  Adicionar local
                </a>
              </p>

              {/* Estoque */}
              <p className="text-base text-[#3B362B] mb-4">
                Em estoque 
                <span className="text-xs font-light ml-1">
                  {livro.quantidade} restante(s)
                </span>
              </p>

              {/* Seletor de quantidade */}
              <div className="flex items-center justify-center w-48 mb-6 mx-auto">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  className="w-8 h-8 border border-gray-300 rounded-l bg-white hover:bg-gray-100 text-lg"
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
                  className="w-16 h-8 border-t border-b border-gray-300 text-center bg-white"
                  min="1"
                  max={livro.quantidade}
                />
                <button 
                  onClick={() => handleQuantityChange(1)}
                  className="w-8 h-8 border border-gray-300 rounded-r bg-white hover:bg-gray-100 text-lg"
                  disabled={quantity >= livro.quantidade}
                >
                  +
                </button>
              </div>

              {/* Botões de ação */}
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleAddToCart}
                  className="w-48 mx-auto flex items-center justify-center gap-2 bg-[#FFD147] hover:bg-[#fac423] text-[#1C1607] rounded-lg px-4 py-3 transition-colors font-medium"
                >
                  <img src="/icons/carrinho.svg" alt="Carrinho" className="w-5 h-5" />
                  Adicionar
                </button>

                <button 
                  onClick={handleBuyNow}
                  className="w-48 mx-auto bg-[#5391AB] hover:bg-[#4a8299] text-white rounded-lg px-4 py-3 transition-colors font-medium"
                >
                  Comprar Agora
                </button>

                <button className="w-48 mx-auto flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-[#1C1607] rounded-lg px-4 py-3 transition-colors">
                  <img src="/icons/caminhao.svg" alt="Frete" className="w-5 h-5" />
                  Calcular Frete
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Carrossel de livros do mesmo gênero */}
        {livro.generos && livro.generos.length > 0 && (
          <section className="mt-16">
            <BooksCarousel 
              title={`Outros do gênero ${Array.isArray(livro.generos) ? livro.generos[0] : livro.generos}`} 
            />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
