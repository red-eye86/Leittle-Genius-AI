'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Volume2,
  VolumeX,
  Shield,
  Globe,
  Home,
  BookOpen,
  Bot,
  Box,
  Award,
  Headphones,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import MascotOwl from './MascotOwl';
import ParentPinModal from './ParentPinModal';
import KidAvatar from './KidAvatar';
import { soundEffects } from '@/lib/audio/soundEffects';
import { setPreferredAudioOutputDevice, getPreferredAudioOutputDevice } from '@/lib/audio/tts';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    activeChild,
    allChildren,
    setActiveChildId,
    language,
    setLanguage,
    soundEnabled,
    setSoundEnabled,
    speak,
    stopSpeech,
    t,
  } = useApp();

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSoundMenuOpen, setIsSoundMenuOpen] = useState(false);
  const [voiceEngine, setVoiceEngine] = useState<'system' | 'cloud'>('system');
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEngine = (localStorage.getItem('lg_voice_engine') as 'system' | 'cloud') || 'system';
      setVoiceEngine(savedEngine);
      setSelectedDeviceId(getPreferredAudioOutputDevice());
    }
  }, []);

  const loadAudioDevices = async () => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const outputs = devices.filter((d) => d.kind === 'audiooutput');
        setAudioDevices(outputs);
      } catch (e) {
        console.warn('Could not list audio devices:', e);
      }
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ml' : 'en');
  };

  const handleEngineChange = (engine: 'system' | 'cloud') => {
    setVoiceEngine(engine);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lg_voice_engine', engine);
    }
    setSoundEnabled(true);
    soundEffects.playStar();
    speak(
      language === 'ml'
        ? 'ഹലോ! ശബ്ദം ഇപ്പോൾ നിങ്ങളുടെ ഹെഡ്‌സെറ്റിൽ കേൾക്കാം!'
        : 'Hello! Voice sound is now active in your headset!'
    );
  };

  const handleTestHeadset = () => {
    setSoundEnabled(true);
    soundEffects.playStar();
    speak(
      language === 'ml'
        ? 'നമസ്കാരം! ഹുട്ടി ടീച്ചറുടെ ശബ്ദം നിങ്ങളുടെ ഹെഡ്‌സെറ്റിൽ വ്യക്തമായി കേൾക്കാം!'
        : 'Hello! Hootie the Owl is speaking clearly in your headset!'
    );
  };

  const isParentRoute = pathname?.startsWith('/parent');

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-2 border-sky-100 shadow-sm transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          {/* Logo & Mascot */}
          <div
            onClick={() => router.push(isParentRoute ? '/parent/dashboard' : '/')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <MascotOwl size="sm" />
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {t('appTitle')}
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  AI
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-500 hidden sm:block">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Center Navigation Shortcuts (for Children) */}
          {!isParentRoute && (
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-black">
              <button
                onClick={() => router.push('/child/dashboard')}
                className={`px-3 py-2 rounded-2xl flex items-center space-x-1 transition ${
                  pathname === '/child/dashboard' ? 'bg-sky-100 text-sky-700 shadow-sm' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Home className="w-4 h-4 text-sky-500" />
                <span>Home</span>
              </button>
              <button
                onClick={() => router.push('/child/subjects')}
                className={`px-3 py-2 rounded-2xl flex items-center space-x-1 transition ${
                  pathname?.includes('/child/subjects') ? 'bg-purple-100 text-purple-700 shadow-sm' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <BookOpen className="w-4 h-4 text-purple-500" />
                <span>{t('mySubjects')}</span>
              </button>
              <button
                onClick={() => router.push('/child/ai-teacher')}
                className={`px-3 py-2 rounded-2xl flex items-center space-x-1 transition ${
                  pathname?.includes('/child/ai-teacher') ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Bot className="w-4 h-4 text-emerald-500" />
                <span>{t('aiTeacher')}</span>
              </button>
              <button
                onClick={() => router.push('/child/world3d')}
                className={`px-3 py-2 rounded-2xl flex items-center space-x-1 transition ${
                  pathname?.includes('/child/world3d') ? 'bg-blue-100 text-blue-700 shadow-sm' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Box className="w-4 h-4 text-blue-500" />
                <span>{t('world3d')}</span>
              </button>
              <button
                onClick={() => router.push('/child/progress')}
                className={`px-3 py-2 rounded-2xl flex items-center space-x-1 transition ${
                  pathname?.includes('/child/progress') ? 'bg-amber-100 text-amber-700 shadow-sm' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>{t('progress')}</span>
              </button>
            </nav>
          )}

          {/* Right Controls: Child Profile, Language, Sound & Headset Settings, Parent Gate */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Child Profile Quick Switcher (when not in parent zone) */}
            {!isParentRoute && activeChild && (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(!isProfileDropdownOpen);
                    setIsSoundMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-sky-50 to-indigo-50 border-2 border-sky-300 hover:border-sky-400 px-3 py-1.5 rounded-2xl shadow-sm transition active:scale-95"
                >
                  <KidAvatar avatar={activeChild.avatar} size="xs" />
                  <div className="text-left hidden xs:block">
                    <p className="text-xs font-black text-slate-800 leading-tight">
                      {activeChild.name}
                    </p>
                    <p className="text-[10px] font-bold text-sky-600">
                      {activeChild.classGrade}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 pl-1">
                    <span className="text-xs font-black text-amber-500">⭐ {activeChild.stars}</span>
                  </div>
                </button>

                {/* Dropdown to switch between children */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-3xl p-3 border-2 border-sky-200 shadow-xl z-50 animate-fade-in">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                      {t('chooseProfile')}
                    </p>
                    <div className="space-y-1.5">
                      {allChildren.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setActiveChildId(c.id);
                            setIsProfileDropdownOpen(false);
                            router.push('/child/dashboard');
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-2xl transition ${
                            c.id === activeChild.id
                              ? 'bg-sky-100 text-sky-900 border border-sky-300 font-black'
                              : 'hover:bg-slate-50 text-slate-700 font-bold'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <KidAvatar avatar={c.avatar} size="sm" />
                            <div className="text-left">
                              <p className="text-xs font-black">{c.name}</p>
                              <p className="text-[10px] text-slate-500">{c.classGrade}</p>
                            </div>
                          </div>
                          <span className="text-xs text-amber-500 font-black">⭐ {c.stars}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-xs font-black text-slate-700 transition"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-sky-600" />
              <span>{language === 'en' ? 'മലയാളം' : 'English'}</span>
            </button>

            {/* Sound & Headset Settings Popover */}
            <div className="relative">
              <button
                onClick={() => {
                  const nextOpen = !isSoundMenuOpen;
                  setIsSoundMenuOpen(nextOpen);
                  setIsProfileDropdownOpen(false);
                  if (nextOpen) {
                    loadAudioDevices();
                  }
                }}
                className={`p-2 rounded-2xl transition flex items-center space-x-1 border ${
                  soundEnabled
                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
                }`}
                title="Headset & Sound Settings"
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <VolumeX className="w-4 h-4 text-rose-500" />
                )}
              </button>

              {isSoundMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl p-4 border-2 border-emerald-200 shadow-2xl z-50 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center space-x-2">
                      <Headphones className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-black text-slate-800">
                        Headset & Sound Settings
                      </span>
                    </div>
                    <button
                      onClick={() => setIsSoundMenuOpen(false)}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Test Headset Button */}
                  <button
                    onClick={handleTestHeadset}
                    className="w-full py-2.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-md transition"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Test Headset Sound Now</span>
                  </button>

                  {/* Voice Engine Mode */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      Voice Output Mode
                    </p>
                    <button
                      onClick={() => handleEngineChange('system')}
                      className={`w-full p-2.5 rounded-2xl text-left text-xs border transition flex items-center justify-between ${
                        voiceEngine === 'system'
                          ? 'bg-sky-50 border-sky-400 text-sky-900 font-black'
                          : 'bg-slate-50 border-slate-200 text-slate-600 font-bold hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <p>🎧 Windows Headset Voice (Default)</p>
                        <p className="text-[10px] font-medium text-slate-500">
                          Direct OS speech to your connected headset
                        </p>
                      </div>
                      {voiceEngine === 'system' && <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />}
                    </button>

                    <button
                      onClick={() => handleEngineChange('cloud')}
                      className={`w-full p-2.5 rounded-2xl text-left text-xs border transition flex items-center justify-between ${
                        voiceEngine === 'cloud'
                          ? 'bg-sky-50 border-sky-400 text-sky-900 font-black'
                          : 'bg-slate-50 border-slate-200 text-slate-600 font-bold hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <p>☁️ Cloud AI Voice Stream</p>
                        <p className="text-[10px] font-medium text-slate-500">
                          Uses browser media audio stream
                        </p>
                      </div>
                      {voiceEngine === 'cloud' && <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />}
                    </button>
                  </div>

                  {/* Audio Output Device Selector (if available) */}
                  {audioDevices.length > 1 && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        Select Headset / Speaker
                      </p>
                      <select
                        value={selectedDeviceId}
                        onChange={(e) => {
                          setSelectedDeviceId(e.target.value);
                          setPreferredAudioOutputDevice(e.target.value);
                        }}
                        className="w-full text-xs font-bold p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
                      >
                        <option value="">System Default Headset / Speaker</option>
                        {audioDevices.map((d, i) => (
                          <option key={d.deviceId || i} value={d.deviceId}>
                            {d.label || `Audio Output ${i + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Mute / Unmute Switch */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">App Sound Effects</span>
                    <button
                      onClick={() => {
                        const next = !soundEnabled;
                        setSoundEnabled(next);
                        if (!next) stopSpeech();
                        else soundEffects.playPop();
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-black transition ${
                        soundEnabled
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {soundEnabled ? 'ON 🔊' : 'MUTED 🔇'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Parent Zone Access Button */}
            {!isParentRoute ? (
              <button
                onClick={() => setIsPinModalOpen(true)}
                className="flex items-center space-x-1.5 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-2xl text-xs font-black shadow-sm transition btn-kid-3d"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('parentDashboard')}</span>
              </button>
            ) : (
              <button
                onClick={() => router.push('/child/dashboard')}
                className="flex items-center space-x-1 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-2xl text-xs font-black shadow-sm transition"
              >
                <span>🧒 Student Zone</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Parent Security PIN Modal */}
      <ParentPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        redirectTo="/parent/dashboard"
      />
    </>
  );
}
