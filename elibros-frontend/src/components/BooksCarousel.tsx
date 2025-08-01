"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { elibrosApi, Livro } from '../services/api';
import 'swiper/css';
import 'swiper/css/navigation';

interface BooksCarouselProps {
  title?: string;
  showViewMore?: boolean;
}

export default function BooksCarousel({ 
  title = "Indicações eLibros", 
  showViewMore = false
}: BooksCarouselProps) {
  const [books, setBooks] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Criar um ID único para este carrossel
  const carouselId = `carousel-${title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Substitui qualquer caractere que não seja letra ou número por hífen
    .replace(/^-+|-+$/g, '') // Remove hífens do início e fim
    .replace(/--+/g, '-')}`; // Substitui múltiplos hífens por um único hífen

  // Função para embaralhar array (algoritmo Fisher-Yates)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Usando o endpoint correto que retorna todos os livros
        const response = await elibrosApi.getLivros();
        // Embaralhando os livros para mostrar de forma aleatória
        const randomizedBooks = shuffleArray(response.results);
        setBooks(randomizedBooks);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar livros';
        setError(errorMessage);
        console.error('Erro ao buscar livros:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <section>
        <h2 className="text-xl font-medium mb-8 text-center">{title}</h2>
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD147] mx-auto mb-4"></div>
            <p>Carregando livros...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h2 className="text-xl font-medium mb-8 text-center">{title}</h2>
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <p className="text-red-500">Erro ao carregar livros: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section>
        <h2 className="text-xl font-medium mb-8 text-center">{title}</h2>
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <p>Nenhum livro encontrado.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 md:px-24 overflow-hidden">
      <h2 className="text-2xl font-medium mb-8 text-left">{title}</h2>

      <div className="relative max-w-full">
        {/* Setas posicionadas fora do container dos livros */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-2 z-10">
          <div className={`swiper-button-prev ${carouselId}-prev !text-[#1C1607] !scale-75 opacity-80 hover:opacity-100`}></div>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 -right-2 z-10">
          <div className={`swiper-button-next ${carouselId}-next !text-[#1C1607] !scale-75 opacity-80 hover:opacity-100`}></div>
        </div>
        
        {/* Container dos livros com margem para as setas */}
        <div className="mx-6">
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: `.${carouselId}-next`,
              prevEl: `.${carouselId}-prev`,
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 16,
              },
              900: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 16,
              },
              1200: {
                slidesPerView: 4,
                slidesPerGroup: 4,
                spaceBetween: 20,
              },
            }}
            className="relative w-full"
          >
            {books.map((book) => (
              <SwiperSlide key={book.id}>
                {/* Layout horizontal com altura fixa para alinhamento */}
                <div className="p-2 h-64 w-full">
                  <div className="flex h-full items-start">
                    {/* Imagem à esquerda com tamanho fixo */}
                    <a href={`/livro/${book.id}`} className="flex-shrink-0 mr-4">
                      <Image 
                        src={book.capa || 'https://placehold.co/300x400/e0e0e0/808080?text=Sem+Imagem'} 
                        alt={book.titulo}
                        width={128}
                        height={192}
                        className="rounded object-cover"
                        style={{ width: '8rem', height: '12rem' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/300x400/e0e0e0/808080?text=Sem+Imagem';
                        }}
                      />
                    </a>
                    
                    {/* Informações à direita com altura fixa */}
                    <div className="flex-1 flex flex-col justify-between h-48">
                      <div className="space-y-1">
                        {/* Título com altura fixa e limite de caracteres */}
                        <h3 className="text-sm font-semibold leading-tight overflow-hidden h-10" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical' as const,
                        }}>
                          {book.titulo.length > 45 ? `${book.titulo.substring(0, 45)}...` : book.titulo}
                        </h3>
                        {/* Autor com altura fixa e limite de caracteres */}
                        <p className="text-xs text-gray-700 h-4 overflow-hidden" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical' as const,
                        }}>
                          {(() => {
                            const autores = Array.isArray(book.autores) ? book.autores.join(', ') : book.autores;
                            return autores.length > 25 ? `${autores.substring(0, 25)}...` : autores;
                          })()}
                        </p>
                      </div>
                      
                      <div className="space-y-1 mt-auto">
                        <p className="text-sm font-semibold">
                          R$ {book.preco}
                        </p>
                        <a 
                          href={`/livro/${book.id}`}
                          className="inline-block text-xs text-[#1C1607] bg-[#FFD147] rounded px-3 py-1 hover:bg-[#fac423] transition-colors"
                        >
                          Acessar livro
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            
          </Swiper>
        </div>
      </div>
        
        {showViewMore && (
          <p className="text-center mt-12">
            <a 
              href="/acervo" 
              className="text-black underline text-lg hover:text-[#5B4F3D] transition-colors"
            >
              Ver mais
            </a>
          </p>
        )}
    </section>
  );
}
