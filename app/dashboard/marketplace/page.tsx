
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Plus, BookOpen, CheckCircle, X } from 'lucide-react';
import { marketplaceApi, walletApi } from '@/lib/api';

type Product = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  priceNaira: number;
  salesCount: number;
  seller: string | null;
  sellerName: string | null;
};

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  const [selected, setSelected] = useState<Product | null>(null);
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [buySuccess, setBuySuccess] = useState<string | null>(null);

  const loadProducts = () => {
    setLoading(true);
    marketplaceApi.listProducts()
      .then(res => setProducts(res.data || []))
      .catch(err => setError(err.message || 'Could not load courses'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
    walletApi.getBalance().then(res => setBalance(res.data.balance ?? 0)).catch(() => {});
  }, []);

  const handleBuy = async () => {
    if (!selected) return;
    setBuying(true);
    setBuyError(null);
    try {
      const res = await marketplaceApi.buyProduct(selected.id);
      setBalance(res.data.balanceAfterNaira);
      setBuySuccess(`You now own "${res.data.title}"! Find it in My Purchases.`);
    } catch (err: any) {
      setBuyError(err.message || 'Purchase failed');
    } finally {
      setBuying(false);
    }
  };

  const closeModal = () => {
    setSelected(null);
    setBuyError(null);
    setBuySuccess(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Marketplace</h1>
          <p className="text-gray-400 text-sm mt-1">Buy and sell tech courses</p>
        </div>
        <div className="flex items-center gap-3">
          {balance !== null && (
            <span className="text-sm text-gray-400">
              Balance: <span className="text-[#00D4AA] font-semibold">₦{balance.toLocaleString()}</span>
            </span>
          )}
          <Link
            href="/dashboard/marketplace/sell"
            className="flex items-center gap-2 px-4 py-2 bg-[#00D4AA] hover:bg-[#00BF9A] text-black font-semibold rounded-xl text-sm transition-colors"
          >
            <Plus size={16} /> Sell a Course
          </Link>
        </div>
      </div>

      {/* Sub nav */}
      <div className="flex gap-2">
        <Link href="/dashboard/marketplace/purchases" className="flex items-center gap-2 px-4 py-2 bg-[#111827] border border-white/10 text-gray-300 hover:text-white rounded-xl text-sm transition-colors">
          <BookOpen size={15} /> My Purchases
        </Link>
        <Link href="/dashboard/marketplace/sell" className="flex items-center gap-2 px-4 py-2 bg-[#111827] border border-white/10 text-gray-300 hover:text-white rounded-xl text-sm transition-colors sm:hidden">
          <Plus size={15} /> Sell
        </Link>
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading courses…</div>
      ) : error ? (
        <div className="text-center py-16 text-red-400">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag size={40} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-400">No courses listed yet.</p>
          <p className="text-gray-600 text-sm mt-1">Be the first — click "Sell a Course".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="bg-[#111827] border border-white/8 rounded-2xl p-5 text-left hover:border-[#00D4AA]/40 transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-[#00D4AA]/10 flex items-center justify-center mb-4">
                <BookOpen size={22} className="text-[#00D4AA]" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{p.title}</h3>
              <p className="text-gray-500 text-xs mb-3 line-clamp-2">{p.description || 'No description'}</p>
              <div className="flex items-center justify-between">
                <span className="text-[#00D4AA] font-bold">₦{p.priceNaira.toLocaleString()}</span>
                <span className="text-gray-600 text-xs">{p.sellerName || p.seller || 'Seller'}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Detail / Buy Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Course Details</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>

            {buySuccess ? (
              <div className="text-center py-6">
                <CheckCircle size={44} className="mx-auto text-emerald-400 mb-3" />
                <p className="text-white font-semibold mb-1">Purchase Successful</p>
                <p className="text-gray-400 text-sm">{buySuccess}</p>
                <div className="flex gap-3 mt-6">
                  <Link href="/dashboard/marketplace/purchases" className="flex-1 py-3 bg-[#00D4AA] hover:bg-[#00BF9A] text-black font-semibold rounded-xl text-center transition-colors">
                    Go to My Purchases
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-xl bg-[#00D4AA]/10 flex items-center justify-center">
                  <BookOpen size={26} className="text-[#00D4AA]" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">{selected.title}</h2>
                  <p className="text-gray-500 text-xs mt-0.5">by {selected.sellerName || selected.seller || 'Seller'}</p>
                </div>
                <p className="text-gray-400 text-sm">{selected.description || 'No description provided.'}</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-gray-400 text-sm">Price</span>
                  <span className="text-[#00D4AA] font-bold text-xl">₦{selected.priceNaira.toLocaleString()}</span>
                </div>
                {balance !== null && (
                  <p className="text-gray-500 text-xs">Your balance: ₦{balance.toLocaleString()}</p>
                )}
                {buyError && (
                  <div className="bg-red-400/5 border border-red-400/20 rounded-xl p-3 text-red-400 text-sm">{buyError}</div>
                )}
                <button
                  onClick={handleBuy}
                  disabled={buying}
                  className="w-full py-3.5 bg-[#00D4AA] hover:bg-[#00BF9A] disabled:opacity-60 text-black font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {buying ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <>Buy for ₦{selected.priceNaira.toLocaleString()}</>}
                </button>
                <p className="text-gray-600 text-[11px] text-center">Payment is deducted from your BankyHQ wallet balance.</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
