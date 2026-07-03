'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Plus, Trash2, Video, FileText, ShieldCheck } from 'lucide-react';
import { academyApi } from '@/lib/api';

type Course = { id: string; title: string; priceNaira: number; level: string; lessonCount: number };
type Lesson = { id: string; title: string; videoUrl: string | null; position: number };

export default function AcademyManagePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New course form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('beginner');
  const [price, setPrice] = useState('');
  const [creating, setCreating] = useState(false);

  // Selected course + lessons
  const [selected, setSelected] = useState<any>(null);
  const [lTitle, setLTitle] = useState('');
  const [lVideo, setLVideo] = useState('');
  const [lContent, setLContent] = useState('');
  const [addingLesson, setAddingLesson] = useState(false);

  const loadCourses = () => {
    setLoading(true);
    academyApi.listCourses()
      .then(res => setCourses(res.data as any || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCourses(); }, []);

  const handleCreate = async () => {
    setError(null);
    if (!title.trim()) { setError('Course title is required'); return; }
    setCreating(true);
    try {
      await academyApi.createCourse({
        title: title.trim(),
        description: description.trim() || undefined,
        level,
        price: price ? parseFloat(price) : 0,
      });
      setTitle(''); setDescription(''); setPrice(''); setLevel('beginner');
      loadCourses();
    } catch (err: any) {
      setError(err.message || 'Could not create course');
    } finally {
      setCreating(false);
    }
  };

  const openCourse = async (id: string) => {
    setError(null);
    try {
      const res = await academyApi.getCourse(id);
      setSelected(res.data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddLesson = async () => {
    if (!selected) return;
    setError(null);
    if (!lTitle.trim()) { setError('Lesson title is required'); return; }
    setAddingLesson(true);
    try {
      await academyApi.addLesson(selected.id, {
        title: lTitle.trim(),
        videoUrl: lVideo.trim() || undefined,
        content: lContent.trim() || undefined,
      });
      setLTitle(''); setLVideo(''); setLContent('');
      const res = await academyApi.getCourse(selected.id);
      setSelected(res.data);
      loadCourses();
    } catch (err: any) {
      setError(err.message || 'Could not add lesson');
    } finally {
      setAddingLesson(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!selected) return;
    try {
      await academyApi.deleteLesson(lessonId);
      const res = await academyApi.getCourse(selected.id);
      setSelected(res.data);
      loadCourses();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      await academyApi.deleteCourse(id);
      if (selected?.id === id) setSelected(null);
      loadCourses();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/10 flex items-center justify-center">
          <ShieldCheck size={20} className="text-[#00D4AA]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Academy</h1>
          <p className="text-gray-400 text-sm mt-0.5">Create courses and add lessons (admin only)</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-400/5 border border-red-400/20 rounded-xl p-3 text-red-400 text-sm">{error}</div>
      )}

      {/* Create course */}
      <div className="bg-[#111827] border border-white/8 rounded-2xl p-5 space-y-4">
        <h2 className="text-white font-semibold flex items-center gap-2"><Plus size={16} /> New Course</h2>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Course title (e.g. Build Your First Website with Wix)"
          className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4AA]"
        />
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Course description"
          rows={2}
          className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4AA] resize-none"
        />
        <div className="flex gap-3">
          <select
            value={level}
            onChange={e => setLevel(e.target.value)}
            className="flex-1 bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4AA]"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="Price ₦ (0 = free)"
            className="flex-1 bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4AA]"
          />
        </div>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="w-full py-3 bg-[#00D4AA] hover:bg-[#00BF9A] disabled:opacity-60 text-black font-semibold rounded-xl transition-colors"
        >
          {creating ? 'Creating…' : 'Create Course'}
        </button>
      </div>

      {/* Existing courses */}
      <div>
        <h2 className="text-white font-semibold mb-3">Your Courses</h2>
        {loading ? (
          <p className="text-gray-500 text-center py-8">Loading…</p>
        ) : courses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No courses yet. Create your first one above.</p>
        ) : (
          <div className="space-y-2">
            {courses.map(c => (
              <div key={c.id} className="bg-[#111827] border border-white/8 rounded-xl p-4 flex items-center gap-3">
                <BookOpen size={18} className="text-[#00D4AA] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{c.title}</p>
                  <p className="text-gray-500 text-xs">{c.lessonCount} lessons · {c.priceNaira === 0 ? 'Free' : `₦${c.priceNaira.toLocaleString()}`} · {c.level}</p>
                </div>
                <button onClick={() => openCourse(c.id)} className="text-[#00D4AA] text-xs px-3 py-1.5 rounded-lg bg-[#00D4AA]/10 hover:bg-[#00D4AA]/20 transition-colors">
                  Manage Lessons
                </button>
                <button onClick={() => handleDeleteCourse(c.id)} className="text-red-400 hover:text-red-300 p-1.5">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lesson manager for selected course */}
      {selected && (
        <div className="bg-[#111827] border border-[#00D4AA]/30 rounded-2xl p-5 space-y-4">
          <h2 className="text-white font-semibold">Lessons — {selected.title}</h2>

          {/* Existing lessons */}
          {selected.lessons && selected.lessons.length > 0 ? (
            <div className="space-y-2">
              {selected.lessons.map((l: Lesson, i: number) => (
                <div key={l.id} className="flex items-center gap-3 bg-[#0B1120] rounded-xl p-3">
                  <span className="text-gray-500 text-xs w-5">{i + 1}</span>
                  {l.videoUrl ? <Video size={15} className="text-[#00D4AA]" /> : <FileText size={15} className="text-gray-500" />}
                  <span className="text-white text-sm flex-1 truncate">{l.title}</span>
                  <button onClick={() => handleDeleteLesson(l.id)} className="text-red-400 hover:text-red-300 p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No lessons yet. Add the first one below.</p>
          )}

          {/* Add lesson */}
          <div className="border-t border-white/5 pt-4 space-y-3">
            <p className="text-gray-300 text-sm font-medium">Add a lesson</p>
            <input
              value={lTitle}
              onChange={e => setLTitle(e.target.value)}
              placeholder="Lesson title (e.g. Lesson 1: Welcome)"
              className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4AA] text-sm"
            />
            <input
              value={lVideo}
              onChange={e => setLVideo(e.target.value)}
              placeholder="Video link (YouTube / Google Drive URL) — optional"
              className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4AA] text-sm"
            />
            <textarea
              value={lContent}
              onChange={e => setLContent(e.target.value)}
              placeholder="Lesson notes / written content — optional"
              rows={2}
              className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4AA] text-sm resize-none"
            />
            <button
              onClick={handleAddLesson}
              disabled={addingLesson}
              className="w-full py-2.5 bg-[#00D4AA] hover:bg-[#00BF9A] disabled:opacity-60 text-black font-semibold rounded-xl text-sm transition-colors"
            >
              {addingLesson ? 'Adding…' : 'Add Lesson'}
            </button>
          </div>

          <button onClick={() => setSelected(null)} className="text-gray-500 text-xs hover:text-white">Close</button>
        </div>
      )}
    </div>
  );
}
