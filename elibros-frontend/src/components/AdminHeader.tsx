'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('#dropdown-admin')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="px-4 md:px-20 py-4 border-b-8 border-[#FFD147] flex flex-col md:flex-row justify-between items-center bg-[#1C1607]">
      {/* Logo */}
      <h1>
        <Link href="/admin" className="flex">
          <Image src="/logo.png" alt="eLibros" width={208} height={60} className="w-48 md:w-52" />
        </Link>
      </h1>
      
      {/* Navigation */}
      <nav className="mt-4 md:mt-0">
        <ul className="flex flex-wrap gap-4 md:gap-6 items-center">
          <li>
            <Link 
              href="/admin" 
              className="text-white px-2 py-1 relative group hover:before:visible hover:before:scale-x-100 before:content-[''] before:absolute before:w-full before:h-px before:bottom-0 before:left-0 before:bg-[#FFD147] before:invisible before:scale-x-0 before:transition-all before:duration-200"
            >
              Início
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/livros" 
              className="text-white px-2 py-1 relative group hover:before:visible hover:before:scale-x-100 before:content-[''] before:absolute before:w-full before:h-px before:bottom-0 before:left-0 before:bg-[#FFD147] before:invisible before:scale-x-0 before:transition-all before:duration-200"
            >
              Livros
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/clientes" 
              className="text-white px-2 py-1 relative group hover:before:visible hover:before:scale-x-100 before:content-[''] before:absolute before:w-full before:h-px before:bottom-0 before:left-0 before:bg-[#FFD147] before:invisible before:scale-x-0 before:transition-all before:duration-200"
            >
              Clientes
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/pedidos" 
              className="text-white px-2 py-1 relative group hover:before:visible hover:before:scale-x-100 before:content-[''] before:absolute before:w-full before:h-px before:bottom-0 before:left-0 before:bg-[#FFD147] before:invisible before:scale-x-0 before:transition-all before:duration-200"
            >
              Pedidos
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/generos" 
              className="text-white px-2 py-1 relative group hover:before:visible hover:before:scale-x-100 before:content-[''] before:absolute before:w-full before:h-px before:bottom-0 before:left-0 before:bg-[#FFD147] before:invisible before:scale-x-0 before:transition-all before:duration-200"
            >
              Gêneros
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/categorias" 
              className="text-white px-2 py-1 relative group hover:before:visible hover:before:scale-x-100 before:content-[''] before:absolute before:w-full before:h-px before:bottom-0 before:left-0 before:bg-[#FFD147] before:invisible before:scale-x-0 before:transition-all before:duration-200"
            >
              Categorias
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/cupons" 
              className="text-white px-2 py-1 relative group hover:before:visible hover:before:scale-x-100 before:content-[''] before:absolute before:w-full before:h-px before:bottom-0 before:left-0 before:bg-[#FFD147] before:invisible before:scale-x-0 before:transition-all before:duration-200"
            >
              Cupons
            </Link>
          </li>

          {/* User Dropdown */}
          <li id="dropdown-admin" className="relative">
            <div 
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
                <Image 
                  src="/usuario.png" 
                  alt="Perfil"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Dropdown Menu */}
              <ul 
                className={`
                  absolute right-0 top-full mt-1 bg-[#1C1607] min-w-max px-3 py-1 rounded-sm flex flex-col gap-0 transition-all duration-200
                  ${isDropdownOpen ? 'visible opacity-100' : 'invisible opacity-0'}
                `}
              >
                <li className="w-full">
                  <Link 
                    href="/admin/perfil" 
                    className="text-white px-2 py-2 block w-full hover:text-[#FFD147] transition-all duration-200"
                  >
                    Meu perfil
                  </Link>
                </li>
                <li className="w-full border-t border-[#3B362B]">
                  <button 
                    onClick={handleLogout}
                    className="text-white px-2 py-2 block w-full text-left hover:text-red-400 transition-all duration-200"
                  >
                    Sair
                  </button>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}