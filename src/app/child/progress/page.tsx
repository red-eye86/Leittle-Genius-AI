'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, Star, Flame, Award, CheckCircle2, Lock } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { Achievement } from '@/lib/db/types';
import KidAvatar from '@/components/ui/KidAvatar';

export default function ChildProgressPage() {
  const router = useRouter();
  const { activeChild, language, t } = useApp();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeChild) return;
    fetch(`/api/data/progress?childId=${activeChild.id}`)
      .then((res) => res.json())
      .then((data) => {
        setAchievements(data.achievements || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [activeChild]);

  if (!activeChild) return null;

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-4xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/child/dashboard')}
          className="flex items-center space-x-1.5 text-xs font-black text-slate-500 hover:text-slate-800 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ml' ? 'ഹോം' : 'Dashboard'}</span>
        </button>

        <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800">
          Personal Milestones
        </span>
      </div>

      {/* Progress Summary Card */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-4xl p-6 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-5 text-center sm:text-left">
          <div className="p-3 bg-white/20 rounded-3xl border-2 border-white/40 shadow-inner">
            <KidAvatar avatar={activeChild.avatar} size="2xl" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-amber-100 bg-white/20 px-3 py-1 rounded-full">
              {activeChild.classGrade} Star Learner
            </span>
            <h1 className="text-3xl font-black mt-1">
              {activeChild.name}&apos;s Trophy Room
            </h1>
            <p className="text-xs sm:text-sm text-white/90 mt-0.5">
              {language === 'ml'
                ? 'നിങ്ങൾ നേടിയ നക്ഷത്രങ്ങളും ബാഡ്ജുകളും!'
                : 'Every star earned is a step forward in learning!'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-white/25 backdrop-blur-md rounded-2xl p-4 text-center min-w-[90px]">
            <p className="text-2xl font-black">⭐ {activeChild.stars}</p>
            <p className="text-[10px] font-bold text-amber-100 uppercase">Stars</p>
          </div>
          <div className="bg-white/25 backdrop-blur-md rounded-2xl p-4 text-center min-w-[90px]">
            <p className="text-2xl font-black">🔥 {activeChild.streakDays}</p>
            <p className="text-[10px] font-bold text-orange-100 uppercase">Days Streak</p>
          </div>
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

