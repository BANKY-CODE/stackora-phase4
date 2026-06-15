'use client';

import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  requireVerified?: boolean;
  fallback?: React.ReactNode;
}

export default function RoleGuard({
  children,
  allowedRoles,
  requireVerified = false,
  fallback,
}: RoleGuardProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading Stackora…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (requireVerified && !user?.is_email_verified) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-navy-950">
        <div className="text-center max-w-sm mx-auto p-8">
          <div className="text-4xl mb-4">📧</div>
          <h2 className="text-xl font-bold text-white mb-2 font-display">Verify your email</h2>
          <p className="text-slate-400 text-sm">Please check your inbox and verify your email to access this page.</p>
        </div>
      </div>
    );
  }

  if (allowedRoles && user) {
    const hasRole = allowedRoles.some(r => user.roles.includes(r));
    if (!hasRole) {
      return fallback || (
        <div className="min-h-screen flex items-center justify-center bg-navy-950">
          <div className="text-center max-w-sm mx-auto p-8">
            <div className="text-4xl mb-4">🚫</div>
            <h2 className="text-xl font-bold text-white mb-2 font-display">Access denied</h2>
            <p className="text-slate-400 text-sm">You don't have permission to view this page.</p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
