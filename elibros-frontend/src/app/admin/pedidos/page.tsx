'use client';

import { useState, useMemo } from 'react';
import AdminProtectedRoute from '../../../components/AdminProtectedRoute';
import AdminLayout from '../../../components/AdminLayout';
import { usePedidos } from '../../../hooks/usePedidos';
import { pedidoApi, Pedido } from '../../../services/pedidoApiService';

interface PedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  pedido?: Pedido;
  onSuccess: () => void;
}

function PedidoModal({ isOpen, onClose, pedido, onSuccess }: PedidoModalProps) {
  const [formData, setFormData] = useState({
    status: pedido?.status || 'pendente' as Pedido['status'],
    observacoes: pedido?.observacoes || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pedido) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await pedidoApi.update(pedido.id, formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !pedido) return null;

  const nextStatuses = pedidoApi.getNextStatuses(pedido.status);
  const canEdit = pedidoApi.canEditStatus(pedido.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          Detalhes do Pedido #{pedido.numero_pedido}
        </h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Informações do Pedido */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Cliente</h3>
            <p className="text-sm text-gray-600">{pedido.cliente.nome}</p>
            <p className="text-sm text-gray-600">{pedido.cliente.email}</p>
            {pedido.cliente.telefone && (
              <p className="text-sm text-gray-600">{pedido.cliente.telefone}</p>
            )}
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Valores</h3>
            <p className="text-sm text-gray-600">Subtotal: {pedidoApi.formatValor(pedido.valor_subtotal)}</p>
            <p className="text-sm text-gray-600">Frete: {pedidoApi.formatValor(pedido.valor_frete)}</p>
            {pedido.valor_desconto > 0 && (
              <p className="text-sm text-gray-600">Desconto: -{pedidoApi.formatValor(pedido.valor_desconto)}</p>
            )}
            <p className="text-sm font-medium text-gray-900">Total: {pedidoApi.formatValor(pedido.valor_total)}</p>
          </div>
        </div>

        {/* Endereço de Entrega */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Endereço de Entrega</h3>
          <div className="text-sm text-gray-600">
            <p>{pedido.endereco_entrega.nome}</p>
            <p>{pedido.endereco_entrega.logradouro}, {pedido.endereco_entrega.numero}</p>
            {pedido.endereco_entrega.complemento && (
              <p>{pedido.endereco_entrega.complemento}</p>
            )}
            <p>{pedido.endereco_entrega.bairro}, {pedido.endereco_entrega.cidade} - {pedido.endereco_entrega.estado}</p>
            <p>CEP: {pedido.endereco_entrega.cep}</p>
          </div>
        </div>

        {/* Itens do Pedido */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Itens do Pedido</h3>
          <div className="space-y-2">
            {pedido.itens.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium">{item.livro.titulo}</p>
                  <p className="text-xs text-gray-600">Qtd: {item.quantidade} x {pedidoApi.formatValor(item.preco_unitario)}</p>
                </div>
                <p className="text-sm font-medium">{pedidoApi.formatValor(item.subtotal)}</p>
              </div>
            ))}
          </div>
        </div>

        {canEdit && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status do Pedido
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Pedido['status'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value={pedido.status}>{pedidoApi.formatStatus(pedido.status)}</option>
                {nextStatuses.map(status => (
                  <option key={status} value={status}>{pedidoApi.formatStatus(status)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                rows={3}
                placeholder="Observações sobre o pedido..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isSubmitting}
              >
                Fechar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Atualizando...' : 'Atualizar'}
              </button>
            </div>
          </form>
        )}

        {!canEdit && (
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface CancelConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
  pedidoNumero: string;
}

function CancelConfirmModal({ isOpen, onClose, onConfirm, pedidoNumero }: CancelConfirmModalProps) {
  const [motivo, setMotivo] = useState('');

  const handleConfirm = () => {
    onConfirm(motivo);
    setMotivo('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Cancelar Pedido</h3>
        <p className="text-gray-600 mb-4">
          Tem certeza que deseja cancelar o pedido <strong>#{pedidoNumero}</strong>?
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Motivo do cancelamento (opcional)
          </label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            rows={3}
            placeholder="Descreva o motivo do cancelamento..."
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Cancelar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PedidosAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<string>('-data_pedido');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingPedido, setViewingPedido] = useState<Pedido | undefined>();
  const [cancelModal, setCancelModal] = useState<{ isOpen: boolean; pedido?: Pedido }>({ isOpen: false });

  const { 
    pedidos, 
    loading, 
    error, 
    totalCount,
    refreshPedidos,
    updateStatus,
    cancelPedido
  } = usePedidos({
    search: searchTerm,
    status: filterStatus,
    ordering: sortOrder
  });

  const filteredPedidos = useMemo(() => {
    return pedidos.filter(pedido => {
      const matchesSearch = !searchTerm || 
        pedido.numero_pedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.cliente.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = !filterStatus || pedido.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  }, [pedidos, searchTerm, filterStatus]);

  const handleViewPedido = (pedido: Pedido) => {
    setViewingPedido(pedido);
    setIsModalOpen(true);
  };

  const handleCancelPedido = (pedido: Pedido) => {
    setCancelModal({ isOpen: true, pedido });
  };

  const confirmCancel = async (motivo: string) => {
    if (cancelModal.pedido) {
      const success = await cancelPedido(cancelModal.pedido.id, motivo);
      if (success) {
        setCancelModal({ isOpen: false });
      }
    }
  };

  const handleModalSuccess = () => {
    refreshPedidos();
  };

  const getStatusBadge = (pedido: Pedido) => {
    const colorClass = pedidoApi.getStatusColor(pedido.status);
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>
        {pedidoApi.formatStatus(pedido.status)}
      </span>
    );
  };

  const statusOptions = [
    { value: '', label: 'Status' },
    { value: 'pendente', label: 'Pendente' },
    { value: 'confirmado', label: 'Confirmado' },
    { value: 'preparando', label: 'Preparando' },
    { value: 'caminho', label: 'A caminho' },
    { value: 'entregue', label: 'Entregue' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="max-w-none mx-0 px-20 py-20">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-3xl font-light text-gray-900">Pedidos</h1>
          </div>

          {/* Search and Filters */}
          <div className="mb-12">
            <div className="flex gap-4 items-center">
              {/* Search Bar */}
              <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <img src="/icons/lupa.svg" alt="Pesquisar" className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Pesquise por código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#F4F4F4] rounded-full focus:outline-none placeholder-gray-500"
                />
              </div>

              {/* recentes */}
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-3 py-2 pr-8 bg-transparent text-sm appearance-none focus:outline-none"
                >
                  <option value="-data_pedido">Mais recentes</option>
                  <option value="data_pedido">Mais antigos</option>
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* status */}
              <div className="relative">
                <select
                  value={filterStatus || ''}
                  onChange={(e) => setFilterStatus(e.target.value || undefined)}
                  className="px-3 py-2 pr-8 bg-transparent text-sm appearance-none focus:outline-none"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {}
          {loading && (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando pedidos...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
              <button
                onClick={refreshPedidos}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Pedidos List */}
          {!loading && !error && (
            <div>
              {filteredPedidos.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-600">
                    {searchTerm || filterStatus
                      ? 'Nenhum pedido encontrado com os filtros aplicados.'
                      : 'Nenhum pedido realizado ainda.'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredPedidos.map((pedido) => (
                    <div key={pedido.id} className="flex items-center">
                      <div className="min-w-0 flex-shrink-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">#{pedido.numero_pedido}</h3>
                          {getStatusBadge(pedido)}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Cliente: {pedido.cliente.nome}</p>
                          <p>Valor: {pedidoApi.formatValor(pedido.valor_total)}</p>
                          <p>Data: {pedidoApi.formatData(pedido.data_pedido)}</p>
                          <p>Pagamento: {pedido.metodo_pagamento}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-16">
                        <button
                          onClick={() => handleViewPedido(pedido)}
                          className="px-6 py-2 bg-[#FFCD35] text-black rounded-full hover:bg-[#e6b82f] transition-colors text-sm font-medium"
                        >
                          Ver Detalhes
                        </button>
                        
                        {pedidoApi.canCancel(pedido.status) && (
                          <button
                            onClick={() => handleCancelPedido(pedido)}
                            className="px-6 py-2 bg-[#FF4E4E] text-white rounded-full hover:bg-[#e63946] transition-colors text-sm font-medium"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        <PedidoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          pedido={viewingPedido}
          onSuccess={handleModalSuccess}
        />

        <CancelConfirmModal
          isOpen={cancelModal.isOpen}
          onClose={() => setCancelModal({ isOpen: false })}
          onConfirm={confirmCancel}
          pedidoNumero={cancelModal.pedido?.numero_pedido || ''}
        />
      </AdminLayout>
    </AdminProtectedRoute>
  );
}