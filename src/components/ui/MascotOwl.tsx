'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { soundEffects } from '@/lib/audio/soundEffects';

interface MascotOwlProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speaking?: boolean;
  onTap?: () => void;
}

export default function MascotOwl({ size = 'md', speaking = false, onTap }: MascotOwlProps) {
  const [isWiggling, setIsWiggling] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
  };

  const badgeSizeClasses = {
    sm: 'w-4 h-4 text-[9px] -bottom-0.5 -right-0.5',
    md: 'w-6 h-6 text-xs -bottom-1 -right-1',
    lg: 'w-7 h-7 text-sm -bottom-1 -right-1',
    xl: 'w-9 h-9 text-base -bottom-1.5 -right-1.5',
  };

  const handleClick = () => {
    soundEffects.playPop();
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 800);
    if (onTap) onTap();
  };

  return (
    <div
      onClick={handleClick}
      className={`relative cursor-pointer transition-transform duration-200 select-none flex-shrink-0 ${sizeClasses[size]} ${
        isWiggling ? 'animate-wiggle scale-110' : ''
      } ${speaking ? 'animate-bounce-gentle' : ''}`}
      title="Chikoo - Your Family Pet & AI Assistant! 🐶🐾 Tap me!"
    >
      {/* Speaking Glow Halo */}
      {speaking && (
        <div className="absolute -inset-1.5 rounded-full bg-cyan-400/40 animate-ping pointer-events-none" />
      )}

      {/* Chikoo 3D Avatar Image */}
      <div className="relative w-full h-full rounded-full overflow-hidden border-2 sm:border-3 border-cyan-400 shadow-lg ring-2 ring-indigo-200 bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600">
        <Image
          src="/characters/chikoo.jpg"
          alt="Chikoo - AI Pet Assistant"
          fill
          sizes="(max-width: 768px) 100px, 150px"
          className="object-cover object-top hover:scale-105 transition-transform duration-300"
          priority
        />
        {speaking && (
          <div className="absolute inset-0 border-2 border-cyan-300 rounded-full pointer-events-none animate-pulse" />
        )}
      </div>

      {/* Cute Tech Paw Badge */}
      <div
        className={`absolute rounded-full bg-cyan-500 text-white font-black flex items-center justify-center shadow-md border-2 border-white ring-1 ring-cyan-300 ${badgeSizeClasses[size]}`}
      >
        <span>🐾</span>
      </div>
    </div>
  );
}

export { MascotOwl as MascotChikoo };
