'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Languages,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';

interface LoginCardProps {
  redirectTo?: string;
  onSuccess?: () => void;
  isMainPage?: boolean;
}

export default function LoginCard({
  redirectTo = '/',
  onSuccess,
  isMainPage = false,
}: LoginCardProps) {
  const router = useRouter();
  const { language, setLanguage, speak, loginUser } = useApp();

  const [authMode, setAuthMode] = useState<'credentials' | 'pin'>('credentials');
  const [emailOrUser, setEmailOrUser] = useState('parent@littlegenius.ai');
  const [password, setPassword] = useState('admin123');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const isMalayalam = language === 'ml';

  // Handle Credentials Login
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUser.trim() || !password.trim()) {
      setErrorMsg(isMalayalam ? 'യൂസർനെയിമും പാസ്‌വേഡും നൽകുക' : 'Please enter your username and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/data/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verifyCredentials: {
            emailOrUsername: emailOrUser,
            password: password,
          },
        }),
      });

      const data = await res.json();
      if (data.valid) {
        handleLoginSuccess();
      } else {
        soundEffects.playIncorrect();
        setErrorMsg(
          isMalayalam
            ? 'തെറ്റായ വിവരങ്ങൾ! വീണ്ടും പരിശോധിക്കുക (Default: admin / admin123)'
            : 'Invalid credentials. Please check and try again (Default: admin / admin123)'
        );
      }
    } catch (err) {
      // Fallback local check
      if (
        (emailOrUser === 'admin' || emailOrUser === 'parent@littlegenius.ai') &&
        (password === 'admin123' || password === '1234')
      ) {
        handleLoginSuccess();
      } else {
        soundEffects.playIncorrect();
        setErrorMsg(isMalayalam ? 'ലോഗിൻ പരാജയപ്പെട്ടു' : 'Login failed. Please verify credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle PIN Login
  const handlePinSubmit = async (pinValue: string) => {
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/data/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verifyPin: pinValue }),
      });
      const data = await res.json();

      if (data.valid || pinValue === '1234') {
        handleLoginSuccess();
      } else {
        soundEffects.playIncorrect();
        setErrorMsg(isMalayalam ? 'തെറ്റായ സുരക്ഷാ പിൻ!' : 'Incorrect security PIN. Default is 1234.');
        setPin('');
      }
    } catch (e) {
      if (pinValue === '1234') {
        handleLoginSuccess();
      } else {
        soundEffects.playIncorrect();
        setErrorMsg(isMalayalam ? 'പിൻ തെറ്റാണ്' : 'Incorrect PIN. Try 1234.');
        setPin('');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePinDigit = (digit: string) => {
    soundEffects.playPop();
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMsg('');
      if (nextPin.length === 4) {
        handlePinSubmit(nextPin);
      }
    }
  };

  const handlePinBackspace = () => {
    soundEffects.playPop();
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleLoginSuccess = () => {
    soundEffects.playStar();
    setSuccess(true);
    loginUser();

    if (rememberMe) {
      localStorage.setItem('lg_parent_remember', 'true');
    }

    const greeting = isMalayalam
      ? isMainPage
        ? 'സ്വാഗതം! നമുക്ക് ഇന്നത്തെ പാഠങ്ങൾ പഠിച്ചു തുടങ്ങാം!'
        : 'സ്വാഗതം! പാരന്റ് ഡാഷ്‌ബോർഡ് അൺലോക്ക് ചെയ്തു!'
      : isMainPage
      ? 'Welcome to Little Genius AI! Let us start your learning tasks!'
      : 'Access granted! Welcome to the Parent Dashboard!';
    speak(greeting);

    setTimeout(() => {
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
      }
    }, 700);
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none">
      {/* Dynamic Animated Ambient Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" />
      <div className="absolute top-10 right-1/4 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-5xl border-3 border-indigo-200/80 shadow-2xl p-6 sm:p-9 space-y-6 text-slate-800 transition-all">
        {/* Top Navigation & Language Toggle */}
        <div className="flex items-center justify-between">
          {!isMainPage ? (
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-1.5 text-xs font-black text-slate-500 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3 py-1.5 rounded-2xl transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isMalayalam ? 'ഹോം' : 'Back to Home'}</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1 text-xs font-black text-indigo-600">
              <ShieldCheck className="w-4 h-4" />
              <span>Security Protected</span>
            </div>
          )}

          <button
            onClick={() => {
              soundEffects.playPop();
              setLanguage(isMalayalam ? 'en' : 'ml');
            }}
            className="flex items-center space-x-1 text-xs font-bold text-amber-700 bg-amber-100/80 hover:bg-amber-200 px-3 py-1.5 rounded-2xl transition"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{isMalayalam ? 'മലയാളം' : 'English'}</span>
          </button>
        </div>

        {/* Brand Header with Chikoo Mascot */}
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-4 border-indigo-400 shadow-xl ring-4 ring-indigo-200 mx-auto">
              <Image
                src="/characters/chikoo.jpg"
                alt="Chikoo Security Guard"
                fill
                sizes="88px"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1.5 rounded-full shadow-md border-2 border-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isMainPage
                ? isMalayalam
                  ? 'ലിറ്റിൽ ജീനിയസ് ലോഗിൻ'
                  : 'Little Genius AI Login'
                : isMalayalam
                ? 'രക്ഷിതാവ് സുരക്ഷാ പ്രവേശനം'
                : 'Parent Security Access'}
            </h1>
            <p className="text-xs text-slate-500 font-bold mt-1">
              {isMainPage
                ? isMalayalam
                  ? 'കുട്ടികളുടെ പഠന ടാസ്കുകൾ തുടങ്ങാൻ യൂസർനെയിമും പാസ്‌വേഡും നൽകുക'
                  : 'Sign in with credentials to start kids learning tasks & 3D lessons'
                : isMalayalam
                ? 'സിലബസ്, എഐ ക്രമീകരണങ്ങൾ, കുട്ടികളുടെ പഠന വിശകലനം എന്നിവ നിയന്ത്രിക്കുക'
                : 'Manage textbooks, syllabus, Gemini API settings & learning insights'}
            </p>
          </div>
        </div>

        {/* Authentication Mode Switcher Tabs */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center space-x-1 text-xs font-black">
          <button
            type="button"
            onClick={() => {
              soundEffects.playPop();
              setAuthMode('credentials');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center space-x-1.5 transition ${
              authMode === 'credentials'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{isMalayalam ? 'പാസ്‌വേഡ് ലോഗിൻ' : 'Email / Password'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playPop();
              setAuthMode('pin');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center space-x-1.5 transition ${
              authMode === 'pin'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{isMalayalam ? '4-അക്ക പിൻ' : 'Quick PIN'}</span>
          </button>
        </div>

        {/* Error Alert Message */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-wiggle">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{isMalayalam ? 'വിജയകരമായി ലോഗിൻ ചെയ്തു!' : 'Login successful! Redirecting...'}</span>
          </div>
        )}

        {/* Mode 1: Credentials Form */}
        {authMode === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isMalayalam ? 'ഇമെയിൽ അല്ലെങ്കിൽ യൂസർനെയിം' : 'Email or Username'}</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={emailOrUser}
                  onChange={(e) => setEmailOrUser(e.target.value)}
                  placeholder="parent@littlegenius.ai or admin"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isMalayalam ? 'പാസ്‌വേഡ്' : 'Password'}</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-11 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer font-bold text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <span>{isMalayalam ? 'എന്നെ ഓർക്കുക' : 'Remember me'}</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  setAuthMode('pin');
                }}
                className="font-black text-indigo-600 hover:text-indigo-800 transition"
              >
                {isMalayalam ? 'പിൻ ഉപയോഗിക്കണോ?' : 'Use PIN instead?'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-sky-600 to-purple-600 hover:opacity-95 text-white font-black text-sm shadow-xl flex items-center justify-center space-x-2 transition btn-kid-3d disabled:opacity-50"
            >
              <span>
                {loading
                  ? isMalayalam
                    ? 'പരിശോധിക്കുന്നു...'
                    : 'Authenticating...'
                  : isMalayalam
                  ? 'പ്രവേശിക്കുക'
                  : 'Sign In to Learn'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Mode 2: Quick PIN Numpad */
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <p className="text-xs font-bold text-slate-500">
                {isMalayalam ? '4-അക്ക സുരക്ഷാ പിൻ നൽകുക' : 'Enter your 4-digit Security PIN'}
              </p>

              {/* PIN Bubbles Indicator */}
              <div className="flex justify-center space-x-3 py-1">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                      pin.length > idx
                        ? 'bg-indigo-600 border-indigo-600 scale-110 shadow-md'
                        : 'border-slate-300 bg-slate-50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Tactile Keypad */}
            <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handlePinDigit(digit)}
                  className="h-12 rounded-2xl bg-slate-50 hover:bg-indigo-50 border-2 border-slate-200 hover:border-indigo-300 text-lg font-black text-slate-800 transition active:scale-95 shadow-sm"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPin('')}
                className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-xs font-black text-slate-600 transition active:scale-95"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handlePinDigit('0')}
                className="h-12 rounded-2xl bg-slate-50 hover:bg-indigo-50 border-2 border-slate-200 hover:border-indigo-300 text-lg font-black text-slate-800 transition active:scale-95 shadow-sm"
              >
                0
              </button>
              <button
                type="button"
                onClick={handlePinBackspace}
                className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-xs font-black text-slate-600 transition active:scale-95"
              >
                ⌫
              </button>
            </div>
          </div>
        )}

        {/* Credentials Helper Box */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <div className="bg-indigo-50/70 border border-indigo-200/60 rounded-2xl p-2.5 text-[11px] font-bold text-slate-600 flex items-center justify-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span>
              {isMalayalam
                ? 'ഡെഫോൾട്ട് ക്രഡൻഷ്യൽ: admin / admin123 (അല്ലെങ്കിൽ പിൻ: 1234)'
                : 'Default: User: admin • Pass: admin123 • PIN: 1234'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

