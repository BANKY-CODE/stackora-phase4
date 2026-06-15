'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { usersApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState({
    firstName: user?.first_name || '',
    lastName:  user?.last_name  || '',
    bio:       user?.bio        || '',
    phone:     user?.phone      || '',
    country:   user?.country    || 'Nigeria',
  });

  const initials = ((user?.first_name?.[0] || '') + (user?.last_name?.[0] || user?.username?.[0] || '')).toUpperCase();
  const displayName = user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.username;

  const roleColors: Record<string, string> = {
    admin: 'bg-red-500/15 text-red-400 border-red-500/30',
    moderator: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    instructor: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    vendor: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    user: 'bg-brand-500/15 text-brand-400 border-brand-500/30',
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await usersApi.updateProfile(form);
      await refreshUser();
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-up">

        {/* Banner + Avatar */}
        <div className="bg-navy-800 border border-white/8 rounded-2xl overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-brand-700 via-brand-600 to-teal-600 relative">
            <div className="absolute -bottom-10 left-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-400 flex items-center justify-center font-display font-bold text-white text-3xl border-4 border-navy-800 shadow-xl">
                {initials || '?'}
              </div>
            </div>
          </div>

          <div className="pt-14 px-6 pb-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h2 className="font-display font-bold text-white text-xl">{displayName}</h2>
                <p className="text-sm text-slate-500">@{user?.username}</p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {user?.roles.map(role => (
                    <span key={role} className={`badge border ${roleColors[role] || roleColors.user}`}>
                      {role}
                    </span>
                  ))}
                  <span className={`badge border ${user?.is_email_verified ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'}`}>
                    {user?.is_email_verified ? '✓ Verified' : '⚠ Unverified'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => editing ? handleSave() : setEditing(true)}
                disabled={saving}
                className="btn-primary flex items-center gap-2"
              >
                {saving ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                ) : editing ? '💾 Save changes' : '✏️ Edit profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-navy-800 border border-white/8 rounded-2xl p-6 space-y-5">
            <h3 className="font-display font-bold text-white">Personal Information</h3>

            <div>
              <label className="label">First Name</label>
              {editing ? (
                <input className="input" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="First name" />
              ) : (
                <p className="text-sm text-slate-300">{user?.first_name || '—'}</p>
              )}
            </div>

            <div>
              <label className="label">Last Name</label>
              {editing ? (
                <input className="input" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Last name" />
              ) : (
                <p className="text-sm text-slate-300">{user?.last_name || '—'}</p>
              )}
            </div>

            <div>
              <label className="label">Phone</label>
              {editing ? (
                <input className="input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+234 000 000 0000" />
              ) : (
                <p className="text-sm text-slate-300">{user?.phone || '—'}</p>
              )}
            </div>

            <div>
              <label className="label">Country</label>
              {editing ? (
                <select className="input" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}>
                  <option>Nigeria</option><option>Ghana</option><option>Kenya</option>
                  <option>South Africa</option><option>Uganda</option><option>Other</option>
                </select>
              ) : (
                <p className="text-sm text-slate-300">{user?.country || '—'}</p>
              )}
            </div>

            {editing && (
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '💾'} Save
                </button>
                <button onClick={() => setEditing(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-navy-800 border border-white/8 rounded-2xl p-6">
              <h3 className="font-display font-bold text-white mb-5">Account Details</h3>
              <div className="space-y-4">
                <Row label="Email"    value={user?.email || '—'} />
                <Row label="Username" value={`@${user?.username || '—'}`} />
                <Row label="Member since" value={user?.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'} />
                <Row label="Last login" value={user?.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'First session'} />
              </div>
            </div>

            <div className="bg-navy-800 border border-white/8 rounded-2xl p-6">
              <h3 className="font-display font-bold text-white mb-5">Bio</h3>
              {editing ? (
                <textarea
                  className="input resize-none"
                  rows={4}
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Tell the community about yourself…"
                  maxLength={500}
                />
              ) : (
                <p className="text-sm text-slate-400 leading-relaxed">{user?.bio || 'No bio yet. Click Edit profile to add one.'}</p>
              )}
            </div>

            {/* Referral */}
            <div className="bg-navy-800 border border-white/8 rounded-2xl p-6">
              <h3 className="font-display font-bold text-white mb-3">Referral Link</h3>
              <p className="text-xs text-slate-500 mb-3">Earn ₦500 for every new paid member you refer.</p>
              <div className="flex items-center gap-2 bg-navy-700 border border-white/8 rounded-xl p-3">
                <code className="text-xs text-brand-400 flex-1 truncate">
                  stackora.ng/ref/{user?.username}
                </code>
                <button
                  onClick={() => { navigator.clipboard.writeText(`https://stackora.ng/ref/${user?.username}`); toast.success('Link copied!'); }}
                  className="text-xs text-slate-400 hover:text-white transition-colors flex-shrink-0"
                >
                  📋 Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-xs text-slate-500 uppercase tracking-wide">{label}</span>
      <span className="text-sm text-slate-300 text-right max-w-[60%] truncate">{value}</span>
    </div>
  );
}
