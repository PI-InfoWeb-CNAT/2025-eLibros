'use client';

import { useState, useMemo, useEffect } from 'react';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import { useCategorias } from '@/hooks/useCategorias';
import { categoriaApi } from '@/services/categoriaApiService';
import { Categoria } from '@/types/categoria';

interface CategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoria?: Categoria;
  onSuccess: () => void;
}

function CategoriaModal({ isOpen, onClose, categoria, onSuccess }: CategoriaModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Atualizar formData quando a categoria prop mudar
  useEffect(() => {
    if (categoria) {
      setFormData({
        nome: categoria.nome,
      });
    } else {
      setFormData({
        nome: '',
      });
    }
  }, [categoria]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (categoria) {
        await categoriaApi.update(categoria.id, formData);
      } else {
        await categoriaApi.create(formData);
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar categoria');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {categoria ? 'Editar Categoria' : 'Adicionar Categoria'}
        </h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Categoria
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
              placeholder="Ex: Best-sellers"
            />
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
              {isSubmitting ? 'Salvando...' : (categoria ? 'Atualizar' : 'Criar')}
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
  categoriaNome: string;
}

function DeleteConfirmModal({ isOpen, onClose, onConfirm, categoriaNome }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">Excluir Categoria</h3>
        <p className="text-gray-600 mb-6">
          Tem certeza que deseja excluir a categoria <strong>{categoriaNome}</strong>?
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

export default function CategoriasAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'nome' | '-nome'>('nome');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | undefined>();
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; categoria?: Categoria }>({ isOpen: false });

  const {
    categorias,
    isLoading: loading,
    error,
    refreshCategorias,
    deleteCategoria
  } = useCategorias();

  const filteredCategorias = useMemo(() => {
    if (!searchTerm.trim()) {
      // Sem pesquisa, aplica apenas a ordenação alfabética
      return [...categorias].sort((a, b) => {
        if (sortOrder === 'nome') {
          return a.nome.localeCompare(b.nome);
        } else {
          return b.nome.localeCompare(a.nome);
        }
      });
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    const exactMatches: Categoria[] = [];
    const startsWithMatches: Categoria[] = [];
    const includesMatches: Categoria[] = [];
    
    categorias.forEach(categoria => {
      const categoriaNome = categoria.nome.toLowerCase();
      
      if (categoriaNome === searchTermLower) {
        // Correspondência exata completa (maior prioridade)
        exactMatches.push(categoria);
      } else if (categoriaNome.startsWith(searchTermLower)) {
        // Correspondência no início (alta prioridade)
        startsWithMatches.push(categoria);
      } else if (categoriaNome.includes(searchTermLower)) {
        // Correspondência parcial (baixa prioridade)
        includesMatches.push(categoria);
      }
    });
    
    // Ordenar alfabeticamente dentro de cada grupo
    const sortFunction = (a: Categoria, b: Categoria) => {
      if (sortOrder === 'nome') {
        return a.nome.localeCompare(b.nome);
      } else {
        return b.nome.localeCompare(a.nome);
      }
    };
    
    exactMatches.sort(sortFunction);
    startsWithMatches.sort(sortFunction);
    includesMatches.sort(sortFunction);
    
    // Retorna na ordem: exato → começa com → contém
    return [...exactMatches, ...startsWithMatches, ...includesMatches];
  }, [categorias, searchTerm, sortOrder]);

  const handleAddCategoria = () => {
    setEditingCategoria(undefined);
    setIsModalOpen(true);
  };

  const handleEditCategoria = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setIsModalOpen(true);
  };

  const handleDeleteCategoria = (categoria: Categoria) => {
    setDeleteModal({ isOpen: true, categoria });
  };

  const confirmDelete = async () => {
    if (deleteModal.categoria) {
      await deleteCategoria(deleteModal.categoria.id);
      setDeleteModal({ isOpen: false });
    }
  };

  const handleModalSuccess = () => {
    refreshCategorias();
  };

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="max-w-none mx-0 px-20 py-20">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-3xl font-light text-gray-900">Categorias</h1>
            <button
              onClick={handleAddCategoria}
              className="bg-[#876950] text-white px-6 py-2 rounded-full hover:bg-[#6d5440] transition-colors"
            >
              + Adicionar categoria
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

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'nome' | '-nome')}
                  className="px-3 py-2 pr-8 bg-transparent text-sm appearance-none focus:outline-none"
                >
                  <option value="nome">A-Z</option>
                  <option value="-nome">Z-A</option>
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
              <p className="mt-2 text-gray-600">Carregando categorias...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
              <button
                onClick={refreshCategorias}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Categorias List */}
          {!loading && !error && (
            <div>
              {filteredCategorias.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-600">
                    {searchTerm
                      ? 'Nenhuma categoria encontrada com os filtros aplicados.'
                      : 'Nenhuma categoria cadastrada ainda.'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredCategorias.map((categoria) => (
                    <div key={categoria.id} className="flex items-center">
                      <div className="w-80">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{categoria.nome}</h3>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditCategoria(categoria)}
                          className="px-6 py-2 bg-[#FFCD35] text-black rounded-full hover:bg-[#e6b82f] transition-colors text-sm font-medium"
                        >
                          Editar
                        </button>
                        
                        <button
                          onClick={() => handleDeleteCategoria(categoria)}
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
        <CategoriaModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          categoria={editingCategoria}
          onSuccess={handleModalSuccess}
        />

        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false })}
          onConfirm={confirmDelete}
          categoriaNome={deleteModal.categoria?.nome || ''}
        />
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
