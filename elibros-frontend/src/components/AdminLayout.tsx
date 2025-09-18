'use client';

import { ReactNode } from 'react';
import AdminHeader from '../components/AdminHeader';
import Footer from '../components/Footer';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FFFFF5] font-['Poppins'] text-[#1C1607] flex flex-col">
      <AdminHeader />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}