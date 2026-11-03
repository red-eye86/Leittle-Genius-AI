'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, ArrowRight, ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { Subject, Textbook } from '@/lib/db/types';

export default function SubjectsPage() {
  const router = useRouter();
  const { activeChild, language, t } = useApp();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeChild) return;
    Promise.all([
      fetch(`/api/data/subjects?childId=${activeChild.id}`).then((r) => r.json()),
      fetch(`/api/data/textbooks?childId=${activeChild.id}`).then((r) => r.json()),
    ])
      .then(([subData, tbData]) => {
        setSubjects(subData.subjects || []);
        setTextbooks(tbData.textbooks || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [activeChild]);

  if (!activeChild) return null;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/child/dashboard')}
          className="flex items-center space-x-1.5 text-xs font-black text-slate-500 hover:text-slate-800 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ml' ? 'ഹോം' : 'Dashboard'}</span>
        </button>

        <div className="text-right">
          <span className="text-xs font-black px-3 py-1 rounded-xl bg-sky-100 text-sky-800">
            {activeChild.classGrade} Syllabus
          </span>
        </div>
      </div>

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 flex items-center justify-center space-x-3">
          <span>📚</span>
          <span>{t('mySubjects')}</span>
        </h1>
        <p className="text-sm font-bold text-slate-500">
          {language === 'ml'
            ? 'സ്കൂൾ സിലബസ് പ്രകാരമുള്ള വിഷയങ്ങളും പാഠപുസ്തകങ്ങളും'
            : 'Select a subject to explore its chapters, quizzes, and 3D lessons'}
        </p>
      </div>

      {/* Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {subjects.map((sub) => {
          const linkedBooks = textbooks.filter((b) => b.subjectId === sub.id);
          const totalChapters = linkedBooks.reduce((acc, b) => acc + (b.chapters?.length || 0), 0);

          return (
            <div
              key={sub.id}
              onClick={() => {
                soundEffects.playPop();
                router.push(`/child/chapters?subjectId=${sub.id}`);
              }}
              className="cursor-pointer bg-white rounded-4xl p-7 border-4 border-slate-200 hover:border-sky-400 shadow-md card-kid-hover flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-5xl p-3 rounded-3xl bg-slate-50 border border-slate-100 shadow-inner">
                    {sub.icon}
                  </span>
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {totalChapters > 0 ? `${totalChapters} Chapters` : 'Curriculum Ready'}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-800">
                  {language === 'ml' ? sub.malayalamName : sub.name}
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-1 line-clamp-2">
                  {language === 'ml' ? sub.malayalamDescription : sub.description}
                </p>
              </div>

              <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-between">
                <span className="text-xs font-black text-sky-600 flex items-center space-x-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{linkedBooks[0]?.title || 'Standard Textbook'}</span>
                </span>
                <span className="p-2 rounded-xl bg-sky-50 text-sky-600 group-hover:translate-x-1 transition">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

