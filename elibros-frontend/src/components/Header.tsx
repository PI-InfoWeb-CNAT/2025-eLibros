"use client";

import { useAuth } from '../contexts/AuthContext';
import AuthenticatedHeader from './AuthenticatedHeader';

interface HeaderProps {}

export default function Header({}: HeaderProps) {
  const { isAuthenticated, isInitialized } = useAuth();

  // Mostra um placeholder durante o carregamento para evitar flash
  if (!isInitialized) {
    return (
      <header className="px-4 md:px-20 py-4 border-b-8 border-[#FFD147] flex flex-col md:flex-row justify-between items-center bg-[#1C1607]">
        <h1>
          <a href="/" className="flex">
            <img src="/logo.png" alt="eLibros" className="w-48 md:w-52" />
          </a>
        </h1>
        
        <nav className="mt-4 md:mt-0">
          <ul className="flex gap-4 md:gap-6 items-center">
            <li>
              <a 
                href="/" 
                className="text-white px-2 py-1 relative opacity-70"
              >
                Início
              </a>
            </li>
            <li>
              <a 
                href="/acervo" 
                className="text-white px-2 py-1 relative opacity-70"
              >
                Acervo
              </a>
            </li>
            {/* Placeholder para botões de autenticação */}
            <li>
              <div className="bg-gray-600 text-transparent px-6 py-2 rounded animate-pulse">
                Carregando
              </div>
            </li>
            <li>
              <div className="bg-gray-600 text-transparent px-6 py-2 rounded animate-pulse">
                Carregando
              </div>
            </li>
          </ul>
        </nav>
      </header>
    );
  }

  // Se o usuário estiver autenticado, usar o header específico
  if (isAuthenticated) {
    return <AuthenticatedHeader />;
  }

  // Header padrão para usuários não autenticados
  return (
    <header className="px-4 md:px-20 py-4 border-b-8 border-[#FFD147] flex flex-col md:flex-row justify-between items-center bg-[#1C1607]">
      <h1>
        <a href="/" className="flex">
          <img src="/logo.png" alt="eLibros" className="w-48 md:w-52" />
        </a>
      </h1>
      
      <nav className="mt-4 md:mt-0">
        <ul className="flex gap-4 md:gap-6 items-center">
          <li>
            <a 
              href="/" 
              className="text-white px-2 py-1 border-b border-[#FFD147] relative group hover:before:visible hover:before:scale-x-100 before:content-[''] before:absolute before:w-full before:h-px before:bottom-0 before:left-0 before:bg-[#FFD147] before:invisible before:scale-x-0 before:transition-all before:duration-200"
            >
              Início
            </a>
          </li>
          <li>
            <a 
              href="/acervo" 
              className="text-white px-2 py-1 relative group hover:before:visible hover:before:scale-x-100 before:content-[''] before:absolute before:w-full before:h-px before:bottom-0 before:left-0 before:bg-[#FFD147] before:invisible before:scale-x-0 before:transition-all before:duration-200"
            >
              Acervo
            </a>
          </li>
          <li>
            <a 
              href="/registro" 
              className="bg-white text-[#1C1607] px-6 py-2 rounded hover:bg-gray-200 transition-colors duration-300"
              id="cadastrar"
            >
              Cadastrar
            </a>
          </li>
          <li>
            <a 
              href="/login" 
              className="bg-[#FFD147] text-[#1C1607] px-6 py-2 rounded hover:bg-[#fac423] transition-colors duration-300"
              id="entrar"
            >
              Entrar
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
