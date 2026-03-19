// ─── InstructorPage ────────────────────────────────────────────────────────
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCourse } from '../services/courseService.js';
import { useAuthStore } from '../store/authStore.js';
import toast from 'react-hot-toast';

export function InstructorPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: '', description: '', category: 'Web Development',
    level: 'beginner', price: 0, isFree: true, requirements: '', outcomes: '',
  });

  const mutation = useMutation({
    mutationFn: () => createCourse({
      ...form,
      price: form.isFree ? 0 : Number(form.price),
      requirements: form.requirements.split('\n').filter(Boolean),
      outcomes: form.outcomes.split('\n').filter(Boolean),
    }),
    onSuccess: () => {
      toast.success('Course created! Add lessons from the course editor.');
      queryClient.invalidateQueries(['courses']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create course'),
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">Create a course</h1>
      <p className="text-gray-500 mb-8">Fill in the details — you can add lessons after creation.</p>

      <div className="card p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Course title</label>
          <input className="input" placeholder="e.g. Complete React for Beginners"
            value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea className="input min-h-24 resize-none" placeholder="What will students learn?"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {['Web Development','Data Science','AI & ML','Design','Business','DevOps'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Level</label>
            <select className="input" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
              {['beginner','intermediate','advanced'].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
            <input type="checkbox" checked={form.isFree} onChange={(e) => setForm({ ...form, isFree: e.target.checked })} className="rounded" />
            Free course
          </label>
          {!form.isFree && (
            <input type="number" className="input mt-2" placeholder="Price in USD"
              value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Requirements (one per line)</label>
          <textarea className="input min-h-20 resize-none" placeholder="Basic JavaScript knowledge&#10;Computer with internet"
            value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Learning outcomes (one per line)</label>
          <textarea className="input min-h-20 resize-none" placeholder="Build full-stack apps&#10;Deploy to production"
            value={form.outcomes} onChange={(e) => setForm({ ...form, outcomes: e.target.value })} />
        </div>
        <button onClick={() => mutation.mutate()} disabled={!form.title || !form.description || mutation.isPending} className="btn-primary w-full">
          {mutation.isPending ? 'Creating…' : 'Create course'}
        </button>
      </div>
    </div>
  );
}

export default InstructorPage;
