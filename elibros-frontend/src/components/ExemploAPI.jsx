// Componente de exemplo mostrando como usar a API
// src/components/ExemploAPI.jsx
'use client';

import { useState, useEffect } from 'react';
import { useLivros, useLivrosDestaque } from '../hooks/useApi';

export default function ExemploAPI() {
  const { data: livros, loading: loadingLivros, error: errorLivros } = useLivros();
  const { data: livrosDestaque, loading: loadingDestaque, error: errorDestaque } = useLivrosDestaque();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  // Função para pesquisar livros
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bug-free-train-qr595jrgp59fx76g-8000.app.github.dev/api/v1';
      const response = await fetch(`${API_BASE_URL}/livros/?search=${encodeURIComponent(searchTerm)}`);
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Erro na pesquisa:', error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Exemplo de Conexão com API Django</h1>
      
      {/* Seção de Pesquisa */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Pesquisar Livros</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite o título do livro..."
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Pesquisar
          </button>
        </form>
        
        {searchResults && (
          <div className="mt-4">
            <h3 className="text-lg font-medium">Resultados da Pesquisa:</h3>
            <p className="text-gray-600">
              {searchResults.count} livro(s) encontrado(s)
            </p>
          </div>
        )}
      </div>

      {/* Seção de Livros em Destaque */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Livros em Destaque</h2>
        
        {loadingDestaque && <p>Carregando livros em destaque...</p>}
        {errorDestaque && <p className="text-red-500">Erro: {errorDestaque}</p>}
        
        {livrosDestaque && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {livrosDestaque.results?.map((livro) => (
              <div key={livro.id} className="border p-4 rounded-lg shadow">
                <h3 className="font-bold">{livro.titulo}</h3>
                <p className="text-gray-600">Autores: {livro.autores?.join(', ')}</p>
                <p className="text-green-600 font-semibold">R$ {livro.preco}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Seção de Todos os Livros */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Todos os Livros</h2>
        
        {loadingLivros && <p>Carregando livros...</p>}
        {errorLivros && <p className="text-red-500">Erro: {errorLivros}</p>}
        
        {livros && (
          <div>
            <p className="mb-4 text-gray-600">
              Total de {livros.count} livros encontrados
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {livros.results?.slice(0, 6).map((livro) => (
                <div key={livro.id} className="border p-4 rounded-lg shadow">
                  <h3 className="font-bold">{livro.titulo}</h3>
                  <p className="text-gray-600">Autores: {livro.autores?.join(', ')}</p>
                  <p className="text-gray-500">Editora: {livro.editora}</p>
                  <p className="text-green-600 font-semibold">R$ {livro.preco}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status da Conexão */}
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Status da Conexão:</h3>
        <p>URL da API: {process.env.NEXT_PUBLIC_API_URL || 'https://bug-free-train-qr595jrgp59fx76g-8000.app.github.dev/api/v1'}</p>
        <div className="flex gap-4 mt-2">
          <span className={`px-2 py-1 rounded text-sm ${!loadingLivros && !errorLivros ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
            Livros: {loadingLivros ? 'Carregando...' : errorLivros ? 'Erro' : 'Conectado'}
          </span>
          <span className={`px-2 py-1 rounded text-sm ${!loadingDestaque && !errorDestaque ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
            Destaque: {loadingDestaque ? 'Carregando...' : errorDestaque ? 'Erro' : 'Conectado'}
          </span>
        </div>
      </div>
    </div>
  );
}