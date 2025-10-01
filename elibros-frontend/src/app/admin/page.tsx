'use client';

import Image from 'next/image';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStats } from '@/hooks/useAdmin';

interface AdminCardProps {
  title: string;
  icon: string;
  href: string;
}

function AdminCard({ title, icon, href }: AdminCardProps) {
  return (
    <a 
      href={href}
      className="bg-white rounded-lg shadow-lg border border-gray-200 p-12 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105"
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="text-6xl text-gray-700 group-hover:text-[#1C1607] transition-colors">
          <Image 
            src={icon} 
            alt={title} 
            width={80} 
            height={80} 
            className="w-20 h-20 object-contain"
          />
        </div>
        <h2 className="text-2xl font-medium text-gray-900 group-hover:text-[#1C1607]">
          {title}
        </h2>
      </div>
    </a>
  );
}

export default function AdminPage() {
  const { user } = useAuth();
  const { stats, loading: statsLoading, error: statsError } = useAdminStats();

  const getDisplayName = () => {
    if (user?.nome && user.nome !== 'Nome não informado') {
      return user.nome;
    }
    if (user?.username) {
      return user.username;
    }
    return 'Admin';
  };

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-light text-gray-900">
              Bem vindo, {getDisplayName()}!
            </h1>
          </div>

          {statsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow-sm border animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-600">Livros</p>
                <p className="text-2xl font-bold text-[#FFCD35]">{stats.total_livros}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-600">Clientes</p>
                <p className="text-2xl font-bold text-[#FFCD35]">{stats.total_clientes}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-600">Pedidos</p>
                <p className="text-2xl font-bold text-[#FFCD35]">{stats.total_pedidos}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-600">Gêneros</p>
                <p className="text-2xl font-bold text-[#FFCD35]">{stats.total_generos}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-600">Categorias</p>
                <p className="text-2xl font-bold text-[#FFCD35]">{stats.total_categorias}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-[#FFCD35]">{stats.total_administradores}</p>
              </div>
            </div>
          ) : statsError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-12">
              <p className="text-red-600">Erro ao carregar estatísticas: {statsError}</p>
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <AdminCard
              title="Manter Livros"
              icon="/icons/manterlivro.png"
              href="/admin/livros"
            />

            <AdminCard
              title="Manter Pedidos"
              icon="/icons/manterpedido.png"
              href="/admin/pedidos"
            />

            <AdminCard
              title="Manter Clientes"
              icon="/icons/mantercliente.png"
              href="/admin/clientes"
            />

            <AdminCard
              title="Manter Gêneros"
              icon="/icons/mantergenero.png"
              href="/admin/generos"
            />

            <AdminCard
              title="Manter Categorias"
              icon="/icons/mantercategoria.svg"
              href="/admin/categorias"
            />

            <AdminCard
              title="Manter Cupons"
              icon="/icons/mantercupom.png"
              href="/admin/cupons"
            />
          </div>

        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
