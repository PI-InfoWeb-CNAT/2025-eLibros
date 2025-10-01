import { useState, useEffect } from 'react';
import { clienteApi } from '@/services/clienteApiService';
import { Cliente, ClienteListResponse } from '@/types/cliente';

interface UseClientesOptions {
  search?: string;
  is_active?: boolean;
  ordering?: string;
  page?: number;
}

export function useClientes(options: UseClientesOptions = {}) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchClientes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await clienteApi.list(options);
      setClientes(response.results || []);
      setTotalCount(response.count || 0);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar clientes');
      setClientes([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshClientes = () => {
    fetchClientes();
  };

  const deleteCliente = async (id: number) => {
    try {
      await clienteApi.delete(id);
      await fetchClientes(); // Recarrega a lista
      return true;
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
      setError(err instanceof Error ? err.message : 'Erro ao excluir cliente');
      return false;
    }
  };

  const deactivateCliente = async (id: number) => {
    try {
      await clienteApi.deactivateAccount(id);
      await fetchClientes(); // Recarrega a lista
      return true;
    } catch (err) {
      console.error('Erro ao desativar cliente:', err);
      setError(err instanceof Error ? err.message : 'Erro ao desativar cliente');
      return false;
    }
  };

  const reactivateCliente = async (id: number) => {
    try {
      await clienteApi.reactivateAccount(id);
      await fetchClientes(); // Recarregar a lista
      return true;
    } catch (err) {
      console.error('Erro ao reativar cliente:', err);
      setError(err instanceof Error ? err.message : 'Erro ao reativar cliente');
      return false;
    }
  };

  const updateCliente = async (id: number, data: any) => {
    try {
      await clienteApi.update(id, data);
      await fetchClientes(); // Recarregar a lista
      return true;
    } catch (err) {
      console.error('Erro ao atualizar cliente:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar cliente');
      return false;
    }
  };

  const getCliente = async (id: number) => {
    try {
      return await clienteApi.get(id);
    } catch (err) {
      console.error('Erro ao buscar cliente:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar cliente');
      return null;
    }
  };

  useEffect(() => {
    fetchClientes();
  }, [options.search, options.is_active, options.ordering, options.page]);

  return {
    clientes,
    isLoading,
    error,
    totalCount,
    refreshClientes,
    deleteCliente,
    deactivateCliente,
    reactivateCliente,
    updateCliente,
    getCliente
  };
}