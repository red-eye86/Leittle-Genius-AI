'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Gamepad2, BookOpen, Layers, Volume2 } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import TracingGame from '@/components/games/TracingGame';
import MathSpeedChallenge from '@/components/games/MathSpeedChallenge';
import MemoryCardGame from '@/components/games/MemoryCardGame';
import ChapterQuestGame from '@/components/games/ChapterQuestGame';
import MathBlocks3D from '@/components/3d/MathBlocks3D';
import { soundEffects } from '@/lib/audio/soundEffects';
import { Subject, Textbook, TextbookChapter } from '@/lib/db/types';

function GamesArenaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryChapterId = searchParams.get('chapterId') || '';
  const querySubjectId = searchParams.get('subjectId') || '';

  const { activeChild, language, t, speak } = useApp();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(querySubjectId);
  const [selectedChapterId, setSelectedChapterId] = useState<string>(queryChapterId);
  const [activeGame, setActiveGame] = useState<string>('chapter_quest');

  const isUKG = activeChild?.classGrade === 'UKG';

  useEffect(() => {
    if (!activeChild) return;

    Promise.all([
      fetch(`/api/data/subjects?childId=${activeChild.id}`).then((r) => r.json()),
      fetch(`/api/data/textbooks?childId=${activeChild.id}`).then((r) => r.json()),
    ])
      .then(([subData, tbData]) => {
        const subs: Subject[] = subData.subjects || [];
        const tbs: Textbook[] = tbData.textbooks || [];
        setSubjects(subs);
        setTextbooks(tbs);

        // Check if queryChapterId belongs to this child's textbooks
        const matchingBook = queryChapterId
          ? tbs.find((tb) => tb.chapters?.some((c) => c.id === queryChapterId))
          : undefined;

        if (matchingBook && queryChapterId) {
          setSelectedSubjectId(matchingBook.subjectId);
          setSelectedChapterId(queryChapterId);
        } else if (querySubjectId && subs.some((s) => s.id === querySubjectId)) {
          setSelectedSubjectId(querySubjectId);
          const firstChap = tbs
            .filter((tb) => tb.subjectId === querySubjectId)
            .flatMap((tb) => tb.chapters || [])[0];
          setSelectedChapterId(firstChap?.id || '');
        } else if (subs.length > 0) {
          const defaultSubId = subs[0].id;
          setSelectedSubjectId(defaultSubId);
          const firstChap = tbs
            .filter((tb) => tb.subjectId === defaultSubId)
            .flatMap((tb) => tb.chapters || [])[0];
          setSelectedChapterId(firstChap?.id || '');
        }
      })
      .catch(() => {});
  }, [activeChild?.id, activeChild?.classGrade, queryChapterId, querySubjectId]);

  const subjectChapters: TextbookChapter[] = textbooks
    .filter((tb) => !selectedSubjectId || tb.subjectId === selectedSubjectId)
    .flatMap((tb) => tb.chapters || []);

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const activeChapter =
    subjectChapters.find((c) => c.id === selectedChapterId) || subjectChapters[0];

  const handleSubjectSelect = (subId: string) => {
    soundEffects.playPop();
    setSelectedSubjectId(subId);
    const chaps = textbooks
      .filter((tb) => tb.subjectId === subId)
      .flatMap((tb) => tb.chapters || []);
    setSelectedChapterId(chaps[0]?.id || '');
  };

  const handleChapterSelect = (chapId: string) => {
    soundEffects.playPop();
    setSelectedChapterId(chapId);
  };

  const games = [
    {
      id: 'chapter_quest',
      label: 'Chapter Concept Matcher 🎯',
      malayalamLabel: 'പാഠഭാഗം മാച്ചിംഗ് ഗെയിം 🎯',
    },
    {
      id: 'memory',
      label: 'Chapter Memory Flip 🃏',
      malayalamLabel: 'മെമ്മറി ഫ്ലിപ്പ് 🃏',
    },
    {
      id: 'tracing',
      label: 'Writing & Drawing Practice ✍️',
      malayalamLabel: 'എഴുത്തും വരയും ✍️',
    },
    {
      id: 'math_blitz',
      label: isUKG ? 'UKG Counting Blitz ⚡' : 'Speed Math Blitz ⚡',
      malayalamLabel: 'കണക്ക് സ്പീഡ് ചലഞ്ച് ⚡',
    },
    {
      id: 'apple_count',
      label: '3D Apple Counting 🍎',
      malayalamLabel: '3D ആപ്പിൾ എണ്ണൽ 🍎',
    },
  ];

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/child/dashboard')}
          className="flex items-center space-x-1.5 text-xs font-black text-slate-500 hover:text-slate-800 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ml' ? 'ഹോം' : 'Dashboard'}</span>
        </button>

        <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-pink-100 text-pink-700 flex items-center space-x-1.5">
          <Gamepad2 className="w-4 h-4" />
          <span>
            {activeChild
              ? `${activeChild.name} (${activeChild.classGrade}) • Syllabus Games`
              : '100% Educational Games'}
          </span>
        </span>
      </div>

      {/* Main Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 rounded-4xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-200 bg-white/20 px-3 py-1 rounded-full">
            {activeChild
              ? `${activeChild.name} • ${activeChild.classGrade} Play & Learn Arena`
              : 'Play & Learn Arena'}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black mt-2">
            {activeChapter
              ? `Ch ${activeChapter.chapterNumber}: ${
                  language === 'ml' ? activeChapter.malayalamTitle : activeChapter.title
                }`
              : t('gamesZone')}
          </h1>
          <p className="text-xs sm:text-sm text-pink-100 mt-1 max-w-2xl">
            {activeChapter
              ? language === 'ml'
                ? activeChapter.malayalamSummary
                : activeChapter.summary
              : language === 'ml'
              ? 'കളികളിലൂടെ സന്തോഷത്തോടെ പഠിക്കാം!'
              : 'Every game matches your exact school syllabus chapters!'}
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          {activeChapter && (
            <button
              onClick={() => {
                soundEffects.playPop();
                speak(
                  language === 'ml'
                    ? `${activeChapter.malayalamTitle}. ${activeChapter.malayalamSummary}`
                    : `${activeChapter.title}. ${activeChapter.summary}`
                );
              }}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-2xl font-black text-xs flex items-center space-x-1.5 border border-white/30 shadow-sm transition"
            >
              <Volume2 className="w-4 h-4" />
              <span>{language === 'ml' ? 'കേൾക്കാം' : 'Listen'}</span>
            </button>
          )}
          <span className="text-5xl animate-bounce-gentle">🎮</span>
        </div>
      </div>

      {/* Subject & Chapter Selector for the Active Child Profile */}
      {subjects.length > 0 ? (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-pink-100 shadow-sm space-y-4">
          {/* 1. Subject Tabs */}
          <div>
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1">
              <BookOpen className="w-3.5 h-3.5 text-pink-500" />
              <span>
                {language === 'ml'
                  ? `1. ${activeChild?.name || ''} — വിഷയം തിരഞ്ഞെടുക്കുക:`
                  : `1. Select ${activeChild?.name}'s Subject (${activeChild?.classGrade}):`}
              </span>
            </p>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {subjects.map((sub) => {
                const isSelected = sub.id === activeSubject?.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSubjectSelect(sub.id)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition flex items-center space-x-1.5 border ${
                      isSelected
                        ? 'bg-pink-500 text-white border-pink-500 shadow-md scale-[1.02]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-pink-50 hover:border-pink-200'
                    }`}
                  >
                    <span>{sub.icon}</span>
                    <span>{language === 'ml' && sub.malayalamName ? sub.malayalamName : sub.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Chapter Pills */}
          {subjectChapters.length > 0 && (
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {language === 'ml'
                    ? '2. ഗെയിം കളിക്കാൻ പാഠം തിരഞ്ഞെടുക്കുക:'
                    : '2. Select Chapter for Matching Games:'}
                </span>
              </p>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {subjectChapters.map((chap) => {
                  const isSelected = chap.id === activeChapter?.id;
                  return (
                    <button
                      key={chap.id}
                      onClick={() => handleChapterSelect(chap.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200'
                      }`}
                    >
                      Ch {chap.chapterNumber}: {language === 'ml' ? chap.malayalamTitle : chap.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border-2 border-pink-100 text-center space-y-3">
          <p className="text-sm font-bold text-slate-600">
            {language === 'ml'
              ? `${activeChild?.classGrade} സിലബസിനായി പാഠപുസ്തകങ്ങൾ അപ്‌ലോഡ് ചെയ്തിട്ടില്ല.`
              : `No curriculum uploaded yet for ${activeChild?.classGrade}.`}
          </p>
          <button
            onClick={() => router.push('/parent/syllabus')}
            className="px-5 py-2 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs transition"
          >
            Upload School Textbooks
          </button>
        </div>
      )}

      {/* Game Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {games.map((g) => (
          <button
            key={g.id}
            onClick={() => {
              soundEffects.playPop();
              setActiveGame(g.id);
            }}
            className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeGame === g.id
                ? 'bg-pink-500 text-white shadow-md scale-105'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <span>{language === 'ml' ? g.malayalamLabel : g.label}</span>
          </button>
        ))}
      </div>

      {/* Active Game Area */}
      <div className="pt-2">
        {activeGame === 'chapter_quest' && (
          <ChapterQuestGame chapter={activeChapter} subject={activeSubject} />
        )}
        {activeGame === 'memory' && (
          <MemoryCardGame chapter={activeChapter} subject={activeSubject} />
        )}
        {activeGame === 'tracing' && (
          <TracingGame chapter={activeChapter} subject={activeSubject} />
        )}
        {activeGame === 'math_blitz' && (
          <MathSpeedChallenge chapter={activeChapter} subject={activeSubject} />
        )}
        {activeGame === 'apple_count' && <MathBlocks3D isUKG={isUKG} />}
      </div>
    </div>
  );
}

export default function GamesPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-bold text-slate-500">Loading Play & Learn Games...</div>}>
      <GamesArenaContent />
    </Suspense>
  );
}
