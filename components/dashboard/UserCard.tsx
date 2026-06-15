'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function UserCard() {
  const { user } = useAuth();
  const router   = useRouter();

  if (!user) return null;

  const initials = ((user.first_name?.[0] || '') + (user.last_name?.[0] || user.username?.[0] || '')).toUpperCase();
  const displayName = user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.username;

  const roleColors: Record<string, string> = {
    admin:      'bg-red-500/15 text-red-400 border-red-500/30',
    moderator:  'bg-orange-500/15 text-orange-400 border-orange-500/30',
    instructor: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    vendor:     'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    user:       'bg-brand-500/15 text-brand-400 border-brand-500/30',
  };

  const primaryRole = user.roles.includes('admin') ? 'admin'
    : user.roles.includes('moderator') ? 'moderator'
    : user.roles.includes('instructor') ? 'instructor'
    : user.roles.includes('vendor') ? 'vendor'
    : 'user';

  return (
    <div className="bg-navy-800 border border-white/8 rounded-2xl p-5">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-400 flex items-center justify-center font-display font-bold text-white text-xl shadow-lg shadow-brand-500/25 flex-shrink-0">
          {initials || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-white truncate">{displayName}</h3>
          <p className="text-sm text-slate-500 truncate">@{user.username}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {user.roles.map(role => (
              <span key={role} className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${roleColors[role] || roleColors.user}`}>
                {role}
              </span>
            ))}
            {!user.is_email_verified && (
              <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border bg-yellow-500/15 text-yellow-400 border-yellow-500/30">
                Unverified
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/5">
        <Stat label="Courses"  value="0" />
        <Stat label="Sales"    value="0" />
        <Stat label="Points"   value="0" />
      </div>

      <button
        onClick={() => router.push('/dashboard/profile')}
        className="mt-4 w-full text-center text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors py-2 rounded-xl hover:bg-brand-500/10"
      >
        View full profile →
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-display font-bold text-white text-lg leading-none">{value}</div>
      <div className="text-[11px] text-slate-500 mt-1">{label}</div>
    </div>
  );
}
