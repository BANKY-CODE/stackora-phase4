'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Plus, Trash2, Video, FileText, ShieldCheck, ExternalLink } from 'lucide-react';
import { academyApi } from '@/lib/api';

type Course = { id: string; title: string; priceNaira: number; level: string; lessonCount: number; contentUrl: string | null };
type Lesson = { id: string; title: string; videoUrl: string | null; position: number };

export default function AcademyManagePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('beginner');
  const [price, setPrice] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [creating, setCreating] = useState(false);
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

  useEffect(() => {
    loadCourses();
  }, []);

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
        contentUrl: contentUrl.trim() || undefined,
      });
      setTitle('');
      setDescription('');
      setPrice('');
      setLevel('beginner');
      setContentUrl('');
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
