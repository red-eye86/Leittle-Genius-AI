'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Upload,
  Settings,
  Layers,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Flame,
  ArrowRight,
  ShieldCheck,
  Edit3,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { ChildProfile } from '@/lib/db/types';
import KidAvatar from '@/components/ui/KidAvatar';
import EditChildProfileModal from '@/components/ui/EditChildProfileModal';

export default function ParentDashboardPage() {
  const router = useRouter();
  const { allChildren, language, t } = useApp();
  const [selectedChildId, setSelectedChildId] = useState<string>('child-1');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/data/progress?childId=${selectedChildId}`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedChildId]);

  const selectedChild = allChildren.find((c) => c.id === selectedChildId) || allChildren[0];
  const isUKG = selectedChild?.classGrade === 'UKG';

  return (
    <div className="space-y-8 pb-16 animate-fade-in max-w-6xl mx-auto">
      {/* Top Parent Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🛡️</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800">
              {t('parentDashboard')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-bold mt-0.5">
            {t('parentSafetyTip')}
          </p>
        </div>

        {/* Quick Parent Action Buttons */}
        <div className="flex items-center space-x-2 flex-wrap">
          <button
            onClick={() => router.push('/parent/upload')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Textbook</span>
          </button>
          <button
            onClick={() => router.push('/parent/library')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs flex items-center space-x-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Library</span>
          </button>
          <button
            onClick={() => router.push('/parent/syllabus')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs flex items-center space-x-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Syllabus</span>
          </button>
          <button
            onClick={() => router.push('/parent/settings')}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Child Switcher Tabs & Edit Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          {allChildren.map((child) => (
            <button
              key={child.id}
              onClick={() => {
                soundEffects.playPop();
                setSelectedChildId(child.id);
              }}
              className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center space-x-2.5 transition shadow-sm ${
                selectedChildId === child.id
                  ? 'bg-slate-900 text-white shadow-md scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <KidAvatar avatar={child.avatar} size="xs" />
              <div className="text-left">
                <p className="leading-tight">{child.name}</p>
                <p className="text-[10px] opacity-75">{child.classGrade}</p>
              </div>
            </button>
          ))}
        </div>

        {selectedChild && (
          <button
            onClick={() => setEditingChild(selectedChild)}
            className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-xs rounded-2xl border-2 border-indigo-200 flex items-center space-x-1.5 shadow-sm transition self-start sm:self-auto"
          >
            <Edit3 className="w-4 h-4 text-indigo-600" />
            <span>Edit {selectedChild.name}&apos;s Name & Photo</span>
          </button>
        )}
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Time</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-3xl font-black text-slate-800">
            {stats?.stats?.totalMinutes || selectedChild?.totalLearningMinutes || 0}m
          </p>
          <p className="text-[11px] text-slate-400 font-bold">This Academic Month</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Quiz Accuracy</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-emerald-600">
            {stats?.stats?.avgScore || 92}%
          </p>
          <p className="text-[11px] text-emerald-600 font-bold">Excellent Retention</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Stars Earned</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-amber-500">
            ⭐ {selectedChild?.stars}
          </p>
          <p className="text-[11px] text-slate-400 font-bold">Positive Reinforcement</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Streak</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-3xl font-black text-orange-600">
            🔥 {selectedChild?.streakDays} Days
          </p>
          <p className="text-[11px] text-orange-500 font-bold">Consistent Study</p>
        </div>
      </div>

      {/* Adaptive Learning Recommendations (Section 14) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Topics Mastered */}
        <div className="bg-white rounded-4xl p-6 border-2 border-emerald-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-black">{t('topicsMastered')}</h3>
          </div>

          <div className="space-y-2.5">
            {isUKG ? (
              <>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Letter A sound (/æ/) recognition</span>
                  <span className="text-[10px] font-black text-emerald-700 bg-white px-2 py-0.5 rounded-md">100% Mastered</span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Counting apples from 1 to 10</span>
                  <span className="text-[10px] font-black text-emerald-700 bg-white px-2 py-0.5 rounded-md">100% Mastered</span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Recognizing circle, square, triangle</span>
                  <span className="text-[10px] font-black text-emerald-700 bg-white px-2 py-0.5 rounded-md">95% Mastered</span>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Order of 8 Planets in Solar System</span>
                  <span className="text-[10px] font-black text-emerald-700 bg-white px-2 py-0.5 rounded-md">100% Mastered</span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Day & Night Earth Rotation (24h)</span>
                  <span className="text-[10px] font-black text-emerald-700 bg-white px-2 py-0.5 rounded-md">100% Mastered</span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Multiplication tables 2, 3, 4, 5</span>
                  <span className="text-[10px] font-black text-emerald-700 bg-white px-2 py-0.5 rounded-md">92% Mastered</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Adaptive Revision Recommendations */}
        <div className="bg-white rounded-4xl p-6 border-2 border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-amber-800">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-black">{t('topicsRevision')}</h3>
          </div>

          <div className="space-y-3">
            {isUKG ? (
              <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 space-y-2">
                <p className="text-xs font-black text-amber-900">
                  Phonics sound for Letter C (/k/ vs /s/)
                </p>
                <p className="text-xs text-slate-600">
                  Recommended: Play Phonics Sound Match game with Cat 🐱 and Cup ☕.
                </p>
                <button
                  onClick={() => router.push('/child/games')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs"
                >
                  Start Phonics Practice 👉
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 space-y-2">
                <p className="text-xs font-black text-amber-900">
                  Multiplication tables 7 & 8 practice
                </p>
                <p className="text-xs text-slate-600">
                  Recommended: Spend 5 minutes in Speed Math Blitz to strengthen 7 × 6 and 8 × 7 recall.
                </p>
                <button
                  onClick={() => router.push('/child/games')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs"
                >
                  Launch Math Blitz 👉
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Quiz Attempts Log */}
      <div className="bg-white rounded-4xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-slate-800">
          Recent Assessment Attempts
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-black">
                <th className="py-2.5">Date</th>
                <th>Quiz Topic</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Stars Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
              {(stats?.attempts || []).map((att: any) => (
                <tr key={att.id}>
                  <td className="py-3 text-slate-500">{att.timestamp?.split('T')[0]}</td>
                  <td>{att.quizId?.replace('quiz-', '')}</td>
                  <td>{att.score} / {att.totalQuestions}</td>
                  <td>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      {att.percentage}%
                    </span>
                  </td>
                  <td className="text-amber-500">⭐ +{att.starsEarned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Child Profile Modal */}
      {editingChild && (
        <EditChildProfileModal
          child={editingChild}
          isOpen={!!editingChild}
          onClose={() => setEditingChild(null)}
          onSave={(updated) => {
            setEditingChild(null);
          }}
        />
      )}
    </div>
  );
}

