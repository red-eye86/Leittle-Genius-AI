'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';

interface CardItem {
  id: number;
  emoji: string;
  name: string;
  malayalamName: string;
}

const BASE_ITEMS: { emoji: string; name: string; malayalamName: string }[] = [
  { emoji: '☀️', name: 'Sun', malayalamName: 'സൂര്യൻ' },
  { emoji: '🌍', name: 'Earth', malayalamName: 'ഭൂമി' },
  { emoji: '🪐', name: 'Saturn', malayalamName: 'ശനി' },
  { emoji: '🍎', name: 'Apple', malayalamName: 'ആപ്പിൾ' },
  { emoji: '🐱', name: 'Cat', malayalamName: 'പൂച്ച' },
  { emoji: '⭐', name: 'Star', malayalamName: 'നക്ഷത്രം' },
];

export default function MemoryCardGame() {
  const { language, speak, addStars } = useApp();
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const initGame = () => {
    const pairs = [...BASE_ITEMS, ...BASE_ITEMS];
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
  }, []);

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

        speak(language === 'ml' ? `${first.malayalamName} കണ്ടെത്തി!` : `Found ${first.name}!`);

        if (nextMatched.length === cards.length) {
          soundEffects.playStar();
          confetti({ particleCount: 60, spread: 50 });
          addStars(3);
        }
      } else {
        setTimeout(() => {
          soundEffects.playIncorrect();
          setFlipped([]);
        }, 800);
      }
    }
  };

  const isCompleted = cards.length > 0 && matched.length === cards.length;

  return (
    <div className="bg-white rounded-3xl p-6 border-4 border-yellow-400 shadow-xl max-w-lg mx-auto text-center">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🃏</span>
          <h3 className="text-lg font-black text-slate-800">
            {language === 'ml' ? 'ഓർമ്മശക്തി കളി' : 'Memory Flip Quest'}
          </h3>
        </div>
        <div className="flex items-center space-x-3 text-xs font-bold text-slate-600">
          <span>{language === 'ml' ? 'ശ്രമങ്ങൾ' : 'Moves'}: {moves}</span>
          <button
            onClick={initGame}
            className="p-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-xl transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 my-4">
        {cards.map((card, idx) => {
          const isCardFlipped = flipped.includes(idx) || matched.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => handleCardClick(idx)}
              className={`h-20 sm:h-24 rounded-2xl font-black text-3xl sm:text-4xl flex items-center justify-center transition-all duration-300 shadow-md ${
                isCardFlipped
                  ? 'bg-amber-100 border-2 border-amber-400 transform rotate-0 scale-100'
                  : 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white border-2 border-yellow-500 hover:scale-105'
              }`}
            >
              {isCardFlipped ? card.emoji : '❓'}
            </button>
          );
        })}
      </div>

      {isCompleted && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 mt-4 animate-bounce-gentle">
          <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-1" />
          <h4 className="text-xl font-black text-amber-800">
            {language === 'ml' ? 'അഭിനന്ദനങ്ങൾ! നിങ്ങൾ എല്ലാ ജോഡികളും കണ്ടെത്തി!' : 'Hooray! You matched all pairs!'}
          </h4>
          <p className="text-xs font-bold text-slate-600 mt-0.5">+3 Stars Earned ⭐⭐⭐</p>
        </div>
      )}
    </div>
  );
}

