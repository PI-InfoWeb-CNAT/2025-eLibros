"use client";

import { useState, useEffect } from 'react';
import { Header, Footer } from '../../components';
import BooksCarousel from '../../components/BooksCarousel';
import { elibrosApi, Livro } from '../../services/api';

interface Genero {
  id: number;
  nome: string;
}

interface Autor {
  id: number;
  nome: string;
}

export default function AcervoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    sort: '',
    genre: '',
    author: '',
    year: ''
  });
  
  // Estados para dados da API
  const [livros, setLivros] = useState<Livro[]>([]);
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [autores, setAutores] = useState<Autor[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Carregar apenas os filtros iniciais (gêneros e autores)
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const response = await elibrosApi.pesquisarLivros();
        setGeneros(response.generos);
        setAutores(response.autores);
      } catch (error) {
        console.error('Erro ao carregar filtros:', error);
      }
    };
    loadFilterOptions();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await performSearch();
  };

  const performSearch = async () => {
    setLoading(true);
    try {
      const response = await elibrosApi.pesquisarLivros(
        searchTerm || undefined,
        filters.genre || undefined,
        filters.author || undefined,
        filters.year || undefined
      );
      
      let resultados = response.livros;
      
      // Aplicar ordenação local se necessário
      if (filters.sort) {
        switch (filters.sort) {
          case 'asc':
            resultados = resultados.sort((a, b) => a.titulo.localeCompare(b.titulo));
            break;
          case 'desc':
            resultados = resultados.sort((a, b) => b.titulo.localeCompare(a.titulo));
            break;
          case 'mais-vendidos':
            resultados = resultados.sort((a, b) => b.qtd_vendidos - a.qtd_vendidos);
            break;
        }
      }
      
      setLivros(resultados);
      setHasSearched(true);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  // Executar busca quando filtros mudarem (apenas se já pesquisou antes)
  useEffect(() => {
    if (hasSearched) {
      performSearch();
    }
  }, [filters]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      sort: '',
      genre: '',
      author: '',
      year: ''
    });
    setHasSearched(false);
    setLivros([]);
  };

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

              {/* Genre Filter - Dinâmico */}
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="bg-transparent border-none text-base focus:outline-none cursor-pointer"
              >
                <option value="">Gênero</option>
                {generos.map((genero) => (
                  <option key={genero.id} value={genero.nome}>
                    {genero.nome}
                  </option>
                ))}
              </select>

              {/* Author Filter - Dinâmico */}
              <select
                value={filters.author}
                onChange={(e) => handleFilterChange('author', e.target.value)}
                className="bg-transparent border-none text-base focus:outline-none cursor-pointer"
              >
                <option value="">Autor(a)</option>
                {autores.map((autor) => (
                  <option key={autor.id} value={autor.nome}>
                    {autor.nome}
                  </option>
                ))}
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
                <option value="1990">1981-1990</option>
                <option value="2000">1991-2000</option>
                <option value="2010">2001-2010</option>
                <option value="+">&gt; 2010</option>
              </select>

              {/* Clear Filters Button */}
              {hasSearched && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-[#C5A572] transition-colors"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Results Section */}
        {loading && (
          <section className="px-6 md:px-24">
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD147] mx-auto mb-4"></div>
                <p>Carregando livros...</p>
              </div>
            </div>
          </section>
        )}

        {hasSearched && !loading && (
          <section className="px-6 md:px-24 mb-12">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">
                Resultados da pesquisa
                {searchTerm && ` para "${searchTerm}"`}
              </h2>
              <p className="text-gray-600">
                {livros.length} {livros.length === 1 ? 'livro encontrado' : 'livros encontrados'}
              </p>
            </div>

            {livros.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {livros.map((livro) => (
                  <div key={livro.id} className="group">
                    <a href={`/livro/${livro.id}`} className="block">
                      <div className="flex h-48 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4">
                        {/* Imagem do livro */}
                        <div className="flex-shrink-0 mr-4">
                          <img
                            src={livro.capa || 'https://placehold.co/300x400/e0e0e0/808080?text=Sem+Imagem'}
                            alt={livro.titulo}
                            className="w-20 h-32 rounded object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://placehold.co/300x400/e0e0e0/808080?text=Sem+Imagem';
                            }}
                          />
                        </div>
                        
                        {/* Informações do livro */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-sm font-semibold leading-tight mb-1 overflow-hidden h-10" style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical' as const,
                            }}>
                              {livro.titulo}
                            </h3>
                            <p className="text-xs text-gray-600 mb-2">
                              {Array.isArray(livro.autores) ? livro.autores.join(', ') : livro.autores}
                            </p>
                            {livro.generos && livro.generos.length > 0 && (
                              <p className="text-xs text-gray-500 mb-2">
                                {livro.generos.slice(0, 2).join(', ')}
                              </p>
                            )}
                          </div>
                          
                          <div className="mt-auto">
                            <p className="text-lg font-bold text-[#1C1607] mb-2">
                              R$ {livro.preco}
                            </p>
                            <span className="inline-block text-xs text-[#1C1607] bg-[#FFD147] rounded px-3 py-1 group-hover:bg-[#fac423] transition-colors">
                              Ver detalhes
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold mb-4">Nenhum livro encontrado</h3>
                <p className="text-gray-600 mb-6">
                  Tente ajustar os filtros ou fazer uma nova pesquisa.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-[#C5A572] text-white px-6 py-2 rounded-lg hover:bg-[#b8966a] transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </section>
        )}

        {/* Carrosséis - Mostrar apenas quando não há pesquisa ativa */}
        {!hasSearched && !loading && (
          <>
            <BooksCarousel title="Indicações eLibros" showViewMore={false} />
            <div className="mt-16">
              <BooksCarousel title="Lançamentos" showViewMore={false} />
            </div>
            <div className="mt-16">
              <BooksCarousel title="Mais vendidos" showViewMore={false} />
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
