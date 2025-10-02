'use client';

import { useEffect, useState, useMemo } from 'react';
import AdminProtectedRoute from '../../../components/AdminProtectedRoute';
import AdminLayout from '../../../components/AdminLayout';
import { useLivros } from '../../../hooks/useLivros';
import { livroApi } from '@/services';
import { autorApi } from '@/services/autorApiService';
import { categoriaApi } from '@/services/categoriaApiService';
import { generoApi } from '@/services/generoApiService';
import { Livro, Autor, Categoria, GeneroLiterario } from '@/types';
import { elibrosApi } from '../../../services/api';
import { useRouter } from 'next/navigation';

interface LivroModalProps {
  isOpen: boolean;
  onClose: () => void;
  livro?: Livro;
  onSuccess: () => void;
}

function LivroModal({ isOpen, onClose, livro, onSuccess }: LivroModalProps) {
  const { autores, loading: loadingAutores, refreshAutores } = useAutores();
  const { categorias, loading: loadingCategorias, refreshCategorias } = useCategorias();
  const { generos, loading: loadingGeneros, refreshGeneros } = useGeneros();

  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    sinopse: '',
    editora: '',
    ISBN: '',
    data_de_publicacao: '',
    ano_de_publicacao: undefined as number | undefined,
    preco: '',
    desconto: '',
    quantidade: 0,
    autor: [] as number[],      // Nome correto para Django
    categoria: [] as number[],   // Nome correto para Django
    genero: [] as number[],      // Nome correto para Django
  });

  const [capaFile, setCapaFile] = useState<File | null>(null);
  const [capaPreview, setCapaPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Estados para modais de criação
  const [createAutorModal, setCreateAutorModal] = useState(false);
  const [createCategoriaModal, setCreateCategoriaModal] = useState(false);
  const [createGeneroModal, setCreateGeneroModal] = useState(false);
  const [newAutorName, setNewAutorName] = useState('');
  const [newCategoriaNome, setNewCategoriaNome] = useState('');
  const [newGeneroName, setNewGeneroName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  // Estados para filtros de pesquisa
  const [searchAutor, setSearchAutor] = useState('');
  const [searchCategoria, setSearchCategoria] = useState('');
  const [searchGenero, setSearchGenero] = useState('');

  // Funções para filtrar listas baseado na pesquisa com priorização
  const filteredAutores = useMemo(() => {
    let filteredList = autores;
    
    // Se há pesquisa, aplica filtro de busca
    if (searchAutor.trim()) {
      const searchTerm = searchAutor.toLowerCase();
      const exactMatches: Autor[] = [];
      const partialMatches: Autor[] = [];
      
      autores.forEach(autor => {
        const autorNome = autor.nome.toLowerCase();
        if (autorNome === searchTerm) {
          // Correspondência exata completa
          exactMatches.push(autor);
        } else if (autorNome.startsWith(searchTerm)) {
          // Correspondência no início (alta prioridade)
          exactMatches.push(autor);
        } else if (autorNome.includes(searchTerm)) {
          // Correspondência parcial (baixa prioridade)
          partialMatches.push(autor);
        }
      });
      
      filteredList = [...exactMatches, ...partialMatches];
    }
    
    // Separar selecionados e não selecionados
    const selecionados: Autor[] = [];
    const naoSelecionados: Autor[] = [];
    
    filteredList.forEach(autor => {
      if (formData.autor.includes(autor.id)) {
        selecionados.push(autor);
      } else {
        naoSelecionados.push(autor);
      }
    });
    
    // Ordenar cada grupo alfabeticamente
    selecionados.sort((a, b) => a.nome.localeCompare(b.nome));
    naoSelecionados.sort((a, b) => a.nome.localeCompare(b.nome));
    
    // DEBUG: Log da ordenação
    console.log('🔄 Autores - Selecionados:', selecionados.map(a => a.nome));
    console.log('🔄 Autores - Não selecionados:', naoSelecionados.map(a => a.nome));
    
    // Retornar selecionados primeiro, depois não selecionados
    return [...selecionados, ...naoSelecionados];
  }, [autores, searchAutor, formData.autor]);

  const filteredCategorias = useMemo(() => {
    let filteredList = categorias;
    
    // Se há pesquisa, aplica filtro de busca
    if (searchCategoria.trim()) {
      const searchTerm = searchCategoria.toLowerCase();
      const exactMatches: Categoria[] = [];
      const partialMatches: Categoria[] = [];
      
      categorias.forEach(categoria => {
        const categoriaNome = categoria.nome.toLowerCase();
        if (categoriaNome === searchTerm) {
          // Correspondência exata completa
          exactMatches.push(categoria);
        } else if (categoriaNome.startsWith(searchTerm)) {
          // Correspondência no início (alta prioridade)
          exactMatches.push(categoria);
        } else if (categoriaNome.includes(searchTerm)) {
          // Correspondência parcial (baixa prioridade)
          partialMatches.push(categoria);
        }
      });
      
      filteredList = [...exactMatches, ...partialMatches];
    }
    
    // Separar selecionadas e não selecionadas
    const selecionadas: Categoria[] = [];
    const naoSelecionadas: Categoria[] = [];
    
    filteredList.forEach(categoria => {
      if (formData.categoria.includes(categoria.id)) {
        selecionadas.push(categoria);
      } else {
        naoSelecionadas.push(categoria);
      }
    });
    
    // Ordenar cada grupo alfabeticamente
    selecionadas.sort((a, b) => a.nome.localeCompare(b.nome));
    naoSelecionadas.sort((a, b) => a.nome.localeCompare(b.nome));
    
    // Retornar selecionadas primeiro, depois não selecionadas
    return [...selecionadas, ...naoSelecionadas];
  }, [categorias, searchCategoria, formData.categoria]);

  const filteredGeneros = useMemo(() => {
    let filteredList = generos;
    
    // Se há pesquisa, aplica filtro de busca
    if (searchGenero.trim()) {
      const searchTerm = searchGenero.toLowerCase();
      const exactMatches: GeneroLiterario[] = [];
      const partialMatches: GeneroLiterario[] = [];
      
      generos.forEach(genero => {
        const generoNome = genero.nome.toLowerCase();
        if (generoNome === searchTerm) {
          // Correspondência exata completa
          exactMatches.push(genero);
        } else if (generoNome.startsWith(searchTerm)) {
          // Correspondência no início (alta prioridade)
          exactMatches.push(genero);
        } else if (generoNome.includes(searchTerm)) {
          // Correspondência parcial (baixa prioridade)
          partialMatches.push(genero);
        }
      });
      
      filteredList = [...exactMatches, ...partialMatches];
    }
    
    // Separar selecionados e não selecionados
    const selecionados: GeneroLiterario[] = [];
    const naoSelecionados: GeneroLiterario[] = [];
    
    filteredList.forEach(genero => {
      if (formData.genero.includes(genero.id)) {
        selecionados.push(genero);
      } else {
        naoSelecionados.push(genero);
      }
    });
    
    // Ordenar cada grupo alfabeticamente
    selecionados.sort((a, b) => a.nome.localeCompare(b.nome));
    naoSelecionados.sort((a, b) => a.nome.localeCompare(b.nome));
    
    // Retornar selecionados primeiro, depois não selecionados
    return [...selecionados, ...naoSelecionados];
  }, [generos, searchGenero, formData.genero]);

  // Funções para criar novos itens
  const handleCreateAutor = async () => {
    if (!newAutorName.trim()) return;
    
    setIsCreating(true);
    try {
      const novoAutor = await autorApi.create({ nome: newAutorName.trim() });
      
      // Atualiza a lista chamando o refresh do hook
      await refreshAutores();
      
      // Seleciona automaticamente o novo autor
      setFormData({ ...formData, autor: [...formData.autor, novoAutor.id] });
      setNewAutorName('');
      setCreateAutorModal(false);
      
      console.log('✅ Autor criado e lista atualizada:', novoAutor);
    } catch (error) {
      console.error('Erro ao criar autor:', error);
      setError('Erro ao criar autor. Tente novamente.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateCategoria = async () => {
    if (!newCategoriaNome.trim()) return;
    
    setIsCreating(true);
    try {
      const novaCategoria = await categoriaApi.create({ nome: newCategoriaNome.trim() });
      
      // Atualiza a lista chamando o refresh do hook
      await refreshCategorias();
      
      // Seleciona automaticamente a nova categoria
      setFormData({ ...formData, categoria: [...formData.categoria, novaCategoria.id] });
      setNewCategoriaNome('');
      setCreateCategoriaModal(false);
      
      console.log('✅ Categoria criada e lista atualizada:', novaCategoria);
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      setError('Erro ao criar categoria. Tente novamente.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateGenero = async () => {
    if (!newGeneroName.trim()) return;
    
    setIsCreating(true);
    try {
      const novoGenero = await generoApi.create({ nome: newGeneroName.trim() });
      
      // Atualiza a lista chamando o refresh do hook
      await refreshGeneros();
      
      // Seleciona automaticamente o novo gênero
      setFormData({ ...formData, genero: [...formData.genero, novoGenero.id] });
      setNewGeneroName('');
      setCreateGeneroModal(false);
      
      console.log('✅ Gênero criado e lista atualizada:', novoGenero);
    } catch (error) {
      console.error('Erro ao criar gênero:', error);
      setError('Erro ao criar gênero. Tente novamente.');
    } finally {
      setIsCreating(false);
    }
  };
 
  // Extrair IDs baseado nos nomes (StringRelatedField do Django)
  const extractIdsFromNames = (names: string[], sourceList: any[]): number[] => {
    if (!Array.isArray(names) || !Array.isArray(sourceList)) return [];
    
    return names.map(name => {
      const found = sourceList.find(item => item.nome === name);
      return found ? found.id : null;
    }).filter(id => id !== null) as number[];
  };
    
      // DEBUG: Verificar o que está chegando no livro
    useEffect(() => {
      if (livro && isOpen) {
        setIsLoadingData(true);
        console.log('🔄 Populando formulário com dados do livro:', livro);
        console.log('📊 DETALHES:');
        console.log('- Autores:', livro.autores);
        console.log('- Categorias:', livro.categorias);
        console.log('- Gêneros:', livro.generos);
        console.log('- Quantidade:', livro.quantidade);
        console.log('- Datas:', { 
          publicacao: livro.data_de_publicacao, 
          ano: livro.ano_de_publicacao 
        });

        // ... resto do código
      }
    }, [livro, isOpen]);

  useEffect(() => {
    if (livro && isOpen) {
      setIsLoadingData(true);
      console.log('🔄 Populando formulário com dados do livro:', livro);
      
      const formatDateForInput = (dateString: string) => {
        if (!dateString || dateString === 'N/A') return '';
        
        console.log('📅 Formatando data:', dateString);
        
        // Se a data já está no formato YYYY-MM-DD, retorna como está
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) return dateString;
        
        // Se estiver no formato DD/MM/YYYY, converte para YYYY-MM-DD
        if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
          const [day, month, year] = dateString.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        
        // Se for uma string de data ISO, tenta converter
        try {
          const date = new Date(dateString);
          if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
          }
        } catch (e) {
          console.error('Erro ao converter data:', e);
        }
        
        return '';
      };

      setFormData({
        titulo: livro.titulo || '',
        subtitulo: livro.subtitulo || '',
        sinopse: livro.sinopse || '',
        editora: livro.editora || '',
        ISBN: livro.ISBN || '',
        data_de_publicacao: formatDateForInput(livro.data_de_publicacao || ''),
        ano_de_publicacao: livro.ano_de_publicacao,
        preco: livro.preco || '',
        desconto: livro.desconto || '',
        quantidade: livro.quantidade || 0,
        autor: extractIdsFromNames(livro.autores || [], autores),
        categoria: extractIdsFromNames(livro.categorias || [], categorias),
        genero: extractIdsFromNames(livro.generos || [], generos),
      });

      // Também atualiza o preview da capa
      if (livro.capa) {
        setCapaPreview(livro.capa);
      }

      setIsLoadingData(false);
    } else if (!livro && isOpen) {
      // Se for adicionar novo livro, reseta o form
      console.log('🆕 Resetando formulário para novo livro');
      setFormData({
        titulo: '',
        subtitulo: '',
        sinopse: '',
        editora: '',
        ISBN: '',
        data_de_publicacao: '',
        ano_de_publicacao: undefined,
        preco: '',
        desconto: '',
        quantidade: 0,
        autor: [],
        categoria: [],
        genero: [],
      });
      setCapaPreview('');
      setCapaFile(null);
      setIsLoadingData(false);
    }
  }, [livro, isOpen]);

  // Limpar filtros de pesquisa quando modal abre/fecha
  useEffect(() => {
    if (!isOpen) {
      setSearchAutor('');
      setSearchCategoria('');
      setSearchGenero('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);

  // Detectar se vai fazer upload
  const hasFile = capaFile !== null;
  if (hasFile) {
    setIsUploading(true);
  }

  try {
    // Verificar se há arquivo de capa para determinar o formato de envio
    const hasFile = capaFile !== null;
    
    if (hasFile) {
      // Usar FormData quando há arquivo
      const formDataToSend = new FormData();
      
      // Adicionar campos básicos
      formDataToSend.append('titulo', formData.titulo);
      if (formData.subtitulo) formDataToSend.append('subtitulo', formData.subtitulo);
      if (formData.sinopse) formDataToSend.append('sinopse', formData.sinopse);
      formDataToSend.append('editora', formData.editora);
      if (formData.ISBN) formDataToSend.append('ISBN', formData.ISBN);
      if (formData.data_de_publicacao) formDataToSend.append('data_de_publicacao', formData.data_de_publicacao);
      if (formData.ano_de_publicacao) formDataToSend.append('ano_de_publicacao', formData.ano_de_publicacao.toString());
      formDataToSend.append('preco', formData.preco);
      if (formData.desconto) formDataToSend.append('desconto', formData.desconto);
      formDataToSend.append('quantidade', formData.quantidade.toString());
      
      // Adicionar arrays de IDs
      formData.autor.forEach(id => formDataToSend.append('autor', id.toString()));
      formData.categoria.forEach(id => formDataToSend.append('categoria', id.toString()));
      formData.genero.forEach(id => formDataToSend.append('genero', id.toString()));
      
      // Adicionar arquivo de capa
      formDataToSend.append('capa', capaFile);

      console.log('📤 Enviando com FormData (arquivo)');
      
      if (livro) {
        await livroApi.updateWithFile(livro.id, formDataToSend);
      } else {
        await livroApi.createWithFile(formDataToSend);
      }
    } else {
      // Usar JSON quando não há arquivo
      const dataToSend: any = {
        titulo: formData.titulo,
        subtitulo: formData.subtitulo || undefined,
        sinopse: formData.sinopse || undefined,
        editora: formData.editora,
        ISBN: formData.ISBN || undefined,
        data_de_publicacao: formData.data_de_publicacao || undefined,
        ano_de_publicacao: formData.ano_de_publicacao || undefined,
        preco: formData.preco,
        desconto: formData.desconto || undefined,
        quantidade: formData.quantidade,
        autor: formData.autor,
        categoria: formData.categoria,
        genero: formData.genero,
      };

      console.log('📤 Enviando com JSON (sem arquivo):', dataToSend);

      if (livro) {
        await livroApi.update(livro.id, dataToSend);
      } else {
        await livroApi.create(dataToSend);
      }
    }
    
    onSuccess();
    onClose();
  } catch (err) {
    console.error('❌ Erro detalhado:', err);
    setError(err instanceof Error ? err.message : 'Erro ao salvar livro');
  } finally {
    setIsSubmitting(false);
    setIsUploading(false);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {livro ? 'Editar Livro' : 'Adicionar Livro'}
          {isLoadingData && ' (Carregando...)'}
        </h2>
        
        {isLoadingData ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            <span className="ml-2 text-gray-600">Carregando dados do livro...</span>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Grid para organizar os campos em colunas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Coluna 1 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      required
                      placeholder="Título do livro"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subtítulo
                    </label>
                    <input
                      type="text"
                      value={formData.subtitulo}
                      onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Subtítulo do livro"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sinopse
                    </label>
                    <textarea
                      value={formData.sinopse}
                      onChange={(e) => setFormData({ ...formData, sinopse: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      rows={4}
                      placeholder="Sinopse do livro"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Editora *
                    </label>
                    <input
                      type="text"
                      value={formData.editora}
                      onChange={(e) => setFormData({ ...formData, editora: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      required
                      placeholder="Editora"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ISBN
                    </label>
                    <input
                      type="text"
                      value={formData.ISBN}
                      onChange={(e) => setFormData({ ...formData, ISBN: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="ISBN"
                    />
                  </div>
                </div>

                {/* Coluna 2 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Publicação
                    </label>
                    <input
                      type="date"
                      value={formData.data_de_publicacao}
                      onChange={(e) => setFormData({ ...formData, data_de_publicacao: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ano de Publicação
                    </label>
                    <input
                      type="number"
                      min="1000"
                      max="2030"
                      value={formData.ano_de_publicacao || ''}
                      onChange={(e) => setFormData({ ...formData, ano_de_publicacao: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Ex: 2023"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preço (R$) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.preco}
                      onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      required
                      placeholder="Preço"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Desconto (%) <span className="text-gray-400 text-xs">(opcional)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={formData.desconto}
                      onChange={(e) => setFormData({ ...formData, desconto: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Desconto em porcentagem"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantidade em estoque *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.quantidade}
                      onChange={(e) => setFormData({ ...formData, quantidade: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      required
                      placeholder="Quantidade"
                    />
                  </div>
                </div>
              </div>

              {/* Campos que ocupam largura total */}
              <div className="space-y-4">
                {/* Capa - Upload de arquivo OU URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Capa do Livro <span className="text-gray-400 text-xs">(opcional {livro ? '- manter atual se não alterar' : ''})</span>
                  </label>
                  
                  {/* Preview da imagem */}
                  {capaPreview && (
                    <div className="mb-4">
                      <img 
                        src={capaPreview} 
                        alt="Preview da capa" 
                        className="h-32 w-24 object-cover rounded-lg border border-gray-300 shadow-sm"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Campos de capa em linha */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Upload de arquivo */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        📁 Upload de Arquivo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Verificar tamanho do arquivo (limite de 10MB)
                            const maxSize = 10 * 1024 * 1024; // 10MB em bytes
                            if (file.size > maxSize) {
                              alert('⚠️ A imagem é muito grande! Por favor, escolha uma imagem menor que 10MB.');
                              e.target.value = ''; // Limpar o input
                              return;
                            }
                            
                            setCapaFile(file);
                            // Criar preview
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              setCapaPreview(e.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>


                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">
                      💡 Faça upload de um arquivo de imagem para a capa do livro (máximo 10MB).
                    </p>
                    {(capaFile || capaPreview) && (
                      <button
                        type="button"
                        onClick={() => {
                          setCapaFile(null);
                          setCapaPreview('');
                          // Limpar o input de arquivo
                          const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                          if (fileInput) fileInput.value = '';
                        }}
                        className="text-xs text-red-600 hover:text-red-800 underline"
                      >
                        🗑️ Limpar capa
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Autores */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Autores * 
                        {formData.autor.length > 0 && (
                          <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                            {formData.autor.length} selecionado{formData.autor.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </label>
                      <button
                        type="button"
                        onClick={() => setCreateAutorModal(true)}
                        className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium"
                        title="Adicionar novo autor"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Novo
                      </button>
                    </div>
                    
                    {/* Campo de pesquisa para autores */}
                    <div className="mb-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="🔍 Pesquisar autores..."
                          value={searchAutor}
                          onChange={(e) => setSearchAutor(e.target.value)}
                          className="w-full px-2 py-1 pr-6 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        />
                        {searchAutor && (
                          <button
                            type="button"
                            onClick={() => setSearchAutor('')}
                            className="absolute right-1 top-1 text-gray-400 hover:text-gray-600 text-xs"
                            title="Limpar pesquisa"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      {searchAutor && (
                        <div className="text-xs text-gray-500 mt-1">
                          {filteredAutores.length} de {autores.length} autores encontrados
                        </div>
                      )}
                    </div>
                    
                    <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-gray-50">
                      {loadingAutores ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600"></div>
                          <span className="ml-2 text-sm text-gray-500">Carregando autores...</span>
                        </div>
                      ) : filteredAutores.length > 0 ? (
                        <div className="space-y-2">
                          {filteredAutores.map(autor => {
                            const isSelected = formData.autor.includes(autor.id);
                            return (
                              <label 
                                key={autor.id} 
                                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                                  isSelected 
                                    ? 'bg-amber-50 border border-amber-200' 
                                    : 'hover:bg-gray-50'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const newAutores = e.target.checked
                                      ? [...formData.autor, autor.id]
                                      : formData.autor.filter((id: number) => id !== autor.id);
                                    setFormData({ ...formData, autor: newAutores });
                                  }}
                                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                />
                                <span className={`text-sm ${isSelected ? 'text-amber-800 font-medium' : 'text-gray-700'}`}>
                                  {isSelected && '✓ '}{autor.nome}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      ) : autores.length > 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Nenhum autor encontrado com "{searchAutor}"
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Nenhum autor cadastrado
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Categorias */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Categorias *
                        {formData.categoria.length > 0 && (
                          <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                            {formData.categoria.length} selecionada{formData.categoria.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </label>
                      <button
                        type="button"
                        onClick={() => setCreateCategoriaModal(true)}
                        className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium"
                        title="Adicionar nova categoria"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Nova
                      </button>
                    </div>
                    
                    {/* Campo de pesquisa para categorias */}
                    <div className="mb-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="🔍 Pesquisar categorias..."
                          value={searchCategoria}
                          onChange={(e) => setSearchCategoria(e.target.value)}
                          className="w-full px-2 py-1 pr-6 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        />
                        {searchCategoria && (
                          <button
                            type="button"
                            onClick={() => setSearchCategoria('')}
                            className="absolute right-1 top-1 text-gray-400 hover:text-gray-600 text-xs"
                            title="Limpar pesquisa"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      {searchCategoria && (
                        <div className="text-xs text-gray-500 mt-1">
                          {filteredCategorias.length} de {categorias.length} categorias encontradas
                        </div>
                      )}
                    </div>
                    
                    <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-gray-50">
                      {loadingCategorias ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600"></div>
                          <span className="ml-2 text-sm text-gray-500">Carregando categorias...</span>
                        </div>
                      ) : filteredCategorias.length > 0 ? (
                        <div className="space-y-2">
                          {filteredCategorias.map(categoria => {
                            const isSelected = formData.categoria.includes(categoria.id);
                            return (
                              <label 
                                key={categoria.id} 
                                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                                  isSelected 
                                    ? 'bg-amber-50 border border-amber-200' 
                                    : 'hover:bg-gray-50'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const newCategorias = e.target.checked
                                      ? [...formData.categoria, categoria.id]
                                      : formData.categoria.filter((id: number) => id !== categoria.id);
                                    setFormData({ ...formData, categoria: newCategorias });
                                  }}
                                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                />
                                <span className={`text-sm ${isSelected ? 'text-amber-800 font-medium' : 'text-gray-700'}`}>
                                  {isSelected && '✓ '}{categoria.nome}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      ) : categorias.length > 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Nenhuma categoria encontrada com "{searchCategoria}"
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Nenhuma categoria cadastrada
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Gêneros */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Gêneros *
                        {formData.genero.length > 0 && (
                          <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                            {formData.genero.length} selecionado{formData.genero.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </label>
                      <button
                        type="button"
                        onClick={() => setCreateGeneroModal(true)}
                        className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium"
                        title="Adicionar novo gênero"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Novo
                      </button>
                    </div>
                    
                    {/* Campo de pesquisa para gêneros */}
                    <div className="mb-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="🔍 Pesquisar gêneros..."
                          value={searchGenero}
                          onChange={(e) => setSearchGenero(e.target.value)}
                          className="w-full px-2 py-1 pr-6 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        />
                        {searchGenero && (
                          <button
                            type="button"
                            onClick={() => setSearchGenero('')}
                            className="absolute right-1 top-1 text-gray-400 hover:text-gray-600 text-xs"
                            title="Limpar pesquisa"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      {searchGenero && (
                        <div className="text-xs text-gray-500 mt-1">
                          {filteredGeneros.length} de {generos.length} gêneros encontrados
                        </div>
                      )}
                    </div>
                    
                    <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-gray-50">
                      {loadingGeneros ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600"></div>
                          <span className="ml-2 text-sm text-gray-500">Carregando gêneros...</span>
                        </div>
                      ) : filteredGeneros.length > 0 ? (
                        <div className="space-y-2">
                          {filteredGeneros.map(genero => {
                            const isSelected = formData.genero.includes(genero.id);
                            return (
                              <label 
                                key={genero.id} 
                                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                                  isSelected 
                                    ? 'bg-amber-50 border border-amber-200' 
                                    : 'hover:bg-gray-50'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const newGeneros = e.target.checked
                                      ? [...formData.genero, genero.id]
                                      : formData.genero.filter((id: number) => id !== genero.id);
                                    setFormData({ ...formData, genero: newGeneros });
                                  }}
                                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                />
                                <span className={`text-sm ${isSelected ? 'text-amber-800 font-medium' : 'text-gray-700'}`}>
                                  {isSelected && '✓ '}{genero.nome}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      ) : generos.length > 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Nenhum gênero encontrado com "{searchGenero}"
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Nenhum gênero cadastrado
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm"
                  disabled={isSubmitting}
                >
                  {isUploading ? '📤 Fazendo upload...' : 
                   isSubmitting ? '💾 Salvando...' : 
                   (livro ? 'Atualizar' : 'Criar')}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Modal para criar novo autor */}
      {createAutorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Criar Novo Autor</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Autor *
                </label>
                <input
                  type="text"
                  value={newAutorName}
                  onChange={(e) => setNewAutorName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Digite o nome do autor"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCreateAutorModal(false);
                    setNewAutorName('');
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  disabled={isCreating}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateAutor}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                  disabled={isCreating || !newAutorName.trim()}
                >
                  {isCreating ? 'Criando...' : 'Criar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para criar nova categoria */}
      {createCategoriaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Criar Nova Categoria</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  value={newCategoriaNome}
                  onChange={(e) => setNewCategoriaNome(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Digite o nome da categoria"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCreateCategoriaModal(false);
                    setNewCategoriaNome('');
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  disabled={isCreating}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateCategoria}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                  disabled={isCreating || !newCategoriaNome.trim()}
                >
                  {isCreating ? 'Criando...' : 'Criar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para criar novo gênero */}
      {createGeneroModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Criar Novo Gênero</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Gênero *
                </label>
                <input
                  type="text"
                  value={newGeneroName}
                  onChange={(e) => setNewGeneroName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Digite o nome do gênero"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCreateGeneroModal(false);
                    setNewGeneroName('');
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  disabled={isCreating}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateGenero}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                  disabled={isCreating || !newGeneroName.trim()}
                >
                  {isCreating ? 'Criando...' : 'Criar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Hooks para buscar opções
function useAutores() {
  const [autores, setAutores] = useState<Autor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAutores = async () => {
    setLoading(true);
    try {
      // Tenta diferentes endpoints possíveis
      const endpoints = [
        '/autores/',
        '/autor/',
        '/authors/',
        '/livros/autores/'
      ];
      
      let data = null;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔄 Tentando endpoint: ${endpoint}`);
          data = await elibrosApi.makeRequest<any>(endpoint, { skipAuth: true });
          
          // Verifica se os dados são válidos
          if (data && Array.isArray(data)) {
            console.log(`✅ Sucesso no endpoint: ${endpoint}`, data);
            break;
          } else if (data && data.results && Array.isArray(data.results)) {
            // Se a API retornar formato { results: [] }
            data = data.results;
            console.log(`✅ Sucesso no endpoint (com results): ${endpoint}`, data);
            break;
          }
        } catch (err) {
          console.log(`❌ Falha no endpoint: ${endpoint}`, err);
        }
      }
      
      if (data && Array.isArray(data)) {
        setAutores(data);
      } else {
        console.log('📭 Nenhum endpoint funcionou, usando dados mock');
        setAutores([
          { id: 1, nome: "Autor 1" },
          { id: 2, nome: "Autor 2" },
          { id: 3, nome: "Autor 3" },
        ]);
      }
    } catch (err) {
      console.error('❌ Erro geral:', err);
      setAutores([
        { id: 1, nome: "Autor Teste 1" },
        { id: 2, nome: "Autor Teste 2" },
        { id: 3, nome: "Autor Teste 3" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutores();
  }, []);

  return { autores, loading, refreshAutores: fetchAutores };
}

function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      // Tenta diferentes endpoints possíveis
      const endpoints = [
        '/categorias/',
        '/categoria/',
        '/categories/',
        '/livros/categorias/'
      ];
      
      let data = null;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔄 Tentando endpoint: ${endpoint}`);
          data = await elibrosApi.makeRequest<any>(endpoint, { skipAuth: true });
          
          // Verifica se os dados são válidos
          if (data && Array.isArray(data)) {
            console.log(`✅ Sucesso no endpoint: ${endpoint}`, data);
            break;
          } else if (data && data.results && Array.isArray(data.results)) {
            // Se a API retornar formato { results: [] }
            data = data.results;
            console.log(`✅ Sucesso no endpoint (com results): ${endpoint}`, data);
            break;
          }
        } catch (err) {
          console.log(`❌ Falha no endpoint: ${endpoint}`, err);
        }
      }
      
      if (data && Array.isArray(data)) {
        setCategorias(data);
      } else {
        console.log('📭 Nenhum endpoint funcionou, usando dados mock');
        setCategorias([
          { id: 1, nome: "Categoria 1" },
          { id: 2, nome: "Categoria 2" },
          { id: 3, nome: "Categoria 3" },
        ]);
      }
    } catch (err) {
      console.error('❌ Erro geral:', err);
      setCategorias([
        { id: 1, nome: "Categoria Teste 1" },
        { id: 2, nome: "Categoria Teste 2" },
        { id: 3, nome: "Categoria Teste 3" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return { categorias, loading, refreshCategorias: fetchCategorias };
}

function useGeneros() {
  const [generos, setGeneros] = useState<GeneroLiterario[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGeneros = async () => {
    setLoading(true);
    try {
      // Tenta diferentes endpoints possíveis
      const endpoints = [
        '/generos/',
        '/genero/',
        '/genres/',
        '/livros/generos/'
      ];
      
      let data = null;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔄 Tentando endpoint: ${endpoint}`);
          data = await elibrosApi.makeRequest<any>(endpoint, { skipAuth: true });
          
          // Verifica se os dados são válidos
          if (data && Array.isArray(data)) {
            console.log(`✅ Sucesso no endpoint: ${endpoint}`, data);
            break;
          } else if (data && data.results && Array.isArray(data.results)) {
            // Se a API retornar formato { results: [] }
            data = data.results;
            console.log(`✅ Sucesso no endpoint (com results): ${endpoint}`, data);
            break;
          }
        } catch (err) {
          console.log(`❌ Falha no endpoint: ${endpoint}`, err);
        }
      }
      
      if (data && Array.isArray(data)) {
        setGeneros(data);
      } else {
        console.log('📭 Nenhum endpoint funcionou, usando dados mock');
        setGeneros([
          { id: 1, nome: "Gênero 1" },
          { id: 2, nome: "Gênero 2" },
          { id: 3, nome: "Gênero 3" },
        ]);
      }
    } catch (err) {
      console.error('❌ Erro geral:', err);
      setGeneros([
        { id: 1, nome: "Gênero Teste 1" },
        { id: 2, nome: "Gênero Teste 2" },
        { id: 3, nome: "Gênero Teste 3" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGeneros();
  }, []);

  return { generos, loading, refreshGeneros: fetchGeneros };
}

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  livroTitulo: string;
}

function DeleteConfirmModal({ isOpen, onClose, onConfirm, livroTitulo }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">Excluir Livro</h3>
        <p className="text-gray-600 mb-6">
          Tem certeza que deseja excluir o livro <strong>{livroTitulo}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LivrosAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'titulo' | '-titulo'>('titulo');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLivro, setEditingLivro] = useState<Livro | undefined>();
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; livro?: Livro }>({ isOpen: false });
  const [viewModal, setViewModal] = useState<{ isOpen: boolean; livro?: Livro }>({ isOpen: false });

  const router = useRouter();

  const { 
    livros, 
    loading, 
    error, 
    totalCount,
    refreshLivros,
    deleteLivro
  } = useLivros({
    search: searchTerm,
    ordering: sortOrder
  });

  const filteredLivros = useMemo(() => {
    return livros.filter(livro => {
      const matchesSearch = !searchTerm || 
        livro.titulo.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [livros, searchTerm]);

  const handleAddLivro = () => {
    setEditingLivro(undefined);
    setIsModalOpen(true);
  };

  const handleEditLivro = (livro: Livro) => {
    setEditingLivro(livro);
    setIsModalOpen(true);
  };

  const handleDeleteLivro = (livro: Livro) => {
    setDeleteModal({ isOpen: true, livro });
  };

  const handleViewLivro = (livro: Livro) => {
    setViewModal({ isOpen: true, livro });
  };

  const confirmDelete = async () => {
    if (deleteModal.livro) {
      const success = await deleteLivro(deleteModal.livro.id);
      if (success) {
        setDeleteModal({ isOpen: false });
      }
    }
  };

  const handleModalSuccess = () => {
    refreshLivros();
  };

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="max-w-none mx-0 px-20 py-20">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-3xl font-light text-gray-900">Livros</h1>
            <button
              onClick={handleAddLivro}
              className="bg-[#876950] text-white px-6 py-2 rounded-full hover:bg-[#6d5440]"
            >
              + Adicionar livro
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
                  placeholder="Pesquise por título..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#F4F4F4] rounded-full focus:outline-none placeholder-gray-500"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'titulo' | '-titulo')}
                  className="px-3 py-2 pr-8 bg-transparent text-sm appearance-none focus:outline-none"
                >
                  <option value="titulo">A-Z</option>
                  <option value="-titulo">Z-A</option>
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
              <p className="mt-2 text-gray-600">Carregando livros...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
              <button
                onClick={refreshLivros}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Livros List */}
          {!loading && !error && (
            <div>
              {filteredLivros.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-600">
                    {searchTerm
                      ? 'Nenhum livro encontrado com os filtros aplicados.'
                      : 'Nenhum livro cadastrado ainda.'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredLivros.map((livro) => (
                    <div key={livro.id} className="flex items-center">
                      <div className="w-80">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{livro.titulo}</h3>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Autores: {Array.isArray(livro.autores) ? livro.autores.join(', ') : livro.autores}</p>
                          <p>Categorias: {Array.isArray(livro.categorias) ? livro.categorias.join(', ') : livro.categorias}</p>
                          <p>Gêneros: {Array.isArray(livro.generos) ? livro.generos.join(', ') : livro.generos}</p>
                          <p>Editora: {livro.editora} | Ano: {livro.ano_de_publicacao || 'N/A'}</p>
                          <p>Preço: R$ {livro.preco}</p>
                          <p>Desconto: {livro.desconto ? `${livro.desconto}%` : 'Sem desconto'}</p>
                          <p>Estoque: {livro.quantidade}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewLivro(livro)}
                          className="px-6 py-2 bg-transparent border-2 border-[#866951] text-[#866951] rounded-full hover:bg-[#866951] hover:text-white text-sm font-medium transition-colors"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => handleEditLivro(livro)}
                          className="px-6 py-2 bg-[#FFCD35] text-black rounded-full hover:bg-[#e6b82f] text-sm font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteLivro(livro)}
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
        <LivroModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          livro={editingLivro}
          onSuccess={handleModalSuccess}
        />

        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false })}
          onConfirm={confirmDelete}
          livroTitulo={deleteModal.livro?.titulo || ''}
        />

        {/* Modal de Visualização */}
      {viewModal.isOpen && viewModal.livro && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Detalhes do Livro</h2>
                <button
                  onClick={() => setViewModal({ isOpen: false })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Layout principal: Informações + Capa */}
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                {/* Coluna esquerda: Título e Informações */}
                <div className="flex-1">
                  {/* Título */}
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">{viewModal.livro.titulo}</h1>
                  
                  {/* Informações principais */}
                  <div className="space-y-3">
                    <div>
                      <span className="font-semibold text-gray-700">Autor(es):</span>
                      <span className="ml-2 text-gray-600">
                        {viewModal.livro.autores && viewModal.livro.autores.length > 0 
                          ? viewModal.livro.autores.join(', ')
                          : 'N/A'
                        }
                      </span>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-gray-700">Editora:</span>
                      <span className="ml-2 text-gray-600">{viewModal.livro.editora || 'N/A'}</span>
                    </div>
                    
                    {viewModal.livro.ISBN && (
                      <div>
                        <span className="font-semibold text-gray-700">ISBN:</span>
                        <span className="ml-2 text-gray-600">{viewModal.livro.ISBN}</span>
                      </div>
                    )}
                    
                    <div>
                      <span className="font-semibold text-gray-700">Data de publicação:</span>
                      <span className="ml-2 text-gray-600">
                        {viewModal.livro.data_de_publicacao && viewModal.livro.data_de_publicacao !== 'N/A'
                          ? new Date(viewModal.livro.data_de_publicacao).toLocaleDateString('pt-BR')
                          : 'N/A'
                        }
                      </span>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-gray-700">Preço:</span>
                      <span className="ml-2 text-gray-600">
                        R$ {viewModal.livro.preco 
                          ? typeof viewModal.livro.preco === 'string' 
                            ? parseFloat(viewModal.livro.preco).toFixed(2).replace('.', ',')
                            : parseFloat(viewModal.livro.preco).toFixed(2).replace('.', ',')
                          : '0,00'
                        }
                        {viewModal.livro.desconto && viewModal.livro.desconto !== '0' && (
                          <span className="ml-2 text-green-600 font-medium">
                            ({viewModal.livro.desconto}% OFF)
                          </span>
                        )}
                      </span>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-gray-700">Quantidade em estoque:</span>
                      <span className="ml-2 text-gray-600">{viewModal.livro.quantidade ?? 0}</span>
                    </div>
                  </div>
                </div>
                
                {/* Coluna direita: Capa */}
                <div className="flex justify-center md:justify-end md:items-start">
                  <div className="w-40 h-52 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    {viewModal.livro.capa ? (
                      <img
                        src={viewModal.livro.capa}
                        alt={`Capa do livro ${viewModal.livro.titulo}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-book.png';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span className="ml-2 text-sm">Sem capa</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Separador */}
              <div className="border-t border-gray-200 my-6"></div>

              {/* Sinopse */}
              {viewModal.livro.sinopse && (
                <>
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-700 mb-3">Sinopse:</h3>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                      {viewModal.livro.sinopse}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 my-6"></div>
                </>
              )}

              {/* Categorias */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Categorias:</h3>
                <div className="flex flex-wrap gap-2">
                  {viewModal.livro.categorias && viewModal.livro.categorias.length > 0 ? (
                    viewModal.livro.categorias.map((categoria: string, index: number) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {categoria}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">Nenhuma categoria definida</span>
                  )}
                </div>
              </div>

              {/* Gêneros */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Gêneros:</h3>
                <div className="flex flex-wrap gap-2">
                  {viewModal.livro.generos && viewModal.livro.generos.length > 0 ? (
                    viewModal.livro.generos.map((genero: string, index: number) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {genero}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">Nenhum gênero definido</span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t">
              <div className="flex gap-3">
                <button
                  onClick={() => setViewModal({ isOpen: false })}
                  className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Fechar
                </button>
                <button
                  onClick={() => viewModal.livro && router.push(`/livro/${viewModal.livro.id}`)}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  Ver página pública
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </AdminLayout>
    </AdminProtectedRoute>
  );
}