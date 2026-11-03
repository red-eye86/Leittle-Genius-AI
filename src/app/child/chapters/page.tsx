'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  HelpCircle,
  Layers,
  Box,
  CheckCircle,
  Volume2,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { Subject, Textbook, TextbookChapter } from '@/lib/db/types';

function ChaptersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId');
  const { activeChild, language, t, speak } = useApp();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [textbook, setTextbook] = useState<Textbook | null>(null);
  const [chapters, setChapters] = useState<TextbookChapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeChild) return;

    fetch(`/api/data/textbooks?childId=${activeChild.id}`)
      .then((res) => res.json())
      .then((data) => {
        const books = (data.textbooks || []) as Textbook[];
        let matchedBook = books.find((b) => b.subjectId === subjectId);
        if (!matchedBook && books.length > 0) matchedBook = books[0];

        setTextbook(matchedBook || null);
        setChapters(matchedBook?.chapters || []);

        return fetch(`/api/data/subjects?childId=${activeChild.id}`);
      })
      .then((res) => res.json())
      .then((data) => {
        const subs = (data.subjects || []) as Subject[];
        const matchedSub = subs.find((s) => s.id === subjectId) || subs[0] || null;
        setSubject(matchedSub);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [activeChild, subjectId]);

  if (!activeChild) return null;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/child/subjects')}
          className="flex items-center space-x-1.5 text-xs font-black text-slate-500 hover:text-slate-800 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ml' ? 'വിഷയങ്ങൾ' : 'All Subjects'}</span>
        </button>

        {subject && (
          <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-purple-100 text-purple-800 flex items-center space-x-1">
            <span>{subject.icon}</span>
            <span>{language === 'ml' ? subject.malayalamName : subject.name}</span>
          </span>
        )}
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-4xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-purple-200 bg-white/20 px-3 py-1 rounded-full">
            {textbook?.title || 'School Syllabus Textbook'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            {language === 'ml' ? 'പാഠഭാഗങ്ങളും അധ്യായങ്ങളും' : 'Chapters & Lessons'}
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 mt-1">
            {language === 'ml'
              ? 'പഠിക്കാൻ ആഗ്രഹിക്കുന്ന അധ്യായം തിരഞ്ഞെടുക്കൂ'
              : 'Choose a chapter to begin an interactive AI lesson or take a quiz'}
          </p>
        </div>

        <span className="text-5xl">{subject?.icon || '📖'}</span>
      </div>

      {/* Chapters List */}
      <div className="space-y-4">
        {chapters.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-slate-200">
            <p className="text-lg font-bold text-slate-600">No chapters found yet.</p>
            <p className="text-xs text-slate-400 mt-1">
              Ask your parent to upload your school textbook in the Parent Zone!
            </p>
          </div>
        ) : (
          chapters.map((chap) => (
            <div
              key={chap.id}
              className="bg-white rounded-3xl p-6 border-3 border-slate-200 hover:border-indigo-400 shadow-sm card-kid-hover transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 font-black text-xl flex items-center justify-center flex-shrink-0 shadow-inner">
                    {chap.chapterNumber}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-black text-slate-800">
                        {language === 'ml' ? chap.malayalamTitle : chap.title}
                      </h3>
                      <button
                        onClick={() => {
                          soundEffects.playPop();
                          speak(
                            language === 'ml'
                              ? `${chap.malayalamTitle}. ${chap.malayalamSummary}`
                              : `${chap.title}. ${chap.summary}`
                          );
                        }}
                        className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition shadow-sm"
                        title="Listen to Chapter Summary"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">
                      {language === 'ml' ? chap.malayalamSummary : chap.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 flex-wrap">
                  {chap.topics?.slice(0, 3).map((topic, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons for Chapter */}
              <div className="pt-4 border-t-2 border-slate-100 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    soundEffects.playPop();
                    router.push(`/child/lesson?chapterId=${chap.id}&subjectId=${subject?.id || ''}`);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center space-x-2 shadow-md btn-kid-3d"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{t('teachMe')}</span>
                </button>

                <button
                  onClick={() => {
                    soundEffects.playPop();
                    router.push(`/child/quiz?chapterId=${chap.id}&subjectId=${subject?.id || ''}`);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs flex items-center space-x-1.5 shadow-sm btn-kid-3d"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{t('takeQuiz')}</span>
                </button>

                <button
                  onClick={() => {
                    soundEffects.playPop();
                    router.push(`/child/flashcards?chapterId=${chap.id}&subjectId=${subject?.id || ''}`);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-black text-xs flex items-center space-x-1.5 shadow-sm btn-kid-3d"
                >
                  <Layers className="w-4 h-4" />
                  <span>{t('flashcards')}</span>
                </button>

                <button
                  onClick={() => {
                    soundEffects.playPop();
                    router.push(`/child/world3d?chapterId=${chap.id}&subjectId=${subject?.id || ''}`);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-800 font-black text-xs flex items-center space-x-1.5 shadow-sm btn-kid-3d"
                >
                  <Box className="w-4 h-4" />
                  <span>{t('explore3d')}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function ChaptersPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-bold">Loading chapters...</div>}>
      <ChaptersContent />
    </Suspense>
  );
}

