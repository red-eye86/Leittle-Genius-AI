'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { TextbookChapter, Subject } from '@/lib/db/types';

interface CardItem {
  id: number;
  emoji: string;
  name: string;
  malayalamName: string;
}

interface MemoryCardGameProps {
  chapter?: TextbookChapter | null;
  subject?: Subject | null;
}

const DEFAULT_ITEMS: { emoji: string; name: string; malayalamName: string }[] = [
  { emoji: '☀️', name: 'Sun', malayalamName: 'സൂര്യൻ' },
  { emoji: '🌍', name: 'Earth', malayalamName: 'ഭൂമി' },
  { emoji: '🪐', name: 'Saturn', malayalamName: 'ശനി' },
  { emoji: '🍎', name: 'Apple', malayalamName: 'ആപ്പിൾ' },
  { emoji: '🐱', name: 'Cat', malayalamName: 'പൂച്ച' },
  { emoji: '⭐', name: 'Star', malayalamName: 'നക്ഷത്രം' },
];

function emojiForTerm(term: string, idx: number): string {
  const t = term.toLowerCase();
  if (t.includes('history') || t.includes('monument')) return '🏛️';
  if (t.includes('coin')) return '🪙';
  if (t.includes('manuscript')) return '📜';
  if (t.includes('inscript')) return '🪨';
  if (t.includes('archaeolog')) return '🔍';
  if (t.includes('historian')) return '📚';
  if (t.includes('artifact')) return '🏺';
  if (t.includes('almanac') || t.includes('calendar')) return '📅';
  if (t.includes('timeline') || t.includes('chronolog')) return '⏳';
  if (t.includes('citizen') || t.includes('democracy')) return '🇮🇳';
  if (t.includes('rotation') || t.includes('earth') || t.includes('globe')) return '🌍';
  if (t.includes('revolution') || t.includes('sun')) return '☀️';
  if (t.includes('himalaya') || t.includes('mountain')) return '🏔️';
  if (t.includes('plateau')) return '⛰️';
  if (t.includes('desert')) return '🐪';
  if (t.includes('compass') || t.includes('direction')) return '🧭';
  if (t.includes('map') || t.includes('atlas')) return '🗺️';
  if (t.includes('monsoon') || t.includes('rain')) return '🌧️';
  if (t.includes('soil') || t.includes('alluvial')) return '🌱';
  if (t.includes('forest') || t.includes('tree') || t.includes('photosynthesis')) return '🌳';
  if (t.includes('kharif') || t.includes('rabi') || t.includes('crop') || t.includes('agriculture')) return '🌾';
  if (t.includes('highway') || t.includes('metro') || t.includes('train')) return '🚆';
  if (t.includes('satellite')) return '🛰️';
  if (t.includes('pollution') || t.includes('recycle') || t.includes('biodegradable')) return '♻️';
  if (t.includes('incisor') || t.includes('molar') || t.includes('canine') || t.includes('enamel') || t.includes('tooth')) return '🦷';
  if (t.includes('carbohydrate') || t.includes('protein') || t.includes('vitamin') || t.includes('nutrient')) return '🥗';
  if (t.includes('apple')) return '🍎';
  if (t.includes('ball')) return '⚽';
  if (t.includes('cat')) return '🐱';
  if (t.includes('dog')) return '🐶';
  if (t.includes('elephant')) return '🐘';
  if (t.includes('umbrella')) return '☂️';
  const pool = ['🌟', '🎯', '🚀', '🧩', '🏆', '💡', '🦋', '🐬'];
  return pool[idx % pool.length];
}

export default function MemoryCardGame({ chapter, subject }: MemoryCardGameProps) {
  const { language, speak, addStars } = useApp();
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const buildChapterItems = () => {
    if (!chapter) return DEFAULT_ITEMS;

    const rawTerms = [
      ...(chapter.keyTerms || []),
      ...(chapter.topics || []).map((t) => t.split(':')[0].trim()),
    ];

    const uniqueTerms: string[] = [];
    for (const term of rawTerms) {
      if (term && !uniqueTerms.includes(term)) {
        uniqueTerms.push(term);
      }
      if (uniqueTerms.length === 6) break;
    }

    while (uniqueTerms.length < 6) {
      const fallback = DEFAULT_ITEMS[uniqueTerms.length];
      uniqueTerms.push(fallback.name);
    }

    return uniqueTerms.slice(0, 6).map((term, idx) => ({
      emoji: emojiForTerm(term, idx),
      name: term.slice(0, 18),
      malayalamName: term.slice(0, 18),
    }));
  };

  const initGame = () => {
    const baseItems = buildChapterItems();
    const pairs = [...baseItems, ...baseItems];
    const shuffled = pairs
      .map((item, idx) => ({ ...item, id: idx }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  useEffect(() => {
    initGame();
  }, [chapter?.id]);

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    soundEffects.playCardFlip();
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const first = cards[newFlipped[0]];
      const second = cards[newFlipped[1]];

      if (first.name === second.name) {
        soundEffects.playCorrect();
        const nextMatched = [...matched, newFlipped[0], newFlipped[1]];
        setMatched(nextMatched);
        setFlipped([]);

        speak(language === 'ml' ? `${first.malayalamName} കണ്ടെത്തി!` : `Matched ${first.name}!`);

        if (nextMatched.length === cards.length) {
          soundEffects.playStar();
          confetti({ particleCount: 60, spread: 50 });
          addStars(3);
        }
      } else {
        setTimeout(() => {
          soundEffects.playIncorrect();
          setFlipped([]);
        }, 850);
      }
    }
  };

  const isCompleted = cards.length > 0 && matched.length === cards.length;

  return (
    <div className="bg-white rounded-3xl p-6 border-4 border-yellow-400 shadow-xl max-w-2xl mx-auto text-center">
      <div className="flex items-center justify-between mb-4">
        <div className="text-left">
          {chapter && (
            <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
              {subject?.icon || '🃏'} Ch {chapter.chapterNumber}: {chapter.title}
            </span>
          )}
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-2xl">🃏</span>
            <h3 className="text-lg font-black text-slate-800">
              {language === 'ml' ? 'പാഠഭാഗം മെമ്മറി ഫ്ലിപ്പ് ഗെയിം' : 'Chapter Memory Flip Quest'}
            </h3>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-xs font-bold text-slate-600">
          <span>{language === 'ml' ? 'ശ്രമങ്ങൾ' : 'Moves'}: {moves}</span>
          <button
            onClick={initGame}
            className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-xl transition"
            title="New Cards"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 my-4">
        {cards.map((card, idx) => {
          const isCardFlipped = flipped.includes(idx) || matched.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => handleCardClick(idx)}
              className={`h-24 sm:h-28 p-2 rounded-2xl font-black flex flex-col items-center justify-center transition-all duration-300 shadow-md ${
                isCardFlipped
                  ? 'bg-amber-50 border-2 border-amber-400 text-slate-800 transform rotate-0 scale-100'
                  : 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white border-2 border-yellow-500 hover:scale-105'
              }`}
            >
              {isCardFlipped ? (
                <>
                  <span className="text-2xl sm:text-3xl">{card.emoji}</span>
                  <span className="text-[11px] sm:text-xs font-black leading-tight mt-1 line-clamp-2">
                    {card.name}
                  </span>
                </>
              ) : (
                <span className="text-3xl">❓</span>
              )}
            </button>
          );
        })}
      </div>

      {isCompleted && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 mt-4 animate-bounce-gentle">
          <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-1" />
          <h4 className="text-xl font-black text-amber-800">
            {language === 'ml'
              ? 'അഭിനന്ദനങ്ങൾ! ഈ പാഠത്തിലെ എല്ലാ ജോഡികളും നിങ്ങൾ കണ്ടെത്തി!'
              : `Hooray! You matched all pairs in ${chapter?.title || 'this chapter'}!`}
          </h4>
          <p className="text-xs font-bold text-slate-600 mt-0.5">+3 Stars Earned ⭐⭐⭐</p>
        </div>
      )}
    </div>
  );
}
