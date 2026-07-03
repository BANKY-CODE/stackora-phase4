'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { marketplaceApi } from '@/lib/api';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string | number;
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',   href: '/dashboard',            icon: '▦' },
  { label: 'Academy',     href: '/dashboard/academy',    icon: '🛡' },
  { label: 'Tools Hub',   href: '/dashboard/tools',      icon: '🔗' },
  { label: 'Marketplace', href: '/dashboard/marketplace', icon: '🛒' },
  { label: 'Community',   href: '/dashboard/community',   icon: '👥', badge: 3 },
  { label: 'Wallet',      href: '/dashboard/wallet',      icon: '💳' },
  { label: 'AI Assistant', href: '/dashboard/ai', icon: '🤖' },
  { label: 'Analytics', href: '/dashboard/analytics', icon: '📊' },
];

const ADMIN_ITEMS: NavItem[] = [
  { label: 'Course Review', href: '/dashboard/marketplace/review', icon: '🛡', roles: ['admin', 'moderator'] },
  { label: 'Users',         href: '/dashboard/users',              icon: '👤', roles: ['admin'] },
];

const BOTTOM_ITEMS: NavItem[] = [
  { label: 'Notifications', href: '/dashboard/notifications', icon: '🔔', badge: 5 },
  { label: 'Settings',      href: '/dashboard/settings',      icon: '⚙' },
  { label: 'Profile',       href: '/dashboard/profile',       icon: '👤' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [pendingCount, setPendingCount] = useState<number>(0);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  const visibleAdminItems = ADMIN_ITEMS.filter(item =>
    !item.roles || item.roles.some(r => user?.roles.includes(r as any))
  );

  const isAdmin = user?.roles.includes('admin') || user?.roles.includes('moderator');

  useEffect(() => {
    if (isAdmin) {
      marketplaceApi.pendingCount()
        .then(res => setPendingCount(res.data.count))
        .catch(() => {});
    }
  }, [isAdmin]);

  const adminItemsWithBadge = visibleAdminItems.map(item =>
    item.href === '/dashboard/marketplace/review' && pendingCount > 0
      ? { ...item, badge: pendingCount }
      : item
  );

  const avatarInitials = user
    ? ((user.first_name?.[0] || '') + (user.last_name?.[0] || user.username?.[0] || '')).toUpperCase()
    : '?';

  const roleLabel = user?.roles.includes('admin') ? 'Admin'
    : user?.roles.includes('moderator') ? 'Moderator'
    : user?.roles.includes('instructor') ? 'Instructor'
    : user?.roles.includes('vendor') ? 'Vendor'
    : 'Member';

  const roleBadgeColor = user?.roles.includes('admin') ? 'bg-red-500/20 text-red-400'
    : user?.roles.includes('moderator') ? 'bg-orange-500/20 text-orange-400'
    : user?.roles.includes('instructor') ? 'bg-teal-500/20 text-teal-400'
    : user?.roles.includes('vendor') ? 'bg-gold-400/20 text-gold-400'
    : 'bg-brand-500/20 text-brand-400';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={clsx(
        'fixed top-0 left-0 h-full w-[260px] bg-navy-900 border-r border-white/5 z-50',
        'flex flex-col transition-transform duration-300',
        'lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-teal-400 flex items-center justify-center font-display font-bold text-white text-sm shadow-lg shadow-brand-500/30">
            S
          </div>
          <div>
            <span className="font-display font-bold text-white text-lg">Stack<span className="text-brand-400">ora</span></span>
            <div className="text-[10px] text-slate-500 leading-none">Digital Ecosystem</div>
          </div>
          <button onClick={onClose} className="ml-auto text-slate-500 hover:text-white lg:hidden text-xl">✕</button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          <div className="px-3 mb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Main</div>
          {NAV_ITEMS.map(item => (
            <NavLink key={item.href} item={item} active={isActive(item.href)} onClick={() => { router.push(item.href); onClose(); }} />
          ))}

          {adminItemsWithBadge.length > 0 && (
            <>
              <div className="px-3 pt-4 mb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Management</div>
              {adminItemsWithBadge.map(item => (
                <NavLink key={item.href} item={item} active={isActive(item.href)} onClick={() => { router.push(item.href); onClose(); }} />
              ))}
            </>
          )}

          <div className="px-3 pt-4 mb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Account</div>
          {BOTTOM_ITEMS.map(item => (
            <NavLink key={item.href} item={item} active={isActive(item.href)} onClick={() => { router.push(item.href); onClose(); }} />
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-white/5 p-3">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-teal-400 flex items-center justify-center font-display font-bold text-white text-sm flex-shrink-0">
              {avatarInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">
                {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.username}
              </div>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${roleBadgeColor}`}>
                {roleLabel}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-600 hover:text-red-400 transition-colors text-sm opacity-0 group-hover:opacity-100"
              title="Sign out"
            >
              ⏻
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function NavLink({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative',
        active
          ? 'bg-brand-500/15 text-brand-400'
          : 'text-slate-400 hover:text-white hover:bg-white/5',
      )}
    >
      <span className="text-base w-5 text-center">{item.icon}</span>
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge ? (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-500 text-white">
          {item.badge}
        </span>
      ) : null}
    </button>
  );
}
