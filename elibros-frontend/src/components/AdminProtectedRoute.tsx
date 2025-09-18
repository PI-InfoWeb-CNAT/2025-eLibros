'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { adminApi } from '../services/adminApi';

interface AdminProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function AdminProtectedRoute({ 
  children, 
  redirectTo = '/login' 
}: AdminProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isLoading && isAuthenticated && user) {
        try {
          // Usar a nova API para verificar se é admin
          const isAdminUser = await adminApi.isCurrentUserAdmin();
          
          if (!isAdminUser) {
            console.log('❌ Usuário não é administrador');
            router.push('/'); // Redirecionar para home se não for admin
            return;
          }
          
          console.log('✅ Usuário é administrador');
          setIsAdmin(true);
        } catch (error) {
          console.error('Erro ao verificar status de admin:', error);
          router.push('/');
        }
      } else if (!isLoading && !isAuthenticated) {
        console.log('❌ Usuário não autenticado, redirecionando para login');
        router.push(redirectTo);
      }
      
      setIsCheckingAdmin(false);
    };

    checkAdminStatus();
  }, [isAuthenticated, isLoading, user, router, redirectTo]);

  // Mostrar loading enquanto verifica autenticação e status de admin
  if (isLoading || isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-[#FFFFF5] font-['Poppins'] text-[#1C1607] flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD147] mb-4"></div>
        <p>Verificando permissões de administrador...</p>
      </div>
    );
  }

  // Se não estiver autenticado ou não for admin, não renderiza nada (redirecionamento já foi feito)
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  // Se chegou aqui, é um admin autenticado
  return <>{children}</>;
}