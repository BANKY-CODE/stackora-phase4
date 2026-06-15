'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar  from './Topbar';
import RoleGuard from '@/components/ui/RoleGuard';
import { Role } from '@/types';

interface DashboardLayoutProps {
  children:     React.ReactNode;
  title?:       string;
  allowedRoles?: Role[];
  requireVerified?: boolean;
}

export default function DashboardLayout({ children, title, allowedRoles, requireVerified }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RoleGuard allowedRoles={allowedRoles} requireVerified={requireVerified}>
      <div className="min-h-screen bg-navy-950 font-sans">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main area */}
        <div className="lg:ml-[260px] flex flex-col min-h-screen">
          <Topbar onMenuClick={() => setSidebarOpen(true)} title={title} />
          <main className="flex-1 p-4 lg:p-6 max-w-[1400px] w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
