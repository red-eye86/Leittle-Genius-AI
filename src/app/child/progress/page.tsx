'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Lock,
  Unlock,
  Gift,
  Globe,
  Sparkles,
  Gamepad2,
  Smile,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '@/lib/context/AppContext';
import { Achievement } from '@/lib/db/types';
import KidAvatar from '@/components/ui/KidAvatar';
import { soundEffects } from '@/lib/audio/soundEffects';

interface RewardItem {
  id: string;
  category: 'worlds' | 'characters' | 'activities';
  title: string;
  malayalamTitle: string;
  description: string;
  malayalamDescription: string;
  emoji: string;
  requiredStars: number;
  actionHref?: string;
  avatarEmoji?: string;
}

const REWARD_CATALOG: RewardItem[] = [
  // Learning Worlds
  {
    id: 'rw-world-solar',
    category: 'worlds',
    title: '3D Solar System Space World',
    malayalamTitle: '3D സൗരയൂഥ ലോകം',
    description: 'Explore rotating planets, Sun, and Saturn rings in interactive 3D!',
    malayalamDescription: 'കറങ്ങുന്ന ഗ്രഹങ്ങളെയും സൂര്യനെയും 3D-യിൽ കാണാം!',
    emoji: '🪐',
    requiredStars: 10,
    actionHref: '/child/world3d',
  },
  {
    id: 'rw-world-class',
    category: 'worlds',
    title: '3D Virtual Classroom & Lab',
    malayalamTitle: '3D വെർച്വൽ ക്ലാസ്സ്മുറി',
    description: 'Enter Hootie’s 3D classroom with interactive blackboard & blocks!',
    malayalamDescription: 'ഹുട്ടിയുടെ 3D ക്ലാസ്സ്മുറിയിൽ പ്രവേശിക്കാം!',
    emoji: '🏫',
    requiredStars: 20,
    actionHref: '/child/world3d',
  },
  {
    id: 'rw-world-ocean',
    category: 'worlds',
    title: 'Coral Reef Underwater Science World',
    malayalamTitle: 'കടലിനടിയിലെ ശാസ്ത്ര ലോകം',
    description: 'Discover glowing jellyfish, dolphins, and ocean ecosystems!',
    malayalamDescription: 'കടലിനടിയിലെ അത്ഭുത ജീവികളെ പരിചയപ്പെടാം!',
    emoji: '🐬',
    requiredStars: 35,
    actionHref: '/child/story',
  },
  {
    id: 'rw-world-dino',
    category: 'worlds',
    title: 'Dino Jungle Math Safari',
    malayalamTitle: 'ഡിനോ ജംഗിൾ മാത്‍സ് സഫാരി',
    description: 'Solve multiplication & counting puzzles with friendly dinosaurs!',
    malayalamDescription: 'ദിനോസറുകളോടൊപ്പം കണക്ക് കളികൾ കളിക്കാം!',
    emoji: '🦕',
    requiredStars: 50,
    actionHref: '/child/games',
  },

  // Unlockable Characters
  {
    id: 'rw-char-owl',
    category: 'characters',
    title: 'Professor Hootie the Owl',
    malayalamTitle: 'പ്രൊഫസർ ഹുട്ടി മൂങ്ങ',
    description: 'Your wise and patient AI Teacher companion!',
    malayalamDescription: 'നിങ്ങളുടെ പ്രിയപ്പെട്ട ഹുട്ടി ടീച്ചർ!',
    emoji: '🦉',
    requiredStars: 0,
    avatarEmoji: '🦉',
  },
  {
    id: 'rw-char-robot',
    category: 'characters',
    title: 'Sparky the Friendly AI Robot',
    malayalamTitle: 'സ്പാർക്കി AI റോബോട്ട്',
    description: 'A futuristic robot buddy who loves science and math puzzles!',
    malayalamDescription: 'ശാസ്ത്രവും കണക്കും ഇഷ്ടപ്പെടുന്ന റോബോട്ട് കൂട്ടുകാരൻ!',
    emoji: '🤖',
    requiredStars: 25,
    avatarEmoji: '🤖',
  },
  {
    id: 'rw-char-elephant',
    category: 'characters',
    title: 'Appu the Kerala Elephant',
    malayalamTitle: 'അപ്പു കുട്ടിയാന',
    description: 'Gentle forest explorer who teaches nature & Malayalam stories!',
    malayalamDescription: 'കാട്ടിലെ കഥകൾ പറയുന്ന കുസൃതിക്കുട്ടിയാന!',
    emoji: '🐘',
    requiredStars: 35,
    avatarEmoji: '🐘',
  },
  {
    id: 'rw-char-astronaut',
    category: 'characters',
    title: 'Captain Leo the Space Lion',
    malayalamTitle: 'ക്യാപ്റ്റൻ ലിയോ സിംഹം',
    description: 'Brave galactic explorer for fearless quiz champions!',
    malayalamDescription: 'ബഹിരാകാശ പര്യവേക്ഷകനായ ധീര സിംഹം!',
    emoji: '🦁',
    requiredStars: 45,
    avatarEmoji: '🦁',
  },

  // Educational Activities
  {
    id: 'rw-act-story',
    category: 'activities',
    title: 'AI Lesson-to-Story Theatre',
    malayalamTitle: 'AI കഥാ തിയേറ്റർ',
    description: 'Convert any school lesson into an animated character story!',
    malayalamDescription: 'ഏത് പാഠഭാഗവും കാർട്ടൂൺ കഥയാക്കി മാറ്റാം!',
    emoji: '🧚‍♂️',
    requiredStars: 10,
    actionHref: '/child/story',
  },
  {
    id: 'rw-act-trace',
    category: 'activities',
    title: 'Rainbow Crayon Tracing Studio',
    malayalamTitle: 'മഴവില്ല് ഡ്രോയിങ് സ്റ്റുഡിയോ',
    description: 'Trace letters, numbers, and shapes with jumbo rainbow crayons!',
    malayalamDescription: 'അക്ഷരങ്ങളും സംഖ്യകളും രൂപങ്ങളും വരച്ചു പഠിക്കാം!',
    emoji: '🎨',
    requiredStars: 15,
    actionHref: '/child/games',
  },
  {
    id: 'rw-act-blitz',
    category: 'activities',
    title: 'Super Speed Math Boss Challenge',
    malayalamTitle: 'സ്പീഡ് മാത്‍സ് ചലഞ്ച്',
    description: '30-second lightning math challenge for extra star trophies!',
    malayalamDescription: 'വേഗത്തിൽ കണക്ക് ചെയ്ത് നക്ഷത്രങ്ങൾ നേടാം!',
    emoji: '⚡',
    requiredStars: 30,
    actionHref: '/child/games',
  },
];

export default function ChildProgressPage() {
  const router = useRouter();
  const { activeChild, language, addStars, speak, refreshProfiles } = useApp();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([
    'rw-world-solar',
    'rw-world-class',
    'rw-char-owl',
    'rw-act-story',
    'rw-act-trace',
  ]);
  const [chestOpened, setChestOpened] = useState(false);
  const [activeTab, setActiveTab] = useState<'worlds' | 'characters' | 'activities'>('worlds');
  const [equipMessage, setEquipMessage] = useState('');

  useEffect(() => {
    if (!activeChild) return;
    fetch(`/api/data/progress?childId=${activeChild.id}`)
      .then((res) => res.json())
      .then((data) => {
        setAchievements(data.achievements || []);
      })
      .catch((err) => console.error(err));
  }, [activeChild]);

  if (!activeChild) return null;

  const handleOpenTreasureChest = () => {
    if (chestOpened) return;
    soundEffects.playCorrect();
    setChestOpened(true);
    addStars(5);
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    speak(
      language === 'ml'
        ? `അഭിനന്ദനങ്ങൾ ${activeChild.name}! നിധിപ്പെട്ടി തുറന്ന് 5 നക്ഷത്രങ്ങൾ നേടി!`
        : `Hooray ${activeChild.name}! You opened the Golden Treasure Chest and won 5 bonus stars!`
    );
  };

  const handleUnlockItem = (item: RewardItem) => {
    if (activeChild.stars < item.requiredStars) {
      soundEffects.playIncorrect();
      speak(
        language === 'ml'
          ? `ഇത് തുറക്കാൻ ${item.requiredStars} നക്ഷത്രങ്ങൾ വേണം! പാഠങ്ങൾ പഠിച്ച് കൂടുതൽ നക്ഷത്രങ്ങൾ നേടൂ!`
          : `You need ${item.requiredStars} stars to unlock ${item.title}. Complete a chapter or quiz to earn more stars!`
      );
      return;
    }
    soundEffects.playCorrect();
    setUnlockedIds((prev) => Array.from(new Set([...prev, item.id])));
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    speak(
      language === 'ml'
        ? `സൂപ്പർ! ${item.malayalamTitle} അൺലോക്ക് ചെയ്തു!`
        : `Awesome! You unlocked ${item.title}!`
    );
  };

  const handleEquipCharacter = async (item: RewardItem) => {
    if (!item.avatarEmoji) return;
    soundEffects.playStar();
    try {
      await fetch('/api/data/profiles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: activeChild.id,
          updates: { avatar: item.avatarEmoji },
        }),
      });
      await refreshProfiles();
      setEquipMessage(`${item.emoji} ${item.title} equipped as your profile buddy!`);
      setTimeout(() => setEquipMessage(''), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredRewards = REWARD_CATALOG.filter((r) => r.category === activeTab);

  return (
    <div className="space-y-8 pb-16 animate-fade-in max-w-4xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/child/dashboard')}
          className="flex items-center space-x-1.5 text-xs font-black text-slate-500 hover:text-slate-800 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ml' ? 'ഹോം' : 'Dashboard'}</span>
        </button>

        <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800 flex items-center space-x-1">
          <Gift className="w-4 h-4" />
          <span>Learning Rewards & Star Vault</span>
        </span>
      </div>

      {/* Progress & Treasure Chest Hero Card */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 rounded-4xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-5 text-center sm:text-left">
          <div className="p-3 bg-white/20 rounded-3xl border-2 border-white/40 shadow-inner">
            <KidAvatar avatar={activeChild.avatar} size="2xl" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-amber-100 bg-white/20 px-3 py-1 rounded-full">
              ✨ Learning Rewards Vault
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              {activeChild.name}&apos;s Star Kingdom
            </h1>
            <p className="text-xs sm:text-sm text-white/90 mt-0.5 max-w-md">
              {language === 'ml'
                ? 'പാഠങ്ങൾ പൂർത്തിയാക്കി നക്ഷത്രങ്ങൾ നേടൂ — പുതിയ പഠന ലോകങ്ങളും കഥാപാത്രങ്ങളും കളികളും തുറക്കൂ!'
                : 'Complete chapters and earn stars to unlock new learning worlds, characters, and educational activities!'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-white/25 backdrop-blur-md rounded-2xl p-4 text-center min-w-[85px] border border-white/30">
            <p className="text-2xl font-black">⭐ {activeChild.stars}</p>
            <p className="text-[10px] font-bold text-amber-100 uppercase">Stars</p>
          </div>
          <div className="bg-white/25 backdrop-blur-md rounded-2xl p-4 text-center min-w-[85px] border border-white/30">
            <p className="text-2xl font-black">🪙 {activeChild.coins}</p>
            <p className="text-[10px] font-bold text-amber-100 uppercase">Coins</p>
          </div>
          <div className="bg-white/25 backdrop-blur-md rounded-2xl p-4 text-center min-w-[85px] border border-white/30">
            <p className="text-2xl font-black">🔥 {activeChild.streakDays}</p>
            <p className="text-[10px] font-bold text-orange-100 uppercase">Streak</p>
          </div>
        </div>
      </div>

      {/* Golden Mystery Treasure Chest */}
      <div className="bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 rounded-4xl p-6 border-4 border-amber-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="text-5xl animate-bounce-gentle">
            {chestOpened ? '👑' : '🎁'}
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-amber-900">
              {language === 'ml'
                ? 'ഇന്നത്തെ സുവർണ്ണ നിധിപ്പെട്ടി (Daily Star Chest)'
                : 'Daily Golden Star Treasure Chest'}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-amber-700">
              {chestOpened
                ? language === 'ml'
                  ? 'നിങ്ങൾ ഇന്നത്തെ +5 ബോണസ് നക്ഷത്രങ്ങൾ നേടിയിരിക്കുന്നു! 🎉'
                  : 'You claimed +5 Bonus Stars from today’s treasure chest! 🎉'
                : language === 'ml'
                ? 'നിധിപ്പെട്ടി തുറന്ന് സൗജന്യ നക്ഷത്രങ്ങൾ നേടൂ!'
                : 'Tap to open the glowing treasure chest and claim +5 Bonus Stars!'}
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenTreasureChest}
          disabled={chestOpened}
          className={`px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center space-x-2 shadow-lg btn-kid-3d whitespace-nowrap ${
            chestOpened
              ? 'bg-emerald-500 text-white opacity-90 cursor-default'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>
            {chestOpened
              ? language === 'ml'
                ? 'നേടിക്കഴിഞ്ഞു (+5 ⭐)'
                : 'Chest Opened (+5 ⭐)'
              : language === 'ml'
              ? 'നിധിപ്പെട്ടി തുറക്കൂ 🎁'
              : 'Open Treasure Chest 🎁'}
          </span>
        </button>
      </div>

      {equipMessage && (
        <div className="p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-900 font-black text-xs sm:text-sm text-center animate-fade-in">
          {equipMessage}
        </div>
      )}

      {/* Unlockable Worlds, Characters & Activities Section */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-slate-800 flex items-center space-x-2">
            <Unlock className="w-6 h-6 text-amber-500" />
            <span>
              {language === 'ml'
                ? 'നക്ഷത്രങ്ങൾ കൊണ്ട് തുറക്കാവുന്ന സമ്മാനങ്ങൾ'
                : 'Unlock Worlds, Characters & Activities'}
            </span>
          </h2>

          {/* Category Switcher */}
          <div className="flex items-center space-x-2">
            {[
              { id: 'worlds', label: '🌍 Worlds', ml: '🌍 ലോകങ്ങൾ', icon: Globe },
              { id: 'characters', label: '🦉 Characters', ml: '🦉 കഥാപാത്രങ്ങൾ', icon: Smile },
              { id: 'activities', label: '🎮 Activities', ml: '🎮 കളികൾ', icon: Gamepad2 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  soundEffects.playPop();
                  setActiveTab(tab.id as any);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-white shadow-md scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {language === 'ml' ? tab.ml : tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filteredRewards.map((item) => {
            const isUnlocked =
              unlockedIds.includes(item.id) || activeChild.stars >= item.requiredStars;
            const canAfford = activeChild.stars >= item.requiredStars;

            return (
              <div
                key={item.id}
                className={`rounded-3xl p-6 border-4 transition flex flex-col justify-between gap-4 ${
                  isUnlocked
                    ? 'bg-white border-amber-300 shadow-md'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-16 h-16 rounded-3xl flex items-center justify-center text-4xl flex-shrink-0 shadow-inner ${
                      isUnlocked ? 'bg-amber-100' : 'bg-slate-200 grayscale opacity-70'
                    }`}
                  >
                    {item.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          isUnlocked
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isUnlocked ? 'Unlocked ✨' : `Requires ⭐ ${item.requiredStars} Stars`}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mt-1">
                      {language === 'ml' ? item.malayalamTitle : item.title}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">
                      {language === 'ml' ? item.malayalamDescription : item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                  {isUnlocked ? (
                    item.category === 'characters' ? (
                      <button
                        onClick={() => handleEquipCharacter(item)}
                        className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xs shadow-sm btn-kid-3d"
                      >
                        {activeChild.avatar === item.avatarEmoji
                          ? '✓ Active Buddy'
                          : language === 'ml'
                          ? 'ഇത് തിരഞ്ഞെടുക്കൂ'
                          : 'Choose Character'}
                      </button>
                    ) : (
                      <button
                        onClick={() => router.push(item.actionHref || '/child/dashboard')}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-sm btn-kid-3d"
                      >
                        {language === 'ml' ? 'തുറക്കാം 🚀' : 'Enter & Play 🚀'}
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => handleUnlockItem(item)}
                      className={`px-4 py-2 rounded-xl font-black text-xs flex items-center space-x-1.5 ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm btn-kid-3d'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>
                        {language === 'ml'
                          ? `⭐ ${item.requiredStars} നക്ഷത്രം വേണം`
                          : `Unlock with ⭐ ${item.requiredStars}`}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements Badges Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-800 flex items-center space-x-2">
          <Award className="w-6 h-6 text-amber-500" />
          <span>{language === 'ml' ? 'നേട്ടങ്ങൾ & ബാഡ്ജുകൾ' : 'My Achievements & Badges'}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((ach) => {
            const isUnlocked = !!ach.unlockedAt;
            return (
              <div
                key={ach.id}
                className={`rounded-3xl p-5 border-3 transition card-kid-hover flex items-start space-x-4 ${
                  isUnlocked
                    ? 'bg-white border-amber-300 shadow-md'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-inner ${
                    isUnlocked ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {ach.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-base text-slate-800">
                      {language === 'ml' ? ach.titleMalayalam : ach.title}
                    </h3>
                    {isUnlocked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  <p className="text-xs font-bold text-slate-500 mt-0.5">
                    {language === 'ml' ? ach.malayalamDescription : ach.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${ach.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
