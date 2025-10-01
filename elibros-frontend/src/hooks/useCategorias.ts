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
      const data = await categoriaApi.getAll();
      setCategorias(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCategoria = useCallback(async (id: number) => {
    try {
      await categoriaApi.delete(id);
      await fetchCategorias(); // Recarrega a lista após deletar
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao excluir categoria');
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