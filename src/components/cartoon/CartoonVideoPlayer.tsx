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
  Mic,
  Settings2,
  Check,
  CheckCircle2,
  X,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  CartoonEpisode,
  CartoonScene,
  CartoonDialogue,
  FAMILY_CHARACTERS,
  CartoonCharacter,
  GuestCharacter,
  SceneBackdrop,
} from '@/lib/cartoon/cartoonLessonData';
import { soundEffects } from '@/lib/audio/soundEffects';
import {
  VOICE_PROFILES,
  VoiceProfileId,
  getVoiceProfile,
  setVoiceProfile,
  getSelectedVoiceURI,
  setSelectedVoiceURI,
  getAvailableBrowserVoices,
  speakText,
  stopSpeaking,
  testVoiceSampleAudio,
} from '@/lib/audio/tts';

interface CartoonVideoPlayerProps {
  episode: CartoonEpisode;
  language: 'en' | 'ml';
  onLanguageChange?: (lang: 'en' | 'ml') => void;
  onComplete?: () => void;
  isWatched?: boolean;
  onToggleWatched?: () => void;
  learnerId?: 'eadrick' | 'faidan';
}

interface StageActor {
  id: string;
  name: string;
  malayalamName: string;
  role: string;
  malayalamRole: string;
  isGuest: boolean;
  avatarUrl?: string;
  emoji?: string;
  badgeColor: string;
  borderColor: string;
  bgGradient?: string;
  voiceKey?: string;
  voicePitch?: number;
  voiceRate?: number;
  tagline?: string;
}

export function CartoonVideoPlayer({
  episode,
  language = 'en',
  onLanguageChange,
  onComplete,
  isWatched = false,
  onToggleWatched,
  learnerId = 'eadrick',
}: CartoonVideoPlayerProps) {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [currentDialogueIdx, setCurrentDialogueIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<VoiceProfileId>('kid_sweet');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceUri, setSelectedVoiceUriState] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSelectedProfile(getVoiceProfile());
    setSelectedVoiceUriState(getSelectedVoiceURI());
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const v = window.speechSynthesis.getVoices();
      setAvailableVoices(v);
      window.speechSynthesis.onvoiceschanged = () => {
        setAvailableVoices(window.speechSynthesis.getVoices());
      };
    }
  }, []);

  const currentScene: CartoonScene = episode.scenes[currentSceneIdx] || episode.scenes[0];
  const currentDialogue: CartoonDialogue =
    currentScene?.dialogues[currentDialogueIdx] || currentScene?.dialogues[0];

  const isEadrickLearner =
    learnerId === 'eadrick' ||
    episode.chapterId?.includes('c4') ||
    episode.chapterId?.includes('class4');

  // Helper to resolve any speaker (Family or Episode Guest Character)
  const getActor = useCallback(
    (speakerId: string): StageActor => {
      const fam = FAMILY_CHARACTERS[speakerId];
      if (fam) {
        return {
          id: fam.id,
          name: fam.name,
          malayalamName: fam.malayalamName,
          role: fam.role,
          malayalamRole: fam.malayalamRole,
          isGuest: false,
          avatarUrl: fam.avatarUrl,
          badgeColor: fam.badgeColor,
          borderColor: fam.borderColor,
          voicePitch: fam.voicePitch,
          voiceRate: fam.voiceRate,
          tagline: fam.tagline,
        };
      }
      const guest = episode.cast?.find((c) => c.id === speakerId);
      if (guest) {
        return {
          id: guest.id,
          name: guest.name,
          malayalamName: guest.malayalamName,
          role: guest.role,
          malayalamRole: guest.malayalamRole,
          isGuest: true,
          emoji: guest.emoji,
          badgeColor: guest.badgeColor,
          borderColor: guest.borderColor,
          bgGradient: guest.bgGradient,
          voiceKey: guest.voiceKey,
          voicePitch: guest.voicePitch,
          voiceRate: guest.voiceRate,
          tagline: guest.tagline,
        };
      }
      const fallback = isEadrickLearner ? FAMILY_CHARACTERS.eadrick : FAMILY_CHARACTERS.faidan;
      return {
        id: fallback.id,
        name: fallback.name,
        malayalamName: fallback.malayalamName,
        role: fallback.role,
        malayalamRole: fallback.malayalamRole,
        isGuest: false,
        avatarUrl: fallback.avatarUrl,
        badgeColor: fallback.badgeColor,
        borderColor: fallback.borderColor,
        voicePitch: fallback.voicePitch,
        voiceRate: fallback.voiceRate,
        tagline: fallback.tagline,
      };
    },
    [episode.cast, isEadrickLearner]
  );

  const activeActor: StageActor = getActor(
    currentDialogue?.speakerId || (isEadrickLearner ? 'eadrick' : 'faidan')
  );

  // Cleanup auto-timer
  const clearTimer = () => {
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  };

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

  // Speak character line using speakText
  const speakDialogue = useCallback(
    (dialogue: CartoonDialogue, lang: 'en' | 'ml') => {
      if (typeof window === 'undefined' || isMuted) {
        return;
      }

      stopSpeaking();
      const textToSpeak = lang === 'ml' ? dialogue.malayalamText : dialogue.englishText;
      const actor = getActor(dialogue.speakerId);

      let effectivePitch = actor.voicePitch || 1.1;
      let effectiveRate = actor.voiceRate || 1.0;
      let voiceKey = actor.voiceKey || dialogue.speakerId;

      if (!actor.isGuest) {
        if (selectedProfile === 'kid_sweet' && dialogue.speakerId === 'faidan') {
          effectivePitch = 1.55;
          effectiveRate = 0.9;
        } else if (selectedProfile === 'grandma_lilly' && dialogue.speakerId === 'grandmother') {
          effectivePitch = 1.15;
          effectiveRate = 0.88;
        }
      }

      setIsSpeaking(true);
      speakText(
        textToSpeak,
        lang,
        effectiveRate,
        effectivePitch,
        () => {
          setIsSpeaking(false);
          if (autoPlay && isPlaying) {
            clearTimer();
            autoPlayTimerRef.current = setTimeout(() => {
              advanceDialogue();
            }, 1200);
          }
        },
        voiceKey
      );
    },
    [isMuted, autoPlay, isPlaying, selectedProfile, getActor, advanceDialogue]
  );

  const testVoiceSample = (profId: VoiceProfileId, testLang: 'en' | 'ml' = language) => {
    soundEffects.playPop();
    setSelectedProfile(profId);
    setVoiceProfile(profId);
    testVoiceSampleAudio(profId, testLang);
  };

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
  const getBackdropClass = (backdrop: SceneBackdrop) => {
    switch (backdrop) {
      case 'kitchen':
        return 'from-amber-100 via-orange-100 to-yellow-200 border-amber-300 text-slate-800';
      case 'garden':
        return 'from-emerald-100 via-green-100 to-teal-200 border-emerald-300 text-slate-800';
      case 'classroom':
        return 'from-sky-100 via-indigo-100 to-blue-200 border-sky-300 text-slate-800';
      case 'nature':
        return 'from-teal-100 via-emerald-100 to-lime-200 border-teal-300 text-slate-800';
      case 'park':
        return 'from-lime-100 via-yellow-100 to-green-200 border-lime-300 text-slate-800';
      case 'space':
        return 'from-slate-950 via-indigo-950 to-purple-950 text-white border-purple-500';
      case 'jungle':
        return 'from-emerald-950 via-emerald-900 to-amber-950 text-white border-emerald-500';
      case 'ocean':
        return 'from-sky-950 via-cyan-900 to-blue-950 text-white border-cyan-400';
      case 'farm':
        return 'from-amber-100 via-yellow-100 to-lime-200 border-amber-400 text-slate-800';
      case 'city':
        return 'from-slate-200 via-sky-100 to-indigo-200 border-indigo-400 text-slate-800';
      case 'sky':
        return 'from-sky-200 via-blue-100 to-indigo-100 border-sky-400 text-slate-800';
      case 'night':
        return 'from-slate-950 via-indigo-950 to-purple-900 text-white border-indigo-500';
      case 'market':
        return 'from-orange-100 via-amber-100 to-rose-100 border-orange-400 text-slate-800';
      case 'school':
        return 'from-blue-100 via-indigo-100 to-purple-100 border-indigo-300 text-slate-800';
      case 'museum':
        return 'from-stone-200 via-amber-100 to-stone-300 border-stone-400 text-slate-800';
      default:
        return 'from-orange-50 via-amber-50 to-rose-100 border-amber-200 text-slate-800';
    }
  };

  // Full Stage Ensemble: Family + Episode Guest Characters
  // Ensure the primary student learner (Eadrick for Class 4, Faidan for UKG) is positioned front & center!
  const familyList: CartoonCharacter[] = isEadrickLearner
    ? [
        FAMILY_CHARACTERS.grandmother,
        FAMILY_CHARACTERS.father,
        FAMILY_CHARACTERS.eadrick, // Front and center for Eadrick!
        FAMILY_CHARACTERS.mother,
        FAMILY_CHARACTERS.faidan,
      ]
    : [
        FAMILY_CHARACTERS.grandmother,
        FAMILY_CHARACTERS.father,
        FAMILY_CHARACTERS.faidan, // Front and center for Faidan!
        FAMILY_CHARACTERS.mother,
        FAMILY_CHARACTERS.eadrick,
      ];

  const getCharacterShortLabel = (char: CartoonCharacter) => {
    if (char.id === 'eadrick') return language === 'ml' ? 'ഏദ്രിക്' : 'Eadrick';
    if (char.id === 'faidan') return language === 'ml' ? 'ഫൈദാൻ' : 'Faidan';
    if (char.id === 'father') return language === 'ml' ? 'പപ്പ' : 'Papa';
    if (char.id === 'mother') return language === 'ml' ? 'മമ്മി' : 'Mummy';
    if (char.id === 'grandmother') return language === 'ml' ? 'മുത്തശ്ശി' : 'Grandma';
    return language === 'ml' ? char.malayalamName.split(' ')[0] : char.name.split(' ')[0];
  };

  const guestList: GuestCharacter[] = episode.cast || [];

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-indigo-400 bg-slate-950 flex flex-col ${
        isFullscreen ? 'h-screen max-w-none rounded-none' : 'aspect-[16/10] min-h-[560px]'
      }`}
    >
      {/* Top Header Bar inside Video Player */}
      <div className="absolute top-0 inset-x-0 z-30 p-3 sm:p-4 bg-gradient-to-b from-black/85 via-black/45 to-transparent flex items-center justify-between text-white">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded-full bg-rose-600 text-[11px] font-black uppercase tracking-wider flex items-center space-x-1 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
            <span>Cartoon Video</span>
          </span>
          {isWatched && (
            <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-black shadow-xs border border-emerald-400">
              <Check className="w-3.5 h-3.5 text-white" />
              <span>{language === 'ml' ? 'കണ്ടു കഴിഞ്ഞു ✓' : 'Watched ✓'}</span>
            </span>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-xs sm:text-sm font-black truncate max-w-[200px] sm:max-w-md drop-shadow">
              {language === 'ml' ? episode.malayalamTitle : episode.title}
            </span>
            {episode.worldName && (
              <span className="text-[10px] text-amber-300 font-bold flex items-center space-x-1">
                <span>{episode.themeEmoji || '🎬'}</span>
                <span>{language === 'ml' ? episode.worldName.ml : episode.worldName.en}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Voice Selection Button */}
          <button
            onClick={() => {
              soundEffects.playPop();
              setIsVoiceModalOpen(true);
            }}
            className="px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-black flex items-center space-x-1.5 shadow-sm transition"
            title="Choose Voice Style"
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {VOICE_PROFILES[selectedProfile]?.icon} {VOICE_PROFILES[selectedProfile]?.name.split(' ')[0]}
            </span>
          </button>

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
        )} transition-all duration-700 p-4 sm:p-6 flex flex-col justify-between overflow-hidden pt-16`}
      >
        {/* Floating Scene Props in Backdrop */}
        {currentScene.props && (
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            {currentScene.props.map((prop, idx) => (
              <span
                key={idx}
                className="absolute text-3xl sm:text-5xl opacity-40 animate-pulse"
                style={{
                  top: `${15 + (idx * 22) % 65}%`,
                  left: `${8 + (idx * 26) % 85}%`,
                  animationDuration: `${3 + idx * 1.5}s`,
                }}
              >
                {prop}
              </span>
            ))}
          </div>
        )}

        {/* Scene Badge & Title */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-sm border border-slate-200 inline-flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-black text-slate-800">
              {language === 'ml' ? currentScene.malayalamTitle : currentScene.title}
            </span>
          </div>

          <div className="text-xs font-black text-slate-700 bg-white/90 px-2.5 py-1 rounded-xl shadow-xs">
            Scene {currentSceneIdx + 1} of {episode.scenes.length}
          </div>
        </div>

        {/* Active Character Comic Speech Bubble */}
        <div className="relative z-20 my-auto max-w-2xl mx-auto w-full px-2">
          <div
            className={`relative bg-white rounded-3xl p-4 sm:p-6 shadow-2xl border-4 ${activeActor.borderColor} animate-bounce-slight transition-all`}
          >
            {/* Speaker Header with Avatar & Badge */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                {activeActor.isGuest ? (
                  <div
                    className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${
                      activeActor.bgGradient || 'from-amber-400 to-orange-500'
                    } flex items-center justify-center text-2xl shadow-md border-2 border-white flex-shrink-0 animate-bounce`}
                  >
                    {activeActor.emoji || '⭐'}
                  </div>
                ) : (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-400 shadow-sm flex-shrink-0">
                    <Image
                      src={activeActor.avatarUrl || '/characters/faidan.jpg'}
                      alt={activeActor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-black text-slate-800 leading-tight flex items-center space-x-1.5">
                    <span>{language === 'ml' ? activeActor.malayalamName : activeActor.name}</span>
                    {activeActor.isGuest && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700">
                        Guest Star 🌟
                      </span>
                    )}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-500">
                    {language === 'ml' ? activeActor.malayalamRole : activeActor.role}
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
              className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-b-4 border-r-4 ${activeActor.borderColor} rotate-45`}
            ></div>
          </div>
        </div>

        {/* Ensemble Cast Standing On Stage (Family + Topic Guest Characters) */}
        <div className="relative z-10 flex items-end justify-center gap-1.5 sm:gap-4 pt-4 flex-wrap max-w-4xl mx-auto">
          {/* Family Members */}
          {familyList.map((char) => {
            const isSpeakingNow = char.id === currentDialogue.speakerId;
            const isPrimaryLearner = char.id === (isEadrickLearner ? 'eadrick' : 'faidan');

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
                    : isPrimaryLearner
                    ? 'scale-100 z-15'
                    : 'opacity-85 hover:opacity-100 scale-95 z-10'
                }`}
              >
                {/* Character Name Pill */}
                <div
                  className={`text-[9px] sm:text-xs font-black px-2 py-0.5 rounded-full mb-1 shadow-md transition-all truncate max-w-[110px] flex items-center space-x-1 ${
                    isSpeakingNow
                      ? `${char.badgeColor} ring-4 ring-white`
                      : isPrimaryLearner
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                      : 'bg-white/90 text-slate-700'
                  }`}
                >
                  {isPrimaryLearner && <span>⭐</span>}
                  <span>{getCharacterShortLabel(char)}</span>
                </div>

                {/* 3D Character Picture Avatar Frame */}
                <div
                  className={`relative rounded-2xl overflow-hidden shadow-xl transition-all ${
                    isSpeakingNow
                      ? 'w-16 h-22 sm:w-24 sm:h-32 ring-4 ring-amber-400 shadow-amber-300/50'
                      : isPrimaryLearner
                      ? 'w-14 h-20 sm:w-20 sm:h-26 ring-3 ring-amber-400 border-2 border-white'
                      : 'w-12 h-18 sm:w-18 sm:h-24 grayscale-10 border-2 border-white/70'
                  }`}
                >
                  <Image
                    src={char.avatarUrl}
                    alt={char.name}
                    fill
                    className="object-cover object-top hover:scale-105 transition duration-300"
                  />
                  {isSpeakingNow && (
                    <div className="absolute inset-0 border-2 border-amber-300 rounded-2xl pointer-events-none animate-pulse"></div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Guest Cartoon Stars of This Chapter */}
          {guestList.map((guest) => {
            const isSpeakingNow = guest.id === currentDialogue.speakerId;
            return (
              <div
                key={guest.id}
                onClick={() => {
                  soundEffects.playPop();
                  speakDialogue(currentDialogue, language);
                }}
                className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
                  isSpeakingNow
                    ? 'scale-110 -translate-y-2 z-20'
                    : 'opacity-90 hover:opacity-100 scale-95 z-10'
                }`}
              >
                {/* Guest Character Name Pill */}
                <div
                  className={`text-[9px] sm:text-xs font-black px-2 py-0.5 rounded-full mb-1 shadow-md transition-all truncate max-w-[110px] ${
                    isSpeakingNow
                      ? `${guest.badgeColor} ring-4 ring-white`
                      : 'bg-white/95 text-slate-800 border border-slate-200'
                  }`}
                >
                  {language === 'ml' ? guest.malayalamName.split(' ')[0] : guest.name.split(' ')[0]}
                </div>

                {/* Animated Guest Star Emoji Card */}
                <div
                  className={`relative rounded-2xl flex flex-col items-center justify-center shadow-xl transition-all bg-gradient-to-tr ${
                    guest.bgGradient
                  } ${
                    isSpeakingNow
                      ? 'w-16 h-22 sm:w-24 sm:h-32 ring-4 ring-amber-400 shadow-amber-300/50 animate-bounce'
                      : 'w-12 h-18 sm:w-18 sm:h-24 border-2 border-white/80'
                  }`}
                >
                  <span className="text-3xl sm:text-5xl filter drop-shadow">{guest.emoji}</span>
                  <span className="text-[8px] sm:text-[10px] font-black text-white/95 uppercase tracking-wider mt-1 px-1 bg-black/25 rounded-full">
                    GUEST
                  </span>
                  {isSpeakingNow && (
                    <div className="absolute inset-0 border-2 border-amber-300 rounded-2xl pointer-events-none animate-pulse"></div>
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
              ? 'പപ്പ മനോജും മമ്മി ടെസ്സിയും മുത്തശ്ശി ലില്ലിയും ചേട്ടൻ ഏദ്രിക്കും ഫൈദാനും കാർട്ടൂൺ കൂട്ടുകാരും ചേർന്ന് ഈ പാഠം വിജയകരമായി പഠിച്ചു!'
              : 'Papa Manoj, Mummy Tessy, Grandma Lilly, Brother Eadrick, and Little Faidan explored this lesson together with their cartoon friends!'}
          </p>

          {episode.moral && (
            <div className="mt-3 p-3 bg-white/10 rounded-2xl border border-white/20 max-w-md text-xs text-amber-200 font-bold">
              🌟 {language === 'ml' ? episode.moral.ml : episode.moral.en}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-500 text-white font-black text-xs flex items-center space-x-1.5 shadow-md">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>{language === 'ml' ? 'ഈ വീഡിയോ കണ്ടു കഴിഞ്ഞു! ✓' : 'Video Watched! ✓'}</span>
            </div>

            <div className="px-4 py-1.5 rounded-2xl bg-amber-400 text-slate-900 font-black text-xs flex items-center space-x-1.5 shadow-md">
              <Sparkles className="w-4 h-4 text-amber-900" />
              <span>+10 Stars Earned! ⭐</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-6">
            <button
              onClick={restartEpisode}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs flex items-center space-x-2 transition shadow-md shadow-amber-500/20"
            >
              <RotateCcw className="w-4 h-4 text-slate-950" />
              <span>{language === 'ml' ? 'വീണ്ടും കാണുക ↺' : 'Rewatch Episode ↺'}</span>
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
              if (nextState && currentDialogue) {
                speakDialogue(currentDialogue, language);
              } else {
                stopSpeaking();
                clearTimer();
              }
            }}
            className="px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/30 transition transform active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-slate-950" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Play Cartoon</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              clearTimer();
              advanceDialogue();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Next Line"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={restartEpisode}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="Restart Episode"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Auto-Play Toggle & Key Concept Indicator */}
        <div className="flex items-center space-x-3">
          {currentScene.keyConceptPopup && (
            <div className="hidden lg:flex items-center space-x-1.5 text-xs text-amber-300 bg-amber-400/10 px-3 py-1 rounded-xl border border-amber-400/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-bold truncate max-w-xs">
                {language === 'ml'
                  ? currentScene.keyConceptPopup.malayalam
                  : currentScene.keyConceptPopup.english}
              </span>
            </div>
          )}

          <label className="flex items-center space-x-2 text-xs font-bold text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoPlay}
              onChange={(e) => setAutoPlay(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
            />
            <span className="text-[11px]">Auto Play</span>
          </label>
        </div>
      </div>

      {/* Voice Selection Modal */}
      {isVoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-2 border-indigo-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Mic className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-black text-slate-800">
                  {language === 'ml' ? 'ശബ്ദ ശൈലി തിരഞ്ഞെടുക്കുക' : 'Choose Voice Persona'}
                </h3>
              </div>
              <button
                onClick={() => setIsVoiceModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              {language === 'ml'
                ? 'എല്ലാ കഥാപാത്രങ്ങൾക്കും പപ്പ, മമ്മി, മുത്തശ്ശി, കുട്ടികൾ എന്നിവരുടെ ശബ്ദ ശൈലികൾ ആസ്വദിക്കാം:'
                : 'Select the primary voice style for reading dialogues in English & Malayalam:'}
            </p>

            {/* Voice Cards */}
            <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto pr-1">
              {(Object.keys(VOICE_PROFILES) as VoiceProfileId[]).map((profId) => {
                const prof = VOICE_PROFILES[profId];
                const isSelected = selectedProfile === profId;
                return (
                  <div
                    key={profId}
                    onClick={() => testVoiceSample(profId)}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-xs">
                        {prof.icon}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-xs font-black text-slate-800">{prof.name}</h4>
                          {isSelected && (
                            <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-indigo-600 text-white">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">{prof.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        testVoiceSample(profId);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-[10px] font-black flex items-center space-x-1 shadow-xs transition"
                    >
                      <span>🔊 Listen</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => {
                  soundEffects.playPop();
                  setIsVoiceModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition"
              >
                {language === 'ml' ? 'ശരി' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
