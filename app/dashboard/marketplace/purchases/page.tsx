'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, ExternalLink, ShoppingBag } from 'lucide-react';
import { marketplaceApi } from '@/lib/api';

type Purchase = {
  purchaseId: string;
  productId: string;
  title: string;
  description: string | null;
  category: string;
  contentUrl: string | null;
  seller: string;
  priceNaira: number;
  purchasedAt: string;
};

export default function MyPurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    marketplaceApi.myPurchases()
      .then((res) => setPurchases(res.data || []))
      .catch((err) => setError(err.message || 'Could not load your purchases'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/marketplace" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">My Purchases</h1>
          <p className="text-gray-400 text-sm mt-0.5">Courses you have bought</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading your courses…</div>
      ) : error ? (
        <div className="text-center py-16 text-red-400">{error}</div>
      ) : purchases.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag size={40} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-400">You have not bought any courses yet.</p>
          <Link
            href="/dashboard/marketplace"
            className="inline-block mt-4 px-5 py-2.5 bg-[#00D4AA] hover:bg-[#00BF9A] text-black font-semibold rounded-xl text-sm transition-colors"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {purchases.map((p) => (
            <div key={p.purchaseId} className="bg-[#111827] border border-white/8 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#00D4AA]/10 flex items-center justify-center shrink-0">
                  <BookOpen size={22} className="text-[#00D4AA]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold">{p.title}</h3>
                  <p className="text-gray-500 text-xs mt-0.5">
                    by {p.seller} · Bought for ₦{p.priceNaira.toLocaleString()}
                  </p>
                  {p.description ? (
                    <p className="text-gray-400 text-sm mt-2">{p.description}</p>
                  ) : null}

                  <div className="mt-4">
                    {p.contentUrl ? (
                      
                        href={p.contentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#00D4AA] hover:bg-[#00BF9A] text-black font-semibold rounded-xl text-sm transition-colors"
                      >
                        <ExternalLink size={15} /> Open Course
                      </a>
                    ) : (
                      <span className="inline-block px-4 py-2.5 bg-white/5 text-gray-500 rounded-xl text-sm">
                        No content link provided by seller
                      </span>
                    )}
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
