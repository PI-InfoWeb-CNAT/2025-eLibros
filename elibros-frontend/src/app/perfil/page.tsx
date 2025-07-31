"use client";

import { Header, Footer, ProtectedRoute } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

export default function PerfilPage() {
  const { user, logout } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
  };

  const maskEmail = (email: string) => {
    if (!email || !email.includes('@')) return email;
    const [username, domain] = email.split('@');
    if (username.length <= 2) {
      return `${username[0]}*@${domain}`;
    }
    const maskedUsername = username.slice(0, 2) + '*'.repeat(Math.max(0, username.length - 2));
    return `${maskedUsername}@${domain}`;
  };

  const maskPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) *****-$3');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FFFFF5] font-['Poppins'] text-[#1C1607] flex flex-col">
        <Header />
        
        <main className="flex-1 px-4 md:px-20 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-200 rounded-lg p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Profile Picture and Basic Info */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-gray-400 rounded-full flex items-center justify-center mb-4">
                    <svg 
                      width="60" 
                      height="60" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      className="text-gray-600"
                    >
                      <path 
                        d="M20 21V19C20 17.9 19.1 17 18 17H6C4.9 17 4 17.9 4 19V21M16 7C16 9.2 14.2 11 12 11C9.8 11 8 9.2 8 7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7Z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  
                  <div className="text-center mb-6">
                    <h2 className="text-lg font-medium mb-1">Nome do usuário</h2>
                    <p className="text-base text-gray-700">{user?.nome?.toUpperCase() || user?.username?.toUpperCase()}</p>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-1">Identidade de Gênero</h3>
                      <p className="text-sm text-gray-700">{user?.genero || 'Não informado'}</p>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-1">E-mail</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-700">{maskEmail(user?.email || '')}</p>
                        <button 
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Visualizar Perfil <svg className="inline w-3 h-3 ml-1" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-1">Telefone</h3>
                      <p className="text-sm text-gray-700">{maskPhone(user?.telefone || '')}</p>
                    </div>
                    
                    <button className="mt-6 bg-[#FFD147] text-[#1C1607] px-6 py-2 rounded text-sm hover:bg-[#fac423] transition-colors">
                      Editar perfil de usuário
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px bg-black"></div>

                {/* User Information Sections */}
                <div className="flex-1">
                  {/* Authentication Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Senha e autenticação</h3>
                    <button className="bg-[#FFD147] text-[#1C1607] px-4 py-2 rounded text-sm hover:bg-[#fac423] transition-colors mb-4">
                      Alterar senha
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 transition-colors block"
                    >
                      Excluir conta
                    </button>
                  </div>

                  {/* Other Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Outras informações</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Data de Nascimento</h4>
                        <p className="text-sm text-gray-900">
                          {user?.dt_nasc ? new Date(user.dt_nasc).toLocaleDateString('pt-BR') : 'XX/XX/XXXX'}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Endereço</h4>
                        <p className="text-sm text-gray-900">Rua dos todorapés, 4002</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">CPF</h4>
                        <p className="text-sm text-gray-900">
                          {user?.CPF ? formatCPF(user.CPF) : 'XXX.XXX.XXX-XX'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
