import { useState, useEffect, useCallback } from 'react';
import { cupomApi } from '../services/cupomApiService';
import { Cupom, CupomCreateData, CupomUpdateData, CupomStats } from '@/types/cupom';

export interface UseCuponsOptions {
  search?: string;
  ativo?: boolean;
  ordering?: string;
  autoLoad?: boolean;
}

export function useCupons(options: UseCuponsOptions = {}) {
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    search = '',
    ativo,
    ordering = 'codigo',
    autoLoad = true
  } = options;

  const loadCupons = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        search: search || undefined,
        ativo,
        ordering,
        page
      };

      // DEBUG: Ver parâmetros enviados para a API
      console.log('🌐 Enviando parâmetros para API cupons:', params);

      const response = await cupomApi.list(params);
      setCupons(response.results);
      setTotalCount(response.count);
      setCurrentPage(page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar cupons';
      setError(errorMessage);
      console.error('Erro ao carregar cupons:', err);
    } finally {
      setLoading(false);
    }
  }, [search, ativo, ordering]);

  const createCupom = async (data: CupomCreateData): Promise<boolean> => {
    try {
      setError(null);
      const novoCupom = await cupomApi.create(data);
      setCupons(prev => [novoCupom, ...prev]);
      setTotalCount(prev => prev + 1);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar cupom';
      setError(errorMessage);
      console.error('Erro ao criar cupom:', err);
      return false;
    }
  };

  const updateCupom = async (id: number, data: CupomUpdateData): Promise<boolean> => {
    try {
      setError(null);
      const cupomAtualizado = await cupomApi.update(id, data);
      setCupons(prev => prev.map(cupom => 
        cupom.id === id ? cupomAtualizado : cupom
      ));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar cupom';
      setError(errorMessage);
      console.error('Erro ao atualizar cupom:', err);
      return false;
    }
  };

  const deleteCupom = async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await cupomApi.delete(id);
      setCupons(prev => prev.filter(cupom => cupom.id !== id));
      setTotalCount(prev => prev - 1);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir cupom';
      setError(errorMessage);
      console.error('Erro ao excluir cupom:', err);
      return false;
    }
  };

  const toggleStatus = async (id: number): Promise<boolean> => {
    try {
      setError(null);
      const cupomAtualizado = await cupomApi.toggleStatus(id);
      setCupons(prev => prev.map(cupom => 
        cupom.id === id ? cupomAtualizado : cupom
      ));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao alterar status do cupom';
      setError(errorMessage);
      console.error('Erro ao alterar status do cupom:', err);
      return false;
    }
  };

  const refreshCupons = () => {
    loadCupons(currentPage);
  };

  useEffect(() => {
    if (autoLoad) {
      loadCupons(1);
    }
  }, [loadCupons, autoLoad]);

  return {
    cupons,
    loading,
    error,
    totalCount,
    currentPage,
    loadCupons,
    createCupom,
    updateCupom,
    deleteCupom,
    toggleStatus,
    refreshCupons,
    setCurrentPage
  };
}

export function useCupomStats() {
  const [stats, setStats] = useState<CupomStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cupomApi.getStats();
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar estatísticas';
      setError(errorMessage);
      console.error('Erro ao carregar estatísticas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    refreshStats: loadStats
  };
}