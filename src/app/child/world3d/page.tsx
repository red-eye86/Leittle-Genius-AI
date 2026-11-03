'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  Layers,
  Box,
  Eye,
  Volume2,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import SolarSystem3D from '@/components/3d/SolarSystem3D';
import MathBlocks3D from '@/components/3d/MathBlocks3D';
import AlphabetWorld3D from '@/components/3d/AlphabetWorld3D';
import Classroom3D from '@/components/3d/Classroom3D';
import ThreeCanvasFallback from '@/components/3d/ThreeCanvasFallback';
import { soundEffects } from '@/lib/audio/soundEffects';

export default function World3DPage() {
  const router = useRouter();
  const { activeChild, language, t } = useApp();
  const [activeZone, setActiveZone] = useState<'science' | 'math' | 'english' | 'classroom'>('science');
  const [useFallback2D, setUseFallback2D] = useState(false);

  const isUKG = activeChild?.classGrade === 'UKG';

  const zones = [
    { id: 'science', label: '3D Science World', malayalamLabel: 'സയൻസ് ലോകം 🪐', icon: '🪐' },
    { id: 'math', label: '3D Math Counting', malayalamLabel: 'കണക്ക് ലോകം 🍎', icon: '🍎' },
    { id: 'english', label: '3D Phonics & A-Z', malayalamLabel: 'അക്ഷര ലോകം 🔤', icon: '🔤' },
    { id: 'classroom', label: 'Virtual Classroom', malayalamLabel: 'ക്ലാസ്സ്‌റൂം 🦉', icon: '🦉' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/child/dashboard')}
          className="flex items-center space-x-1.5 text-xs font-black text-slate-500 hover:text-slate-800 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ml' ? 'ഹോം' : 'Dashboard'}</span>
        </button>

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

      {/* Main Banner */}
      <div className="bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 rounded-4xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-200 bg-white/20 px-3 py-1 rounded-full">
            Interactive 3D Engine
          </span>
          <h1 className="text-2xl sm:text-4xl font-black mt-2">
            {t('world3d')}
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 mt-1">
            {language === 'ml'
              ? 'വസ്തുക്കളെ തിരിക്കാം, തൊടാം, ശബ്ദം കേട്ട് ആസ്വദിച്ചു പഠിക്കാം!'
              : 'Rotate, touch, zoom, and explore curriculum concepts in 3D!'}
          </p>
        </div>

        <span className="text-5xl animate-bounce-gentle">🚀</span>
      </div>

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
            {activeZone === 'science' && <SolarSystem3D />}
            {activeZone === 'math' && <MathBlocks3D isUKG={isUKG} />}
            {activeZone === 'english' && <AlphabetWorld3D />}
            {activeZone === 'classroom' && <Classroom3D />}
          </>
        )}
      </div>
    </div>
  );
}

