'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  BookOpen,
  Sparkles,
  HelpCircle,
  Layers,
  ArrowRight,
  CheckCircle2,
  Smile,
  Heart,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import MascotOwl from '@/components/ui/MascotOwl';
import { soundEffects } from '@/lib/audio/soundEffects';
import { Lesson, LessonSection } from '@/lib/db/types';

function LessonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterId = searchParams.get('chapterId') || 'chap-c3-sci-1';
  const { activeChild, language, t, speak, stopSpeech, isSpeaking, addStars } = useApp();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<'teach' | 'story' | 'visual' | 'activity'>('teach');
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!activeChild) return;
    setLoading(true);
    fetch('/api/lesson/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chapterId,
        childId: activeChild.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.lesson) {
          setLesson(data.lesson);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [activeChild, chapterId]);

  if (!activeChild) return null;

  const currentSection = lesson?.sections.find((s) => {
    if (activeTab === 'teach') return s.type === 'explanation' || s.type === 'intro';
    if (activeTab === 'story') return s.type === 'story';
    if (activeTab === 'visual') return s.type === 'visual';
    if (activeTab === 'activity') return s.type === 'activity';
    return true;
  }) || lesson?.sections[0];

  const handleReadSection = () => {
    if (!currentSection) return;
    const content = language === 'ml'
      ? `${currentSection.malayalamTitle}. ${currentSection.malayalamContent}`
      : `${currentSection.title}. ${currentSection.content}`;
    speak(content);
  };

  const handleFinishLesson = () => {
    soundEffects.playCorrect();
    addStars(5);
    setCompleted(true);
    speak(
      language === 'ml'
        ? 'അഭിനന്ദനങ്ങൾ! നിങ്ങൾ ഈ പാഠഭാഗം വിജയകരമായി പൂർത്തിയാക്കി! 5 നക്ഷത്രങ്ങൾ ലഭിച്ചു!'
        : 'Awesome! You completed this lesson and earned 5 Stars!'
    );
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-1.5 text-xs font-black text-slate-500 hover:text-slate-800 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ml' ? 'തിരികെ' : 'Back'}</span>
        </button>

        {lesson && (
          <span className="text-[11px] font-bold text-slate-400 bg-white px-3 py-1.5 rounded-xl border border-slate-200 flex items-center space-x-1">
            <BookOpen className="w-3.5 h-3.5 text-sky-500" />
            <span className="truncate max-w-[200px] sm:max-w-none">{lesson.sourceTextbook}</span>
          </span>
        )}
      </div>

      {loading ? (
        <div className="bg-white rounded-4xl p-16 text-center border-4 border-sky-200 shadow-sm">
          <MascotOwl size="lg" speaking />
          <p className="text-xl font-black text-slate-700 mt-4">
            {language === 'ml' ? 'ഹുട്ടി ടീച്ചർ പാഠം തയ്യാറാക്കുന്നു...' : 'Teacher Hootie is preparing your lesson...'}
          </p>
        </div>
      ) : !lesson ? (
        <div className="bg-white rounded-4xl p-12 text-center border-2 border-slate-200">
          <p className="text-lg font-bold text-slate-600">Lesson not found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Lesson Header Card */}
          <div className="bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 rounded-4xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-black uppercase tracking-wider text-amber-200 bg-white/20 px-3 py-1 rounded-full">
                Interactive Lesson
              </span>
              <h1 className="text-3xl sm:text-4xl font-black">
                {language === 'ml' ? lesson.malayalamTitle : lesson.title}
              </h1>
              <p className="text-xs sm:text-sm text-sky-100 max-w-lg">
                {lesson.learningObjectives?.[0] || 'Master the concepts with friendly guidance!'}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleReadSection}
                className={`p-3 sm:px-5 sm:py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center space-x-2 shadow-lg transition btn-kid-3d ${
                  isSpeaking
                    ? 'bg-amber-400 text-slate-900 animate-pulse'
                    : 'bg-white text-indigo-700 hover:bg-sky-50'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                <span className="hidden sm:inline">
                  {isSpeaking
                    ? language === 'ml'
                      ? 'നിർത്തുക'
                      : 'Stop Speaking'
                    : language === 'ml'
                    ? 'ശബ്ദം കേൾക്കാം'
                    : 'Listen to Hootie'}
                </span>
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            <button
              onClick={() => {
                soundEffects.playPop();
                setActiveTab('teach');
              }}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition flex items-center space-x-1.5 ${
                activeTab === 'teach'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <span>📖</span>
              <span>{t('teachMe')}</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playPop();
                setActiveTab('story');
              }}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition flex items-center space-x-1.5 ${
                activeTab === 'story'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <span>🐾</span>
              <span>{t('storyMode')}</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playPop();
                setActiveTab('visual');
              }}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition flex items-center space-x-1.5 ${
                activeTab === 'visual'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <span>🎨</span>
              <span>{t('picturesMode')}</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playPop();
                setActiveTab('activity');
              }}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition flex items-center space-x-1.5 ${
                activeTab === 'activity'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <span>🎮</span>
              <span>{t('gameMode')}</span>
            </button>
          </div>

          {/* Section Body */}
          {currentSection && (
            <div className="bg-white rounded-4xl p-6 sm:p-10 border-4 border-slate-200 shadow-md space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b-2 border-slate-100">
                <span className="text-4xl">{currentSection.visualEmoji || '💡'}</span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-800">
                    {language === 'ml' ? currentSection.malayalamTitle : currentSection.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-400">
                    {activeTab.toUpperCase()} EXPLORATION
                  </p>
                </div>
              </div>

              <div className="prose max-w-none text-slate-700 font-medium text-base sm:text-lg leading-relaxed whitespace-pre-line">
                {language === 'ml' ? currentSection.malayalamContent : currentSection.content}
              </div>

              {/* Learning Objectives box */}
              {lesson.learningObjectives?.length > 0 && (
                <div className="bg-sky-50 rounded-3xl p-5 border-2 border-sky-200 space-y-2">
                  <p className="text-xs font-black uppercase text-sky-700 tracking-wider">
                    {language === 'ml' ? 'പഠന ലക്ഷ്യങ്ങൾ' : 'What We Learned Today:'}
                  </p>
                  <ul className="space-y-1 text-xs sm:text-sm font-bold text-slate-700">
                    {(language === 'ml' ? lesson.malayalamObjectives : lesson.learningObjectives).map(
                      (obj, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>{obj}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="bg-slate-50 rounded-4xl p-6 border-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-slate-800">
                {completed
                  ? language === 'ml'
                    ? 'പാഠം പൂർത്തിയാക്കി! അടുത്തത് എന്താണ്?'
                    : 'Lesson Completed! Where next?'
                  : language === 'ml'
                  ? 'ഈ പാഠം പഠിച്ചു കഴിഞ്ഞോ?'
                  : 'Ready to finish this lesson?'}
              </p>
              <p className="text-xs text-slate-500">
                Test your understanding in the Quiz Arena or practice flashcards!
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {!completed ? (
                <button
                  onClick={handleFinishLesson}
                  className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm flex items-center space-x-1.5 shadow-md btn-kid-3d"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>{language === 'ml' ? 'പാഠം പൂർത്തിയായി ⭐ +5' : 'Mark Done (+5 Stars ⭐)'}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    soundEffects.playPop();
                    router.push(`/child/quiz?chapterId=${chapterId}`);
                  }}
                  className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-sm flex items-center space-x-2 shadow-md btn-kid-3d"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span>{t('takeQuiz')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => {
                  soundEffects.playPop();
                  router.push(`/child/flashcards?chapterId=${chapterId}`);
                }}
                className="px-4 py-3 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-black text-xs"
              >
                {t('flashcards')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LessonPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-bold">Loading lesson...</div>}>
      <LessonContent />
    </Suspense>
  );
}

