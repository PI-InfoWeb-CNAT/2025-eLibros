"use client";

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFFF5] font-['Poppins'] text-[#1C1607] flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD147] mb-4"></div>
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  // Se não estiver autenticado, não renderiza nada (redirecionamento já foi feito)
  if (!isAuthenticated) {
    return null;
  }

  // Se estiver autenticado, renderiza o conteúdo
  return <>{children}</>;
}
