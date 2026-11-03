'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Sparkles,
  Award,
  ChevronRight,
  Globe,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  CartoonEpisode,
  CartoonScene,
  CartoonDialogue,
  FAMILY_CHARACTERS,
  CartoonCharacter,
} from '@/lib/cartoon/cartoonLessonData';
import { soundEffects } from '@/lib/audio/soundEffects';

interface CartoonVideoPlayerProps {
  episode: CartoonEpisode;
  language: 'en' | 'ml';
  onLanguageChange?: (lang: 'en' | 'ml') => void;
  onComplete?: () => void;
}

export function CartoonVideoPlayer({
  episode,
  language = 'en',
  onLanguageChange,
  onComplete,
}: CartoonVideoPlayerProps) {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [currentDialogueIdx, setCurrentDialogueIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentScene: CartoonScene = episode.scenes[currentSceneIdx] || episode.scenes[0];
  const currentDialogue: CartoonDialogue =
    currentScene?.dialogues[currentDialogueIdx] || currentScene?.dialogues[0];
  const activeSpeaker: CartoonCharacter = FAMILY_CHARACTERS[currentDialogue?.speakerId] || FAMILY_CHARACTERS.faidan;

  // Cleanup auto-timer
  const clearTimer = () => {
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  };

  // Speak character line using native SpeechSynthesis with unique pitch per family member
  const speakDialogue = useCallback(
    (dialogue: CartoonDialogue, lang: 'en' | 'ml') => {
      if (typeof window === 'undefined' || !window.speechSynthesis || isMuted) {
        return;
      }

      window.speechSynthesis.cancel();
      const textToSpeak = lang === 'ml' ? dialogue.malayalamText : dialogue.englishText;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const speaker = FAMILY_CHARACTERS[dialogue.speakerId];

      utterance.pitch = speaker.voicePitch;
      utterance.rate = speaker.voiceRate;
      utterance.lang = lang === 'ml' ? 'ml-IN' : 'en-US';

      // Pick matching voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const langVoice = voices.find((v) =>
          lang === 'ml' ? v.lang.startsWith('ml') : v.lang.startsWith('en')
        );
        if (langVoice) {
          utterance.voice = langVoice;
        }
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        // If autoplay is active, advance to next line after a gentle pause
        if (autoPlay && isPlaying) {
          clearTimer();
          autoPlayTimerRef.current = setTimeout(() => {
            advanceDialogue();
          }, 1400);
        }
      };
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMuted, autoPlay, isPlaying]
  );

  // Advance dialogue or next scene
  const advanceDialogue = useCallback(() => {
    if (!currentScene) return;

    if (currentDialogueIdx < currentScene.dialogues.length - 1) {
      setCurrentDialogueIdx((prev) => prev + 1);
    } else if (currentSceneIdx < episode.scenes.length - 1) {
      setCurrentSceneIdx((prev) => prev + 1);
      setCurrentDialogueIdx(0);
      soundEffects.playLevelUp();
    } else {
      // Episode completed!
      setIsPlaying(false);
      setHasCompleted(true);
      soundEffects.playTada();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
      });
      if (onComplete) onComplete();
    }
  }, [currentDialogueIdx, currentScene, currentSceneIdx, episode.scenes.length, onComplete]);

  // Previous dialogue
  const prevDialogue = () => {
    clearTimer();
    if (currentDialogueIdx > 0) {
      setCurrentDialogueIdx((prev) => prev - 1);
    } else if (currentSceneIdx > 0) {
      const prevScene = episode.scenes[currentSceneIdx - 1];
      setCurrentSceneIdx((prev) => prev - 1);
      setCurrentDialogueIdx(prevScene.dialogues.length - 1);
    }
  };

  // Replay current line or scene
  const restartEpisode = () => {
    clearTimer();
    setCurrentSceneIdx(0);
    setCurrentDialogueIdx(0);
    setHasCompleted(false);
    setIsPlaying(true);
  };

  // Trigger speech when line or scene changes
  useEffect(() => {
    if (currentDialogue) {
      if (isPlaying) {
        speakDialogue(currentDialogue, language);
      }
    }
    return () => clearTimer();
  }, [currentDialogueIdx, currentSceneIdx, isPlaying, language, speakDialogue]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Stage Backdrop Colors & Decor
  const getBackdropClass = (backdrop: string) => {
    switch (backdrop) {
      case 'kitchen':
        return 'from-amber-100 via-orange-100 to-yellow-200 border-amber-300';
      case 'garden':
        return 'from-emerald-100 via-green-100 to-teal-200 border-emerald-300';
      case 'classroom':
        return 'from-sky-100 via-indigo-100 to-blue-200 border-sky-300';
      case 'nature':
        return 'from-teal-100 via-emerald-100 to-lime-200 border-teal-300';
      case 'park':
        return 'from-lime-100 via-yellow-100 to-green-200 border-lime-300';
      case 'space':
        return 'from-indigo-950 via-purple-900 to-slate-900 text-white border-purple-500';
      default:
        return 'from-orange-50 via-amber-50 to-rose-100 border-amber-200';
    }
  };

  // Cast layout: all 4 family members displayed on stage
  const castList: CartoonCharacter[] = [
    FAMILY_CHARACTERS.eadrick,
    FAMILY_CHARACTERS.father,
    FAMILY_CHARACTERS.faidan,
    FAMILY_CHARACTERS.mother,
  ];

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-indigo-400 bg-slate-950 flex flex-col ${
        isFullscreen ? 'h-screen max-w-none rounded-none' : 'aspect-[16/10] min-h-[540px]'
      }`}
    >
      {/* Top Header Bar inside Video Player */}
      <div className="absolute top-0 inset-x-0 z-30 p-3 sm:p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-white">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded-full bg-rose-600 text-[11px] font-black uppercase tracking-wider flex items-center space-x-1 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
            <span>Cartoon Video</span>
          </span>
          <span className="text-xs sm:text-sm font-black truncate max-w-[240px] sm:max-w-md drop-shadow">
            {language === 'ml' ? episode.malayalamTitle : episode.title}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Language Toggle */}
          <button
            onClick={() => {
              soundEffects.playPop();
              const newLang = language === 'ml' ? 'en' : 'ml';
              if (onLanguageChange) onLanguageChange(newLang);
            }}
            className="px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-bold flex items-center space-x-1 transition"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'ml' ? 'English' : 'മലയാളം'}</span>
          </button>

          {/* Mute Toggle */}
          <button
            onClick={() => {
              setIsMuted(!isMuted);
              if (!isMuted && window.speechSynthesis) window.speechSynthesis.cancel();
            }}
            className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Animated Stage Area */}
      <div
        className={`relative flex-1 bg-gradient-to-b ${getBackdropClass(
          currentScene.backdrop
        )} transition-all duration-700 p-4 sm:p-6 flex flex-col justify-between overflow-hidden pt-14`}
      >
        {/* Floating Scene Visual Emojis in background */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-around opacity-25 select-none text-6xl sm:text-8xl">
          <span>{currentScene.visualStageEmoji}</span>
        </div>

        {/* Scene Badge & Title */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-sm border border-slate-200 inline-flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-black text-slate-800">
              {language === 'ml' ? currentScene.malayalamTitle : currentScene.title}
            </span>
          </div>

          <div className="text-xs font-black text-slate-600 bg-white/80 px-2.5 py-1 rounded-xl shadow-xs">
            Scene {currentSceneIdx + 1} of {episode.scenes.length}
          </div>
        </div>

        {/* Active Character Comic Speech Bubble */}
        <div className="relative z-20 my-auto max-w-2xl mx-auto w-full px-2">
          <div
            className={`relative bg-white rounded-3xl p-4 sm:p-6 shadow-2xl border-4 ${activeSpeaker.borderColor} animate-bounce-slight transition-all`}
          >
            {/* Speaker Header with Avatar & Badge */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-indigo-400 shadow-sm flex-shrink-0">
                  <Image
                    src={activeSpeaker.avatarUrl}
                    alt={activeSpeaker.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 leading-tight">
                    {language === 'ml' ? activeSpeaker.malayalamName : activeSpeaker.name}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-500">
                    {language === 'ml' ? activeSpeaker.malayalamRole : activeSpeaker.role}
                  </span>
                </div>
              </div>

              {isSpeaking && (
                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black">
                  <span className="animate-pulse">🎙️ Speaking...</span>
                </div>
              )}
            </div>

            {/* Speech Text */}
            <div className="space-y-1.5">
              <p className="text-base sm:text-xl font-black text-slate-800 leading-snug">
                {language === 'ml' ? currentDialogue.malayalamText : currentDialogue.englishText}
              </p>
              {language !== 'ml' && (
                <p className="text-xs sm:text-sm font-bold text-slate-500 italic">
                  {currentDialogue.malayalamText}
                </p>
              )}
            </div>

            {/* Action Prompt Clue */}
            {currentDialogue.actionPrompt && (
              <p className="mt-3 text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg inline-block">
                🎬 {currentDialogue.actionPrompt}
              </p>
            )}

            {/* Comic Speech Pointer Tail */}
            <div
              className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-b-4 border-r-4 ${activeSpeaker.borderColor} rotate-45`}
            ></div>
          </div>
        </div>

        {/* 4 Family Characters Standing On Stage */}
        <div className="relative z-10 flex items-end justify-center gap-2 sm:gap-6 pt-4">
          {castList.map((char) => {
            const isSpeakingNow = char.id === currentDialogue.speakerId;
            return (
              <div
                key={char.id}
                onClick={() => {
                  soundEffects.playPop();
                  speakDialogue(currentDialogue, language);
                }}
                className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
                  isSpeakingNow
                    ? 'scale-110 -translate-y-2 z-20'
                    : 'opacity-85 hover:opacity-100 scale-95 z-10'
                }`}
              >
                {/* Character Name Pill */}
                <div
                  className={`text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full mb-1 shadow-md transition-all ${
                    isSpeakingNow ? `${char.badgeColor} ring-4 ring-white` : 'bg-white/90 text-slate-700'
                  }`}
                >
                  {language === 'ml' ? char.malayalamName : char.name}
                </div>

                {/* 3D Character Picture Avatar Frame */}
                <div
                  className={`relative rounded-3xl overflow-hidden shadow-xl transition-all ${
                    isSpeakingNow
                      ? `w-20 h-28 sm:w-28 sm:h-36 ring-4 ring-amber-400 shadow-amber-300/50`
                      : 'w-16 h-22 sm:w-22 sm:h-28 grayscale-20 border-2 border-white/60'
                  }`}
                >
                  <Image
                    src={char.avatarUrl}
                    alt={char.name}
                    fill
                    className="object-cover object-top hover:scale-105 transition duration-300"
                  />
                  {isSpeakingNow && (
                    <div className="absolute inset-0 border-2 border-amber-300 rounded-3xl pointer-events-none animate-pulse"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion Overlay */}
      {hasCompleted && (
        <div className="absolute inset-0 z-40 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center animate-fade-in">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 text-4xl shadow-xl mb-4 animate-bounce">
            🏆
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-amber-300">
            {language === 'ml' ? 'ഗംഭീരം! കാർട്ടൂൺ പാഠം പൂർത്തിയായി!' : 'Awesome Job! Cartoon Lesson Complete!'}
          </h2>
          <p className="text-sm text-slate-200 mt-2 max-w-md">
            {language === 'ml'
              ? 'പപ്പ മനോജും മമ്മി ടെസ്സിയും ചേട്ടൻ ഏദ്രിക്കും ഫൈദാനും ചേർന്ന് ഈ പാഠം വിജയകരമായി പഠിച്ചു കഴിഞ്ഞു!'
              : 'Papa Manoj, Mummy Tessy, Brother Eadrick, and Little Faidan explored this lesson together!'}
          </p>

          <div className="mt-4 px-4 py-2 rounded-2xl bg-amber-400 text-slate-900 font-black text-sm flex items-center space-x-2 shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-900" />
            <span>+10 Family Learning Stars Earned! ⭐</span>
          </div>

          <div className="flex items-center space-x-3 mt-6">
            <button
              onClick={restartEpisode}
              className="px-5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center space-x-2 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{language === 'ml' ? 'വീണ്ടും കാണുക' : 'Watch Again'}</span>
            </button>

            {onComplete && (
              <button
                onClick={onComplete}
                className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs flex items-center space-x-2 shadow-md transition"
              >
                <span>{language === 'ml' ? 'തുടരുക' : 'Continue Learning'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bottom Video Controller Bar */}
      <div className="relative z-30 bg-slate-900 px-4 py-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
        {/* Progress Tracker Dots */}
        <div className="flex items-center space-x-1.5">
          {currentScene.dialogues.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === currentDialogueIdx
                  ? 'w-6 bg-amber-400'
                  : idx < currentDialogueIdx
                  ? 'w-2 bg-emerald-400'
                  : 'w-2 bg-slate-700'
              }`}
            ></div>
          ))}
        </div>

        {/* Playback Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={prevDialogue}
            disabled={currentSceneIdx === 0 && currentDialogueIdx === 0}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
            title="Previous Line"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundEffects.playPop();
              const nextState = !isPlaying;
              setIsPlaying(nextState);
              if (nextState) {
                speakDialogue(currentDialogue, language);
              } else if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
            }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 flex items-center justify-center font-black shadow-lg transition active:scale-95"
            title={isPlaying ? 'Pause' : 'Play Video'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={advanceDialogue}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Next Line"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* AutoPlay & Repeat Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1.5 transition ${
              autoPlay ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{autoPlay ? 'Auto-Play: ON' : 'Auto-Play: OFF'}</span>
          </button>

          <button
            onClick={() => speakDialogue(currentDialogue, language)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Hear Voice Again"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
