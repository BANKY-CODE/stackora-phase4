'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'success', title: 'Welcome to Stackora!', message: 'Your account is set up and ready.', read: false, time: '2m ago' },
  { id: '2', type: 'info',    title: 'New course available', message: 'Ethical Hacking Masterclass is now live.', read: false, time: '1h ago' },
  { id: '3', type: 'alert',   title: 'Verify your email',   message: 'Please verify your email to unlock all features.', read: false, time: '2h ago' },
  { id: '4', type: 'info',    title: 'Community update',    message: 'New posts in Security Pros NG group.', read: true, time: '1d ago' },
  { id: '5', type: 'success', title: 'Profile updated',     message: 'Your profile was updated successfully.', read: true, time: '2d ago' },
];

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(MOCK_NOTIFICATIONS);
  const router = useRouter();

  const unread = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));

  const iconColor = (type: string) =>
    type === 'success' ? 'text-emerald-400' :
    type === 'alert'   ? 'text-red-400' :
    'text-brand-400';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Notifications"
      >
        🔔
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-navy-950">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 w-80 bg-navy-800 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
              <span className="font-display font-bold text-white text-sm">Notifications</span>
              <div className="flex items-center gap-2">
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-xs text-brand-400 hover:text-brand-300">
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => { router.push('/dashboard/notifications'); setOpen(false); }}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  See all →
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifs.map(n => (
                <div
                  key={n.id}
                  className={`flex gap-3 px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${!n.read ? 'bg-brand-500/5' : ''}`}
                  onClick={() => setNotifs(x => x.map(i => i.id === n.id ? { ...i, read: true } : i))}
                >
                  <span className={`text-base flex-shrink-0 mt-0.5 ${iconColor(n.type)}`}>
                    {n.type === 'success' ? '✅' : n.type === 'alert' ? '🔴' : 'ℹ️'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-xs font-semibold truncate ${!n.read ? 'text-white' : 'text-slate-300'}`}>{n.title}</p>
                      <span className="text-[10px] text-slate-600 flex-shrink-0">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                  {!n.read && <div className="w-1.5 h-1.5 bg-brand-400 rounded-full flex-shrink-0 mt-1.5" />}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
