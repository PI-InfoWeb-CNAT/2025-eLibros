import { useState, useEffect, useCallback } from 'react';
import { livroApi } from '@/services/';
import { Livro, LivroCreateData, LivroUpdateData } from '@/types';

export interface UseLivrosOptions {
  search?: string;
  ordering?: string;
  autoLoad?: boolean;
}

export function useLivros(options: UseLivrosOptions = {}) {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    search = '',
    ordering = 'titulo',
    autoLoad = true
  } = options;

  const loadLivros = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        search: search || undefined,
        ordering,
        page
      };

      const response = await livroApi.list(params);
      setLivros(response.results);
      setTotalCount(response.count);
      setCurrentPage(page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar livros';
      setError(errorMessage);
      console.error('Erro ao carregar livros:', err);
    } finally {
      setLoading(false);
    }
  }, [search, ordering]);

  const createLivro = async (data: LivroCreateData): Promise<boolean> => {
    try {
      setError(null);
      const novoLivro = await livroApi.create(data);
      setLivros(prev => [novoLivro, ...prev]);
      setTotalCount(prev => prev + 1);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar livro';
      setError(errorMessage);
      console.error('Erro ao criar livro:', err);
      return false;
    }
  };

  const updateLivro = async (id: number, data: LivroUpdateData): Promise<boolean> => {
    try {
      setError(null);
      const livroAtualizado = await livroApi.update(id, data);
      setLivros(prev => prev.map(livro => 
        livro.id === id ? livroAtualizado : livro
      ));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar livro';
      setError(errorMessage);
      console.error('Erro ao atualizar livro:', err);
      return false;
    }
  };

  const deleteLivro = async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await livroApi.delete(id);
      setLivros(prev => prev.filter(livro => livro.id !== id));
      setTotalCount(prev => prev - 1);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir livro';
      setError(errorMessage);
      console.error('Erro ao excluir livro:', err);
      return false;
    }
  };

  const refreshLivros = () => {
    loadLivros(currentPage);
  };

  useEffect(() => {
    if (autoLoad) {
      loadLivros(1);
    }
  }, [loadLivros, autoLoad]);

  return {
    livros,
    loading,
    error,
    totalCount,
    currentPage,
    loadLivros,
    createLivro,
    updateLivro,
    deleteLivro,
    refreshLivros,
    setCurrentPage
  };
}