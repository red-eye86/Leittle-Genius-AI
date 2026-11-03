'use client';

import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { createSpeechRecognizer } from '@/lib/audio/tts';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export default function VoiceInput({ onTranscript, className = '' }: VoiceInputProps) {
  const { language } = useApp();
  const [isListening, setIsListening] = useState(false);

  const handleToggle = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    soundEffects.playPop();
    const recognizer = createSpeechRecognizer(
      (text) => {
        setIsListening(false);
        soundEffects.playStar();
        onTranscript(text);
      },
      (err) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      },
      language
    );

    if (recognizer.isSupported) {
      setIsListening(true);
      recognizer.start();
    } else {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`p-3 rounded-2xl font-bold transition-all flex items-center justify-center ${
        isListening
          ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-200'
          : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
      } ${className}`}
      title={isListening ? 'Listening...' : 'Speak your question'}
    >
      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
    </button>
  );
}

