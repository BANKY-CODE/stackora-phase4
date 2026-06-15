'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors ${on ? 'bg-brand-500' : 'bg-navy-600'} flex-shrink-0`}
      role="switch"
      aria-checked={on}
    >
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

function SettingRow({ label, desc, on, onChange }: { label: string; desc?: string; on: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>
  );
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState({
    pushNotifications:   true,
    emailNotifications:  true,
    smsAlerts:           false,
    twoFactor:           user?.is_2fa_enabled || false,
    transactionPin:      true,
    loginAlerts:         true,
    darkMode:            true,
    compactView:         false,
    marketingEmails:     false,
  });

  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [changingPass, setChangingPass]  = useState(false);
  const [showSection,  setShowSection]   = useState('notifications');

  const toggle = (key: keyof typeof settings) =>
    setSettings(s => ({ ...s, [key]: !s[key] }));

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast.error('New passwords do not match'); return;
    }
    if (passwordForm.newPass.length < 8) {
      toast.error('Password must be at least 8 characters'); return;
    }
    setChangingPass(true);
    try {
      await authApi.changePassword(passwordForm.current, passwordForm.newPass);
      toast.success('Password changed. Please log in again.');
      await logout();
      router.push('/login');
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setChangingPass(false);
    }
  };

  const sections = [
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security',      label: 'Security',      icon: '🔒' },
    { id: 'appearance',    label: 'Appearance',     icon: '🎨' },
    { id: 'password',      label: 'Password',       icon: '🔑' },
    { id: 'account',       label: 'Account',        icon: '👤' },
  ];

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-3xl mx-auto animate-fade-up">
        <div className="flex flex-col sm:flex-row gap-6">

          {/* Section tabs */}
          <div className="sm:w-48 flex-shrink-0">
            <div className="bg-navy-800 border border-white/8 rounded-2xl p-2 space-y-0.5">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setShowSection(s.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${showSection === s.id ? 'bg-brand-500/15 text-brand-400' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                >
                  <span>{s.icon}</span>{s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">

            {showSection === 'notifications' && (
              <div className="bg-navy-800 border border-white/8 rounded-2xl p-6">
                <h3 className="font-display font-bold text-white mb-1">Notifications</h3>
                <p className="text-xs text-slate-500 mb-5">Choose how you want to be notified.</p>
                <SettingRow label="Push Notifications"  desc="Alerts for transactions and activity"          on={settings.pushNotifications}  onChange={() => toggle('pushNotifications')} />
                <SettingRow label="Email Notifications" desc="Weekly summaries and important alerts"          on={settings.emailNotifications} onChange={() => toggle('emailNotifications')} />
                <SettingRow label="SMS Alerts"          desc="Wallet transactions above ₦1,000"              on={settings.smsAlerts}          onChange={() => toggle('smsAlerts')} />
                <SettingRow label="Marketing Emails"    desc="Product updates and promotions from Stackora"  on={settings.marketingEmails}    onChange={() => toggle('marketingEmails')} />
              </div>
            )}

            {showSection === 'security' && (
              <div className="bg-navy-800 border border-white/8 rounded-2xl p-6">
                <h3 className="font-display font-bold text-white mb-1">Security</h3>
                <p className="text-xs text-slate-500 mb-5">Protect your account.</p>
                <SettingRow label="Two-Factor Authentication" desc="Extra security when signing in"          on={settings.twoFactor}      onChange={() => { toggle('twoFactor'); toast('Coming in Phase 5'); }} />
                <SettingRow label="Transaction PIN"           desc="Require PIN for wallet actions"          on={settings.transactionPin} onChange={() => toggle('transactionPin')} />
                <SettingRow label="Login Alerts"              desc="Notify me of logins from new devices"   on={settings.loginAlerts}    onChange={() => toggle('loginAlerts')} />

                <div className="mt-5 pt-5 border-t border-white/5">
                  <h4 className="text-sm font-semibold text-white mb-3">Active Sessions</h4>
                  <div className="flex items-center justify-between p-3 bg-navy-700 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-500/15 rounded-lg flex items-center justify-center text-sm">💻</div>
                      <div>
                        <p className="text-xs font-medium text-white">Current device</p>
                        <p className="text-[11px] text-slate-500">This session</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">Active</span>
                  </div>
                </div>
              </div>
            )}

            {showSection === 'appearance' && (
              <div className="bg-navy-800 border border-white/8 rounded-2xl p-6">
                <h3 className="font-display font-bold text-white mb-1">Appearance</h3>
                <p className="text-xs text-slate-500 mb-5">Customise how Stackora looks.</p>
                <SettingRow label="Dark Mode"    desc="Use dark theme — recommended"               on={settings.darkMode}    onChange={() => { toggle('darkMode'); toast('Light mode coming soon!'); }} />
                <SettingRow label="Compact View" desc="Reduce spacing to show more content"        on={settings.compactView} onChange={() => toggle('compactView')} />
              </div>
            )}

            {showSection === 'password' && (
              <div className="bg-navy-800 border border-white/8 rounded-2xl p-6">
                <h3 className="font-display font-bold text-white mb-1">Change Password</h3>
                <p className="text-xs text-slate-500 mb-5">After changing, you'll be logged out of all devices.</p>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="label">Current Password</label>
                    <input type="password" className="input" placeholder="••••••••" value={passwordForm.current} onChange={e => setPasswordForm(f => ({ ...f, current: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">New Password</label>
                    <input type="password" className="input" placeholder="Min 8 chars, 1 uppercase, 1 number" value={passwordForm.newPass} onChange={e => setPasswordForm(f => ({ ...f, newPass: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Confirm New Password</label>
                    <input type="password" className="input" placeholder="Repeat new password" value={passwordForm.confirm} onChange={e => setPasswordForm(f => ({ ...f, confirm: e.target.value }))} />
                  </div>
                  <button type="submit" disabled={changingPass} className="btn-primary flex items-center gap-2">
                    {changingPass ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Changing…</> : '🔑 Change Password'}
                  </button>
                </form>
              </div>
            )}

            {showSection === 'account' && (
              <div className="space-y-4">
                <div className="bg-navy-800 border border-white/8 rounded-2xl p-6">
                  <h3 className="font-display font-bold text-white mb-1">Subscription</h3>
                  <p className="text-xs text-slate-500 mb-5">Your current plan and billing.</p>
                  <div className="flex items-center justify-between py-3 border-b border-white/5">
                    <div><p className="text-sm font-medium text-white">Current Plan</p><p className="text-xs text-slate-500">Stackora Free</p></div>
                    <span className="badge badge-brand">Free</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div><p className="text-sm font-medium text-white">Upgrade to Pro</p><p className="text-xs text-slate-500">Unlock all features — ₦2,500/mo</p></div>
                    <button className="btn-primary text-xs py-1.5 px-4" onClick={() => toast('Coming in Phase 5!')}>Upgrade</button>
                  </div>
                </div>

                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                  <h3 className="font-display font-bold text-red-400 mb-1">Danger Zone</h3>
                  <p className="text-xs text-slate-500 mb-4">These actions are permanent and cannot be undone.</p>
                  <button onClick={() => toast.error('Please contact support to delete your account.')} className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors border border-red-500/30 px-4 py-2 rounded-xl hover:bg-red-500/10">
                    Delete Account
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
