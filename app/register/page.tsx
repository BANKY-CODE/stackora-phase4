'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', firstName: '', lastName: '', country: 'Nigeria',
  });
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      toast.error('Username, email, and password are required');
      return;
    }
    setLoading(true);
    try {
      await authApi.register(form);
      toast.success('Account created! Check your email to verify.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-400 flex items-center justify-center font-display font-bold text-white text-2xl mx-auto mb-4 shadow-lg shadow-brand-500/40">S</div>
          <h1 className="font-display font-bold text-white text-3xl">Join Stackora</h1>
          <p className="text-slate-500 text-sm mt-2">Africa's all-in-one digital ecosystem</p>
        </div>

        <div className="bg-navy-800 border border-white/8 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First Name</label>
                <input className="input" placeholder="Ade" value={form.firstName} onChange={e => update('firstName', e.target.value)} disabled={loading} />
              </div>
              <div>
                <label className="label">Last Name</label>
                <input className="input" placeholder="Okafor" value={form.lastName} onChange={e => update('lastName', e.target.value)} disabled={loading} />
              </div>
            </div>

            <div>
              <label className="label">Username <span className="text-red-400">*</span></label>
              <input className="input" placeholder="adeokafor" value={form.username} onChange={e => update('username', e.target.value)} disabled={loading} autoComplete="username" />
            </div>

            <div>
              <label className="label">Email address <span className="text-red-400">*</span></label>
              <input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={e => update('email', e.target.value)} disabled={loading} autoComplete="email" />
            </div>

            <div>
              <label className="label">Password <span className="text-red-400">*</span></label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input pr-12"
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-sm">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Country</label>
              <select className="input" value={form.country} onChange={e => update('country', e.target.value)} disabled={loading}>
                <option>Nigeria</option><option>Ghana</option><option>Kenya</option>
                <option>South Africa</option><option>Uganda</option><option>Other</option>
              </select>
            </div>

            <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-2" disabled={loading}>
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account…</>
              ) : 'Create account →'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
