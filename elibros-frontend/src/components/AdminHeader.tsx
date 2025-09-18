'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="bg-[#1C1607] text-white py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/icons/logo.svg"
            alt="eLibros Logo"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <span className="text-xl font-bold text-[#FFD147]">ELIBROS</span>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/admin" className="hover:text-[#FFD147] transition-colors">
            Início
          </Link>
          <Link href="/admin/clientes" className="hover:text-[#FFD147] transition-colors">
            Clientes
          </Link>
          <Link href="/admin/pedidos" className="hover:text-[#FFD147] transition-colors">
            Pedidos
          </Link>
          <Link href="/admin/generos" className="hover:text-[#FFD147] transition-colors">
            Gêneros
          </Link>
          <Link href="/admin/categorias" className="hover:text-[#FFD147] transition-colors">
            Categorias
          </Link>
        </nav>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 hover:text-[#FFD147] transition-colors"
          >
            <div className="w-8 h-8 bg-[#FFD147] rounded-full flex items-center justify-center text-[#1C1607] font-semibold">
              {user?.nome?.[0] || user?.username?.[0] || 'A'}
            </div>
            <span className="hidden md:inline">{user?.nome || user?.username || 'Admin'}</span>
          </button>

          {/* Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">{user?.nome || user?.username}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <Link
                href="/admin/perfil"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                Meu Perfil
              </Link>
              <Link
                href="/admin/configuracoes"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                Configurações
              </Link>
              <hr className="my-1" />
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}