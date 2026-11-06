'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Mic,
  MicOff,
  X,
  Sparkles,
  Volume2,
  VolumeX,
  Languages,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';

type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking';

export default function LiveVoiceModal() {
  const router = useRouter();
  const {
    activeChild,
    language,
    setLanguage,
    speak,
    stopSpeaking,
    isLiveVoiceOpen,
    closeLiveVoice,
  } = useApp();

  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [chikooReply, setChikooReply] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isLoopActiveRef = useRef<boolean>(false);

  const isMalayalam = language === 'ml';

  // Open modal and start live conversational loop
  useEffect(() => {
    if (!isLiveVoiceOpen) {
      cleanupAudio();
      return;
    }

    isLoopActiveRef.current = true;
    soundEffects.playStar();

    // Setup Web Audio Analyser for genuine live reactive audio visualizer
    setupAudioAnalyser();

    // Initial greeting from Chikoo
    const greeting = isMalayalam
      ? `ഹലോ ${activeChild?.name || 'കൂട്ടുകാരാ'}! ഞാൻ നിങ്ങളുടെ ലൈവ് വോയ്സ് ചിക്കു! എന്തും ചോദിക്കൂ, നമുക്ക് സംസാരിക്കാം!`
      : `Hey ${activeChild?.name || 'Champion'}! I am Chikoo, your live voice buddy! What would you like to talk about or explore?`;

    setChikooReply(greeting);
    setVoiceState('speaking');

    speak(greeting, () => {
      if (isLoopActiveRef.current) {
        startListeningTurn();
      }
    });

    return () => {
      isLoopActiveRef.current = false;
      cleanupAudio();
    };
  }, [isLiveVoiceOpen]);

  // Audio Analyser Setup
  const setupAudioAnalyser = async () => {
    try {
      if (typeof window === 'undefined' || !navigator.mediaDevices) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        if (!isLoopActiveRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((avg / 255) * 100)));
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
    } catch (e) {
      console.warn('Audio analyser access not granted or unavailable:', e);
    }
  };

  const cleanupAudio = () => {
    stopSpeaking();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setVoiceState('idle');
  };

  // Start a listening turn (detects child speech)
  const startListeningTurn = () => {
    if (!isLoopActiveRef.current || isMuted) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = isMalayalam ? 'ml-IN' : 'en-IN';

    recognition.onstart = () => {
      setVoiceState('listening');
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const finalQuery = event.results[i][0].transcript;
          setTranscript(finalQuery);
          processSpokenTurn(finalQuery);
        } else {
          interim += event.results[i][0].transcript;
          setTranscript(interim);
        }
      }
    };

    recognition.onerror = () => {
      if (isLoopActiveRef.current && voiceState === 'listening') {
        setTimeout(() => {
          if (isLoopActiveRef.current) startListeningTurn();
        }, 600);
      }
    };

    recognition.onend = () => {
      // If recognition ended without speaking, restart listening if still in active loop
      if (isLoopActiveRef.current && voiceState === 'listening') {
        setTimeout(() => {
          if (isLoopActiveRef.current && voiceState === 'listening') {
            startListeningTurn();
          }
        }, 500);
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {}
  };

  // Process user speech (Action command or Gemini AI Q&A)
  const processSpokenTurn = async (queryText: string) => {
    if (!queryText.trim()) return;

    setVoiceState('thinking');
    const lower = queryText.toLowerCase().trim();

    // 1. Language Toggle Command
    if (
      lower.includes('switch to malayalam') ||
      lower.includes('speak in malayalam') ||
      lower.includes('മലയാളം പറയൂ') ||
      lower.includes('മലയാളത്തിലേക്ക്')
    ) {
      setLanguage('ml');
      const confirmation = 'ശരി, ഇനി മുതൽ നമുക്ക് മലയാളത്തിൽ സംസാരിക്കാം!';
      respondWithChikooVoice(confirmation);
      return;
    }

    if (
      lower.includes('switch to english') ||
      lower.includes('speak in english') ||
      lower.includes('change to english')
    ) {
      setLanguage('en');
      const confirmation = 'Switched to English! What shall we talk about?';
      respondWithChikooVoice(confirmation);
      return;
    }

    // 2. Navigation Actions
    if (lower.includes('open science') || lower.includes('സയൻസ്')) {
      const msg = isMalayalam ? 'സയൻസ് ക്ലാസ്സ് തുറക്കുന്നു!' : 'Opening Science lessons for you!';
      respondWithChikooVoice(msg, () => {
        closeLiveVoice();
        router.push('/child/chapters?subject=sub-c3-science');
      });
      return;
    }

    if (lower.includes('open math') || lower.includes('maths') || lower.includes('കണക്ക്')) {
      const msg = isMalayalam ? 'കണക്ക് പാഠങ്ങളിലേക്ക് പോകാം!' : 'Taking you to Mathematics!';
      respondWithChikooVoice(msg, () => {
        closeLiveVoice();
        router.push('/child/chapters?subject=sub-c3-math');
      });
      return;
    }

    if (lower.includes('3d classroom') || lower.includes('3d world') || lower.includes('3d ക്ലാസ്സ്')) {
      const msg = isMalayalam ? '3D ക്ലാസ്സ് റൂം തുറക്കുന്നു! പ്ലാനറ്റുകൾ കാണാം!' : 'Opening the 3D Classroom!';
      respondWithChikooVoice(msg, () => {
        closeLiveVoice();
        router.push('/child/world3d');
      });
      return;
    }

    if (lower.includes('cartoon') || lower.includes('video') || lower.includes('കാർട്ടൂൺ')) {
      const msg = isMalayalam ? 'നല്ലൊരു കാർട്ടൂൺ പാഠം കാണാം!' : 'Opening animated cartoon lessons!';
      respondWithChikooVoice(msg, () => {
        closeLiveVoice();
        router.push('/child/cartoon');
      });
      return;
    }

    if (lower.includes('how many stars') || lower.includes('my stars') || lower.includes('എത്ര സ്റ്റാർ')) {
      const stars = activeChild?.stars || 0;
      const coins = activeChild?.coins || 0;
      const msg = isMalayalam
        ? `നിങ്ങൾ ഇതുവരെ ${stars} സ്റ്റാറുകളും ${coins} ജീനിയസ് കോയിനുകളും നേടിയിട്ടുണ്ട്! അടിപൊളി മിടുക്കൻ!`
        : `You have earned ${stars} golden stars and ${coins} genius coins! You are doing great!`;
      respondWithChikooVoice(msg);
      return;
    }

    // 3. General Q&A with Gemini AI Brain
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: activeChild?.id || 'child-1',
          message: queryText,
          language: language,
          mode: 'explain',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.reply || (isMalayalam ? 'ഉത്തരം തയ്യാറാണ്!' : 'Here is what I found!');
        respondWithChikooVoice(replyText);
      } else {
        const fallbackText = isMalayalam
          ? 'ക്ഷമിക്കണം കൂട്ടുകാരാ, ദയവായി ചോദ്യം ഒന്നുകൂടി ചോദിക്കാമോ?'
          : 'Could you please say that one more time, champion?';
        respondWithChikooVoice(fallbackText);
      }
    } catch (e) {
      const errText = isMalayalam
        ? 'ചിക്കു ഇവിടെയുണ്ട്! വീണ്ടും പറയൂ കേൾക്കാം.'
        : 'Chikoo is listening! Please ask once more.';
      respondWithChikooVoice(errText);
    }
  };

  // Speak Chikoo's reply in Gemini Voice and restart listening loop on end
  const respondWithChikooVoice = (text: string, onDone?: () => void) => {
    if (!isLoopActiveRef.current) return;

    setChikooReply(text);
    setVoiceState('speaking');

    speak(text, () => {
      if (onDone) {
        onDone();
        return;
      }
      // Automatic Hands-free turn-taking: mic re-opens immediately after Chikoo finishes!
      if (isLoopActiveRef.current && !isMuted) {
        setTimeout(() => {
          if (isLoopActiveRef.current) startListeningTurn();
        }, 400);
      } else {
        setVoiceState('idle');
      }
    });
  };

  // Tap-to-interrupt: child taps the orb to interrupt Chikoo mid-speech
  const handleInterrupt = () => {
    soundEffects.playPop();
    stopSpeaking();
    setVoiceState('listening');
    setTranscript('');
    startListeningTurn();
  };

  if (!isLiveVoiceOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-slate-950/95 backdrop-blur-2xl text-white animate-fade-in p-4 sm:p-8 select-none">
      {/* Top Header Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between pt-2">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-400 ring-2 ring-cyan-500/40">
            <Image
              src="/characters/chikoo.jpg"
              alt="Chikoo Live Voice"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-sm tracking-wide text-cyan-300">
                CHIKOO LIVE VOICE
              </span>
              <span className="text-[10px] uppercase font-black bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/40">
                Hands-Free
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {voiceState === 'listening'
                ? isMalayalam
                  ? 'നിങ്ങൾ സംസാരിക്കൂ, ചിക്കു കേൾക്കുന്നുണ്ട്... 🎙️'
                  : 'Listening to your voice... 🎙️'
                : voiceState === 'thinking'
                ? isMalayalam
                  ? 'ജെമിനി ചിന്തിക്കുന്നു... ✨'
                  : 'Thinking with Gemini Brain... ✨'
                : voiceState === 'speaking'
                ? isMalayalam
                  ? 'ചിക്കു സംസാരിക്കുന്നു (തടസ്സപ്പെടുത്താൻ അമർത്തൂ) 🔊'
                  : 'Chikoo is speaking (Tap orb to interrupt) 🔊'
                : isMalayalam
                ? 'തയ്യാറാണ്'
                : 'Ready'}
            </p>
          </div>
        </div>

        {/* Right Controls: Language & Close */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              soundEffects.playPop();
              setLanguage(isMalayalam ? 'en' : 'ml');
            }}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold text-amber-300 flex items-center space-x-1.5 transition"
          >
            <Languages className="w-4 h-4" />
            <span>{isMalayalam ? 'മലയാളം' : 'English'}</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playPop();
              closeLiveVoice();
            }}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-rose-500/20 hover:border-rose-500/50 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition"
            title="End Live Voice Session"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center: Interactive Reactive Voice Orb (ChatGPT Advanced Voice Mode Visualizer) */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md my-4 relative">
        <div
          onClick={voiceState === 'speaking' ? handleInterrupt : startListeningTurn}
          className="relative cursor-pointer group flex items-center justify-center"
          title={
            voiceState === 'speaking'
              ? 'Tap to Interrupt Chikoo'
              : 'Tap to Speak'
          }
        >
          {/* Outer Pulsing Wave Rings */}
          <div
            className={`absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-cyan-400/20 transition-all duration-300 pointer-events-none ${
              voiceState === 'speaking'
                ? 'scale-125 bg-blue-500/10 animate-ping'
                : voiceState === 'listening'
                ? 'scale-110 bg-cyan-500/10 animate-pulse'
                : ''
            }`}
          />

          <div
            className={`absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full border-2 border-indigo-400/30 transition-transform duration-500 pointer-events-none ${
              voiceState === 'speaking'
                ? 'scale-115 rotate-180 animate-spin duration-1000'
                : voiceState === 'listening'
                ? `scale-${100 + Math.round(audioLevel / 5)}`
                : ''
            }`}
          />

          {/* Central Voice Orb Core */}
          <div
            className={`relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-2xl transition-all duration-300 flex items-center justify-center border-4 ${
              voiceState === 'speaking'
                ? 'border-purple-400 shadow-purple-500/50 ring-8 ring-purple-500/30 scale-105'
                : voiceState === 'listening'
                ? 'border-cyan-400 shadow-cyan-500/50 ring-8 ring-cyan-500/30 scale-100'
                : voiceState === 'thinking'
                ? 'border-amber-400 shadow-amber-500/50 ring-8 ring-amber-500/30 animate-pulse'
                : 'border-blue-400 shadow-blue-500/30'
            }`}
          >
            <Image
              src="/characters/chikoo.jpg"
              alt="Chikoo Live Avatar"
              fill
              sizes="192px"
              className="object-cover"
              priority
            />

            {/* Glowing Aura Overlay */}
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                voiceState === 'speaking'
                  ? 'bg-purple-600/20'
                  : voiceState === 'listening'
                  ? 'bg-cyan-500/10'
                  : 'bg-transparent'
              }`}
            />
          </div>

          {/* 4 Animated Waveform Equalizer Lines Floating on the Orb */}
          {voiceState === 'speaking' && (
            <div className="absolute -bottom-4 bg-purple-900/90 border border-purple-400 px-4 py-1.5 rounded-full flex items-center space-x-1.5 shadow-lg">
              <span className="w-1 h-3 bg-purple-300 rounded-full animate-bounce" />
              <span className="w-1 h-6 bg-purple-200 rounded-full animate-bounce delay-75" />
              <span className="w-1 h-4 bg-purple-300 rounded-full animate-bounce delay-150" />
              <span className="w-1 h-2 bg-purple-200 rounded-full animate-bounce delay-100" />
              <span className="text-[11px] font-black text-purple-200 ml-1.5">
                {isMalayalam ? 'സംസാരിക്കുന്നു' : 'Speaking'}
              </span>
            </div>
          )}

          {voiceState === 'listening' && (
            <div className="absolute -bottom-4 bg-cyan-900/90 border border-cyan-400 px-4 py-1.5 rounded-full flex items-center space-x-1.5 shadow-lg">
              <span
                className="w-1 bg-cyan-300 rounded-full transition-all duration-100"
                style={{ height: `${Math.max(6, (audioLevel / 100) * 24)}px` }}
              />
              <span
                className="w-1 bg-cyan-200 rounded-full transition-all duration-100"
                style={{ height: `${Math.max(10, (audioLevel / 100) * 32)}px` }}
              />
              <span
                className="w-1 bg-cyan-300 rounded-full transition-all duration-100"
                style={{ height: `${Math.max(8, (audioLevel / 100) * 26)}px` }}
              />
              <span className="text-[11px] font-black text-cyan-200 ml-1.5">
                {isMalayalam ? 'കേൾക്കുന്നു...' : 'Listening...'}
              </span>
            </div>
          )}
        </div>

        {/* Real-time Subtitles / Spoken Text Display */}
        <div className="mt-8 w-full text-center px-4 min-h-[90px] flex flex-col items-center justify-center">
          {voiceState === 'listening' && transcript && (
            <p className="text-base sm:text-lg font-bold text-cyan-200 italic animate-fade-in">
              &ldquo;{transcript}&rdquo;
            </p>
          )}

          {voiceState === 'thinking' && (
            <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>
                {isMalayalam
                  ? 'ചിക്കു ചിന്തിക്കുന്നു...'
                  : 'Chikoo is thinking with Gemini...'}
              </span>
            </div>
          )}

          {voiceState === 'speaking' && chikooReply && (
            <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed max-w-md animate-fade-in">
              {chikooReply}
            </p>
          )}

          {voiceState === 'idle' && (
            <p className="text-sm text-slate-400">
              {isMalayalam
                ? 'സംസാരിക്കാൻ ഓർബിൽ തൊടൂ...'
                : 'Tap the orb or speak to start...'}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="w-full max-w-md flex items-center justify-center space-x-6 pb-4">
        {/* Mute / Unmute Button */}
        <button
          onClick={() => {
            soundEffects.playPop();
            if (!isMuted) {
              stopSpeaking();
              if (recognitionRef.current) recognitionRef.current.abort();
              setVoiceState('idle');
              setIsMuted(true);
            } else {
              setIsMuted(false);
              startListeningTurn();
            }
          }}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition shadow-xl ${
            isMuted
              ? 'bg-rose-600 hover:bg-rose-500 text-white ring-4 ring-rose-500/30'
              : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20'
          }`}
          title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {/* Center Tap to Talk / Interrupt Button */}
        <button
          onClick={voiceState === 'speaking' ? handleInterrupt : startListeningTurn}
          className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl ring-4 ring-blue-500/40 hover:scale-105 active:scale-95 transition"
          title={voiceState === 'speaking' ? 'Interrupt' : 'Speak'}
        >
          {/* ChatGPT Style 4 Animated Bars */}
          <div className="flex items-center space-x-1">
            <span className="w-1 h-4 bg-white rounded-full" />
            <span className="w-1 h-7 bg-white rounded-full" />
            <span className="w-1 h-5 bg-white rounded-full" />
            <span className="w-1 h-3 bg-white rounded-full" />
          </div>
        </button>

        {/* End Voice Chat Session Button */}
        <button
          onClick={() => {
            soundEffects.playPop();
            closeLiveVoice();
          }}
          className="w-14 h-14 rounded-full bg-rose-600/80 hover:bg-rose-600 text-white flex items-center justify-center transition shadow-xl border border-rose-500/50"
          title="End Live Voice Mode"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

