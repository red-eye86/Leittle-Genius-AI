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
  RefreshCw,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { Flashcard } from '@/lib/db/types';

function FlashcardsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterId = searchParams.get('chapterId');
  const { activeChild, language, t, speak, addStars } = useApp();

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeChild) return;
    setLoading(true);

    const url = chapterId
      ? `/api/flashcards/generate?childId=${activeChild.id}&chapterId=${chapterId}`
      : `/api/flashcards/generate?childId=${activeChild.id}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCards(data.flashcards || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [activeChild, chapterId]);

  if (!activeChild) return null;

  const currentCard = cards[currentIndex];

  const handleFlip = () => {
    soundEffects.playCardFlip();
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    soundEffects.playPop();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrevious = () => {
    soundEffects.playPop();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleMastered = () => {
    soundEffects.playCorrect();
    addStars(1);
    setCards((prev) =>
      prev.map((c, idx) => (idx === currentIndex ? { ...c, mastered: true } : c))
    );
    handleNext();
  };

  const readCard = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <div className="space-y-6 pb-16 animate-fade-in max-w-2xl mx-auto text-center">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-1.5 text-xs font-black text-slate-500 hover:text-slate-800 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ml' ? 'തിരികെ' : 'Back'}</span>
        </button>

        <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-purple-100 text-purple-800">
          ⭐ {masteredCount} / {cards.length} Mastered
        </span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800">
          {t('flashcards')}
        </h1>
        <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
          {language === 'ml'
            ? 'കാർഡ് മറിക്കാൻ തൊടൂ, ഉത്തരം കാണാം!'
            : 'Tap the card to flip and discover the answer!'}
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-4xl p-16 border-2 border-slate-200">
          <p className="text-lg font-bold text-slate-600">Loading flashcards...</p>
        </div>
      ) : cards.length === 0 ? (
        <div className="bg-white rounded-4xl p-12 border-2 border-slate-200">
          <p className="text-lg font-bold text-slate-600">No flashcards found for this section.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Card Counter */}
          <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-500">
            <span>Card {currentIndex + 1} of {cards.length}</span>
            <span className="text-purple-600 font-black">{currentCard.category}</span>
          </div>

          {/* Interactive Flip Card Container */}
          <div
            onClick={handleFlip}
            className="perspective-1000 w-full h-[320px] sm:h-[360px] cursor-pointer select-none"
          >
            <div
              className={`relative w-full h-full rounded-5xl shadow-2xl transition-transform duration-500 transform-style-3d border-4 ${
                isFlipped
                  ? 'rotate-y-180 bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-purple-400'
                  : 'bg-white text-slate-800 border-sky-300'
              }`}
            >
              {/* FRONT OF CARD */}
              <div
                className={`absolute inset-0 p-8 flex flex-col items-center justify-between backface-hidden ${
                  isFlipped ? 'hidden' : 'flex'
                }`}
              >
                <div className="w-full flex items-center justify-between">
                  <span className="text-4xl">{currentCard.visualEmoji}</span>
                  <button
                    onClick={readCard}
                    className="p-2.5 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-700"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
                    {language === 'ml' ? currentCard.frontMalayalam : currentCard.front}
                  </h3>
                  <p className="text-xs font-bold text-sky-600">
                    {language === 'ml' ? currentCard.front : currentCard.frontMalayalam}
                  </p>
                </div>

                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-400">
                  <RotateCw className="w-4 h-4 text-sky-400" />
                  <span>{t('flipCard')}</span>
                </div>
              </div>

              {/* BACK OF CARD */}
              <div
                className={`absolute inset-0 p-8 flex flex-col items-center justify-between backface-hidden rotate-y-180 ${
                  !isFlipped ? 'hidden' : 'flex'
                }`}
              >
                <div className="w-full flex items-center justify-between">
                  <span className="text-4xl">{currentCard.visualEmoji}</span>
                  <button
                    onClick={readCard}
                    className="p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 px-4">
                  <p className="text-lg sm:text-xl font-bold leading-relaxed">
                    {language === 'ml' ? currentCard.backMalayalam : currentCard.back}
                  </p>
                </div>

                <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-200">
                  <RotateCw className="w-4 h-4" />
                  <span>Tap to flip back</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Feedback Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handlePrevious}
              className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border-2 border-slate-200 shadow-sm"
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center space-x-1.5"
            >
              <Clock className="w-4 h-4" />
              <span>{t('reviewLater')}</span>
            </button>

            <button
              onClick={handleMastered}
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm flex items-center space-x-2 shadow-lg btn-kid-3d"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{t('markMastered')}</span>
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border-2 border-slate-200 shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FlashcardsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-bold">Loading flashcards...</div>}>
      <FlashcardsContent />
    </Suspense>
  );
}

