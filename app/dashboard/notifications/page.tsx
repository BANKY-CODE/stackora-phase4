'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import clsx from 'clsx';

const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'success', title: 'Welcome to Stackora!',     message: 'Your account has been created. Explore the platform to get started.',        read: false, time: '2 minutes ago',  category: 'account' },
  { id: '2', type: 'info',    title: 'New course available',     message: 'Ethical Hacking Masterclass is now live in the Academy.',                     read: false, time: '1 hour ago',     category: 'academy' },
  { id: '3', type: 'warning', title: 'Verify your email',        message: 'Please verify your email address to unlock wallet and marketplace features.', read: false, time: '2 hours ago',    category: 'account' },
  { id: '4', type: 'info',    title: 'Community post trending',  message: '"How I passed CEH on first attempt" is trending in Security Pros NG.',        read: true,  time: '5 hours ago',    category: 'community' },
  { id: '5', type: 'success', title: 'Platform update',          message: 'Stackora Phase 3 is live! Auth system and user management are ready.',        read: true,  time: '1 day ago',      category: 'platform' },
  { id: '6', type: 'info',    title: 'Referral program',         message: 'Earn ₦500 for every paid user you refer. Share your link today!',            read: true,  time: '2 days ago',     category: 'account' },
];

const TYPE_CONFIG = {
  success: { icon: '✅', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  info:    { icon: 'ℹ️',  color: 'text-brand-400',   bg: 'bg-brand-500/10 border-brand-500/20'   },
  warning: { icon: '⚠️', color: 'text-yellow-400',  bg: 'bg-yellow-500/10 border-yellow-500/20' },
  alert:   { icon: '🔴', color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20'       },
};

type FilterType = 'all' | 'unread' | 'account' | 'academy' | 'community' | 'platform';

export default function NotificationsPage() {
  const [notifs,  setNotifs]  = useState(MOCK_NOTIFICATIONS);
  const [filter,  setFilter]  = useState<FilterType>('all');

  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const markRead = (id: string) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  const deleteNotif = (id: string) => setNotifs(n => n.filter(x => x.id !== id));

  const filtered = notifs.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'all') return true;
    return n.category === filter;
  });

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all',       label: `All (${notifs.length})` },
    { id: 'unread',    label: `Unread (${unreadCount})` },
    { id: 'account',   label: 'Account' },
    { id: 'academy',   label: 'Academy' },
    { id: 'community', label: 'Community' },
    { id: 'platform',  label: 'Platform' },
  ];

  return (
    <DashboardLayout title="Notifications">
      <div className="max-w-2xl mx-auto animate-fade-up">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-white text-xl">Notifications</h2>
            <p className="text-sm text-slate-500">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="btn-ghost text-xs">Mark all as read</button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={clsx(
                'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                filter === f.id
                  ? 'bg-brand-500 text-white'
                  : 'bg-navy-800 border border-white/8 text-slate-400 hover:text-white hover:border-white/20'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">🔔</div>
              <p className="text-slate-400 font-medium">No notifications here</p>
              <p className="text-sm text-slate-600 mt-1">Check back later</p>
            </div>
          ) : filtered.map(n => {
            const cfg = TYPE_CONFIG[n.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.info;
            return (
              <div
                key={n.id}
                className={clsx(
                  'flex gap-4 p-5 rounded-2xl border transition-all',
                  !n.read ? cfg.bg : 'bg-navy-800 border-white/8',
                )}
              >
                <div className={`text-xl flex-shrink-0 mt-0.5 ${cfg.color}`}>{cfg.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${!n.read ? 'text-white' : 'text-slate-300'}`}>{n.title}</p>
                    <span className="text-[11px] text-slate-600 flex-shrink-0">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-3 mt-3">
                    {!n.read && (
                      <button onClick={() => markRead(n.id)} className="text-[11px] text-brand-400 hover:text-brand-300 font-medium">Mark as read</button>
                    )}
                    <button onClick={() => deleteNotif(n.id)} className="text-[11px] text-slate-600 hover:text-red-400 font-medium">Dismiss</button>
                  </div>
                </div>
                {!n.read && <div className="w-2 h-2 bg-brand-400 rounded-full flex-shrink-0 mt-2" />}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
