'use client';

import { useState, useMemo, useEffect } from 'react';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import { useGeneros } from '@/hooks/useGeneros';
import { generoApi } from '@/services/generoApiService';
import { GeneroLiterario } from '@/types/generoLiterario';

interface GeneroModalProps {
  isOpen: boolean;
  onClose: () => void;
  genero?: GeneroLiterario;
  onSuccess: () => void;
}

function GeneroModal({ isOpen, onClose, genero, onSuccess }: GeneroModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Atualizar formData quando o genero prop mudar
  useEffect(() => {
    if (genero) {
      setFormData({
        nome: genero.nome,
      });
    } else {
      setFormData({
        nome: '',
      });
    }
  }, [genero]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (genero) {
        await generoApi.update(genero.id, formData);
      } else {
        await generoApi.create(formData);
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar gênero');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {genero ? 'Editar Gênero' : 'Adicionar Gênero'}
        </h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Gênero
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
              {isSubmitting ? 'Salvando...' : (genero ? 'Atualizar' : 'Criar')}
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
  generoNome: string;
}

function DeleteConfirmModal({ isOpen, onClose, onConfirm, generoNome }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">Excluir Gênero</h3>
        <p className="text-gray-600 mb-6">
          Tem certeza que deseja excluir o gênero <strong>{generoNome}</strong>?
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

export default function GenerosAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'nome' | '-nome'>('nome');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGenero, setEditingGenero] = useState<GeneroLiterario | undefined>();
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; genero?: GeneroLiterario }>({ isOpen: false });

  const {
    generos,
    isLoading: loading,
    error,
    refreshGeneros,
    deleteGenero
  } = useGeneros();

  const filteredGeneros = useMemo(() => {
    // Se não há termo de busca, apenas ordena alfabeticamente
    if (!searchTerm.trim()) {
      return [...generos].sort((a, b) => {
        if (sortOrder === 'nome') {
          return a.nome.localeCompare(b.nome);
        } else {
          return b.nome.localeCompare(a.nome);
        }
      });
    }

    // Aplica busca com diferentes níveis de prioridade
    const searchTermLower = searchTerm.toLowerCase();
    
    const searchResults = generos.map(genero => {
      const nomeGenero = genero.nome.toLowerCase();
      
      let priority = 0;
      let matches = false;
      
      // Prioridade 1: Exact match (correspondência exata)
      if (nomeGenero === searchTermLower) {
        priority = 1;
        matches = true;
      }
      // Prioridade 2: Match string no início (começa com o termo)
      else if (nomeGenero.startsWith(searchTermLower)) {
        priority = 2;
        matches = true;
      }
      // Prioridade 3: Include string (contém o termo)
      else if (nomeGenero.includes(searchTermLower)) {
        priority = 3;
        matches = true;
      }
      
      return { genero, priority, matches };
    })
    .filter(result => result.matches)
    .sort((a, b) => {
      // Primeiro ordena por prioridade (menor = mais relevante)
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      
      // Em caso de empate na prioridade, ordena alfabeticamente
      if (sortOrder === 'nome') {
        return a.genero.nome.localeCompare(b.genero.nome);
      } else {
        return b.genero.nome.localeCompare(a.genero.nome);
      }
    })
    .map(result => result.genero);

    console.log('🔍 Busca por gêneros realizada:', {
      termo: searchTerm,
      resultados: searchResults.length,
      primeiros3: searchResults.slice(0, 3).map(g => ({
        nome: g.nome,
        id: g.id
      }))
    });

    return searchResults;
  }, [generos, searchTerm, sortOrder]);

  const handleAddGenero = () => {
    setEditingGenero(undefined);
    setIsModalOpen(true);
  };

  const handleEditGenero = (genero: GeneroLiterario) => {
    setEditingGenero(genero);
    setIsModalOpen(true);
  };

  const handleDeleteGenero = (genero: GeneroLiterario) => {
    setDeleteModal({ isOpen: true, genero });
  };

  const confirmDelete = async () => {
    if (deleteModal.genero) {
      await deleteGenero(deleteModal.genero.id);
      setDeleteModal({ isOpen: false });
    }
  };

  const handleModalSuccess = () => {
    refreshGeneros();
  };

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="max-w-none mx-0 px-20 py-20">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-3xl font-light text-gray-900">Gêneros</h1>
            <button
              onClick={handleAddGenero}
              className="bg-[#876950] text-white px-6 py-2 rounded-full hover:bg-[#6d5440] transition-colors"
            >
              + Adicionar gênero
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
              <p className="mt-2 text-gray-600">Carregando gêneros...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
              <button
                onClick={refreshGeneros}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Generos List */}
          {!loading && !error && (
            <div>
              {filteredGeneros.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-600">
                    {searchTerm
                      ? 'Nenhum gênero encontrado com os filtros aplicados.'
                      : 'Nenhum gênero cadastrado ainda.'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredGeneros.map((genero) => (
                    <div key={genero.id} className="flex items-center">
                      <div className="w-80">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{genero.nome}</h3>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditGenero(genero)}
                          className="px-6 py-2 bg-[#FFCD35] text-black rounded-full hover:bg-[#e6b82f] transition-colors text-sm font-medium"
                        >
                          Editar
                        </button>
                        
                        <button
                          onClick={() => handleDeleteGenero(genero)}
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
        <GeneroModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          genero={editingGenero}
          onSuccess={handleModalSuccess}
        />

        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false })}
          onConfirm={confirmDelete}
          generoNome={deleteModal.genero?.nome || ''}
        />
      </AdminLayout>
    </AdminProtectedRoute>
  );
}