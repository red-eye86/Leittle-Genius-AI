'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Eye,
  Volume2,
  BookOpen,
  Box,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import SolarSystem3D from '@/components/3d/SolarSystem3D';
import MathBlocks3D from '@/components/3d/MathBlocks3D';
import AlphabetWorld3D from '@/components/3d/AlphabetWorld3D';
import Classroom3D from '@/components/3d/Classroom3D';
import ChapterConcept3D from '@/components/3d/ChapterConcept3D';
import ThreeCanvasFallback from '@/components/3d/ThreeCanvasFallback';
import { getTopicDetail, getChapterTopicsList } from '@/components/3d/chapter3dData';
import { soundEffects } from '@/lib/audio/soundEffects';
import { Subject, Textbook, TextbookChapter } from '@/lib/db/types';

function World3DContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryChapterId = searchParams.get('chapterId') || '';
  const querySubjectId = searchParams.get('subjectId') || '';

  const { activeChild, language, t, speakText } = useApp();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(querySubjectId);
  const [selectedChapterId, setSelectedChapterId] = useState<string>(queryChapterId);

  const [activeZone, setActiveZone] = useState<'chapter3d' | 'science' | 'math' | 'english' | 'classroom'>('chapter3d');
  const [useFallback2D, setUseFallback2D] = useState(false);

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

        if (queryChapterId) {
          let foundSubId = querySubjectId;
          if (!foundSubId) {
            for (const tb of tbs) {
              if (tb.chapters?.some((c) => c.id === queryChapterId)) {
                foundSubId = tb.subjectId;
                break;
              }
            }
          }
          setSelectedSubjectId(foundSubId || subs[0]?.id || '');
          setSelectedChapterId(queryChapterId);
          setActiveZone('chapter3d');
        } else if (querySubjectId) {
          setSelectedSubjectId(querySubjectId);
          const subTbs = tbs.filter((tb) => tb.subjectId === querySubjectId);
          const firstChap = subTbs.flatMap((tb) => tb.chapters || [])[0];
          setSelectedChapterId(firstChap?.id || '');
          setActiveZone('chapter3d');
        } else if (subs.length > 0) {
          const defaultSubId = subs[0].id;
          setSelectedSubjectId(defaultSubId);
          const subTbs = tbs.filter((tb) => tb.subjectId === defaultSubId);
          const firstChap = subTbs.flatMap((tb) => tb.chapters || [])[0];
          setSelectedChapterId(firstChap?.id || '');
        }
      })
      .catch(() => {});
  }, [activeChild, queryChapterId, querySubjectId]);

  const subjectChapters: TextbookChapter[] = textbooks
    .filter((tb) => !selectedSubjectId || tb.subjectId === selectedSubjectId)
    .flatMap((tb) => tb.chapters || []);

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId);
  const activeChapter = subjectChapters.find((c) => c.id === selectedChapterId) || subjectChapters[0];
  const activeChapterFirstTopic = activeChapter ? getChapterTopicsList(activeChapter)[0] : '';
  const activeChapterPreview = activeChapter ? getTopicDetail(activeChapter, activeChapterFirstTopic, 0) : null;

  const handleSubjectSelect = (subId: string) => {
    soundEffects.playPop();
    setSelectedSubjectId(subId);
    const subTbs = textbooks.filter((tb) => tb.subjectId === subId);
    const chaps = subTbs.flatMap((tb) => tb.chapters || []);
    setSelectedChapterId(chaps[0]?.id || '');
    setActiveZone('chapter3d');
  };

  const handleChapterSelect = (chapId: string) => {
    soundEffects.playPop();
    setSelectedChapterId(chapId);
    setActiveZone('chapter3d');
  };

  const zones = [
    { id: 'chapter3d', label: 'Chapter 3D PBR Studio', malayalamLabel: 'പാഠഭാഗം 3D 🧊', icon: '🧊' },
    { id: 'science', label: '3D Solar System', malayalamLabel: 'സൗരയൂഥം 🪐', icon: '🪐' },
    { id: 'math', label: '3D Math Counting', malayalamLabel: 'കണക്ക് ലോകം 🍎', icon: '🍎' },
    { id: 'english', label: '3D Phonics & A-Z', malayalamLabel: 'അക്ഷര ലോകം 🔤', icon: '🔤' },
    { id: 'classroom', label: 'Virtual Classroom', malayalamLabel: 'ക്ലാസ്സ്‌റൂം 🦉', icon: '🦉' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-1.5 text-xs font-black text-slate-500 hover:text-slate-800 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ml' ? 'തിരികെ' : 'Back'}</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="hidden sm:inline-flex items-center space-x-1 text-[11px] font-black px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>57+ Realistic PBR 3D Templates</span>
          </span>
          <button
            onClick={() => {
              soundEffects.playPop();
              setUseFallback2D(!useFallback2D);
            }}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center space-x-1"
          >
            <Eye className="w-3.5 h-3.5 text-sky-500" />
            <span>{useFallback2D ? 'Switch to 3D WebGL' : '2D Mode (Lightweight)'}</span>
          </button>
        </div>
      </div>

      {/* Main Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-700 rounded-4xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-200 bg-white/20 px-3 py-1 rounded-full">
              {activeSubject ? `${activeSubject.icon} ${activeSubject.name} • Realistic 3D Syllabus` : 'Interactive 3D Engine'}
            </span>
            {activeZone === 'chapter3d' && activeChapterPreview && (
              <span className="text-[11px] font-black text-emerald-200 bg-emerald-950/50 border border-emerald-400/40 px-3 py-1 rounded-full">
                🧱 {activeChapterPreview.materialNote}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {activeZone === 'chapter3d' && activeChapter
              ? `Ch ${activeChapter.chapterNumber}: ${activeChapter.title}`
              : t('world3d')}
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 max-w-2xl">
            {activeZone === 'chapter3d' && activeChapter
              ? activeChapter.summary
              : language === 'ml'
              ? 'വസ്തുക്കളെ തിരിക്കാം, തൊടാം, ശബ്ദം കേട്ട് ആസ്വദിച്ചു പഠിക്കാം!'
              : 'Rotate, zoom, explode parts, and inspect realistic 3D materials matched to every chapter!'}
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          {activeZone === 'chapter3d' && activeChapter && (
            <button
              onClick={() => {
                soundEffects.playPop();
                speakText(`${activeChapter.title}. ${activeChapter.summary}`);
              }}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-2xl font-black text-xs flex items-center space-x-1.5 border border-white/30 shadow-sm transition"
            >
              <Volume2 className="w-4 h-4" />
              <span>{language === 'ml' ? 'ശബ്ദം കേൾക്കാം' : 'Listen to Chapter'}</span>
            </button>
          )}
          <span className="text-5xl animate-bounce-gentle">
            {activeZone === 'chapter3d' && activeChapterPreview ? activeChapterPreview.emoji : '🚀'}
          </span>
        </div>
      </div>

      {/* Subject & Chapter Selector Card */}
      {subjects.length > 0 && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-sky-100 shadow-sm space-y-4">
          {/* Subject Tabs */}
          <div>
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1">
              <BookOpen className="w-3.5 h-3.5 text-sky-500" />
              <span>{language === 'ml' ? '1. വിഷയം തിരഞ്ഞെടുക്കുക:' : '1. Select Subject for Realistic 3D Exploration:'}</span>
            </p>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {subjects.map((sub) => {
                const isSelected = sub.id === selectedSubjectId;
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSubjectSelect(sub.id)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition flex items-center space-x-1.5 border ${
                      isSelected
                        ? 'bg-sky-500 text-white border-sky-500 shadow-md scale-[1.02]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-sky-50 hover:border-sky-200'
                    }`}
                  >
                    <span>{sub.icon}</span>
                    <span>{language === 'ml' && sub.malayalamName ? sub.malayalamName : sub.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chapter Pills with Exact 3D Template Preview */}
          {subjectChapters.length > 0 && (
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1">
                <Box className="w-3.5 h-3.5 text-indigo-500" />
                <span>
                  {language === 'ml'
                    ? '2. പാഠം തിരഞ്ഞെടുക്കുക (യഥാർത്ഥ 3D മോഡലും മെറ്റീരിയലും):'
                    : '2. Select Chapter (Exact-Matched 3D Template & Material):'}
                </span>
              </p>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {subjectChapters.map((chap) => {
                  const isSelected = chap.id === (activeChapter?.id || selectedChapterId) && activeZone === 'chapter3d';
                  const chapTopics = getChapterTopicsList(chap);
                  const preview = getTopicDetail(chap, chapTopics[0] || chap.title, 0);
                  return (
                    <button
                      key={chap.id}
                      onClick={() => handleChapterSelect(chap.id)}
                      className={`px-3.5 py-2 rounded-2xl text-left transition border flex items-center space-x-2 shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.01]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200'
                      }`}
                    >
                      <span className="text-lg">{preview.emoji}</span>
                      <div>
                        <div className="text-xs font-black whitespace-nowrap">
                          Ch {chap.chapterNumber}: {chap.title}
                        </div>
                        <div
                          className={`text-[10px] font-bold whitespace-nowrap ${
                            isSelected ? 'text-amber-200' : 'text-slate-400'
                          }`}
                        >
                          {chapTopics.length} 3D Models • {preview.shortLabel}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Zone Switcher Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {zones.map((z) => (
          <button
            key={z.id}
            onClick={() => {
              soundEffects.playPop();
              setActiveZone(z.id as any);
            }}
            className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition flex items-center space-x-2 ${
              activeZone === z.id
                ? 'bg-sky-500 text-white shadow-md scale-105'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <span>{z.icon}</span>
            <span>{language === 'ml' ? z.malayalamLabel : z.label}</span>
          </button>
        ))}
      </div>

      {/* 3D Canvas Zone Render */}
      <div className="w-full">
        {useFallback2D ? (
          <ThreeCanvasFallback title="2D Interactive Lightweight Learning" />
        ) : (
          <>
            {activeZone === 'chapter3d' && <ChapterConcept3D chapter={activeChapter} subject={activeSubject} />}
            {activeZone === 'science' && <SolarSystem3D />}
            {activeZone === 'math' && <MathBlocks3D isUKG={isUKG} />}
            {activeZone === 'english' && <AlphabetWorld3D />}
            {activeZone === 'classroom' && (
              <Classroom3D
                chapter={activeChapter}
                subject={activeSubject}
                subjects={subjects}
                chapters={subjectChapters}
                onSelectSubject={handleSubjectSelect}
                onSelectChapter={handleChapterSelect}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function World3DPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-bold text-slate-500">Loading 3D Learning World...</div>}>
      <World3DContent />
    </Suspense>
  );
}
