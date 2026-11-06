'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Settings,
  Key,
  ShieldCheck,
  Clock,
  Volume2,
  CheckCircle2,
  Lock,
  Sparkles,
  User,
  Edit3,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { ChildProfile } from '@/lib/db/types';
import KidAvatar from '@/components/ui/KidAvatar';
import EditChildProfileModal from '@/components/ui/EditChildProfileModal';

export default function ParentSettingsPage() {
  const router = useRouter();
  const { allChildren, speak } = useApp();
  const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);

  const [llmProvider, setLlmProvider] = useState<string>('smart_built_in');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [openAiApiKey, setOpenAiApiKey] = useState('');
  const [parentEmail, setParentEmail] = useState('parent@littlegenius.ai');
  const [password, setPassword] = useState('admin123');
  const [pin, setPin] = useState('1234');
  const [dailyLimit, setDailyLimit] = useState(45);
  const [enableVoice, setEnableVoice] = useState(true);
  const [aiSafeMode, setAiSafeMode] = useState(true);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/data/settings')
      .then((res) => res.json())
      .then((data) => {
        const s = data.settings;
        if (s) {
          setLlmProvider(s.llmProvider || 'smart_built_in');
          setGeminiApiKey(s.geminiApiKey || '');
          setOpenAiApiKey(s.openAiApiKey || '');
          setParentEmail(s.email || 'parent@littlegenius.ai');
          setPassword(s.password || 'admin123');
          setPin(s.pin || '1234');
          setDailyLimit(s.dailyTimeLimitMinutes || 45);
          setEnableVoice(s.enableVoice !== false);
          setAiSafeMode(s.aiSafeMode !== false);
        }
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/data/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          llmProvider,
          geminiApiKey,
          openAiApiKey,
          email: parentEmail,
          password,
          pin,
          dailyTimeLimitMinutes: Number(dailyLimit),
          enableVoice,
          aiSafeMode,
        }),
      });

      if (res.ok) {
        soundEffects.playStar();
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/parent/dashboard')}
          className="flex items-center space-x-1.5 text-xs font-black text-slate-500 hover:text-slate-800 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Parent Dashboard</span>
        </button>

        <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-indigo-100 text-indigo-800">
          Security & Configuration
        </span>
      </div>

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-black text-slate-800 flex items-center justify-center space-x-2">
          <Settings className="w-8 h-8 text-indigo-600" />
          <span>Parent & AI Settings</span>
        </h1>
        <p className="text-xs sm:text-sm font-bold text-slate-500">
          Configure AI providers, screen time limits, security PIN, and child safety controls.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-4xl p-6 sm:p-10 border-4 border-slate-200 shadow-xl space-y-6">
        {/* Child Profiles & Avatars Section */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center space-x-1.5">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Manage Children&apos;s Names & Profile Pictures:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allChildren.map((child) => (
              <div
                key={child.id}
                className="p-4 rounded-3xl border-2 border-slate-200 bg-slate-50 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <KidAvatar avatar={child.avatar} size="lg" />
                  <div>
                    <p className="text-base font-black text-slate-800">{child.name}</p>
                    <p className="text-xs text-slate-500 font-bold">
                      {child.classGrade} • {child.age} yrs old
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingChild(child)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1 shadow-sm transition btn-kid-3d"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Provider Configuration */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Teaching Engine:</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'smart_built_in', title: 'Smart Built-In Engine', desc: 'Pre-configured curriculum engine (Zero API key needed)' },
              { id: 'gemini', title: 'Google Gemini AI', desc: 'Gemini 1.5 Flash API with RAG textbook grounding' },
              { id: 'openai', title: 'OpenAI GPT-4o Mini', desc: 'OpenAI Chat Completions API' },
              { id: 'anthropic', title: 'Anthropic Claude', desc: 'Claude 3.5 Sonnet API' },
            ].map((p) => (
              <div
                key={p.id}
                onClick={() => setLlmProvider(p.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                  llmProvider === p.id
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <p className="text-xs font-black">{p.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{p.desc}</p>
              </div>
            ))}
          </div>

          {llmProvider === 'gemini' && (
            <div className="space-y-3 pt-3 bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-indigo-900 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Google Gemini API Key (Brain & Voice):</span>
                </label>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Gemini Voice Active
                </span>
              </div>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full p-3 bg-white border border-indigo-200 rounded-xl text-xs font-mono text-slate-800 outline-none focus:border-indigo-500 shadow-sm"
              />
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Powers <strong>Chikoo AI JARVIS</strong> and generates high-fidelity <strong>Gemini Voice output</strong> across the entire app with native, authentic Malayalam & English.
              </p>

              {/* Instant Voice Test Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playPop();
                    speak('നമസ്കാരം! ചിക്കുവിന്റെ ജെമിനി ശബ്ദം പൂർണ്ണമായും തയ്യാറാണ്! മലയാളം പാഠങ്ങൾ നമുക്ക് ഒന്നിച്ചു പഠിക്കാം!');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center space-x-1 shadow-sm transition btn-kid-3d"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Test Malayalam Voice (മലയാളം)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playPop();
                    speak('Hello Champion! Chikoo JARVIS is online and ready to guide your learning adventures!');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center space-x-1 shadow-sm transition btn-kid-3d"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Test English Voice</span>
                </button>
              </div>
            </div>
          )}

          {llmProvider === 'openai' && (
            <div className="space-y-1 pt-2">
              <label className="text-xs font-bold text-slate-600">OpenAI API Key:</label>
              <input
                type="password"
                value={openAiApiKey}
                onChange={(e) => setOpenAiApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Daily Time Limit (minutes) */}
        <div className="space-y-2 pb-6 border-b border-slate-100">
          <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-sky-500" />
            <span>Daily Screen Time Limit:</span>
          </label>
          <div className="flex items-center space-x-3">
            {[30, 45, 60, 90].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDailyLimit(mins)}
                className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition ${
                  dailyLimit === mins
                    ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {mins} Minutes
              </button>
            ))}
          </div>
        </div>

        {/* Parent Security & Login Credentials */}
        <div className="space-y-4 pb-6 border-b border-slate-100">
          <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center space-x-1.5">
            <Lock className="w-4 h-4 text-rose-500" />
            <span>Parent & Admin Login Credentials:</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Parent Email / Username:</label>
              <input
                type="text"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                placeholder="parent@littlegenius.ai"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Login Password:</label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <label className="text-xs font-bold text-slate-600">Quick 4-Digit Security PIN:</label>
            <input
              type="text"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-36 p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-center text-lg font-black tracking-widest text-slate-800 outline-none focus:border-indigo-500"
            />
            <p className="text-[11px] text-slate-400">Used for fast PIN unlocking on mobile/tablet screens.</p>
          </div>
        </div>

        {/* Child Safety & Audio Toggles */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Child Safety Guardrails:</span>
          </label>

          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={aiSafeMode}
                onChange={(e) => setAiSafeMode(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="text-xs font-bold text-slate-700">
                Strict AI Child-Safe Filter (Politely redirects non-academic questions)
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enableVoice}
                onChange={(e) => setEnableVoice(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="text-xs font-bold text-slate-700">
                Enable AI Speech Voice Narration (Malayalam & English TTS)
              </span>
            </label>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl shadow-lg transition btn-kid-3d"
        >
          {saving ? 'Saving Settings...' : 'Save Settings'}
        </button>
      </form>

      {/* Edit Child Profile Modal */}
      {editingChild && (
        <EditChildProfileModal
          child={editingChild}
          isOpen={!!editingChild}
          onClose={() => setEditingChild(null)}
        />
      )}
    </div>
  );
}

