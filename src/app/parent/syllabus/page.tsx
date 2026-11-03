'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Layers,
  Plus,
  Trash2,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { Subject } from '@/lib/db/types';
import KidAvatar from '@/components/ui/KidAvatar';

export default function SyllabusManagementPage() {
  const router = useRouter();
  const { allChildren, language } = useApp();

  const [selectedChildId, setSelectedChildId] = useState('child-1');
  const [board, setBoard] = useState('ICIC');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Subject form
  const [newSubName, setNewSubName] = useState('');
  const [newSubMalayalam, setNewSubMalayalam] = useState('');
  const [newSubIcon, setNewSubIcon] = useState('📖');
  const [newSubDesc, setNewSubDesc] = useState('');

  const fetchSubjects = () => {
    fetch(`/api/data/subjects?childId=${selectedChildId}`)
      .then((res) => res.json())
      .then((data) => setSubjects(data.subjects || []));
  };

  useEffect(() => {
    fetchSubjects();
    fetch('/api/data/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings?.syllabusBoard) setBoard(data.settings.syllabusBoard);
      });
  }, [selectedChildId]);

  const handleBoardChange = async (newBoard: string) => {
    setBoard(newBoard);
    soundEffects.playStar();
    await fetch('/api/data/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ syllabusBoard: newBoard }),
    });
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;
    soundEffects.playPop();
    await fetch(`/api/data/subjects?id=${id}`, { method: 'DELETE' });
    fetchSubjects();
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;

    soundEffects.playStar();
    const currentChild = allChildren.find((c) => c.id === selectedChildId);

    await fetch('/api/data/subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        childId: selectedChildId,
        name: newSubName,
        malayalamName: newSubMalayalam || newSubName,
        icon: newSubIcon,
        description: newSubDesc,
        classGrade: currentChild?.classGrade || 'Class 4',
      }),
    });

    setNewSubName('');
    setNewSubMalayalam('');
    setNewSubDesc('');
    setShowAddModal(false);
    fetchSubjects();
  };

  const selectedChild = allChildren.find((c) => c.id === selectedChildId);

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/parent/dashboard')}
          className="flex items-center space-x-1.5 text-xs font-black text-slate-500 hover:text-slate-800 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Parent Dashboard</span>
        </button>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Subject</span>
        </button>
      </div>

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-black text-slate-800 flex items-center justify-center space-x-2">
          <Layers className="w-8 h-8 text-indigo-600" />
          <span>Syllabus & Subject Manager</span>
        </h1>
        <p className="text-xs sm:text-sm font-bold text-slate-500">
          Configure educational boards, subjects, and curricula for your children.
        </p>
      </div>

      {/* Board Configuration (ICIC / ICSE / Kerala State / CBSE) */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-3">
        <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
          School Board / Syllabus:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['ICIC', 'ICSE', 'Kerala State', 'CBSE'].map((b) => (
            <button
              key={b}
              onClick={() => handleBoardChange(b)}
              className={`p-3.5 rounded-2xl font-black text-xs transition border-2 text-center ${
                board === b
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Child Switcher */}
      <div className="flex items-center space-x-3">
        {allChildren.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              soundEffects.playPop();
              setSelectedChildId(c.id);
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center space-x-1.5 ${
              selectedChildId === c.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <KidAvatar avatar={c.avatar} size="xs" />
            <span>{c.name} ({c.classGrade})</span>
          </button>
        ))}
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {subjects.map((sub) => (
          <div
            key={sub.id}
            className="p-5 bg-white rounded-3xl border-2 border-slate-200 shadow-sm flex items-start justify-between"
          >
            <div className="flex items-start space-x-3.5">
              <span className="text-3xl p-2.5 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner">
                {sub.icon}
              </span>
              <div>
                <h3 className="font-black text-base text-slate-800">{sub.name}</h3>
                <p className="text-xs text-indigo-600 font-bold">{sub.malayalamName}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{sub.description}</p>
              </div>
            </div>

            <button
              onClick={() => handleDeleteSubject(sub.id)}
              className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
              title="Delete Subject"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl p-6 sm:p-8 max-w-md w-full border-4 border-indigo-400 shadow-2xl space-y-4">
            <h3 className="text-xl font-black text-slate-800">Add New Subject</h3>

            <form onSubmit={handleAddSubject} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Subject Name (English)</label>
                <input
                  type="text"
                  required
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Subject Name (Malayalam)</label>
                <input
                  type="text"
                  value={newSubMalayalam}
                  onChange={(e) => setNewSubMalayalam(e.target.value)}
                  placeholder="e.g. കമ്പ്യൂട്ടർ ശാസ്ത്രം"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Icon Emoji</label>
                <input
                  type="text"
                  value={newSubIcon}
                  onChange={(e) => setNewSubIcon(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Description</label>
                <textarea
                  value={newSubDesc}
                  onChange={(e) => setNewSubDesc(e.target.value)}
                  placeholder="Foundational topics..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none h-20"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md"
                >
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

