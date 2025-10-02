'use client';

import React, { useState, useMemo } from 'react';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import { useClientes } from '@/hooks/useClientes';
import { clienteApi } from '@/services/clienteApiService';
import { Cliente } from '@/types/cliente';

interface ClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente?: Cliente;
}

function ClienteModal({ isOpen, onClose, cliente }: ClienteModalProps) {
  if (!isOpen || !cliente) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Detalhes do Cliente</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Foto de Perfil */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {cliente.foto_de_perfil ? (
                <img
                  src={cliente.foto_de_perfil}
                  alt={`Foto de ${clienteApi.formatNome(cliente)}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="/usuario.png"
                  alt={`Foto padrão de ${clienteApi.formatNome(cliente)}`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">Informações Pessoais</h3>
            <div className="mt-2 space-y-2 text-sm">
              <p><span className="font-medium">Nome:</span> {clienteApi.formatNome(cliente)}</p>
              <p><span className="font-medium">Email:</span> {cliente.user.email}</p>
              <p><span className="font-medium">CPF:</span> {cliente.user.CPF ? clienteApi.formatCPF(cliente.user.CPF) : 'Não informado'}</p>
              <p><span className="font-medium">Telefone:</span> {cliente.user.telefone ? clienteApi.formatTelefone(cliente.user.telefone) : 'Não informado'}</p>
              <p><span className="font-medium">Gênero:</span> {clienteApi.formatGenero(cliente.user.genero)}</p>
              <p><span className="font-medium">Data de Nascimento:</span> {cliente.user.dt_nasc ? new Date(cliente.user.dt_nasc).toLocaleDateString('pt-BR') : 'Não informado'}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">Status da Conta</h3>
            <div className="mt-2 space-y-2 text-sm">
              <p><span className="font-medium">Email Verificado:</span> {clienteApi.isEmailVerified(cliente) ? 'Sim' : 'Não'}</p>
              <p><span className="font-medium">Cadastrado em:</span> {new Date(cliente.user.date_joined).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>

          {cliente.endereco && (
            <div>
              <h3 className="font-semibold text-gray-700">Endereço</h3>
              <div className="mt-2 text-sm">
                <p className="whitespace-pre-line">{clienteApi.formatEnderecoCompleto(cliente)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

interface ActionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmColor?: string;
}

function ActionConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText,
  confirmColor = 'bg-red-600 hover:bg-red-700'
}: ActionConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${confirmColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ClienteEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente?: Cliente;
  onSave: (id: number, data: any) => Promise<boolean>;
}

function ClienteEditModal({ isOpen, onClose, cliente, onSave }: ClienteEditModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    username: '',
    cpf: '',
    telefone: '',
    genero: '',
    dt_nasc: '',
    endereco: {
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: ''
    }
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Preencher formulário quando cliente mudar
  React.useEffect(() => {
    if (cliente) {
      setFormData({
        nome: cliente.nome || '',
        email: cliente.email || '',
        username: cliente.username || '',
        cpf: cliente.cpf || '',
        telefone: cliente.telefone || '',
        genero: cliente.genero || '',
        dt_nasc: cliente.data_nascimento || '',
        endereco: cliente.endereco ? {
          cep: cliente.endereco.cep || '',
          rua: cliente.endereco.rua || '',
          numero: cliente.endereco.numero || '',
          complemento: cliente.endereco.complemento || '',
          bairro: cliente.endereco.bairro || '',
          cidade: cliente.endereco.cidade || '',
          uf: cliente.endereco.uf || ''
        } : {
          cep: '',
          rua: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          uf: ''
        }
      });
      
      // Definir preview para foto atual
      setPreviewUrl(cliente.foto_de_perfil || null);
      setSelectedFile(null);
    }
  }, [cliente]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente) return;

    setIsLoading(true);
    try {
      let success;
      
      if (selectedFile) {
        // Se há arquivo, usar FormData
        const formDataToSend = new FormData();
        // Adicionar dados do usuário
        formDataToSend.append('user[nome]', formData.nome);
        formDataToSend.append('user[email]', formData.email);
        formDataToSend.append('user[username]', formData.username);
        formDataToSend.append('user[cpf]', formData.cpf);
        formDataToSend.append('user[telefone]', formData.telefone);
        formDataToSend.append('user[genero]', formData.genero);
        formDataToSend.append('user[dt_nasc]', formData.dt_nasc);
        formDataToSend.append('foto_de_perfil', selectedFile);
        
        // Adicionar dados do endereço
        Object.entries(formData.endereco).forEach(([key, value]) => {
          // Verificar se o valor é válido (não null, undefined, ou string vazia)
          const isValidValue = value !== null && value !== undefined && 
            (typeof value === 'string' ? value.trim() !== '' : value !== '');
          
          if (isValidValue) {
            if (key === 'numero') {
              const numeroValue = typeof value === 'string' ? parseInt(value, 10) : Number(value);
              if (!isNaN(numeroValue) && numeroValue > 0) {
                formDataToSend.append(`endereco[${key}]`, numeroValue.toString());
              }
            } else {
              formDataToSend.append(`endereco[${key}]`, typeof value === 'string' ? value.trim() : String(value));
            }
          }
        });
        
        success = await onSave(cliente.id, formDataToSend);
      } else {
        // Sem arquivo, usar JSON normal
        const enderecoData: any = {};
        // Copiar apenas campos válidos do endereço
        Object.entries(formData.endereco).forEach(([key, value]) => {
          // Verificar se o valor é válido (não null, undefined, ou string vazia)
          const isValidValue = value !== null && value !== undefined && 
            (typeof value === 'string' ? value.trim() !== '' : value !== '');
          
          if (isValidValue) {
            if (key === 'numero') {
              const numeroValue = typeof value === 'string' ? parseInt(value, 10) : Number(value);
              if (!isNaN(numeroValue) && numeroValue > 0) {
                enderecoData[key] = numeroValue;
              }
            } else {
              enderecoData[key] = typeof value === 'string' ? value.trim() : value;
            }
          }
        });
        
        success = await onSave(cliente.id, {
          user: {
            nome: formData.nome,
            email: formData.email,
            username: formData.username,
            cpf: formData.cpf,
            telefone: formData.telefone,
            genero: formData.genero,
            dt_nasc: formData.dt_nasc
          },
          endereco: enderecoData
        });
      }

      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !cliente) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Editar Cliente</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações Pessoais */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Informações Pessoais</h3>
              
              {/* Campo de foto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto de Perfil</label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src="/usuario.png"
                        alt="Foto padrão"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FFCD35] file:text-black hover:file:bg-[#e6b82e]"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="000.000.000-00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
                <select
                  value={formData.genero}
                  onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="F">Feminino</option>
                  <option value="M">Masculino</option>
                  <option value="NB">Não-binário</option>
                  <option value="PND">Prefiro não dizer</option>
                  <option value="NI">Não informado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                <input
                  type="date"
                  value={formData.dt_nasc}
                  onChange={(e) => setFormData({ ...formData, dt_nasc: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Endereço</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                <input
                  type="text"
                  value={formData.endereco.cep}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    endereco: { ...formData.endereco, cep: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                <input
                  type="text"
                  value={formData.endereco.rua}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    endereco: { ...formData.endereco, rua: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                  <input
                    type="text"
                    value={formData.endereco.numero}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      endereco: { ...formData.endereco, numero: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                  <input
                    type="text"
                    value={formData.endereco.complemento}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      endereco: { ...formData.endereco, complemento: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                <input
                  type="text"
                  value={formData.endereco.bairro}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    endereco: { ...formData.endereco, bairro: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={formData.endereco.cidade}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      endereco: { ...formData.endereco, cidade: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UF</label>
                  <input
                    type="text"
                    value={formData.endereco.uf}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      endereco: { ...formData.endereco, uf: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={2}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-black bg-[#FFCD35] rounded-lg hover:bg-[#e6b82e] disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ClientesAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'user__nome' | '-user__nome'>('user__nome');
  const [viewModal, setViewModal] = useState<{ isOpen: boolean; cliente?: Cliente }>({ isOpen: false });
  const [editModal, setEditModal] = useState<{ isOpen: boolean; cliente?: Cliente }>({ isOpen: false });
  const [actionModal, setActionModal] = useState<{ 
    isOpen: boolean; 
    cliente?: Cliente; 
    action?: 'delete' 
  }>({ isOpen: false });

  const {
    clientes,
    isLoading: loading,
    error,
    refreshClientes,
    deleteCliente,
    updateCliente
  } = useClientes({
    search: searchTerm,
    ordering: sortOrder
  });

  const filteredClientes = useMemo(() => {
    return clientes.filter(cliente => {
      const matchesSearch = !searchTerm || 
        clienteApi.formatNome(cliente).toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [clientes, searchTerm]);

  const handleViewCliente = (cliente: Cliente) => {
    setViewModal({ isOpen: true, cliente });
  };

  const handleDeleteCliente = (cliente: Cliente) => {
    setActionModal({ 
      isOpen: true, 
      cliente, 
      action: 'delete' 
    });
  };

  const handleEditCliente = (cliente: Cliente) => {
    setEditModal({ isOpen: true, cliente });
  };

  const confirmAction = async () => {
    if (!actionModal.cliente || !actionModal.action) return;

    try {
      switch (actionModal.action) {
        case 'delete':
          await deleteCliente(actionModal.cliente.id);
          break;
      }
      setActionModal({ isOpen: false });
    } catch (error) {
      console.error('Erro ao executar ação:', error);
    }
  };

  const getActionModalConfig = () => {
    if (!actionModal.cliente || !actionModal.action) return null;

    const configs = {
      delete: {
        title: 'Excluir Cliente',
        message: `Tem certeza que deseja excluir permanentemente o cliente ${clienteApi.formatNome(actionModal.cliente)}? Esta ação não pode ser desfeita.`,
        confirmText: 'Excluir',
        confirmColor: 'bg-red-600 hover:bg-red-700'
      }
    };

    return configs[actionModal.action];
  };

  const modalConfig = getActionModalConfig();

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="max-w-none mx-0 px-20 py-20">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-3xl font-light text-gray-900">Clientes</h1>
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
                  placeholder="Pesquise por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#F4F4F4] rounded-full focus:outline-none placeholder-gray-500"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'user__nome' | '-user__nome')}
                  className="px-3 py-2 pr-8 bg-transparent text-sm appearance-none focus:outline-none"
                >
                  <option value="user__nome">A-Z</option>
                  <option value="-user__nome">Z-A</option>
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
              <p className="mt-2 text-gray-600">Carregando clientes...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
              <button
                onClick={refreshClientes}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Clientes List */}
          {!loading && !error && (
            <div>
              {filteredClientes.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-600">
                    {searchTerm
                      ? 'Nenhum cliente encontrado com os filtros aplicados.'
                      : 'Nenhum cliente cadastrado ainda.'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredClientes.map((cliente) => (
                    <div key={cliente.id} className="flex items-center">
                      <div className="w-80">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{clienteApi.formatNome(cliente)}</h3>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Email: {cliente.user.email}</p>
                          <p>Telefone: {cliente.user.telefone ? clienteApi.formatTelefone(cliente.user.telefone) : 'Não informado'}</p>
                          <p>Endereço: {clienteApi.hasAddress(cliente) ? 'Cadastrado' : 'Não informado'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewCliente(cliente)}
                          className="px-6 py-2 bg-transparent border-2 border-[#866951] text-[#866951] rounded-full hover:bg-[#866951] hover:text-white text-sm font-medium transition-colors"
                        >
                          Ver
                        </button>
                        
                        <button
                          onClick={() => handleEditCliente(cliente)}
                          className="px-6 py-2 bg-[#FFCD35] text-black rounded-full hover:bg-[#e6b82e] text-sm font-medium"
                        >
                          Editar
                        </button>
                        
                        <button
                          onClick={() => handleDeleteCliente(cliente)}
                          className="px-6 py-2 bg-[#FF4E4E] text-white rounded-full hover:bg-[#e63946] text-sm font-medium"
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
        <ClienteModal
          isOpen={viewModal.isOpen}
          onClose={() => setViewModal({ isOpen: false })}
          cliente={viewModal.cliente}
        />

        <ClienteEditModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false })}
          cliente={editModal.cliente}
          onSave={updateCliente}
        />

        {modalConfig && (
          <ActionConfirmModal
            isOpen={actionModal.isOpen}
            onClose={() => setActionModal({ isOpen: false })}
            onConfirm={confirmAction}
            title={modalConfig.title}
            message={modalConfig.message}
            confirmText={modalConfig.confirmText}
            confirmColor={modalConfig.confirmColor}
          />
        )}
      </AdminLayout>
    </AdminProtectedRoute>
  );
}