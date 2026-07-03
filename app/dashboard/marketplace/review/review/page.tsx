'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Check, X, ShieldCheck, ExternalLink } from 'lucide-react';
import { marketplaceApi } from '@/lib/api';

type Pending = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  priceNaira: number;
  contentUrl: string | null;
  seller: string | null;
  sellerName: string | null;
};

export default function CourseReviewPage() {
  const [pending, setPending] = useState<Pending[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    marketplaceApi.pendingProducts()
      .then((res) => setPending(res.data || []))
      .catch((err) => setError(err.message || 'Could not load pending courses'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const decide = async (id: string, action: 'approve' | 'reject') => {
    setWorking(id);
    setError(null);
    try {
      if (action === 'approve') await marketplaceApi.approveProduct(id);
      else await marketplaceApi.rejectProduct(id);
      setPending((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message || 'Action failed');
    } finally {
      setWorking(null);
    }
  };

  const openLink = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/10 flex items-center justify-center">
          <ShieldCheck size={20} className="text-[#00D4AA]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Course Review</h1>
          <p className="text-gray-400 text-sm mt-0.5">Approve or reject courses before they go live</p>
        </div>
      </div>

      {error ? (
        <div className="bg-red-400/5 border border-red-400/20 rounded-xl p-3 text-red-400 text-sm">{error}</div>
      ) : null}

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading pending courses…</div>
      ) : pending.length === 0 ? (
        <div className="text-center py-16">
          <Check size={40} className="mx-auto text-emerald-400 mb-3" />
          <p className="text-gray-400">All caught up — no courses waiting for review.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((p) => (
            <div key={p.id} className="bg-[#111827] border border-white/8 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#00D4AA]/10 flex items-center justify-center shrink-0">
                  <BookOpen size={22} className="text-[#00D4AA]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold">{p.title}</h3>
                  <p className="text-gray-500 text-xs mt-0.5">
                    by {p.sellerName || p.seller || 'Seller'} · ₦{p.priceNaira.toLocaleString()} · {p.category}
                  </p>
                  {p.description ? <p className="text-gray-400 text-sm mt-2">{p.description}</p> : null}

                  {p.contentUrl ? (
                    <button
                      onClick={() => openLink(p.contentUrl as string)}
                      className="inline-flex items-center gap-1.5 mt-3 text-[#00D4AA] text-xs hover:underline"
                    >
                      <ExternalLink size={13} /> Preview course link
                    </button>
                  ) : (
                    <p className="text-gray-600 text-xs mt-3">No content link provided</p>
                  )}

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => decide(p.id, 'approve')}
                      disabled={working === p.id}
                      className="flex-1 py-2.5 bg-[#00D4AA] hover:bg-[#00BF9A] disabled:opacity-60 text-black font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Check size={15} /> Approve
                    </button>
                    <button
                      onClick={() => decide(p.id, 'reject')}
                      disabled={working === p.id}
                      className="flex-1 py-2.5 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-60 text-red-400 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <X size={15} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
