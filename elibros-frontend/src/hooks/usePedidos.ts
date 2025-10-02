import { useState, useEffect, useCallback } from 'react';
import { pedidoApi, Pedido, PedidoCreateData, PedidoUpdateData, PedidoStats } from '../services/pedidoApiService';

export interface UsePedidosOptions {
  search?: string;
  status?: string;
  cliente?: string;
  data_inicio?: string;
  data_fim?: string;
  ordering?: string;
  autoLoad?: boolean;
  isAdmin?: boolean;
}

export function usePedidos(options: UsePedidosOptions = {}) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    search = '',
    status,
    cliente,
    data_inicio,
    data_fim,
    ordering = '-data_pedido',
    autoLoad = true,
    isAdmin = false
  } = options;

  const loadPedidos = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        search: search || undefined,
        status,
        cliente,
        data_inicio,
        data_fim,
        ordering,
        page,
        isAdmin
      };

      console.log('🔄 Carregando pedidos com parâmetros:', params);
      console.log('📅 Ordenação solicitada:', ordering);

      const response = await pedidoApi.list(params);
      
      console.log('✅ Pedidos recebidos da API:', response.results.length);
      console.log('📊 Primeiros 3 pedidos (para verificar ordem):', 
        response.results.slice(0, 3).map(p => ({
          id: p.id, 
          numero: p.numero_pedido, 
          data: p.data_pedido
        }))
      );
      
      setPedidos(response.results);
      setTotalCount(response.count);
      setCurrentPage(page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar pedidos';
      setError(errorMessage);
      console.error('Erro ao carregar pedidos:', err);
    } finally {
      setLoading(false);
    }
  }, [search, status, cliente, data_inicio, data_fim, ordering, isAdmin]);

  const createPedido = async (data: PedidoCreateData): Promise<boolean> => {
    try {
      setError(null);
      const novoPedido = await pedidoApi.create(data);
      setPedidos(prev => [novoPedido, ...prev]);
      setTotalCount(prev => prev + 1);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar pedido';
      setError(errorMessage);
      console.error('Erro ao criar pedido:', err);
      return false;
    }
  };

  const updatePedido = async (id: number, data: PedidoUpdateData): Promise<boolean> => {
    try {
      setError(null);
      const pedidoAtualizado = await pedidoApi.update(id, data);
      setPedidos(prev => prev.map(pedido => 
        pedido.id === id ? pedidoAtualizado : pedido
      ));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar pedido';
      setError(errorMessage);
      console.error('Erro ao atualizar pedido:', err);
      return false;
    }
  };

  const updateStatus = async (id: number, status: Pedido['status']): Promise<boolean> => {
    try {
      setError(null);
      console.log('🔄 Atualizando status do pedido:', { id, status, isAdmin });
      
      const pedidoAtualizado = await pedidoApi.updateStatus(id, status, isAdmin);
      console.log('✅ Pedido atualizado recebido da API:', pedidoAtualizado);
      
      // Verificar se os dados estão completos
      if (!pedidoAtualizado.cliente) {
        console.warn('⚠️ ATENÇÃO: Pedido retornado sem dados do cliente!');
      }
      if (!pedidoAtualizado.valor_total) {
        console.warn('⚠️ ATENÇÃO: Pedido retornado sem valor total!');
      }
      
      setPedidos(prev => prev.map(pedido => {
        if (pedido.id === id) {
          console.log('🔄 Substituindo pedido no estado:', { antigo: pedido, novo: pedidoAtualizado });
          return pedidoAtualizado;
        }
        return pedido;
      }));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status do pedido';
      setError(errorMessage);
      console.error('❌ Erro ao atualizar status do pedido:', err);
      return false;
    }
  };

  const cancelPedido = async (id: number, motivo?: string): Promise<boolean> => {
    try {
      setError(null);
      const pedidoCancelado = await pedidoApi.cancel(id, motivo, isAdmin);
      setPedidos(prev => prev.map(pedido => 
        pedido.id === id ? pedidoCancelado : pedido
      ));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cancelar pedido';
      setError(errorMessage);
      console.error('Erro ao cancelar pedido:', err);
      return false;
    }
  };

  const refreshPedidos = () => {
    loadPedidos(currentPage);
  };

  const getPedidoById = useCallback(async (id: number): Promise<Pedido | null> => {
    try {
      setError(null);
      return await pedidoApi.get(id, isAdmin);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar pedido';
      setError(errorMessage);
      console.error('Erro ao buscar pedido:', err);
      return null;
    }
  }, [isAdmin]);

  useEffect(() => {
    if (autoLoad) {
      loadPedidos(1);
    }
  }, [loadPedidos, autoLoad]);

  return {
    pedidos,
    loading,
    error,
    totalCount,
    currentPage,
    loadPedidos,
    createPedido,
    updatePedido,
    updateStatus,
    cancelPedido,
    refreshPedidos,
    getPedidoById,
    setCurrentPage
  };
}

export function usePedidoStats() {
  const [stats, setStats] = useState<PedidoStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pedidoApi.getStats();
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

export function usePedidoDetail(id: number) {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPedido = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await pedidoApi.get(id);
      setPedido(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar pedido';
      setError(errorMessage);
      console.error('Erro ao carregar pedido:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const updatePedidoStatus = async (status: Pedido['status']): Promise<boolean> => {
    if (!pedido) return false;

    try {
      setError(null);
      const pedidoAtualizado = await pedidoApi.updateStatus(pedido.id, status);
      setPedido(pedidoAtualizado);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status';
      setError(errorMessage);
      console.error('Erro ao atualizar status:', err);
      return false;
    }
  };

  const cancelarPedido = async (motivo?: string): Promise<boolean> => {
    if (!pedido) return false;

    try {
      setError(null);
      const pedidoCancelado = await pedidoApi.cancel(pedido.id, motivo);
      setPedido(pedidoCancelado);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cancelar pedido';
      setError(errorMessage);
      console.error('Erro ao cancelar pedido:', err);
      return false;
    }
  };

  useEffect(() => {
    loadPedido();
  }, [loadPedido]);

  return {
    pedido,
    loading,
    error,
    refreshPedido: loadPedido,
    updateStatus: updatePedidoStatus,
    cancelar: cancelarPedido
  };
}