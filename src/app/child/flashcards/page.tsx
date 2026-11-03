'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  RotateCw,
  CheckCircle2,
  Clock,
  Volume2,
  Sparkles,
  ArrowRight,
  Layers,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { Flashcard, Subject, Textbook, TextbookChapter } from '@/lib/db/types';

function FlashcardsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlChapterId = searchParams.get('chapterId');
  const urlSubjectId = searchParams.get('subjectId');

  const { activeChild, language, t, speak, stopSpeech, addStars } = useApp();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(urlSubjectId || '');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(urlChapterId || '');

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load subjects and textbooks for the active child
  useEffect(() => {
    if (!activeChild) return;

    Promise.all([
      fetch(`/api/data/subjects?childId=${activeChild.id}`).then((r) => r.json()),
      fetch(`/api/data/textbooks?childId=${activeChild.id}`).then((r) => r.json()),
    ])
      .then(([subData, bookData]) => {
        const subs: Subject[] = subData.subjects || [];
        const books: Textbook[] = bookData.textbooks || [];
        setSubjects(subs);
        setTextbooks(books);

        // Determine initial subject and chapter
        if (urlChapterId) {
          const parentBook = books.find((b) => b.chapters.some((c) => c.id === urlChapterId));
          if (parentBook) {
            setSelectedSubjectId(parentBook.subjectId);
            setSelectedChapterId(urlChapterId);
            return;
          }
        }

        if (urlSubjectId) {
          setSelectedSubjectId(urlSubjectId);
          const book = books.find((b) => b.subjectId === urlSubjectId);
          if (book && book.chapters.length > 0) {
            setSelectedChapterId(book.chapters[0].id);
            return;
          }
        }

        if (subs.length > 0) {
          const firstSub = subs[0];
          setSelectedSubjectId(firstSub.id);
          const firstBook = books.find((b) => b.subjectId === firstSub.id) || books[0];
          if (firstBook && firstBook.chapters.length > 0) {
            setSelectedChapterId(firstBook.chapters[0].id);
          }
        }
      })
      .catch((e) => console.error(e));
  }, [activeChild, urlChapterId, urlSubjectId]);

  // Fetch / generate flashcards whenever selectedChapterId changes
  useEffect(() => {
    if (!activeChild || !selectedChapterId) return;
    setLoading(true);
    setCurrentIndex(0);
    setIsFlipped(false);

    fetch(
      `/api/flashcards/generate?childId=${activeChild.id}&chapterId=${selectedChapterId}&subjectId=${selectedSubjectId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setCards(data.flashcards || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [activeChild, selectedChapterId, selectedSubjectId]);

  if (!activeChild) return null;

  const activeBook = textbooks.find((b) => b.subjectId === selectedSubjectId);
  const chaptersForSubject: TextbookChapter[] = activeBook?.chapters || [];
  const activeChapter = chaptersForSubject.find((c) => c.id === selectedChapterId);
  const activeSubject = subjects.find((s) => s.id === selectedSubjectId);

  const handleSubjectSelect = (subId: string) => {
    soundEffects.playPop();
    stopSpeech();
    setSelectedSubjectId(subId);
    const book = textbooks.find((b) => b.subjectId === subId);
    if (book && book.chapters.length > 0) {
      setSelectedChapterId(book.chapters[0].id);
    }
  };

  const handleChapterSelect = (chapId: string) => {
    soundEffects.playPop();
    stopSpeech();
    setSelectedChapterId(chapId);
  };

  const currentCard = cards[currentIndex];

  const handleFlip = () => {
    soundEffects.playCardFlip();
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    soundEffects.playPop();
    stopSpeech();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, cards.length));
  };

  const handlePrevious = () => {
    soundEffects.playPop();
    stopSpeech();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % Math.max(1, cards.length));
  };

  const handleMastered = () => {
    soundEffects.playCorrect();
    addStars(2);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    setCards((prev) =>
      prev.map((c, idx) => (idx === currentIndex ? { ...c, mastered: true } : c))
    );
    handleNext();
  };

  const readCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.playPop();
    if (!currentCard) return;
    const text = isFlipped
      ? language === 'ml'
        ? currentCard.backMalayalam
        : currentCard.back
      : language === 'ml'
      ? currentCard.frontMalayalam
      : currentCard.front;
    speak(text);
  };

  const masteredCount = cards.filter((c) => c.mastered).length;

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            stopSpeech();
            router.back();
          }}
          className="flex items-center space-x-1.5 text-xs font-black text-slate-500 hover:text-slate-800 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ml' ? 'തിരികെ' : 'Back'}</span>
        </button>

        <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-purple-100 text-purple-800 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            Mastered: {masteredCount} / {cards.length} Cards
          </span>
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-violet-600 rounded-4xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
            ✨ Subject-Wise & Chapter-Wise Flashcards
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">{t('flashcards')}</h1>
          <p className="text-xs sm:text-sm text-purple-100 mt-1">
            {language === 'ml'
              ? 'വിഷയവും അധ്യായവും തിരഞ്ഞെടുത്ത് കാർഡുകൾ മറിച്ചു പഠിക്കാം!'
              : 'Select any subject and chapter below, tap a card to flip, and listen to pronunciation!'}
          </p>
        </div>
        <span className="text-5xl animate-bounce-gentle">🃏✨</span>
      </div>

      {/* 1. Subject Selector Tabs */}
      <div className="space-y-2">
        <p className="text-xs font-black uppercase text-slate-400 tracking-wider">
          1. {language === 'ml' ? 'വിഷയം തിരഞ്ഞെടുക്കൂ (Select Subject):' : 'Select Subject:'}
        </p>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {subjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => handleSubjectSelect(sub.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition flex items-center space-x-2 border-2 ${
                selectedSubjectId === sub.id
                  ? 'bg-purple-600 text-white border-purple-700 shadow-md scale-105'
                  : 'bg-white text-slate-700 hover:bg-purple-50 border-slate-200'
              }`}
            >
              <span>{sub.icon}</span>
              <span>{language === 'ml' ? sub.malayalamName : sub.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Chapter Selector Pills */}
      {chaptersForSubject.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-black uppercase text-slate-400 tracking-wider">
            2. {language === 'ml' ? 'അധ്യായം തിരഞ്ഞെടുക്കൂ (Select Chapter):' : 'Select Chapter:'}
          </p>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {chaptersForSubject.map((chap) => (
              <button
                key={chap.id}
                onClick={() => handleChapterSelect(chap.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition border-2 ${
                  selectedChapterId === chap.id
                    ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                }`}
              >
                Ch {chap.chapterNumber}: {language === 'ml' ? chap.malayalamTitle : chap.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Flashcard Deck Display */}
      {loading ? (
        <div className="p-16 text-center font-black text-purple-600 animate-pulse">
          Generating Chapter Flashcards... ✨
        </div>
      ) : cards.length === 0 ? (
        <div className="bg-white rounded-4xl p-12 border-4 border-slate-200 text-center space-y-4">
          <p className="text-lg font-bold text-slate-600">No flashcards found for this chapter.</p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6 text-center">
          {/* Active Chapter Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-black">
            <BookOpen className="w-3.5 h-3.5" />
            <span>
              {activeSubject?.icon} {language === 'ml' ? activeSubject?.malayalamName : activeSubject?.name} • Ch{' '}
              {activeChapter?.chapterNumber}: {language === 'ml' ? activeChapter?.malayalamTitle : activeChapter?.title}
            </span>
          </div>

          {/* 3D Flip Card */}
          <div
            onClick={handleFlip}
            className="cursor-pointer group select-none relative min-h-[340px] sm:min-h-[380px] flex flex-col justify-between rounded-5xl p-8 sm:p-10 transition-all duration-300 shadow-kid border-4 bg-white hover:border-purple-400"
            style={{
              borderColor: isFlipped ? '#10b981' : '#c084fc',
              background: isFlipped
                ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
                : 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
            }}
          >
            {/* Card Top Bar */}
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                  isFlipped ? 'bg-emerald-200 text-emerald-900' : 'bg-purple-200 text-purple-900'
                }`}
              >
                {isFlipped
                  ? language === 'ml'
                    ? 'ഉത്തരം / വിശദീകരണം'
                    : 'Answer & Explanation'
                  : currentCard.category}
              </span>

              <div className="flex items-center space-x-2">
                {currentCard.mastered && (
                  <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Mastered</span>
                  </span>
                )}
                <button
                  onClick={readCard}
                  className="px-3 py-2 bg-white hover:bg-purple-600 hover:text-white rounded-2xl shadow-md text-purple-700 transition flex items-center space-x-1 text-xs font-black"
                  title="Listen Pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{language === 'ml' ? 'കേൾക്കാം 🔊' : 'Listen 🔊'}</span>
                </button>
              </div>
            </div>

            {/* Card Center Content */}
            <div className="my-auto py-6 space-y-4">
              <div className="text-6xl sm:text-7xl animate-bounce-gentle">
                {currentCard.visualEmoji || '🌟'}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 leading-snug">
                {isFlipped
                  ? language === 'ml'
                    ? currentCard.backMalayalam
                    : currentCard.back
                  : language === 'ml'
                  ? currentCard.frontMalayalam
                  : currentCard.front}
              </h2>

              {!isFlipped && (
                <p className="text-xs font-bold text-purple-500 pt-2">
                  👆 {language === 'ml' ? 'ഉത്തരം കാണാൻ കാർഡിൽ തൊടൂ' : 'Tap anywhere on the card to flip!'}
                </p>
              )}
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>
                Card {currentIndex + 1} of {cards.length}
              </span>
              <span className="flex items-center space-x-1 text-purple-600">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Flip Card</span>
              </span>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handlePrevious}
              className="px-5 py-3 rounded-2xl bg-white border-2 border-slate-200 font-black text-xs text-slate-700 hover:bg-slate-50"
            >
              👈 {t('previous')}
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-xs flex items-center space-x-1.5"
            >
              <Clock className="w-4 h-4" />
              <span>{language === 'ml' ? 'പിന്നീട് പഠിക്കാം' : 'Review Later'}</span>
            </button>

            <button
              onClick={handleMastered}
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs flex items-center space-x-1.5 shadow-lg btn-kid-3d"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'ml' ? 'പഠിച്ചു കഴിഞ്ഞു! (+2 ⭐)' : 'I Know This! (+2 ⭐)'}</span>
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs flex items-center space-x-1 shadow-md btn-kid-3d"
            >
              <span>{t('next')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FlashcardsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-bold">Loading Flashcards...</div>}>
      <FlashcardsContent />
    </Suspense>
  );
}
