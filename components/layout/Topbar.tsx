'use client';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NotificationBell from '@/components/dashboard/NotificationBell';

interface TopbarProps {
  onMenuClick: () => void;
  title?:      string;
}

export default function Topbar({ onMenuClick, title }: TopbarProps) {
  const { user } = useAuth();
  const router   = useRouter();
  const [search, setSearch] = useState('');

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = user?.first_name || user?.username || 'there';

  return (
    <header className="sticky top-0 z-30 h-16 bg-navy-900/80 backdrop-blur-xl border-b border-white/5 flex items-center gap-4 px-4 lg:px-6">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Title / Greeting */}
      <div className="flex-1 min-w-0">
        {title ? (
          <h1 className="font-display font-bold text-white text-lg truncate">{title}</h1>
        ) : (
          <div>
            <p className="text-xs text-slate-500 leading-none">{greeting()},</p>
            <p className="font-display font-bold text-white text-base leading-tight">{displayName} 👋</p>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-4 py-2 w-56 transition-all focus-within:border-brand-500/50 focus-within:bg-brand-500/5">
        <span className="text-slate-500 text-sm">🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search Stackora…"
          className="bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none flex-1"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-slate-600 hover:text-slate-300 text-xs">✕</button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <NotificationBell />

        {/* Avatar */}
        <button
          onClick={() => router.push('/dashboard/profile')}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-teal-400 flex items-center justify-center font-display font-bold text-white text-sm hover:ring-2 hover:ring-brand-400/50 transition-all"
        >
          {((user?.first_name?.[0] || '') + (user?.last_name?.[0] || user?.username?.[0] || '')).toUpperCase() || '?'}
        </button>
      </div>
    </header>
  );
}
