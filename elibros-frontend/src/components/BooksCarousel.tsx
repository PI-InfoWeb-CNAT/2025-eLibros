"use client";

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { elibrosApi, Livro } from '../services/api';
import 'swiper/css';
import 'swiper/css/navigation';

interface BooksCarouselProps {
  title?: string;
}

export default function BooksCarousel({ title = "Indicações eLibros" }: BooksCarouselProps) {
  const [books, setBooks] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ✅ Usando o endpoint correto que retorna todos os livros
        const response = await elibrosApi.getLivros();
        setBooks(response.results);
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
    <section className="px-4 md:px-20">
      <h2 className="text-2xl font-medium mb-8 text-left">{title}</h2>
      
      <div className="swiper-container w-full">
        <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            breakpoints={{
              200: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 20,
              },
              1000: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 20,
              },
              1400: {
                slidesPerView: 4,
                slidesPerGroup: 4,
                spaceBetween: 20,
              },
            }}
            className="relative w-full"
          >
            {books.map((book) => (
              <SwiperSlide key={book.id}>
                <div className="p-2 h-40">
                  <div className="flex h-full">
                    {/* Imagem à esquerda */}
                    <a href={`/livro/${book.id}`} className="flex-shrink-0 mr-4">
                      <img 
                        src={book.capa || 'https://placehold.co/300x400/e0e0e0/808080?text=Sem+Imagem'} 
                        alt={book.titulo}
                        className="w-20 h-32 rounded object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/300x400/e0e0e0/808080?text=Sem+Imagem';
                        }}
                      />
                    </a>
                    
                    {/* Informações à direita */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-base font-semibold leading-tight overflow-hidden" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical' as const,
                        }}>
                          {book.titulo}
                        </h3>
                        <p className="text-sm text-gray-700">
                          {Array.isArray(book.autores) ? book.autores.join(', ') : book.autores}
                        </p>
                        <p className="text-sm font-semibold">
                          R$ {book.preco}
                        </p>
                      </div>
                      
                      <div className="mt-auto pt-2">
                        <a 
                          href={`/livro/${book.id}`}
                          className="inline-block text-sm text-[#1C1607] bg-[#FFD147] rounded-lg px-4 py-2 hover:bg-[#fac423] transition-colors"
                        >
                          Comprar
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            
            {/* Navigation buttons */}
            <div className="swiper-button-prev !text-[#1C1607] !scale-75"></div>
            <div className="swiper-button-next !text-[#1C1607] !scale-75"></div>
          </Swiper>
        </div>
    </section>
  );
}
