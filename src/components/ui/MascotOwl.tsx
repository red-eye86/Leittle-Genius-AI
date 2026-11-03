'use client';

import React, { useState } from 'react';
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

  const handleClick = () => {
    soundEffects.playPop();
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 800);
    if (onTap) onTap();
  };

  return (
    <div
      onClick={handleClick}
      className={`relative cursor-pointer transition-transform duration-200 select-none ${sizeClasses[size]} ${
        isWiggling ? 'animate-wiggle scale-110' : ''
      } ${speaking ? 'animate-bounce-gentle' : ''}`}
      title="Hootie the Learning Owl! Tap me!"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        {/* Owl Ear Tufts */}
        <polygon points="22,35 15,10 38,25" fill="#4f46e5" />
        <polygon points="78,35 85,10 62,25" fill="#4f46e5" />

        {/* Owl Body */}
        <ellipse cx="50" cy="55" rx="36" ry="38" fill="#6366f1" />

        {/* Belly */}
        <ellipse cx="50" cy="62" rx="24" ry="26" fill="#e0e7ff" />
        {/* Belly feather marks */}
        <path d="M42,52 Q50,56 58,52" stroke="#818cf8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M38,62 Q50,67 62,62" stroke="#818cf8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M44,72 Q50,76 56,72" stroke="#818cf8" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Wings */}
        <path d="M14,50 Q10,75 25,78 Q22,60 20,48 Z" fill="#4338ca" />
        <path d="M86,50 Q90,75 75,78 Q78,60 80,48 Z" fill="#4338ca" />

        {/* Big Curious Eyes */}
        <circle cx="36" cy="40" r="14" fill="#ffffff" stroke="#c7d2fe" strokeWidth="2" />
        <circle cx="64" cy="40" r="14" fill="#ffffff" stroke="#c7d2fe" strokeWidth="2" />

        {/* Pupils */}
        <circle cx={speaking ? '38' : '36'} cy="40" r="8" fill="#1e1b4b" />
        <circle cx={speaking ? '66' : '64'} cy="40" r="8" fill="#1e1b4b" />

        {/* Eye Twinkle Highlights */}
        <circle cx="34" cy="37" r="3.5" fill="#ffffff" />
        <circle cx="62" cy="37" r="3.5" fill="#ffffff" />
        <circle cx="38" cy="42" r="1.5" fill="#ffffff" />
        <circle cx="66" cy="42" r="1.5" fill="#ffffff" />

        {/* Orange Beak */}
        <polygon points="50,44 43,54 57,54" fill="#f59e0b" />

        {/* Cute Feet */}
        <ellipse cx="40" cy="91" rx="6" ry="3" fill="#f59e0b" />
        <ellipse cx="60" cy="91" rx="6" ry="3" fill="#f59e0b" />

        {/* Graduation Cap */}
        <polygon points="50,14 18,22 50,30 82,22" fill="#0f172a" />
        <rect x="42" y="27" width="16" height="5" rx="2" fill="#1e293b" />
        {/* Tassel */}
        <line x1="50" y1="22" x2="78" y2="30" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="78" cy="31" r="2.5" fill="#f59e0b" />
      </svg>
    </div>
  );
}

