'use client';

import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useState, useEffect } from "react";

interface AuthenticatedHeaderProps {}

export default function AuthenticatedHeader({}: AuthenticatedHeaderProps) {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('#dropdown')) {
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
    <header className="px-4 md:px-20 py-4 border-b-8 border-[#FFD147] flex justify-between items-center bg-[#1C1607]">
      {/* Logo */}
      <h1>
        <a href="/" className="flex">
          <img src="/logo.png" alt="eLibros" className="w-48 md:w-52" />
        </a>
      </h1>
      
      {/* Navigation */}
      <nav className="flex">
        <ul className="flex gap-4 items-center list-none">
          <li>
            <a 
              href="/" 
              className="text-white px-1 relative nav-link-normal before:content-[''] before:absolute before:w-full before:h-px before:bottom-0 before:left-0 before:bg-[#FFD147] before:invisible before:scale-x-0 before:transition-all before:duration-200 hover:before:visible hover:before:scale-x-100"
            >
              Início
            </a>
          </li>
          <li>
            <a 
              href="/acervo" 
              className="text-white px-1 relative nav-link-normal before:content-[''] before:absolute before:w-full before:h-px before:bottom-0 before:left-0 before:bg-[#FFD147] before:invisible before:scale-x-0 before:transition-all before:duration-200 hover:before:visible hover:before:scale-x-100"
            >
              Acervo
            </a>
          </li>

          {/* Cart */}
          <li>
            <a href="/carrinho" className="relative text-white flex items-center" id="carrinho">
              <img src="/carrinho.svg" alt="Carrinho" className="w-6 h-6 brightness-0 invert" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FFD147] text-[#1C1607] text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {totalItems > 9 ? '+9' : totalItems}
                </span>
              )}
            </a>
          </li>

          {/* User Dropdown */}
          <li id="dropdown" className="relative">
            <div 
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
                <img 
                  src="/usuario.png" 
                  alt="Perfil"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Dropdown Menu */}
              <ul 
                className={`
                  absolute right-0 top-full mt-1 bg-[#1C1607] min-w-max px-3 py-1 rounded-sm flex flex-col gap-0 transition-all duration-200
                  ${isDropdownOpen ? 'visible opacity-100' : 'invisible opacity-0'}
                `}
                id="espacinho"
              >
                <li className="w-full">
                  <Link 
                    href="/perfil" 
                    className="text-white px-2 py-2 block w-full hover:text-[#FFD147] transition-all duration-200"
                  >
                    Meu perfil
                  </Link>
                </li>
                <li className="w-full border-t border-[#3B362B]">
                  <button 
                    onClick={handleLogout}
                    className="text-white px-2 py-2 block w-full text-left hover:text-red-400 transition-all duration-200"
                    id="sair"
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
