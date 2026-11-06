'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';

interface LiveVoiceButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LiveVoiceButton({
  className = '',
  size = 'md',
}: LiveVoiceButtonProps) {
  const { openLiveVoice, isLiveVoiceOpen } = useApp();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const barClasses = {
    sm: 'w-0.5 space-x-0.5',
    md: 'w-1 space-x-1',
    lg: 'w-1.5 space-x-1.5',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    soundEffects.playStar();
    openLiveVoice();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`relative rounded-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-blue-500/30 hover:scale-105 active:scale-95 flex-shrink-0 group ${
        sizeClasses[size]
      } ${isLiveVoiceOpen ? 'ring-4 ring-blue-400/50 bg-blue-500' : ''} ${className}`}
      title="Start Live Voice Chat with Chikoo JARVIS (Hands-free Voice Mode)"
      aria-label="Start Live Voice Chat"
    >
      {/* 4 Animated Audio Waveform Bars (Exact ChatGPT Advanced Voice Mode Icon) */}
      <div className={`flex items-center justify-center ${barClasses[size]}`}>
        <span
          className="bg-white rounded-full transition-all duration-300 group-hover:animate-pulse"
          style={{ height: size === 'sm' ? '8px' : size === 'lg' ? '16px' : '12px', width: size === 'sm' ? '2px' : '3px' }}
        />
        <span
          className="bg-white rounded-full transition-all duration-300 group-hover:animate-pulse delay-75"
          style={{ height: size === 'sm' ? '14px' : size === 'lg' ? '26px' : '20px', width: size === 'sm' ? '2px' : '3px' }}
        />
        <span
          className="bg-white rounded-full transition-all duration-300 group-hover:animate-pulse delay-150"
          style={{ height: size === 'sm' ? '10px' : size === 'lg' ? '20px' : '15px', width: size === 'sm' ? '2px' : '3px' }}
        />
        <span
          className="bg-white rounded-full transition-all duration-300 group-hover:animate-pulse delay-100"
          style={{ height: size === 'sm' ? '6px' : size === 'lg' ? '12px' : '9px', width: size === 'sm' ? '2px' : '3px' }}
        />
      </div>

      {/* Subtle pulse ring on hover */}
      <span className="absolute inset-0 rounded-full border border-white/20 group-hover:scale-110 transition-transform pointer-events-none" />
    </button>
  );
}

