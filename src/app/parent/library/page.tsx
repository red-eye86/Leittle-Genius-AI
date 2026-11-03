'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Upload,
  Trash2,
  Search,
  FileText,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { Textbook } from '@/lib/db/types';
import KidAvatar from '@/components/ui/KidAvatar';

export default function TextbookLibraryPage() {
  const router = useRouter();
  const { allChildren, language } = useApp();

  const [selectedChildId, setSelectedChildId] = useState('child-1');
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncMessage, setSyncMessage] = useState('');

  const fetchBooks = () => {
    setLoading(true);
    fetch(`/api/data/textbooks?childId=${selectedChildId}`)
      .then((res) => res.json())
      .then((data) => {
        setTextbooks(data.textbooks || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleSyncIcse = async () => {
    soundEffects.playStar();
    setLoading(true);
    try {
      const res = await fetch('/api/data/textbooks', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSyncMessage('✅ All 9 Official ICSE E-Books (Class 4 & UKG) and 46 chapters synced subject-wise & chapter-wise!');
        fetchBooks();
        setTimeout(() => setSyncMessage(''), 5000);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [selectedChildId]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this textbook from the library?')) return;
    soundEffects.playPop();
    try {
      await fetch(`/api/data/textbooks?id=${id}`, { method: 'DELETE' });
      fetchBooks();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredBooks = textbooks.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.chapters?.some((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/parent/dashboard')}
          className="flex items-center space-x-1.5 text-xs font-black text-slate-500 hover:text-slate-800 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Parent Dashboard</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSyncIcse}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Sync ICSE E-Books (4th & UKG)</span>
          </button>

          <button
            onClick={() => router.push('/parent/upload')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Custom PDF</span>
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-800 text-xs sm:text-sm font-black text-center animate-fade-in">
          {syncMessage}
        </div>
      )}

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-black text-slate-800 flex items-center justify-center space-x-2">
          <BookOpen className="w-8 h-8 text-indigo-600" />
          <span>Textbook & E-Book Library</span>
        </h1>
        <p className="text-xs sm:text-sm font-bold text-slate-500">
          Search, manage, and review extracted curriculum chapters.
        </p>
      </div>

      {/* Child Switcher & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          {allChildren.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                soundEffects.playPop();
                setSelectedChildId(c.id);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center space-x-1.5 ${
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

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books or chapters..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 shadow-sm"
          />
        </div>
      </div>

      {/* Books List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-slate-200">
            <p className="text-sm font-bold text-slate-500">Loading library...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-slate-200 space-y-3">
            <p className="text-base font-bold text-slate-700">No textbooks found.</p>
            <button
              onClick={() => router.push('/parent/upload')}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
            >
              Upload First Book
            </button>
          </div>
        ) : (
          filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3.5">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800">{book.title}</h3>
                    <p className="text-xs text-slate-500 font-bold mt-0.5">
                      {book.academicYear} • {book.fileSize} • {book.pageCount} Pages • Uploaded on {book.uploadDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black px-3 py-1 bg-emerald-100 text-emerald-800 rounded-xl">
                    RAG Grounded
                  </span>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                    title="Delete Textbook"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chapters List within book */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-100">
                <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  Extracted Chapters ({book.chapters?.length || 0}):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {book.chapters?.map((chap) => (
                    <div
                      key={chap.id}
                      className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between"
                    >
                      <span className="truncate">
                        Ch {chap.chapterNumber}: {chap.title}
                      </span>
                      <span className="text-[10px] text-indigo-600 font-bold flex-shrink-0">
                        {chap.topics?.length || 0} topics
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

