import { useState, useEffect } from 'react';
import { generoApi } from '@/services/generoApiService';
import { GeneroLiterario } from '@/types/generoLiterario';

interface UseGenerosOptions {
  search?: string;
  ordering?: string;
}

export function useGeneros(options: UseGenerosOptions = {}) {
  const [generos, setGeneros] = useState<GeneroLiterario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGeneros = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (options.search || options.ordering) {
        const response = await generoApi.search(options);
        setGeneros(response.results || []);
      } else {
        const data = await generoApi.list();
        setGeneros(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Erro ao carregar gêneros:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar gêneros');
      setGeneros([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshGeneros = () => {
    fetchGeneros();
  };

  const deleteGenero = async (id: number) => {
    try {
      await generoApi.delete(id);
      await fetchGeneros(); // Recarrega a lista
      return true;
    } catch (err) {
      console.error('Erro ao excluir gênero:', err);
      setError(err instanceof Error ? err.message : 'Erro ao excluir gênero');
      return false;
    }
  };

  useEffect(() => {
    fetchGeneros();
  }, [options.search, options.ordering]);

  return {
    generos,
    isLoading,
    error,
    refreshGeneros,
    deleteGenero
  };
}