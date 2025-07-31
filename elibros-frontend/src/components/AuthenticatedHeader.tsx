'use client';

import Link from "next/link";
import { ShoppingCart, User, ChevronDown } from "lucide-react";
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
      if (!target.closest('.user-dropdown')) {
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
      
      {/* Navigation and User Menu */}
      <div className="flex items-center gap-6">
        {/* Navigation Links */}
        <nav>
          <ul className="flex gap-6 items-center">
            <li>
              <a 
                href="/" 
                className="text-white px-2 py-1 relative group hover:before:visible hover:before:scale-x-100 before:content-[''] before:absolute before:w-full before:h-px before:bottom-0 before:left-0 before:bg-[#FFD147] before:invisible before:scale-x-0 before:transition-all before:duration-200"
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
          </ul>
        </nav>

        {/* Cart Icon */}
        <a href="/carrinho" className="relative">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-white hover:text-[#FFD147] transition-colors"
          >
            <path 
              d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V19C17 19.6 16.6 20 16 20H8C7.4 20 7 19.6 7 19V13M9 19V13M15 19V13" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#FFD147] text-[#1C1607] text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {totalItems}
            </span>
          )}
        </a>

        {/* User Avatar with Dropdown */}
        <div className="relative user-dropdown">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center"
          >
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="text-white"
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
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
              <div className="py-1">
                <Link 
                  href="/perfil" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Meu perfil
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
