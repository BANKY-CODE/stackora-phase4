'use client';
import DashboardLayout from '@/components/layout/DashboardLayout';
export default function Page() {
  return (
    <DashboardLayout title="Coming Soon">
      <div className="max-w-lg mx-auto mt-16 text-center animate-fade-up">
        <div className="inline-flex w-20 h-20 rounded-3xl bg-brand-500/15 border border-white/10 items-center justify-center text-4xl mb-6">🚧</div>
        <h2 className="font-display font-bold text-white text-2xl mb-3">Coming in Phase 5</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">This module is under construction. The backend API is ready and waiting.</p>
        <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/25 text-brand-400 text-xs font-bold px-4 py-2 rounded-full">Backend API ready ✓</div>
      </div>
    </DashboardLayout>
  );
}
