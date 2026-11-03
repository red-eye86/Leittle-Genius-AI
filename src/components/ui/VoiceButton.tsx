'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';

interface VoiceButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export default function VoiceButton({ text, size = 'sm', className = '', label }: VoiceButtonProps) {
  const { speak, stopSpeech, isSpeaking } = useApp();
  const [playingThis, setPlayingThis] = useState(false);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingThis && isSpeaking) {
      stopSpeech();
      setPlayingThis(false);
    } else {
      setPlayingThis(true);
      speak(text, () => setPlayingThis(false));
    }
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base',
  };

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center space-x-1.5 rounded-2xl font-bold transition-all shadow-sm ${
        playingThis && isSpeaking
          ? 'bg-amber-400 text-slate-900 animate-pulse'
          : 'bg-sky-100 hover:bg-sky-200 text-sky-700'
      } ${sizeClasses[size]} ${className}`}
      title="Listen to pronunciation"
    >
      {playingThis && isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      {label && <span>{label}</span>}
    </button>
  );
}

