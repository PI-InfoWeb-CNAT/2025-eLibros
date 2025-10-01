import { useState, useCallback, useEffect } from 'react';
import { categoriaApi } from '@/services/categoriaApiService';
import { Categoria } from '@/types/categoria';

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await categoriaApi.getAll();
      setCategorias(data);
    } catch (err) {
      let errorMessage = 'Erro ao carregar categorias';
      
      if (err instanceof Error) {
        if (err.message.includes('401') || err.message.includes('token')) {
          errorMessage = 'Erro de autenticação. Faça login novamente.';
        } else if (err.message.includes('500')) {
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
        } else if (err.message.includes('conexão') || err.message.includes('fetch')) {
          errorMessage = 'Erro de conexão. Verifique sua internet.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      console.error('Erro ao carregar categorias:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCategoria = useCallback(async (id: number) => {
    try {
      await categoriaApi.delete(id);
      await fetchCategorias(); // Recarrega a lista após deletar
    } catch (err) {
      let errorMessage = 'Erro ao excluir categoria';
      
      if (err instanceof Error) {
        if (err.message.includes('401') || err.message.includes('token')) {
          errorMessage = 'Erro de autenticação. Faça login novamente.';
        } else {
          errorMessage = err.message;
        }
      }
      
      throw new Error(errorMessage);
    }
  }, [fetchCategorias]);

  // Carregar categorias quando o componente montar
  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  return {
    categorias,
    isLoading,
    error,
    refreshCategorias: fetchCategorias,
    deleteCategoria,
  };
}