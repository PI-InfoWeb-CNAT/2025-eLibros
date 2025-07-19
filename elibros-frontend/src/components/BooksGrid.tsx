"use client";

import { useState, useEffect } from 'react';
import { elibrosApi, Livro } from '../services/api';

interface BooksGridProps {
  title?: string;
  limit?: number;
}

export default function BooksGrid({ title, limit = 8 }: BooksGridProps) {
  const [books, setBooks] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        
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
        {title && <h2 className="text-xl font-medium mb-8 text-left px-4 md:px-12">{title}</h2>}
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
        {title && <h2 className="text-xl font-medium mb-8 text-left px-4 md:px-12">{title}</h2>}
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
        {title && <h2 className="text-xl font-medium mb-8 text-left px-4 md:px-12">{title}</h2>}
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
      {title && <h2 className="text-xl font-medium mb-8 text-left">{title}</h2>}
      
      {/* Grid de livros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.slice(0, limit).map((book) => (
          <div key={book.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            {/* Container do livro - layout horizontal */}
            <div className="flex p-4">
              {/* Imagem do livro */}
              <figure className="flex-shrink-0 mr-4">
                <img 
                  src={book.capa || 'https://placehold.co/300x400/e0e0e0/808080?text=Sem+Imagem'} 
                  alt={book.titulo}
                  className="w-16 h-24 rounded object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/300x400/e0e0e0/808080?text=Sem+Imagem';
                  }}
                />
              </figure>
              
              {/* Informações do livro */}
              <div className="flex-1 flex flex-col justify-between min-h-[96px]">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold leading-tight overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as const,
                  }}>
                    {book.titulo}
                    {book.subtitulo && (
                      <span className="block text-xs font-normal text-gray-600">{book.subtitulo}</span>
                    )}
                  </h3>
                  
                  <p className="text-xs text-gray-600">
                    {Array.isArray(book.autores) ? book.autores.join(', ') : book.autores}
                  </p>
                </div>
                
                <div className="mt-auto">
                  <p className="text-sm font-semibold text-gray-800 mb-2">
                    R$ {book.preco}
                  </p>
                  
                  <a 
                    href={`/livro/${book.id}`}
                    className="inline-block text-xs text-[#1C1607] bg-[#FFD147] rounded-lg px-3 py-1.5 hover:bg-[#fac423] transition-colors font-medium"
                  >
                    Comprar
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
