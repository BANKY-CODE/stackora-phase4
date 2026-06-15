'use client';
import { useState } from 'react';
import { authApi } from '@/lib/api';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent,  setSent]  = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await authApi.forgotPassword(email); } catch {}
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-400 flex items-center justify-center font-display font-bold text-white text-2xl mx-auto mb-4">S</div>
          <h1 className="font-display font-bold text-white text-2xl">Reset your password</h1>
          <p className="text-slate-500 text-sm mt-2">Enter your email and we'll send a reset link</p>
        </div>
        <div className="bg-navy-800 border border-white/8 rounded-2xl p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="font-display font-bold text-white mb-2">Check your inbox</h3>
              <p className="text-sm text-slate-400 mb-6">If an account exists for {email}, you'll receive a reset link shortly.</p>
              <Link href="/login" className="btn-primary inline-block">Back to login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Email address</label>
                <input type="email" className="input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '📧'} Send reset link
              </button>
              <div className="text-center">
                <Link href="/login" className="text-sm text-slate-500 hover:text-slate-300">← Back to login</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
