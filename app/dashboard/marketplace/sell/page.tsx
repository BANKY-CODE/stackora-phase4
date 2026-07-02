'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, BookOpen } from 'lucide-react';
import { marketplaceApi } from '@/lib/api';

export default function SellCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('course');
  const [price, setPrice] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (!title.trim()) { setError('Please enter a course title.'); return; }
    const priceNum = parseFloat(price);
    if (!priceNum || priceNum < 1) { setError('Please enter a valid price (at least ₦1).'); return; }

    setLoading(true);
    try {
      await marketplaceApi.createProduct({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        price: priceNum,
        contentUrl: contentUrl.trim() || undefined,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Could not list your course.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <CheckCircle size={48} className="mx-auto text-emerald-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Course Listed!</h2>
        <p className="text-gray-400 mb-8">Your course is now live in the marketplace for others to buy.</p>
        <div className="flex flex-col gap-3">
          <Link href="/dashboard/marketplace" className="w-full py-3.5 bg-[#00D4AA] hover:bg-[#00BF9A] text-black font-semibold rounded-xl transition-colors">
            View Marketplace
          </Link>
          <button
            onClick={() => { setSuccess(false); setTitle(''); setDescription(''); setPrice(''); setContentUrl(''); }}
            className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-colors"
          >
            List Another Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/marketplace" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Sell a Course</h1>
          <p className="text-gray-400 text-sm mt-0.5">List your course for others to buy</p>
        </div>
      </div>

      <div className="bg-[#111827] border border-white/8 rounded-2xl p-6 space-y-5">
        <div className="w-12 h-12 rounded-xl bg-[#00D4AA]/10 flex items-center justify-center">
          <BookOpen size={22} className="text-[#00D4AA]" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1.5">Course Title *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Complete Website Design Masterclass"
            maxLength={150}
            className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4AA] transition-colors"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What will students learn? What's included?"
            rows={4}
            className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4AA] transition-colors resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1.5">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4AA] transition-colors"
          >
            <option value="course">Course</option>
            <option value="webdesign">Web Design</option>
            <option value="coding">Coding / Development</option>
            <option value="design">Design</option>
            <option value="cybersecurity">Cybersecurity</option>
            <option value="digital">Digital Skills</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1.5">Price (₦) *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₦</span>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="5000"
              className="w-full bg-[#0B1120] border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4AA] transition-colors"
            />
          </div>
          <p className="text-gray-600 text-xs mt-1.5">You keep 90%. BankyHQ takes a 10% platform fee on each sale.</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1.5">Course Link (optional)</label>
          <input
            type="text"
            value={contentUrl}
            onChange={e => setContentUrl(e.target.value)}
            placeholder="Link to the course content (Google Drive, etc.)"
            className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4AA] transition-colors"
          />
          <p className="text-gray-600 text-xs mt-1.5">Buyers get this link after purchase.</p>
        </div>

        {error && (
          <div className="bg-red-400/5 border border-red-400/20 rounded-xl p-3 text-red-400 text-sm">{error}</div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3.5 bg-[#00D4AA] hover:bg-[#00BF9A] disabled:opacity-60 text-black font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : 'List My Course'}
        </button>
      </div>
    </div>
  );
}
