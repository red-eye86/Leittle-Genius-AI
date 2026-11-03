'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChildProfile, Language } from '../db/types';
import { translations, getTranslation } from '../i18n/translations';
import { speakText, stopSpeaking } from '../audio/tts';
import { soundEffects } from '../audio/soundEffects';

interface AppContextType {
  activeChild: ChildProfile | null;
  activeChildId: string;
  setActiveChildId: (id: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  speak: (text: string, onEnd?: () => void) => void;
  stopSpeech: () => void;
  isSpeaking: boolean;
  addStars: (count: number) => void;
  refreshProfiles: () => Promise<void>;
  allChildren: ChildProfile[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeChildId, setActiveChildIdState] = useState<string>('child-1');
  const [language, setLanguageState] = useState<Language>('en');
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [allChildren, setAllChildren] = useState<ChildProfile[]>([]);

  // Load initial settings and children from localStorage / server
  useEffect(() => {
    const savedChildId = localStorage.getItem('lg_active_child');
    if (savedChildId) setActiveChildIdState(savedChildId);

    const savedLang = localStorage.getItem('lg_lang') as Language;
    if (savedLang) setLanguageState(savedLang);

    const savedSound = localStorage.getItem('lg_sound');
    if (savedSound !== null) {
      const isEnabled = savedSound === 'true';
      setSoundEnabledState(isEnabled);
      soundEffects.enabled = isEnabled;
    }

    refreshProfiles();
  }, []);

  const refreshProfiles = async () => {
    try {
      const res = await fetch('/api/data/profiles');
      if (res.ok) {
        const data = await res.json();
        setAllChildren(data.children || []);
      }
    } catch (e) {
      console.warn('Failed to fetch profiles, using fallback', e);
    }
  };

  const setActiveChildId = (id: string) => {
    setActiveChildIdState(id);
    localStorage.setItem('lg_active_child', id);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lg_lang', lang);
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    soundEffects.enabled = enabled;
    localStorage.setItem('lg_sound', String(enabled));
  };

  const speak = (text: string, onEnd?: () => void) => {
    setIsSpeaking(true);
    speakText(text, language, activeChild?.classGrade === 'UKG' ? 0.9 : 1.0, 1.1, () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    });
  };

  const stopSpeech = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  const addStars = async (count: number) => {
    soundEffects.playStar();
    setAllChildren((prev) =>
      prev.map((c) => (c.id === activeChildId ? { ...c, stars: c.stars + count, coins: c.coins + count * 2 } : c))
    );
    try {
      await fetch('/api/data/profiles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: activeChildId, starIncrement: count }),
      });
    } catch (e) {
      console.error('Failed to persist star count', e);
    }
  };

  const activeChild = allChildren.find((c) => c.id === activeChildId) || allChildren[0] || null;

  const t = (key: keyof typeof translations['en']): string => {
    return getTranslation(language, key);
  };

  return (
    <AppContext.Provider
      value={{
        activeChild,
        activeChildId,
        setActiveChildId,
        language,
        setLanguage,
        t,
        soundEnabled,
        setSoundEnabled,
        speak,
        stopSpeech,
        isSpeaking,
        addStars,
        refreshProfiles,
        allChildren,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

