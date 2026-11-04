'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, ShieldCheck, BookOpen, Bot, Box, Award, Heart, Star, Compass } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import MascotOwl from '@/components/ui/MascotOwl';
import KidAvatar from '@/components/ui/KidAvatar';
import { soundEffects } from '@/lib/audio/soundEffects';

export default function LandingPage() {
  const router = useRouter();
  const { allChildren, setActiveChildId, language, t, speak } = useApp();

  const handleSelectChild = (id: string, name: string) => {
    soundEffects.playStar();
    setActiveChildId(id);
    speak(language === 'ml' ? `സ്വാഗതം ${name}! നമുക്ക് പഠനം തുടങ്ങാം!` : `Welcome ${name}! Let's start learning!`);
    router.push('/child/dashboard');
  };

  return (
    <div className="space-y-12 py-4">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-5xl bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 text-white p-8 sm:p-12 shadow-2xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>{language === 'ml' ? 'കേരള സ്കൂൾ സിലബസ് അടിസ്ഥാനമാക്കിയുള്ളത്' : 'Kerala & ICSE Syllabus Grounded'}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              {t('appTitle')}
            </h1>

            <p className="text-xl sm:text-2xl font-bold text-sky-100">
              {t('tagline')}
            </p>

            <p className="text-sm sm:text-base text-slate-100 max-w-lg leading-relaxed">
              {language === 'ml'
                ? 'നിങ്ങളുടെ കുട്ടികളുടെ സ്കൂൾ പാഠപുസ്തകങ്ങൾ അപ്‌ലോഡ് ചെയ്യുക. പ്രിയപ്പെട്ട ചിക്കു AI കൂട്ടുകാരൻ 3D ലോകങ്ങളിലൂടെയും ഗെയിമുകളിലൂടെയും സന്തോഷത്തോടെ പഠിപ്പിക്കും!'
                : 'Upload real school textbooks and worksheets. Our friendly AI pet buddy Chikoo transforms lessons into interactive 3D worlds, joyful games, and fun quizzes!'}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <span className="flex items-center space-x-1.5 bg-white/20 px-3 py-1 rounded-xl text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>100% Child-Safe & Ad-Free</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-white/20 px-3 py-1 rounded-xl text-xs font-bold">
                <Compass className="w-4 h-4 text-amber-300" />
                <span>English & മലയാളം</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative p-6 bg-white/10 backdrop-blur-xl rounded-4xl border-2 border-white/30 shadow-2xl animate-float">
              <MascotOwl size="xl" />
              <div className="mt-4 bg-white text-slate-800 px-4 py-2 rounded-2xl shadow-md text-center">
                <p className="text-xs font-black text-indigo-600 uppercase">Meet Chikoo 🐶🐾</p>
                <p className="text-xs font-bold text-slate-600">Your AI Pet & Study Buddy!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Choose Child Profile Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800">
            {t('chooseProfile')}
          </h2>
          <p className="text-sm sm:text-base font-bold text-slate-500">
            {language === 'ml'
              ? 'ഓരോ കുട്ടിക്കും പ്രത്യേക സിലബസും പാഠപുസ്തകങ്ങളും പുരോഗതിയും ഉണ്ട്'
              : 'Each child has their own independent dashboard, syllabus, textbooks, and rewards!'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {allChildren.map((child) => {
            const isUKG = child.classGrade === 'UKG';
            return (
              <div
                key={child.id}
                onClick={() => handleSelectChild(child.id, child.name)}
                className={`group cursor-pointer rounded-4xl p-8 border-4 transition-all duration-300 card-kid-hover shadow-kid ${
                  isUKG
                    ? 'bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 border-pink-400 hover:border-pink-500'
                    : 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 border-sky-400 hover:border-sky-500'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-white rounded-3xl shadow-md border-2 border-slate-100 group-hover:scale-110 transition duration-300">
                    <KidAvatar avatar={child.avatar} size="2xl" />
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-4 py-1.5 rounded-2xl text-xs font-black uppercase tracking-wider text-white shadow-sm ${
                        isUKG ? 'bg-pink-500' : 'bg-sky-500'
                      }`}
                    >
                      {child.classGrade}
                    </span>
                    <p className="text-xs font-bold text-slate-500 mt-1">
                      {child.age} {language === 'ml' ? 'വയസ്സ്' : 'Years Old'}
                    </p>
                  </div>
                </div>

                <h3 className="text-3xl font-black text-slate-800 mb-2">
                  {child.name}
                </h3>

                <p className="text-xs sm:text-sm font-bold text-slate-600 mb-6 leading-relaxed">
                  {isUKG
                    ? language === 'ml'
                      ? 'ചിത്രങ്ങൾ, ശബ്ദങ്ങൾ, അക്ഷരങ്ങൾ, എണ്ണൽ, കൊച്ചു കളികൾ'
                      : 'Pictures, Phonics Sounds, Apple Counting, Tracing & Joyful Games'
                    : language === 'ml'
                    ? 'ഇന്ററാക്ടീവ് പാഠങ്ങൾ, 3D സയൻസ്, കണക്ക് വെല്ലുവിളി, ക്വിസുകൾ'
                    : 'Interactive Explanations, 3D Solar System, Math Blitz & Story Quests'}
                </p>

                {/* Stars and streak info */}
                <div className="flex items-center justify-between pt-4 border-t-2 border-slate-200/60">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-black text-amber-600 flex items-center space-x-1">
                      <span>⭐</span>
                      <span>{child.stars} {t('stars')}</span>
                    </span>
                    <span className="text-xs font-black text-orange-600 flex items-center space-x-1">
                      <span>🔥</span>
                      <span>{child.streakDays} {t('streak')}</span>
                    </span>
                  </div>

                  <button className="flex items-center space-x-1 font-black text-xs uppercase tracking-wide group-hover:translate-x-1 transition text-slate-800">
                    <span>{t('continueLearning')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="bg-white/80 backdrop-blur-md rounded-5xl p-8 sm:p-12 border-4 border-slate-100 shadow-xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
            {language === 'ml' ? 'പഠനം രസകരമാക്കുന്ന അത്ഭുതങ്ങൾ' : 'Designed for True Joyful Learning'}
          </h3>
          <p className="text-xs sm:text-sm font-bold text-slate-500">
            {language === 'ml'
              ? 'വിരസമായ അഡ്മിൻ ഡാഷ്‌ബോർഡുകൾക്ക് പകരം യഥാർത്ഥ 3D അനുഭവങ്ങളും കളികളും'
              : 'Grounded in uploaded school curriculum with zero pressure and positive reinforcement'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            onClick={() => router.push('/child/story')}
            className="cursor-pointer p-6 rounded-3xl bg-teal-50 hover:bg-teal-100/80 border-2 border-teal-200 space-y-3 transition card-kid-hover"
          >
            <div className="w-12 h-12 bg-teal-500 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md">
              🧚‍♂️
            </div>
            <h4 className="text-base font-black text-slate-800">AI Story Learning</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Convert school lessons into stories. Teach plants, animals, or environmental science through a story with animated characters.
            </p>
          </div>

          <div
            onClick={() => router.push('/child/games')}
            className="cursor-pointer p-6 rounded-3xl bg-pink-50 hover:bg-pink-100/80 border-2 border-pink-200 space-y-3 transition card-kid-hover"
          >
            <div className="w-12 h-12 bg-pink-500 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md">
              ✍️
            </div>
            <h4 className="text-base font-black text-slate-800">Writing & Drawing Practice</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Let the UKG child trace letters, numbers, and shapes using a mouse, finger, or stylus with rainbow crayons.
            </p>
          </div>

          <div
            onClick={() => router.push('/child/ai-teacher')}
            className="cursor-pointer p-6 rounded-3xl bg-emerald-50 hover:bg-emerald-100/80 border-2 border-emerald-200 space-y-3 transition card-kid-hover"
          >
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md">
              🎙️
            </div>
            <h4 className="text-base font-black text-slate-800">AI Voice Teacher</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              The child can ask, &ldquo;Why is the sky blue?&rdquo; or &ldquo;How many 5s are there in 20?&rdquo; and hear a simple explanation aloud.
            </p>
          </div>

          <div
            onClick={() => router.push('/child/progress')}
            className="cursor-pointer p-6 rounded-3xl bg-amber-50 hover:bg-amber-100/80 border-2 border-amber-200 space-y-3 transition card-kid-hover"
          >
            <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md">
              🎁
            </div>
            <h4 className="text-base font-black text-slate-800">Learning Rewards</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete chapters and earn stars to unlock new learning worlds, characters, and educational activities.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

