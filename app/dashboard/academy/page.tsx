'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';
import { academyApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

type Course = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  level: string;
  priceNaira: number;
  isFree: boolean;
  coverUrl: string | null;
  contentUrl: string | null;
  lessonCount: number;
};

const levelColor: Record<string, string> = {
  beginner: 'text-emerald-400 bg-emerald-400/10',
  intermediate: 'text-yellow-400 bg-yellow-400/10',
  advanced: 'text-red-400 bg-red-400/10',
};

export default function AcademyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.roles?.includes('admin') || user?.roles?.includes('moderator');

  useEffect(() => {
    academyApi.listCourses()
      .then(res => setCourses(res.data || []))
      .catch(err => setError(err.message || 'Could not load courses'))
      .finally(() => setLoading(false));
  }, []);

  const openLink = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">BankyHQ Academy</h1>
          <p className="text-gray-400 text-sm mt-1">Learn tech skills from real courses</p>
        </div>
        {isAdmin ? (
          <button
            onClick={() => router.push('/dashboard/academy/manage')}
            className="flex items-center gap-2 px-4 py-2 bg-[#00D4AA]/10 hover:bg-[#00D4AA]/20 text-[#00D4AA] font-semibold rounded-xl text-sm transition-colors"
          >
            <ShieldCheck size={15} /> Manage Courses
          </button>
        ) : null}
      </div>

      {/* Error */}
      {error ? (
        <div className="bg-red-400/5 border border-red-400/20 rounded-xl p-3 text-red-400 text-sm">{error}</div>
      ) : null}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading courses…</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen size={40} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-400">No courses available yet.</p>
          <p className="text-gray-600 text-sm mt-1">Check back soon — new courses are coming!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(c => (
            <div key={c.id} className="bg-[#111827] border border-white/8 rounded-2xl p-5 flex flex-col hover:border-[#00D4AA]/30 transition-all hover:-translate-y-1">
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-[#00D4AA]/10 flex items-center justify-center mb-4">
                <BookOpen size={22} className="text-[#00D4AA]" />
              </div>

              {/* Title */}
              <h3 className="text-white font-semibold mb-1 line-clamp-2">{c.title}</h3>

              {/* Description */}
              {c.description ? (
                <p className="text-gray-500 text-xs mb-3 line-clamp-2 flex-1">{c.description}</p>
              ) : (
                <div className="flex-1" />
              )}

              {/* Tags */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${levelColor[c.level] || 'text-gray-400 bg-gray-400/10'}`}>
                  {c.level}
                </span>
                <span className="text-xs text-gray-500">{c.lessonCount} lesson{c.lessonCount !== 1 ? 's' : ''}</span>
              </div>

              {/* Price + Access */}
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                <span className={`font-bold text-sm ${c.isFree ? 'text-emerald-400' : 'text-[#00D4AA]'}`}>
                  {c.isFree ? 'Free' : `₦${c.priceNaira.toLocaleString()}`}
                </span>
                {c.contentUrl ? (
                  <button
                    onClick={() => openLink(c.contentUrl as string)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00D4AA] hover:bg-[#00BF9A] text-black font-semibold rounded-xl text-xs transition-colors"
                  >
                    <ExternalLink size={13} /> Access Course
                  </button>
                ) : (
                  <span className="text-gray-600 text-xs">Coming soon</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
