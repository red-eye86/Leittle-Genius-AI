'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { useRouter, usePathname } from 'next/navigation';
import { Volume2, VolumeX, Shield, Globe, Users, Sparkles, Home, BookOpen, Bot, Box, Award } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import MascotOwl from './MascotOwl';
import ParentPinModal from './ParentPinModal';
import KidAvatar from './KidAvatar';

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
    stopSpeech,
    t,
  } = useApp();

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ml' : 'en');
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

          {/* Right Controls: Child Profile, Language, Sound, Parent Gate */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Child Profile Quick Switcher (when not in parent zone) */}
            {!isParentRoute && activeChild && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
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

                {/* Dropdown to switch between Aarav & Diya */}
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

            {/* Sound Toggle */}
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (!next) {
                  stopSpeech();
                }
              }}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-700 transition"
              title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

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

