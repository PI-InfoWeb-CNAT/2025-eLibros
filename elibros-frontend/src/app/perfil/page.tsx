"use client";

import Image from 'next/image';
import { Header, Footer, ProtectedRoute } from '../../components';
import { useAuth } from '../../contexts/AuthContext';

export default function PerfilPage() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Não informado';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FFFFF5] font-['Poppins'] text-[#1C1607] flex flex-col">
        <Header />
        
        <main>
          <form className="bg-[#EBEBE1] mx-16 my-16 px-16 py-16 rounded-sm flex flex-col gap-16">
            {/* Primeira seção */}
            <div className="flex gap-16">
              <figure className="w-[18%] m-0">
                <Image 
                  src="/usuario.png" 
                  alt="Profile Picture"
                  width={200}
                  height={200}
                  className="w-full aspect-square rounded-full object-cover"
                />
              </figure>

              <div className="flex flex-col gap-5 flex-1">
                <div className="flex flex-col">
                  <label htmlFor="username" className="font-light mb-1 text-black/50 text-lg w-full">Nome de Usuário</label>
                  <input 
                    id="username" 
                    type="text" 
                    value={user?.username || ''} 
                    disabled
                    className="bg-[#EBEBE1] outline-1 outline-[#EBEBE1] border border-[#EBEBE1] text-[#3B362B] text-lg font-light p-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="font-light mb-1 text-black/50 text-lg w-full">E-mail</label>
                  <input 
                    id="email" 
                    type="email" 
                    value={user?.email || ''} 
                    disabled
                    className="bg-[#EBEBE1] outline-1 outline-[#EBEBE1] border border-[#EBEBE1] text-[#3B362B] text-lg font-light p-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="fone" className="font-light mb-1 text-black/50 text-lg w-full">Telefone</label>
                  <input 
                    id="fone" 
                    type="tel" 
                    value={user?.telefone || ''} 
                    disabled
                    className="bg-[#EBEBE1] outline-1 outline-[#EBEBE1] border border-[#EBEBE1] text-[#3B362B] text-lg font-light p-2"
                  />
                </div>
              </div>

              <div className="flex flex-col w-[25%]">
                <label htmlFor="genero" className="font-light mb-1 text-black/50 text-lg">Identidade de gênero</label>
                <select 
                  id="genero" 
                  disabled
                  className="bg-[#EBEBE1] outline-1 outline-[#EBEBE1] border border-[#EBEBE1] text-[#3B362B] text-lg font-light p-2"
                >
                  <option>{user?.genero || 'Colocar Gênero'}</option>
                </select>
              </div>

              <div className="flex flex-col justify-between w-[25%] gap-4">
                <a 
                  id="visualizar-pedidos" 
                  href="/pedidos"
                  className="w-full bg-[#D9D9D9] text-center py-2 rounded-sm text-[#3B362B] text-lg font-light no-underline"
                >
                  Visualizar pedidos
                </a>
                <a 
                  id="editar-perfil" 
                  href="/editar-perfil"
                  className="w-full bg-[#D9D9D9] text-center py-2 rounded-sm text-[#3B362B] text-lg font-light no-underline"
                >
                  Editar perfil de usuário
                </a>
              </div>
            </div>

            {/* Segunda seção */}
            <div className="flex gap-16">
              <div className="w-[25%] flex flex-col justify-between">
                <div className="flex flex-col">
                  <h3 className="text-[#3B362B] mb-5 font-normal">Senha e autenticação</h3>
                  <a 
                    id="alterar-senha" 
                    href="/alterar-senha"
                    className="inline-block w-fit px-7 py-3 bg-[#FFD147] text-center text-[#3B362B] text-lg font-light no-underline whitespace-nowrap"
                  >
                    Alterar senha
                  </a>
                </div>
                <hr className="border-gray-400 my-4" />
                <div>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-3 border border-[#FF4E4E] text-[#3B362B] text-lg font-light bg-transparent hover:bg-red-50 transition-colors whitespace-nowrap"
                    id="excluir-conta"
                  >
                    Excluir conta
                  </button>
                </div>
              </div>

              <div className="w-px bg-[#6C6C6C80]"></div>

              <div className="flex flex-col flex-1">
                <h3 className="text-[#3B362B] mb-5 font-normal">Outras informações</h3>
                <div className="flex flex-col mb-4">
                  <h4 className="font-light mb-1 text-black/50 text-lg">Data de nascimento</h4>
                  <p className="text-[#3B362B] text-lg font-light">{formatDate(user?.dt_nasc || '')}</p>
                </div>
                <div className="flex flex-col mb-4">
                  <h4 className="font-light mb-1 text-black/50 text-lg">Endereço</h4>
                  <a href="#" className="text-[#3B362B] text-lg font-light no-underline">Cadastrar endereço</a>
                </div>
                <div className="flex flex-col">
                  <h4 className="font-light mb-1 text-black/50 text-lg">CPF</h4>
                  <p className="text-[#3B362B] text-lg font-light">{user?.CPF || 'Não informado'}</p>
                </div>
              </div>
            </div>
          </form>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
