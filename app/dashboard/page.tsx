'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import UserCard from '@/components/dashboard/UserCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import QuickActions from '@/components/dashboard/QuickActions';
import { useAuth } from '@/context/AuthContext';

function StatCard({ label, value, change, up, icon, color }: {
  label: string; value: string; change: string; up: boolean; icon: string; color: string;
}) {
  return (
    <div className="bg-navy-800 border border-white/8 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-lg`}>{icon}</div>
        <span className={`text-xs font-semibold ${up ? 'text-emerald-400' : 'text-red-400'}`}>
          {up ? '↑' : '↓'} {change}
        </span>
      </div>
      <div className="font-display font-bold text-white text-2xl">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </div>
  );
}

function AdminView() {
  return (
    <div className="mb-6 p-5 bg-red-500/5 border border-red-500/20 rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl">🔑</span>
        <div>
          <h3 className="font-display font-bold text-white">Admin Panel</h3>
          <p className="text-xs text-slate-500">Full platform access</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Users',    value: '—', icon: '👥', color: 'bg-brand-500/15' },
          { label: 'Active Today',   value: '—', icon: '📊', color: 'bg-teal-500/15' },
          { label: 'Revenue',        value: '—', icon: '💰', color: 'bg-yellow-500/15' },
          { label: 'Pending Issues', value: '—', icon: '⚠️', color: 'bg-red-500/15' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl p-3 text-center`}>
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="font-display font-bold text-white text-lg">{s.value}</div>
            <div className="text-[10px] text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InstructorView() {
  return (
    <div className="mb-6 p-5 bg-teal-500/5 border border-teal-500/20 rounded-2xl">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl">🎓</span>
        <div>
          <h3 className="font-display font-bold text-white">Instructor Dashboard</h3>
          <p className="text-xs text-slate-500">Manage your courses and students</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Courses', value: '0', icon: '📚', color: 'bg-teal-500/15' },
          { label: 'Students', value: '0', icon: '👨‍🎓', color: 'bg-brand-500/15' },
          { label: 'Earnings', value: '₦0', icon: '💳', color: 'bg-yellow-500/15' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl p-3 text-center`}>
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="font-display font-bold text-white text-lg">{s.value}</div>
            <div className="text-[10px] text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VendorView() {
  return (
    <div className="mb-6 p-5 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl">🛒</span>
        <div>
          <h3 className="font-display font-bold text-white">Vendor Dashboard</h3>
          <p className="text-xs text-slate-500">Your marketplace performance</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Products', value: '0', icon: '📦', color: 'bg-yellow-500/15' },
          { label: 'Sales', value: '0', icon: '💰', color: 'bg-emerald-500/15' },
          { label: 'Revenue', value: '₦0', icon: '📈', color: 'bg-brand-500/15' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl p-3 text-center`}>
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="font-display font-bold text-white text-lg">{s.value}</div>
            <div className="text-[10px] text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-up">

        {/* Role-based panel */}
        {user?.roles.includes('admin')      && <AdminView />}
        {user?.roles.includes('instructor') && !user.roles.includes('admin') && <InstructorView />}
        {user?.roles.includes('vendor')     && !user.roles.includes('admin') && <VendorView />}

        {/* Email verification banner */}
        {user && !user.is_email_verified && (
          <div className="flex items-center gap-4 p-4 bg-yellow-500/8 border border-yellow-500/25 rounded-2xl">
            <span className="text-2xl flex-shrink-0">📧</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-yellow-300">Verify your email address</p>
              <p className="text-xs text-slate-500 mt-0.5">Check your inbox and click the verification link to unlock all features.</p>
            </div>
            <button className="btn-outline text-xs py-1.5 px-4 flex-shrink-0 border-yellow-500/30 text-yellow-400 hover:border-yellow-400/50">
              Resend
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Wallet Balance"    value="₦0"    change="0%" up={true}  icon="💳" color="bg-yellow-500/15" />
          <StatCard label="Courses Enrolled"  value="0"     change="0"  up={true}  icon="🛡️" color="bg-brand-500/15" />
          <StatCard label="Referral Earned"   value="₦0"    change="0%" up={true}  icon="👥" color="bg-teal-500/15"   />
          <StatCard label="Marketplace Sales" value="0"     change="0"  up={true}  icon="🛒" color="bg-emerald-500/15" />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <UserCard />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <QuickActions />
            <ActivityFeed />
          </div>
        </div>

        {/* Module cards */}
        <div>
          <h3 className="font-display font-bold text-white mb-4">Explore Stackora</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Academy',     icon: '🛡️', desc: '200+ security courses',      color: 'from-brand-500/20',   href: '/dashboard/academy' },
              { name: 'Marketplace', icon: '🛒', desc: 'Buy & sell digital products', color: 'from-emerald-500/20', href: '/dashboard/marketplace' },
              { name: 'Community',   icon: '👥', desc: '50k+ members worldwide',      color: 'from-purple-500/20',  href: '/dashboard/community' },
              { name: 'Wallet',      icon: '💳', desc: 'VTU & fintech services',      color: 'from-yellow-500/20',  href: '/dashboard/wallet' },
            ].map(m => (
              <div key={m.name} className={`bg-gradient-to-br ${m.color} to-transparent border border-white/8 rounded-2xl p-5 cursor-pointer hover:border-white/20 transition-all hover:-translate-y-1`}>
                <div className="text-2xl mb-3">{m.icon}</div>
                <div className="font-display font-bold text-white text-sm">{m.name}</div>
                <div className="text-xs text-slate-500 mt-1">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
