"use client";

import { useState, useEffect } from 'react';
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
    <section className="px-6 md:px-24">
      <h2 className="text-2xl font-medium mb-8 text-left">{title}</h2>

      <div className="relative">
      <div className="absolute top-1/2 -translate-y-1/2 left-0 z-10">
        <div className={`swiper-button-prev ${carouselId}-prev !text-[#1C1607] !scale-75`}></div>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-0 z-10">
        <div className={`swiper-button-next ${carouselId}-next !text-[#1C1607] !scale-75`}></div>
      </div>
      
      <div className="px-8 md:px-12">
        <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: `.${carouselId}-next`,
              prevEl: `.${carouselId}-prev`,
            }}
            breakpoints={{
              200: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 2,
                slidesPerGroup: 1,
                spaceBetween: 20,
              },
              900: {
                slidesPerView: 3,
                slidesPerGroup: 1,
                spaceBetween: 20,
              },
              1200: {
                slidesPerView: 4,
                slidesPerGroup: 1,
                spaceBetween: 20,
              },
              1600: {
                slidesPerView: 5,
                slidesPerGroup: 1,
                spaceBetween: 20,
              },
            }}
            className="relative w-full"
          >
            {books.map((book) => (
              <SwiperSlide key={book.id}>
                {/* Layout horizontal - imagem do lado das informações */}
                <div className="p-3 h-52">
                  <div className="flex h-full items-start">
                    {/* Imagem à esquerda */}
                    <a href={`/livro/${book.id}`} className="flex-shrink-0 mr-4">
                      <img 
                        src={book.capa || 'https://placehold.co/300x400/e0e0e0/808080?text=Sem+Imagem'} 
                        alt={book.titulo}
                        className="w-26 h-40 rounded object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/300x400/e0e0e0/808080?text=Sem+Imagem';
                        }}
                      />
                    </a>
                    
                    {/* Informações à direita */}
                    <div className="flex-1 flex flex-col justify-between h-40">
                      <div className="space-y-1">
                        <h3 className="text-base font-semibold leading-tight overflow-hidden h-12" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical' as const,
                        }}>
                          {book.titulo}
                        </h3>
                        <p className="text-sm text-gray-700 h-5 overflow-hidden" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical' as const,
                        }}>
                          {Array.isArray(book.autores) ? book.autores.join(', ') : book.autores}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">
                          R$ {book.preco}
                        </p>
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
