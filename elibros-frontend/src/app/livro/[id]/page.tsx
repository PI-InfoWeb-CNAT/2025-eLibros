"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header, Footer, BooksCarousel } from '../../../components';
import { elibrosApi, Livro, Avaliacao } from '../../../services/api';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function LivroPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { addToCart, canUseCart } = useCart();
  const [livro, setLivro] = useState<Livro | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loadingLivro, setLoadingLivro] = useState(true);
  const [loadingAvaliacoes, setLoadingAvaliacoes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [comentario, setComentario] = useState('');
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const maxCaracteres = 1000;

  const livroId = typeof params.id === 'string' ? parseInt(params.id, 10) : null;

  // Função para carregar avaliações
  const carregarAvaliacoes = async () => {
    if (!livroId) return;
    
    try {
      setLoadingAvaliacoes(true);
      const avaliacoesData = await elibrosApi.getAvaliacoesLivro(livroId);
      setAvaliacoes(avaliacoesData);
    } catch (err) {
      console.error('Erro ao carregar avaliações:', err);
    } finally {
      setLoadingAvaliacoes(false);
    }
  };

  // Função para enviar comentário/avaliação
  const handleEnviarComentario = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Você precisa estar logado para comentar!');
      return;
    }

    if (!comentario.trim()) {
      alert('Digite um comentário!');
      return;
    }

    if (comentario.trim().length < 10) {
      alert('O comentário deve ter pelo menos 10 caracteres!');
      return;
    }

    if (!livroId) return;

    try {
      setEnviandoComentario(true);
      await elibrosApi.criarAvaliacao(livroId, { texto: comentario.trim() });
      setComentario('');
      await carregarAvaliacoes(); // Recarregar avaliações
      alert('Comentário enviado com sucesso!');
    } catch (err: any) {
      console.error('Erro ao enviar comentário:', err);
      const message = err?.message || 'Erro ao enviar comentário';
      alert(message);
    } finally {
      setEnviandoComentario(false);
    }
  };

  // Função para curtir/descurtir avaliação
  const handleCurtirAvaliacao = async (avaliacaoId: number, usuarioCurtiu: boolean) => {
    if (!isAuthenticated) {
      alert('Você precisa estar logado para curtir!');
      return;
    }

    try {
      if (usuarioCurtiu) {
        await elibrosApi.removerCurtidaAvaliacao(avaliacaoId);
      } else {
        await elibrosApi.curtirAvaliacao(avaliacaoId);
      }
      await carregarAvaliacoes(); // Recarregar avaliações
    } catch (err: any) {
      console.error('Erro ao curtir avaliação:', err);
      const message = err?.message || 'Erro ao curtir avaliação';
      alert(message);
    }
  };

  useEffect(() => {
    const fetchLivro = async () => {
      if (!livroId) {
        setError('ID do livro inválido');
        setLoadingLivro(false);
        return;
      }

      try {
        setLoadingLivro(true);
        setError(null);
        
        const response = await elibrosApi.getLivro(livroId);
        setLivro(response);
        
        // Carregar avaliações em paralelo para acelerar
        carregarAvaliacoes();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar livro';
        setError(errorMessage);
        console.error('Erro ao buscar livro:', err);
      } finally {
        setLoadingLivro(false);
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

  const handleAddToCart = async () => {
    if (!canUseCart) {
      alert('Faça login para adicionar itens ao carrinho!');
      router.push('/login');
      return;
    }

    if (livro) {
      try {
        await addToCart(livro, quantity);
        alert(`${livro.titulo} adicionado ao carrinho!`);
      } catch (error) {
        alert('Erro ao adicionar ao carrinho. Tente novamente.');
      }
    }
  };

  const handleBuyNow = async () => {
    if (!canUseCart) {
      alert('Faça login para comprar!');
      router.push('/login');
      return;
    }

    if (livro) {
      try {
        await addToCart(livro, quantity);
        router.push('/carrinho');
      } catch (error) {
        alert('Erro ao adicionar ao carrinho. Tente novamente.');
      }
    }
  };

  if (loadingLivro) {
    return (
      <div className="min-h-screen bg-[#FFFFF5] font-['Poppins'] text-[#1C1607] flex flex-col">
        <Header />
        <main className="flex-1 px-4 md:px-20 py-8">
          <section className="flex flex-col lg:flex-row gap-8 lg:gap-20 mt-12">
            {/* Skeleton da imagem */}
            <div className="flex-shrink-0">
              <div className="w-72 h-96 bg-gray-200 rounded-lg animate-pulse mx-auto lg:mx-0"></div>
            </div>

            {/* Skeleton das informações */}
            <div className="flex-1">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
              </div>
            </div>

            {/* Skeleton da seção de compra */}
            <div className="lg:w-80 border-8 border-[#D9D9D9] rounded-lg p-6">
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-20 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </section>
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
            <BooksCarousel 
              title={`Outros do gênero ${Array.isArray(livro.generos) ? livro.generos[0] : livro.generos}`} 
            />
          </section>
        )}

        {/* Seção de Comentários */}
        <section className='flex justify-start'>
          <div className='flex flex-row mt-16 items-center'>
            <h2 className='mt-8 mr-15 text-2xl font-medium mb-8 text-left'>Comentários</h2>
          </div>
        </section>

        <section className="mt-8">
          <div className="space-y-8">
            {/* Campo de comentário */}
            <div className="bg-white rounded-xl shadow p-6 w-full">
              <form onSubmit={handleEnviarComentario} className="relative">
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value.slice(0, maxCaracteres))}
                  placeholder={isAuthenticated ? "Escreva seu comentário..." : "Faça login para comentar..."}
                  className="w-full h-32 bg-gray-100 rounded-lg p-4 text-gray-700 resize-none outline-none"
                  maxLength={maxCaracteres}
                  disabled={!isAuthenticated || enviandoComentario}
                />
                <button
                  type="submit"
                  className={`absolute bottom-4 right-4 p-1 rounded transition-colors ${
                    !isAuthenticated || comentario.trim().length === 0 || enviandoComentario
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-600 hover:text-[#FFD147] hover:bg-gray-100'
                  }`}
                  disabled={!isAuthenticated || comentario.trim().length === 0 || enviandoComentario}
                  title={enviandoComentario ? "Enviando..." : "Enviar"}
                >
                  {enviandoComentario ? (
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                    </svg>
                  )}
                </button>
              </form>
              <div className="flex justify-between text-gray-400 text-sm mt-1">
                <span>
                  {!isAuthenticated && "Você precisa estar logado para comentar"}
                  {enviandoComentario && "Enviando comentário..."}
                </span>
                <span>{comentario.length}/{maxCaracteres}</span>
              </div>
            </div>

            {/* Loading das avaliações */}
            {loadingAvaliacoes && avaliacoes.length === 0 && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow p-6 flex gap-4 items-start animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 mt-1"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded mb-2 w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded mb-3 w-1/6"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Loading adicional quando já há avaliações */}
            {loadingAvaliacoes && avaliacoes.length > 0 && (
              <div className="text-center py-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FFD147] mx-auto"></div>
              </div>
            )}

            {/* Lista de avaliações */}
            {avaliacoes.length > 0 ? (
              avaliacoes.map((avaliacao) => (
                <div key={avaliacao.id} className="bg-white rounded-xl shadow p-6 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-[#3B362B] flex-shrink-0 mt-1 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {avaliacao.usuario_nome.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-lg mt-2 mb-1 text-[#3B362B]">
                      {avaliacao.usuario_nome}
                    </div>
                    <div className="text-gray-500 text-xs mb-2">
                      {new Date(avaliacao.data_publicacao).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="text-gray-700 text-base leading-relaxed">
                      {avaliacao.texto}
                    </div>
                  </div>
                  <div className="flex items-end h-full justify-end">
                    <button 
                      onClick={() => handleCurtirAvaliacao(avaliacao.id, avaliacao.usuario_curtiu)}
                      className={`flex gap-1 items-center transition-colors ${
                        avaliacao.usuario_curtiu 
                          ? 'text-[#3B362B]' 
                          : 'text-gray-400 hover:text-[#3B362B]'
                      } ${!avaliacao.pode_curtir ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!avaliacao.pode_curtir}
                      title={
                        !isAuthenticated 
                          ? 'Faça login para curtir' 
                          : !avaliacao.pode_curtir 
                            ? 'Você não pode curtir sua própria avaliação'
                            : avaliacao.usuario_curtiu 
                              ? 'Remover curtida' 
                              : 'Curtir'
                      }
                    >
                      <img 
                        src="/icons/Like.svg" 
                        alt="Curtir" 
                        className={`w-5 h-5 ${avaliacao.usuario_curtiu ? 'filter-none' : ''}`} 
                      />
                      <span className="text-sm">{avaliacao.curtidas}</span>
                    </button>
                  </div>
                </div>
              ))
            ) : !loadingAvaliacoes && (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
