'use client';

import { useState, useMemo } from 'react';
import AdminProtectedRoute from '../../../components/AdminProtectedRoute';
import AdminLayout from '../../../components/AdminLayout';
import { usePedidos } from '../../../hooks/usePedidos';
import { pedidoApi, Pedido } from '../../../services/pedidoApiService';

interface PedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  pedido: Pedido | null;
  onSuccess: () => void;
  onUpdateStatus?: (id: number, status: Pedido['status']) => Promise<boolean>;
  mode?: 'view' | 'edit';
}

function PedidoModal({ isOpen, onClose, pedido, onSuccess, onUpdateStatus, mode = 'view' }: PedidoModalProps) {
  const [formData, setFormData] = useState({
    status: pedido?.status || 'pendente' as Pedido['status'],
    observacoes: pedido?.observacoes || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Detectar se a API está usando códigos ou formato por extenso
  const isUsingCodes = pedido?.status && ['PRO', 'CON', 'ENV', 'ENT', 'CAN'].includes(pedido.status);
  
  console.log('🔍 Modal - Status do pedido:', pedido?.status, 'Usando códigos:', isUsingCodes);
  
  // Opções de status baseadas no formato detectado
  const statusOptions = isUsingCodes ? [
    { value: 'PRO', label: 'Em processamento' },
    { value: 'CON', label: 'Confirmado' },
    { value: 'ENV', label: 'Enviado' },
    { value: 'ENT', label: 'Entregue' },
    { value: 'CAN', label: 'Cancelado' }
  ] : [
    { value: 'pendente', label: 'Em processamento' },
    { value: 'confirmado', label: 'Confirmado' },
    { value: 'enviado', label: 'Enviado' },
    { value: 'entregue', label: 'Entregue' },
    { value: 'cancelado', label: 'Cancelado' }
  ];
  
  console.log('📋 Opções de status disponíveis:', statusOptions);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pedido) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Se apenas o status mudou e temos a função de updateStatus, usamos ela
      if (formData.status !== pedido.status && onUpdateStatus) {
        await onUpdateStatus(pedido.id, formData.status);
      } else {
        // Caso contrário, usa a atualização completa
        await pedidoApi.update(pedido.id, formData, true); // true indica que é admin
        onSuccess();
      }
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
  const isEditMode = mode === 'edit' && canEdit;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {isEditMode ? 'Editar' : 'Detalhes do'} Pedido #{pedido.numero_pedido}
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
            <p className="text-sm text-gray-600">{pedido.cliente?.nome || 'Cliente não encontrado'}</p>
            <p className="text-sm text-gray-600">{pedido.cliente?.email || 'E-mail não disponível'}</p>
            {pedido.cliente?.telefone && (
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
            {pedido.itens.map((item, index) => (
              <div key={item.id || `item-${index}`} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium">{item.livro.titulo}</p>
                  <p className="text-xs text-gray-600">Qtd: {item.quantidade} x {pedidoApi.formatValor(item.preco_unitario)}</p>
                </div>
                <p className="text-sm font-medium">{pedidoApi.formatValor(item.subtotal)}</p>
              </div>
            ))}
          </div>
        </div>

        {isEditMode && (
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
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
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

        {!isEditMode && (
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
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewingPedido, setViewingPedido] = useState<Pedido | undefined>();
  const [editingPedido, setEditingPedido] = useState<Pedido | undefined>();
  const [cancelModal, setCancelModal] = useState<{ isOpen: boolean; pedido?: Pedido }>({ isOpen: false });

  // Limpar o "#" do termo de busca antes de enviar para a API
  const apiSearchTerm = searchTerm.replace(/^#/, '');

  const { 
    pedidos, 
    loading, 
    error, 
    totalCount,
    refreshPedidos,
    updateStatus,
    cancelPedido
  } = usePedidos({
    search: apiSearchTerm,
    status: filterStatus,
    ordering: sortOrder,
    isAdmin: true  // Indica que é página de admin
  });

  const filteredPedidos = useMemo(() => {
    // Primeiro filtra por status
    const statusFiltered = pedidos.filter(pedido => {
      return !filterStatus || pedido.status === filterStatus;
    });

    // Se não há termo de busca, apenas ordena por data
    if (!searchTerm) {
      const sorted = [...statusFiltered].sort((a, b) => {
        const dateA = new Date(a.data_pedido).getTime();
        const dateB = new Date(b.data_pedido).getTime();
        
        if (sortOrder === '-data_pedido') {
          return dateB - dateA;
        } else {
          return dateA - dateB;
        }
      });
      return sorted;
    }

    // Aplica busca com diferentes níveis de prioridade
    const searchTermLower = searchTerm.toLowerCase();
    
    // Remove "#" do termo de busca se presente (para busca no número do pedido)
    const cleanSearchTerm = searchTermLower.replace(/^#/, '');
    
    // Para nome e email, usamos o termo original (sem remover #)
    const nameEmailSearchTerm = searchTermLower;
    
    const searchResults = statusFiltered.map(pedido => {
      const numero = pedido.numero_pedido.toLowerCase();
      const nomeCliente = pedido.cliente?.nome?.toLowerCase() || '';
      const emailCliente = pedido.cliente?.email?.toLowerCase() || '';
      
      let priority = 0;
      let matches = false;
      
      // Prioridade 1: Exact match no número do pedido (sem #)
      if (numero === cleanSearchTerm && cleanSearchTerm.length > 0) {
        priority = 1;
        matches = true;
      }
      // Prioridade 2: Exact match em nome ou email (usando termo original)
      else if (nomeCliente === nameEmailSearchTerm || emailCliente === nameEmailSearchTerm) {
        priority = 2;
        matches = true;
      }
      // Prioridade 3: Match string no início do número do pedido
      else if (cleanSearchTerm.length > 0 && numero.startsWith(cleanSearchTerm)) {
        priority = 3;
        matches = true;
      }
      // Prioridade 4: Match string no início do nome
      else if (nomeCliente.startsWith(nameEmailSearchTerm)) {
        priority = 4;
        matches = true;
      }
      // Prioridade 5: Match string no início do email
      else if (emailCliente.startsWith(nameEmailSearchTerm)) {
        priority = 5;
        matches = true;
      }
      // Prioridade 6: Include string no número do pedido
      else if (cleanSearchTerm.length > 0 && numero.includes(cleanSearchTerm)) {
        priority = 6;
        matches = true;
      }
      // Prioridade 7: Include string no nome
      else if (nomeCliente.includes(nameEmailSearchTerm)) {
        priority = 7;
        matches = true;
      }
      // Prioridade 8: Include string no email
      else if (emailCliente.includes(nameEmailSearchTerm)) {
        priority = 8;
        matches = true;
      }
      
      return { pedido, priority, matches };
    })
    .filter(result => result.matches)
    .sort((a, b) => {
      // Primeiro ordena por prioridade (menor = mais relevante)
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      
      // Em caso de empate na prioridade, ordena por data
      const dateA = new Date(a.pedido.data_pedido).getTime();
      const dateB = new Date(b.pedido.data_pedido).getTime();
      
      if (sortOrder === '-data_pedido') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    })
    .map(result => result.pedido);

    console.log('� Busca realizada:', {
      termo: searchTerm,
      termoLimpo: cleanSearchTerm,
      resultados: searchResults.length,
      primeiros3: searchResults.slice(0, 3).map(p => ({
        numero: p.numero_pedido,
        data: p.data_pedido
      }))
    });

    return searchResults;
  }, [pedidos, searchTerm, filterStatus, sortOrder, apiSearchTerm]);

  const handleViewPedido = (pedido: Pedido) => {
    setViewingPedido(pedido);
    setIsViewModalOpen(true);
  };

  const handleEditPedido = (pedido: Pedido) => {
    setEditingPedido(pedido);
    setIsEditModalOpen(true);
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
    // Não precisamos mais do refreshPedidos() porque o updateStatus já atualiza o estado local
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
  };

  const getStatusBadge = (pedido: Pedido) => {
    // DEBUG: Ver status de cada pedido
    console.log('🔍 Status do pedido', pedido.numero_pedido, ':', pedido.status);
    
    const colorClass = pedidoApi.getStatusColor(pedido.status);
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>
        {pedidoApi.formatStatus(pedido.status)}
      </span>
    );
  };

  const statusOptions = [
    { value: '', label: 'Todos os Status' },
    { value: 'pendente', label: 'Em processamento' },
    { value: 'confirmado', label: 'Confirmado' },
    { value: 'enviado', label: 'Enviado' },
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
            {/* Indicador da ordenação atual */}
            <div className="mb-4 text-sm text-gray-600">
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                Ordenação: {sortOrder === '-data_pedido' ? 'Mais recentes' : ' Mais antigos'}
              </span>
            </div>
            
            <div className="flex gap-4 items-center">
              {/* Search Bar */}
              <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <img src="/icons/lupa.svg" alt="Pesquisar" className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Pesquise por número do pedido, nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#F4F4F4] rounded-full focus:outline-none placeholder-gray-500"
                />
              </div>

              {/* recentes */}
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => {
                    console.log('🔄 Alterando ordenação para:', e.target.value);
                    setSortOrder(e.target.value);
                  }}
                  className="px-3 py-2 pr-8 bg-transparent text-sm appearance-none focus:outline-none border border-gray-200 rounded"
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
                  {filteredPedidos.map((pedido, index) => (
                    <div key={pedido.id || `pedido-${index}`} className="flex items-center">
                      <div className="min-w-0 flex-shrink-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">#{pedido.numero_pedido}</h3>
                          {getStatusBadge(pedido)}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Cliente: {pedido.cliente?.nome || 'Cliente não encontrado'}</p>
                          <p>Valor: {pedidoApi.formatValor(pedido.valor_total)}</p>
                          <p>Data: <span className="font-medium">{pedidoApi.formatData(pedido.data_pedido)}</span></p>
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
                        
                        {pedidoApi.canEditStatus(pedido.status) && (
                          <button
                            onClick={() => handleEditPedido(pedido)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            Editar
                          </button>
                        )}
                        
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
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          pedido={viewingPedido || null}
          onSuccess={handleModalSuccess}
          onUpdateStatus={updateStatus}
          mode="view"
        />

        <PedidoModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          pedido={editingPedido || null}
          onSuccess={handleModalSuccess}
          onUpdateStatus={updateStatus}
          mode="edit"
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