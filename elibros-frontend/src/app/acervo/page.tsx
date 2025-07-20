"use client";

import { useState } from 'react';
import { Header, Footer, BooksCarousel } from '../../components';

export default function AcervoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    sort: '',
    genre: '',
    author: '',
    year: ''
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar busca
    console.log('Searching for:', searchTerm, 'with filters:', filters);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Lista de títulos para os diferentes carrosséis
  const carouselTitles = [
    'De tirar o fôlego',
    'LGBTQIA+',
    'Edições Especiais',
    'Do velho testamento',
    'Romance',
    'Suspense',
    'Ficção',
    'Mais Vendidos',
    'Lançamentos',
    'Clássicos Brasileiros',
    'Literatura Contemporânea',
    'Grandes Autores'
  ];

  return (
    <div className="min-h-screen bg-[#FFFFF5] font-['Poppins'] text-[#1C1607] flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        {/* Search Section */}
        <section className="mb-12 px-4 md:px-20">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-8 font-['Poppins']">
            {/* Search Bar */}
            <div className="flex items-center gap-3 bg-[#F4F4F4] px-4 py-2 rounded-full flex-grow max-w-2xl">
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-400 flex-shrink-0"
              >
                <path 
                  d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="search"
                name="pesquisa"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar por nome/autor..."
                className="w-full bg-transparent py-2 text-base focus:outline-none"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Sort Filter */}
              <div className="flex items-center gap-2">
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="text-gray-500"
                >
                  <path 
                    d="M3 4.5H21V6H3V4.5Z" 
                    fill="currentColor"
                  />
                  <path 
                    d="M3 11.25H15V12.75H3V11.25Z" 
                    fill="currentColor"
                  />
                  <path 
                    d="M3 18H9V19.5H3V18Z" 
                    fill="currentColor"
                  />
                </svg>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="bg-transparent border-none text-base focus:outline-none cursor-pointer"
                >
                  <option value="">Ordenar</option>
                  <option value="asc">A-Z</option>
                  <option value="desc">Z-A</option>
                  <option value="mais-vendidos">Mais vendidos</option>
                </select>
              </div>

              {/* Genre Filter */}
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="bg-transparent border-none text-base focus:outline-none cursor-pointer"
              >
                <option value="">Gênero</option>
                <option value="Romance">Romance</option>
                <option value="Suspense">Suspense</option>
                <option value="Ficção">Ficção</option>
                <option value="Drama">Drama</option>
              </select>

              {/* Author Filter */}
              <select
                value={filters.author}
                onChange={(e) => handleFilterChange('author', e.target.value)}
                className="bg-transparent border-none text-base focus:outline-none cursor-pointer"
              >
                <option value="">Autor(a)</option>
                <option value="Machado de Assis">Machado de Assis</option>
                <option value="Clarice Lispector">Clarice Lispector</option>
                <option value="Graciliano Ramos">Graciliano Ramos</option>
              </select>

              {/* Year Filter */}
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="bg-transparent border-none text-base focus:outline-none cursor-pointer"
              >
                <option value="">Ano de publicação</option>
                <option value="1960">&lt;= 1960</option>
                <option value="1970">1961-1970</option>
                <option value="1980">1971-1980</option>
                <option value="2000">1991-2000</option>
                <option value="2010">2001-2010</option>
                <option value="+">&gt; 2010</option>
              </select>
            </div>
          </form>
        </section>

        {/* Books Section */}
        <section className="space-y-16">
          {carouselTitles.map((title, index) => (
            <div key={index} className="w-full">
              <BooksCarousel title={title} />
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
