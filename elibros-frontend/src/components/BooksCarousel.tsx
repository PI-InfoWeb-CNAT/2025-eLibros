"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Book } from '../data/books';
import ClientOnly from './ClientOnly';
import 'swiper/css';
import 'swiper/css/navigation';

interface BooksCarouselProps {
  books: Book[];
}

export default function BooksCarousel({ books }: BooksCarouselProps) {
  return (
    <section>
      <h2 className="text-xl font-medium mb-8 text-center">Indicações eLibros</h2>
      
      <ClientOnly fallback={
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD147] mx-auto mb-4"></div>
            <p>Carregando livros...</p>
          </div>
        </div>
      }>
        <div className="swiper-container max-w-6xl mx-auto flex justify-center items-center">
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
                      src={book.image} 
                      alt={book.title}
                      className="w-28 h-40 rounded mx-auto object-cover cursor-pointer"
                      onClick={() => window.location.href = `/livro/${book.id}`}
                    />
                  </figure>
                  <div className="flex flex-col items-center w-full">
                    <h3 
                      className="text-base font-semibold mb-2 px-2 leading-tight h-12 line-clamp-3 cursor-pointer text-center w-full"
                      onClick={() => window.location.href = `/livro/${book.id}`}
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs italic mb-2 pt-4">{book.author}</p>
                    <p className="text-sm mb-4">R$ {book.price}</p>
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
      </ClientOnly>
      
      <p className="text-center mt-12">
        <a 
          href="/acervo" 
          className="text-black underline text-lg"
        >
          Ver mais
        </a>
      </p>
    </section>
  );
}
