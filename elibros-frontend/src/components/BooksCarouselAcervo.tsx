"use client";

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { elibrosApi, Livro } from '../services/api';
import 'swiper/css';
import 'swiper/css/navigation';

interface BooksCarouselAcervoProps {
  title?: string;
}

export default function BooksCarouselAcervo({ title = "Livros" }: BooksCarouselAcervoProps) {
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
        <h2 className="text-xl font-medium mb-8 text-left px-4 md:px-12">{title}</h2>
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
        <h2 className="text-xl font-medium mb-8 text-left px-4 md:px-12">{title}</h2>
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
        <h2 className="text-xl font-medium mb-8 text-left px-4 md:px-12">{title}</h2>
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <p>Nenhum livro encontrado.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-medium mb-8 text-left px-4 md:px-12">{title}</h2>
      
      <div className="w-full">
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
              spaceBetween: 30,
            },
            1000: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 40,
            },
            1400: {
              slidesPerView: 4,
              slidesPerGroup: 4,
              spaceBetween: 50,
            },
            1800: {
              slidesPerView: 5,
              slidesPerGroup: 5,
              spaceBetween: 40,
            },
          }}
          className="relative w-full"
        >
          {books.map((book) => (
            <SwiperSlide key={book.id} className="flex justify-center items-center">
              <div className="flex flex-col justify-center text-center items-center max-w-32">
                <figure className="mb-4">
                  <img 
                    src={book.capa || 'https://placehold.co/300x400/e0e0e0/808080?text=Sem+Imagem'} 
                    alt={book.titulo}
                    className="w-28 h-40 rounded mx-auto object-cover cursor-pointer"
                    onClick={() => window.location.href = `/livro/${book.id}`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/300x400/e0e0e0/808080?text=Sem+Imagem';
                    }}
                  />
                </figure>
                <div className="flex flex-col items-center w-full">
                  <h3 
                    className="text-base font-semibold mb-2 px-2 leading-tight h-12 line-clamp-3 cursor-pointer text-center w-full"
                    onClick={() => window.location.href = `/livro/${book.id}`}
                  >
                    {book.titulo}
                  </h3>
                  <p className="text-xs italic mb-2 pt-4">
                    {Array.isArray(book.autores) ? book.autores.join(', ') : book.autores}
                  </p>
                  <p className="text-sm mb-4">R$ {book.preco}</p>
                  <a 
                    href={`/livro/${book.id}`}
                    className="text-sm text-[#1C1607] bg-[#FFD147] rounded-lg px-5 py-2 hover:bg-[#fac423] transition-colors"
                  >
                    Comprar
                  </a>
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
