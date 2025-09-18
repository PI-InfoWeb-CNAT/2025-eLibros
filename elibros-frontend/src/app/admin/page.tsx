'use client';

import { useEffect } from 'react';
import AdminProtectedRoute from '../../components/AdminProtectedRoute';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminStats, useRecentActivities } from '../../hooks/useAdmin';

interface AdminCardProps {
  title: string;
  icon: React.ReactNode;
  href: string;
}

function AdminCard({ title, icon, href }: AdminCardProps) {
  return (
    <a 
      href={href}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow duration-200 cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className="text-4xl text-gray-700 group-hover:text-[#1C1607] transition-colors">
          {icon}
        </div>
        <h2 className="text-xl font-medium text-gray-900 group-hover:text-[#1C1607]">
          {title}
        </h2>
      </div>
    </a>
  );
}

export default function AdminPage() {
  const { user } = useAuth();
  const { stats, loading: statsLoading, error: statsError } = useAdminStats();
  const { activities, loading: activitiesLoading, error: activitiesError } = useRecentActivities();

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900">
              Bem vindo, {user?.nome || 'Admin'}!
            </h1>
          </div>

          {/* Stats Cards */}
          {statsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow-sm border animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-600">Livros</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total_livros}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-600">Clientes</p>
                <p className="text-2xl font-bold text-green-600">{stats.total_clientes}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-600">Pedidos</p>
                <p className="text-2xl font-bold text-orange-600">{stats.total_pedidos}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-600">Gêneros</p>
                <p className="text-2xl font-bold text-purple-600">{stats.total_generos}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-600">Categorias</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.total_categorias}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-red-600">{stats.total_administradores}</p>
              </div>
            </div>
          ) : statsError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-600">Erro ao carregar estatísticas: {statsError}</p>
            </div>
          ) : null}

          {/* Admin Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {/* Manter Livros */}
            <AdminCard
              title="Manter Livros"
              icon={
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                  <path d="M6 2C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2H6Z" />
                  <path d="M14 2V8H20" />
                </svg>
              }
              href="/admin/livros"
            />

            {/* Manter Pedidos */}
            <AdminCard
              title="Manter Pedidos"
              icon={
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                  <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" />
                </svg>
              }
              href="/admin/pedidos"
            />

            {/* Manter Clientes */}
            <AdminCard
              title="Manter Clientes"
              icon={
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5L13.5 7.23C12.5 7.09 11.5 7.09 10.5 7.23L9 7.5L3 7V9L9 8.5C11 8.5 13 8.5 15 8.5L21 9ZM12 8C8.69 8 6 10.69 6 14V16L3 19V21H21V19L18 16V14C18 10.69 15.31 8 12 8Z" />
                </svg>
              }
              href="/admin/clientes"
            />

            {/* Manter Gêneros */}
            <AdminCard
              title="Manter Gêneros"
              icon={
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                  <path d="M9.5 3C11.43 3 13 4.57 13 6.5S11.43 10 9.5 10 6 8.43 6 6.5 7.57 3 9.5 3M9.5 5C8.67 5 8 5.67 8 6.5S8.67 8 9.5 8 11 7.33 11 6.5 10.33 5 9.5 5M18.5 9C19.88 9 21 10.12 21 11.5S19.88 14 18.5 14 16 12.88 16 11.5 17.12 9 18.5 9M18.5 11C18.22 11 18 11.22 18 11.5S18.22 12 18.5 12 19 11.78 19 11.5 18.78 11 18.5 11M16.5 18C17.88 18 19 19.12 19 20.5S17.88 23 16.5 23 14 21.88 14 20.5 15.12 18 16.5 18Z" />
                </svg>
              }
              href="/admin/generos"
            />

            {/* Manter Categorias */}
            <AdminCard
              title="Manter Categorias"
              icon={
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                  <path d="M3 5V19C3 20.1 3.9 21 5 21H11V19H5V5H19V11H21V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5ZM16 13V16H19V18H16V21H14V18H11V16H14V13H16Z" />
                </svg>
              }
              href="/admin/categorias"
            />

            {/* Manter Cupons */}
            <AdminCard
              title="Manter Cupons"
              icon={
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                  <path d="M12.79 21L3 11.21V2H11.21L21 11.79L12.79 21ZM7 9C7.55 9 8 8.55 8 8S7.55 7 7 7 6 7.45 6 8 6.45 9 7 9Z" />
                </svg>
              }
              href="/admin/cupons"
            />
          </div>

          {/* Recent Activities */}
          {!activitiesLoading && activities && (
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-medium mb-4">Pedidos Recentes</h3>
                <div className="space-y-3">
                  {activities.recent_orders.map(order => (
                    <div key={order.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium">{order.numero_pedido}</p>
                        <p className="text-sm text-gray-600">{order.cliente_nome}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">R$ {order.valor_total}</p>
                        <p className="text-sm text-gray-600">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Clients */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-medium mb-4">Clientes Recentes</h3>
                <div className="space-y-3">
                  {activities.recent_clients.map(client => (
                    <div key={client.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium">{client.nome}</p>
                        <p className="text-sm text-gray-600">{client.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {new Date(client.data_cadastro).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}