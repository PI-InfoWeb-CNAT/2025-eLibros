'use client';

import { useState, useMemo } from 'react';
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
    nome: categoria?.nome || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
              placeholder="Ex: Ficção Científica"
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

export default function CategoriasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategoria, setEditingCategoria] = useState<Categoria | undefined>();
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; categoria?: Categoria }>({ isOpen: false });
  const [formModalOpen, setFormModalOpen] = useState(false);

  const {
    categorias,
    isLoading,
    error: loadingError,
    refreshCategorias,
    deleteCategoria
  } = useCategorias();

  const filteredCategorias = useMemo(() => {
    return categorias.filter(categoria => {
      const matchesSearch = searchTerm === '' || 
        categoria.nome.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [categorias, searchTerm]);

  const handleAddCategoria = () => {
    setEditingCategoria(undefined);
    setFormModalOpen(true);
  };

  const handleEditCategoria = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setFormModalOpen(true);
  };

  const handleDeleteClick = (categoria: Categoria) => {
    setDeleteModal({ isOpen: true, categoria });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.categoria) return;

    try {
      await deleteCategoria(deleteModal.categoria.id);
      setDeleteModal({ isOpen: false, categoria: undefined });
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
    }
  };

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Gerenciar Categorias</h1>
            <button
              onClick={handleAddCategoria}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Adicionar Categoria
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <input
                type="text"
                placeholder="Buscar categorias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {loadingError && (
              <div className="p-4 bg-red-50 border-b border-red-200">
                <p className="text-red-600">{loadingError}</p>
              </div>
            )}

            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Carregando...</div>
            ) : filteredCategorias.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Nenhuma categoria encontrada.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCategorias.map((categoria) => (
                      <tr key={categoria.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {categoria.nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditCategoria(categoria)}
                            className="text-amber-600 hover:text-amber-800 mx-2"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteClick(categoria)}
                            className="text-red-600 hover:text-red-800 mx-2"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <CategoriaModal
            isOpen={formModalOpen}
            onClose={() => setFormModalOpen(false)}
            categoria={editingCategoria}
            onSuccess={refreshCategorias}
          />

          <DeleteConfirmModal
            isOpen={deleteModal.isOpen}
            onClose={() => setDeleteModal({ isOpen: false, categoria: undefined })}
            onConfirm={handleDeleteConfirm}
            categoriaNome={deleteModal.categoria?.nome || ''}
          />
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
