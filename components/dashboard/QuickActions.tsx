'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface Action {
  label:  string;
  icon:   string;
  href:   string;
  color:  string;
  desc:   string;
  roles?: string[];
}

const ACTIONS: Action[] = [
  { label: 'Fund Wallet',    icon: '💳', href: '/dashboard/wallet',      color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/20 hover:border-yellow-400/40', desc: 'Add money to wallet' },
  { label: 'Browse Courses', icon: '🛡️', href: '/dashboard/academy',     color: 'from-brand-500/20 to-brand-600/10 border-brand-500/20 hover:border-brand-400/40',    desc: 'Learn cybersecurity' },
  { label: 'Create Bio Link',icon: '🔗', href: '/dashboard/tools',       color: 'from-teal-500/20 to-teal-600/10 border-teal-500/20 hover:border-teal-400/40',         desc: 'Build your profile' },
  { label: 'Marketplace',    icon: '🛒', href: '/dashboard/marketplace', color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 hover:border-emerald-400/40', desc: 'Buy & sell digital goods' },
  { label: 'Community',      icon: '👥', href: '/dashboard/community',   color: 'from-purple-500/20 to-purple-600/10 border-purple-500/20 hover:border-purple-400/40',  desc: 'Connect & grow' },
  { label: 'AI Assistant',   icon: '🤖', href: '/dashboard/ai',          color: 'from-pink-500/20 to-pink-600/10 border-pink-500/20 hover:border-pink-400/40',          desc: 'Get smart help' },
];

const ADMIN_ACTIONS: Action[] = [
  { label: 'Manage Users', icon: '👤', href: '/dashboard/users',     color: 'from-red-500/20 to-red-600/10 border-red-500/20 hover:border-red-400/40', desc: 'User management', roles: ['admin'] },
  { label: 'Analytics',    icon: '📊', href: '/dashboard/analytics', color: 'from-orange-500/20 to-orange-600/10 border-orange-500/20 hover:border-orange-400/40', desc: 'Platform insights', roles: ['admin', 'moderator'] },
];

export default function QuickActions() {
  const router   = useRouter();
  const { user } = useAuth();

  const adminVisible = ADMIN_ACTIONS.filter(a =>
    !a.roles || a.roles.some(r => user?.roles.includes(r as any))
  );

  const all = [...ACTIONS, ...adminVisible];

  return (
    <div className="bg-navy-800 border border-white/8 rounded-2xl p-5">
      <h3 className="font-display font-bold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {all.map(action => (
          <button
            key={action.href}
            onClick={() => router.push(action.href)}
            className={`bg-gradient-to-br ${action.color} border rounded-xl p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg`}
          >
            <div className="text-xl mb-2">{action.icon}</div>
            <div className="text-xs font-semibold text-white leading-tight">{action.label}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{action.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
