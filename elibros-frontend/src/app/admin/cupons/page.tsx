'use client';

import { useState, useMemo, useEffect } from 'react';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import { useCupons } from '@/hooks/useCupons';
import { cupomApi } from '@/services/cupomApiService';
import { Cupom } from '@/types/cupom';

interface CupomModalProps {
  isOpen: boolean;
  onClose: () => void;
  cupom?: Cupom;
  onSuccess: () => void;
}

function CupomModal({ isOpen, onClose, cupom, onSuccess }: CupomModalProps) {
  const [formData, setFormData] = useState({
    codigo: '',
    valor: 0,
    tipo_valor: '1' as '1' | '2',
    ativo: true,
    data_inicio: '',
    data_fim: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useEffect para atualizar formData quando cupom mudar
  useEffect(() => {
    console.log('🔍 CupomModal - Cupom recebido:', cupom);
    
    if (cupom) {
      const newFormData = {
        codigo: cupom.codigo || '',
        valor: cupom.valor || 0,
        tipo_valor: cupom.tipo_valor || '1',
        ativo: cupom.ativo ?? true,
        data_inicio: cupom.data_inicio ? cupom.data_inicio.split('T')[0] : '',
        data_fim: cupom.data_fim ? cupom.data_fim.split('T')[0] : '',
      };
      
      console.log('📝 Atualizando formData com:', newFormData);
      setFormData(newFormData);
    } else {
      // Se não há cupom (novo cupom), reseta o formulário
      console.log('🆕 Resetando formulário para novo cupom');
      setFormData({
        codigo: '',
        valor: 0,
        tipo_valor: '1',
        ativo: true,
        data_inicio: '',
        data_fim: '',
      });
    }
  }, [cupom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Converter datas para formato ISO
      const data = {
        ...formData,
        data_inicio: new Date(formData.data_inicio + 'T00:00:00').toISOString(),
        data_fim: new Date(formData.data_fim + 'T23:59:59').toISOString(),
      };

      if (cupom) {
        await cupomApi.update(cupom.id, data);
      } else {
        await cupomApi.create(data);
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar cupom');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {cupom ? 'Editar Cupom' : 'Adicionar Cupom'}
        </h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código do Cupom
            </label>
            <input
              type="text"
              value={formData.codigo}
              onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
              placeholder="Ex: DESCONTO10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Desconto
            </label>
            <select
              value={formData.tipo_valor}
              onChange={(e) => setFormData({ ...formData, tipo_valor: e.target.value as '1' | '2' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="1">Porcentagem (%)</option>
              <option value="2">Valor Fixo (R$)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor do Desconto
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step={formData.tipo_valor === '2' ? '0.01' : '1'}
                max={formData.tipo_valor === '1' ? '100' : undefined}
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
              <span className="absolute right-3 top-2 text-gray-500">
                {formData.tipo_valor === '1' ? '%' : 'R$'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Início
              </label>
              <input
                type="date"
                value={formData.data_inicio}
                onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Fim
              </label>
              <input
                type="date"
                value={formData.data_fim}
                onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="ativo"
              checked={formData.ativo}
              onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
              className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
            />
            <label htmlFor="ativo" className="ml-2 text-sm font-medium text-gray-700">
              Cupom ativo
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : (cupom ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cupomCodigo: string;
}

function DeleteConfirmModal({ isOpen, onClose, onConfirm, cupomCodigo }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">Excluir Cupom</h3>
        <p className="text-gray-600 mb-6">
          Tem certeza que deseja excluir o cupom <strong>{cupomCodigo}</strong>?
          Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CuponsAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAtivo, setFilterAtivo] = useState<boolean | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'codigo' | '-codigo'>('codigo');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCupom, setEditingCupom] = useState<Cupom | undefined>();
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; cupom?: Cupom }>({ isOpen: false });

  // DEBUG: Ver os parâmetros sendo passados para o hook
  console.log('🔍 Parâmetros do filtro:', {
    search: searchTerm,
    ativo: filterAtivo,
    ordering: sortOrder
  });

  const { 
    cupons, 
    loading, 
    error, 
    totalCount,
    refreshCupons,
    deleteCupom
  } = useCupons({
    search: searchTerm,
    ativo: filterAtivo,
    ordering: sortOrder
  });

  const filteredCupons = useMemo(() => {
    // DEBUG: Ver cupons recebidos da API
    console.log('📦 Cupons recebidos da API:', cupons.length);
    console.log('📋 Status dos cupons:', cupons.map(c => ({ codigo: c.codigo, ativo: c.ativo })));
    
    // O filtro de status já é aplicado no hook useCupons através do parâmetro 'ativo'
    // Aqui só precisamos aplicar a lógica de busca e ordenação
    
    if (!searchTerm.trim()) {
      // Sem pesquisa, aplica apenas a ordenação alfabética
      return cupons.sort((a, b) => {
        if (sortOrder === 'codigo') {
          return a.codigo.localeCompare(b.codigo);
        } else {
          return b.codigo.localeCompare(a.codigo);
        }
      });
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    const exactMatches: Cupom[] = [];
    const startsWithMatches: Cupom[] = [];
    const includesMatches: Cupom[] = [];
    
    cupons.forEach(cupom => {
      const cupomCodigo = cupom.codigo.toLowerCase();
      
      if (cupomCodigo === searchTermLower) {
        // Correspondência exata completa (maior prioridade)
        exactMatches.push(cupom);
      } else if (cupomCodigo.startsWith(searchTermLower)) {
        // Correspondência no início (alta prioridade)
        startsWithMatches.push(cupom);
      } else if (cupomCodigo.includes(searchTermLower)) {
        // Correspondência parcial (baixa prioridade)
        includesMatches.push(cupom);
      }
    });
    
    // Ordenar alfabeticamente dentro de cada grupo
    const sortFunction = (a: Cupom, b: Cupom) => {
      if (sortOrder === 'codigo') {
        return a.codigo.localeCompare(b.codigo);
      } else {
        return b.codigo.localeCompare(a.codigo);
      }
    };
    
    exactMatches.sort(sortFunction);
    startsWithMatches.sort(sortFunction);
    includesMatches.sort(sortFunction);
    
    // Retorna na ordem: exato → começa com → contém
    return [...exactMatches, ...startsWithMatches, ...includesMatches];
  }, [cupons, searchTerm, sortOrder]);

  const handleAddCupom = () => {
    setEditingCupom(undefined);
    setIsModalOpen(true);
  };

  const handleEditCupom = (cupom: Cupom) => {
    console.log('✏️ Editando cupom:', cupom);
    setEditingCupom(cupom);
    setIsModalOpen(true);
  };

  const handleDeleteCupom = (cupom: Cupom) => {
    setDeleteModal({ isOpen: true, cupom });
  };

  const confirmDelete = async () => {
    if (deleteModal.cupom) {
      const success = await deleteCupom(deleteModal.cupom.id);
      if (success) {
        setDeleteModal({ isOpen: false });
      }
    }
  };

  const handleModalSuccess = () => {
    refreshCupons();
    setEditingCupom(undefined); // Limpa o cupom em edição
  };

  const formatData = (dataString: string) => {
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (cupom: Cupom) => {
    const isExpired = cupomApi.isExpired(cupom);
    const isActiveNow = cupomApi.isActive(cupom);
    
    if (!cupom.ativo) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Inativo</span>;
    }
    if (isExpired) {
      return <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">Expirado</span>;
    }
    if (isActiveNow) {
      return <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">Ativo</span>;
    }
    return <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs">Agendado</span>;
  };

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="max-w-none mx-0 px-20 py-20">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-3xl font-light text-gray-900">Cupons</h1>
            <button
              onClick={handleAddCupom}
              className="bg-[#876950] text-white px-6 py-2 rounded-full hover:bg-[#6d5440] transition-colors"
            >
              + Adicionar cupons
            </button>
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
                  placeholder="Pesquise por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#F4F4F4] rounded-full focus:outline-none placeholder-gray-500"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={filterAtivo === undefined ? 'all' : filterAtivo ? 'true' : 'false'}
                  onChange={(e) => {
                    const value = e.target.value;
                    console.log('🔍 Valor selecionado no filtro:', value);
                    
                    if (value === 'all') {
                      setFilterAtivo(undefined);
                    } else if (value === 'true') {
                      setFilterAtivo(true);
                    } else if (value === 'false') {
                      setFilterAtivo(false);
                    }
                  }}
                  className="px-3 py-2 pr-8 bg-transparent text-sm appearance-none focus:outline-none"
                >
                  <option value="all">Todos os cupons</option>
                  <option value="true">Apenas ativos</option>
                  <option value="false">Apenas inativos</option>
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'codigo' | '-codigo')}
                  className="px-3 py-2 pr-8 bg-transparent text-sm appearance-none focus:outline-none"
                >
                  <option value="codigo">A-Z</option>
                  <option value="-codigo">Z-A</option>
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando cupons...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
              <button
                onClick={refreshCupons}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Cupons List */}
          {!loading && !error && (
            <div>
              {filteredCupons.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-600">
                    {searchTerm || filterAtivo !== undefined
                      ? 'Nenhum cupom encontrado com os filtros aplicados.'
                      : 'Nenhum cupom cadastrado ainda.'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredCupons.map((cupom) => (
                    <div key={cupom.id} className="flex items-center">
                      <div className="w-80">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{cupom.codigo}</h3>
                          {getStatusBadge(cupom)}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Desconto: {cupomApi.formatValor(cupom)}</p>
                          <p>Válido de {formatData(cupom.data_inicio)} até {formatData(cupom.data_fim)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditCupom(cupom)}
                          className="px-6 py-2 bg-[#FFCD35] text-black rounded-full hover:bg-[#e6b82f] transition-colors text-sm font-medium"
                        >
                          Editar
                        </button>
                        
                        <button
                          onClick={() => handleDeleteCupom(cupom)}
                          className="px-6 py-2 bg-[#FF4E4E] text-white rounded-full hover:bg-[#e63946] transition-colors text-sm font-medium"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        <CupomModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCupom(undefined); // Limpa o cupom em edição ao fechar
          }}
          cupom={editingCupom}
          onSuccess={handleModalSuccess}
        />

        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false })}
          onConfirm={confirmDelete}
          cupomCodigo={deleteModal.cupom?.codigo || ''}
        />
      </AdminLayout>
    </AdminProtectedRoute>
  );
}