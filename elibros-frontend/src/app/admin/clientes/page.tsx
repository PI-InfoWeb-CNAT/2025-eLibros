'use client';

import { useState, useMemo } from 'react';
import AdminProtectedRoute from '../../../components/AdminProtectedRoute';
import AdminLayout from '../../../components/AdminLayout';
import { Cliente } from '@/types/cliente';
import { clienteApi } from '@/services/clienteApiService';

// export default function ClientesAdminPage() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterAtivo, setFilterAtivo] = useState<boolean | undefined>(undefined);
//   const [sortOrder, setSortOrder] = useState<'codigo' | '-codigo'>('codigo');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingCupom, setEditingCupom] = useState<Cupom | undefined>();
//   const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; cupom?: Cupom }>({ isOpen: false });

//   const { 
//     cupons, 
//     loading, 
//     error, 
//     totalCount,
//     refreshCupons,
//     deleteCupom
//   } = useCupons({
//     search: searchTerm,
//     ativo: filterAtivo,
//     ordering: sortOrder
//   });

//   const filteredCupons = useMemo(() => {
//     return cupons.filter(cupom => {
//       const matchesSearch = !searchTerm || 
//         cupom.codigo.toLowerCase().includes(searchTerm.toLowerCase());
      
//       const matchesFilter = filterAtivo === undefined || cupom.ativo === filterAtivo;
      
//       return matchesSearch && matchesFilter;
//     });
//   }, [cupons, searchTerm, filterAtivo]);

//   const handleAddCupom = () => {
//     setEditingCupom(undefined);
//     setIsModalOpen(true);
//   };

//   const handleEditCupom = (cupom: Cupom) => {
//     setEditingCupom(cupom);
//     setIsModalOpen(true);
//   };

//   const handleDeleteCupom = (cupom: Cupom) => {
//     setDeleteModal({ isOpen: true, cupom });
//   };

//   const confirmDelete = async () => {
//     if (deleteModal.cupom) {
//       const success = await deleteCupom(deleteModal.cupom.id);
//       if (success) {
//         setDeleteModal({ isOpen: false });
//       }
//     }
//   };

//   const handleModalSuccess = () => {
//     refreshCupons();
//   };

//   const formatData = (dataString: string) => {
//     return new Date(dataString).toLocaleDateString('pt-BR');
//   };

//   const getStatusBadge = (cupom: Cupom) => {
//     const isExpired = cupomApi.isExpired(cupom);
//     const isActiveNow = cupomApi.isActive(cupom);
    
//     if (!cupom.ativo) {
//       return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Inativo</span>;
//     }
//     if (isExpired) {
//       return <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">Expirado</span>;
//     }
//     if (isActiveNow) {
//       return <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">Ativo</span>;
//     }
//     return <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs">Agendado</span>;
//   };

//   return (
//     <AdminProtectedRoute>
//       <AdminLayout>
//         <div className="max-w-none mx-0 px-20 py-20">
//           {/* Header */}
//           <div className="flex items-center gap-4 mb-6">
//             <h1 className="text-3xl font-light text-gray-900">Cupons</h1>
//             <button
//               onClick={handleAddCupom}
//               className="bg-[#876950] text-white px-6 py-2 rounded-full hover:bg-[#6d5440] transition-colors"
//             >
//               + Adicionar cupons
//             </button>
//           </div>

//           {/* Search and Filters */}
//           <div className="mb-12">
//             <div className="flex gap-4 items-center">
//               {/* Search Bar */}
//               <div className="relative w-full max-w-md">
//                 <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
//                   <img src="/icons/lupa.svg" alt="Pesquisar" className="w-4 h-4 text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Pesquise por nome..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 bg-[#F4F4F4] rounded-full focus:outline-none placeholder-gray-500"
//                 />
//               </div>

//               {/* Status Filter */}
//               <div className="relative">
//                 <select
//                   value={filterAtivo === undefined ? 'all' : filterAtivo ? 'true' : 'false'}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     setFilterAtivo(value === 'all' ? undefined : value === 'true');
//                   }}
//                   className="px-3 py-2 pr-8 bg-transparent text-sm appearance-none focus:outline-none"
//                 >
//                   <option value="all">Todos os cupons</option>
//                   <option value="true">Apenas ativos</option>
//                   <option value="false">Apenas inativos</option>
//                 </select>
//                 <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
//                   <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </div>
//               </div>

//               {/* Sort */}
//               <div className="relative">
//                 <select
//                   value={sortOrder}
//                   onChange={(e) => setSortOrder(e.target.value as 'codigo' | '-codigo')}
//                   className="px-3 py-2 pr-8 bg-transparent text-sm appearance-none focus:outline-none"
//                 >
//                   <option value="codigo">A-Z</option>
//                   <option value="-codigo">Z-A</option>
//                 </select>
//                 <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
//                   <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Loading State */}
//           {loading && (
//             <div className="p-8 text-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
//               <p className="mt-2 text-gray-600">Carregando cupons...</p>
//             </div>
//           )}

//           {/* Error State */}
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//               <p className="text-red-600">{error}</p>
//               <button
//                 onClick={refreshCupons}
//                 className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//               >
//                 Tentar novamente
//               </button>
//             </div>
//           )}

//           {/* Cupons List */}
//           {!loading && !error && (
//             <div>
//               {filteredCupons.length === 0 ? (
//                 <div className="p-8 text-center">
//                   <p className="text-gray-600">
//                     {searchTerm || filterAtivo !== undefined
//                       ? 'Nenhum cupom encontrado com os filtros aplicados.'
//                       : 'Nenhum cupom cadastrado ainda.'
//                     }
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-8">
//                   {filteredCupons.map((cupom) => (
//                     <div key={cupom.id} className="flex items-center">
//                       <div className="min-w-0 flex-shrink-0">
//                         <div className="flex items-center gap-3 mb-2">
//                           <h3 className="font-medium text-gray-900">{cupom.codigo}</h3>
//                           {getStatusBadge(cupom)}
//                         </div>
//                         <div className="text-sm text-gray-600 space-y-1">
//                           <p>Desconto: {cupomApi.formatValor(cupom)}</p>
//                           <p>Válido de {formatData(cupom.data_inicio)} até {formatData(cupom.data_fim)}</p>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center gap-2 ml-16">
//                         <button
//                           onClick={() => handleEditCupom(cupom)}
//                           className="px-6 py-2 bg-[#FFCD35] text-black rounded-full hover:bg-[#e6b82f] transition-colors text-sm font-medium"
//                         >
//                           Editar
//                         </button>
                        
//                         <button
//                           onClick={() => handleDeleteCupom(cupom)}
//                           className="px-6 py-2 bg-[#FF4E4E] text-white rounded-full hover:bg-[#e63946] transition-colors text-sm font-medium"
//                         >
//                           Excluir
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Modals */}
//         <CupomModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           cupom={editingCupom}
//           onSuccess={handleModalSuccess}
//         />

//         <DeleteConfirmModal
//           isOpen={deleteModal.isOpen}
//           onClose={() => setDeleteModal({ isOpen: false })}
//           onConfirm={confirmDelete}
//           cupomCodigo={deleteModal.cupom?.codigo || ''}
//         />
//       </AdminLayout>
//     </AdminProtectedRoute>
//   );
// }