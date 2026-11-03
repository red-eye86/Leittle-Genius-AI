'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Gamepad2, Sparkles, Trophy } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import TracingGame from '@/components/games/TracingGame';
import MathSpeedChallenge from '@/components/games/MathSpeedChallenge';
import MemoryCardGame from '@/components/games/MemoryCardGame';
import MathBlocks3D from '@/components/3d/MathBlocks3D';
import { soundEffects } from '@/lib/audio/soundEffects';

export default function GamesPage() {
  const router = useRouter();
  const { activeChild, language, t } = useApp();

  const isUKG = activeChild?.classGrade === 'UKG';
  const [activeGame, setActiveGame] = useState<string>('tracing');

  const games = [
    { id: 'tracing', label: 'Writing & Drawing Practice ✍️', malayalamLabel: 'എഴുത്തും വരയും ✍️', forGrade: 'All' },
    { id: 'math_blitz', label: 'Speed Math Blitz ⚡', malayalamLabel: 'കണക്ക് സ്പീഡ് ചലഞ്ച് ⚡', forGrade: 'Primary' },
    { id: 'memory', label: 'Memory Flip Quest 🃏', malayalamLabel: 'മെമ്മറി ഫ്ലിപ്പ് 🃏', forGrade: 'All' },
    { id: 'apple_count', label: 'Apple Counting 🍎', malayalamLabel: 'ആപ്പിൾ എണ്ണൽ 🍎', forGrade: 'UKG' },
  ];

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/child/dashboard')}
          className="flex items-center space-x-1.5 text-xs font-black text-slate-500 hover:text-slate-800 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ml' ? 'ഹോം' : 'Dashboard'}</span>
        </button>

        <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-pink-100 text-pink-700 flex items-center space-x-1">
          <Gamepad2 className="w-4 h-4" />
          <span>100% Educational Games</span>
        </span>
      </div>

      {/* Main Banner */}
      <div className="bg-gradient-to-r from-pink-400 via-rose-500 to-amber-500 rounded-4xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-200 bg-white/20 px-3 py-1 rounded-full">
            Play & Learn Arena
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mt-2">
            {t('gamesZone')}
          </h1>
          <p className="text-xs sm:text-sm text-pink-100 mt-1">
            {language === 'ml'
              ? 'കളികളിലൂടെ സന്തോഷത്തോടെ പഠിക്കാം! തോൽവികളില്ല, പുതിയ കാര്യങ്ങൾ അറിയാം!'
              : 'Every game encourages curiosity and learning without pressure!'}
          </p>
        </div>

        <span className="text-5xl animate-bounce-gentle">🎮</span>
      </div>

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
        {activeGame === 'tracing' && <TracingGame />}
        {activeGame === 'math_blitz' && <MathSpeedChallenge />}
        {activeGame === 'memory' && <MemoryCardGame />}
        {activeGame === 'apple_count' && <MathBlocks3D isUKG />}
      </div>
    </div>
  );
}

