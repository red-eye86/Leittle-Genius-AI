'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  Compass,
  Star,
  Send,
  Radio,
  Minimize2,
  Maximize2,
  Languages,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import LiveVoiceButton from './LiveVoiceButton';

interface JarvisMessage {
  id: string;
  sender: 'user' | 'chikoo';
  text: string;
  timestamp: number;
}

export default function ChikooJarvisWidget() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    activeChild,
    language,
    setLanguage,
    speak,
    stopSpeaking,
    isSpeaking,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [wakeWordEnabled, setWakeWordEnabled] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<JarvisMessage[]>([]);
  const [transcript, setTranscript] = useState('');

  const recognitionRef = useRef<any>(null);
  const wakeWordRecognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const isMalayalam = language === 'ml';

  // Initial welcome message from Chikoo
  useEffect(() => {
    const welcomeText = isMalayalam
      ? `നമസ്കാരം ${activeChild?.name || 'കൂട്ടുകാരാ'}! ഞാൻ നിങ്ങളുടെ സ്വന്തം ചിക്കു JARVIS! എന്ത് സഹായമാണ് വേണ്ടത്? 🐶🐾`
      : `Hello ${activeChild?.name || 'Champion'}! I am Chikoo, your personal AI JARVIS! Ask me anything or tell me where to go! 🐶🐾`;

    setMessages([
      {
        id: 'msg-welcome',
        sender: 'chikoo',
        text: welcomeText,
        timestamp: Date.now(),
      },
    ]);
  }, [activeChild?.name, isMalayalam]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // Execute Voice Navigation & App Commands (JARVIS Action Engine)
  const processJarvisCommand = async (rawQuery: string): Promise<boolean> => {
    const query = rawQuery.toLowerCase().trim();

    // 1. Language Toggle
    if (
      query.includes('switch to malayalam') ||
      query.includes('speak in malayalam') ||
      query.includes('മലയാളം പറയൂ') ||
      query.includes('മലയാളത്തിലേക്ക്')
    ) {
      setLanguage('ml');
      const reply = 'തീർച്ചയായും! ഇനി മുതൽ നമുക്ക് മലയാളത്തിൽ സംസാരിക്കാം!';
      addChikooReply(reply);
      speak(reply);
      return true;
    }

    if (
      query.includes('switch to english') ||
      query.includes('speak in english') ||
      query.includes('ഇംഗ്ലീഷിൽ പറയൂ') ||
      query.includes('change to english')
    ) {
      setLanguage('en');
      const reply = 'Sure thing! Switching to English. What would you like to explore?';
      addChikooReply(reply);
      speak(reply);
      return true;
    }

    // 2. Stars & Score Check
    if (
      query.includes('my stars') ||
      query.includes('my score') ||
      query.includes('how many stars') ||
      query.includes('എത്ര സ്റ്റാർ') ||
      query.includes('എന്റെ പോയിന്റ്')
    ) {
      const stars = activeChild?.stars || 0;
      const coins = activeChild?.coins || 0;
      const reply = isMalayalam
        ? `നിങ്ങൾ ഇതുവരെ ${stars} സ്റ്റാറുകളും ${coins} ജീനിയസ് കോയിനുകളും നേടിയിട്ടുണ്ട്! അടിപൊളി മിടുക്കൻ! 🌟`
        : `You have earned ${stars} golden stars and ${coins} genius coins! You are doing amazing! 🌟`;
      addChikooReply(reply);
      speak(reply);
      return true;
    }

    // 3. Navigation Commands
    if (
      query.includes('open science') ||
      query.includes('science class') ||
      query.includes('സയൻസ്')
    ) {
      const reply = isMalayalam
        ? 'നമുക്ക് സയൻസ് പാഠങ്ങൾ പഠിക്കാം! തുറക്കുന്നു...'
        : 'Opening Science chapters right now!';
      addChikooReply(reply);
      speak(reply);
      router.push('/child/chapters?subject=sub-c3-science');
      return true;
    }

    if (
      query.includes('open math') ||
      query.includes('maths') ||
      query.includes('കണക്ക്')
    ) {
      const reply = isMalayalam
        ? 'കണക്ക് പാഠങ്ങളിലേക്ക് പോകാം! തുറക്കുന്നു...'
        : 'Let us practice Mathematics! Opening now!';
      addChikooReply(reply);
      speak(reply);
      router.push('/child/chapters?subject=sub-c3-math');
      return true;
    }

    if (
      query.includes('open malayalam') ||
      query.includes('മലയാളം പാഠം')
    ) {
      const reply = 'മലയാളം പാഠങ്ങളിലേക്ക് സ്വാഗതം! തുറക്കുന്നു...';
      addChikooReply(reply);
      speak(reply);
      router.push('/child/chapters?subject=sub-c3-malayalam');
      return true;
    }

    if (
      query.includes('open english') ||
      query.includes('ഇംഗ്ലീഷ് പാഠം')
    ) {
      const reply = isMalayalam
        ? 'ഇംഗ്ലീഷ് പാഠങ്ങൾ തുറക്കുന്നു!'
        : 'Opening English lessons for you!';
      addChikooReply(reply);
      speak(reply);
      router.push('/child/chapters?subject=sub-c3-english');
      return true;
    }

    if (
      query.includes('3d classroom') ||
      query.includes('3d world') ||
      query.includes('3d ക്ലാസ്സ്')
    ) {
      const reply = isMalayalam
        ? '3D ക്ലാസ്സ് റൂമിലേക്ക് പോകാം! പ്ലാനറ്റുകളും സയൻസ് മോഡലുകളും കാണാം!'
        : 'Opening the 3D Classroom! Let us explore interactive models!';
      addChikooReply(reply);
      speak(reply);
      router.push('/child/world3d');
      return true;
    }

    if (
      query.includes('cartoon') ||
      query.includes('video') ||
      query.includes('കാർട്ടൂൺ')
    ) {
      const reply = isMalayalam
        ? 'നമുക്ക് ഒരു നല്ല കാർട്ടൂൺ പാഠം കാണാം!'
        : 'Taking you to animated cartoon lessons!';
      addChikooReply(reply);
      speak(reply);
      router.push('/child/cartoon');
      return true;
    }

    if (
      query.includes('games') ||
      query.includes('play game') ||
      query.includes('കളിക്കാം') ||
      query.includes('ഗെയിം')
    ) {
      const reply = isMalayalam
        ? 'നമുക്ക് രസകരമായ കളികളിലൂടെ പഠിക്കാം!'
        : 'Loading educational games and challenges!';
      addChikooReply(reply);
      speak(reply);
      router.push('/child/games');
      return true;
    }

    if (
      query.includes('story') ||
      query.includes('bedtime story') ||
      query.includes('കഥ')
    ) {
      const reply = isMalayalam
        ? 'നല്ലൊരു കഥ കേൾക്കാം! സ്റ്റോറി വേൾഡിലേക്ക് പോകുന്നു...'
        : 'Time for a wonderful story! Opening Story World...';
      addChikooReply(reply);
      speak(reply);
      router.push('/child/story');
      return true;
    }

    if (
      query.includes('quiz') ||
      query.includes('test me') ||
      query.includes('ക്വിസ്')
    ) {
      const reply = isMalayalam
        ? 'ക്വിസ് തുടങ്ങാം! നല്ല കുട്ടിയായി ഉത്തരം പറയൂ!'
        : 'Let us start a quick quiz challenge!';
      addChikooReply(reply);
      speak(reply);
      router.push('/child/quiz');
      return true;
    }

    if (
      query.includes('dashboard') ||
      query.includes('home') ||
      query.includes('ഡാഷ്‌ബോർഡ്')
    ) {
      const reply = isMalayalam ? 'ഡാഷ്‌ബോർഡിലേക്ക് പോകുന്നു...' : 'Heading back to your Dashboard!';
      addChikooReply(reply);
      speak(reply);
      router.push('/child/dashboard');
      return true;
    }

    if (
      query.includes('stop') ||
      query.includes('quiet') ||
      query.includes('നിർത്തൂ') ||
      query.includes('മിണ്ടരുത്')
    ) {
      stopSpeaking();
      return true;
    }

    return false; // Not a command, pass to Gemini Brain
  };

  const addChikooReply = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: 'chikoo',
        text,
        timestamp: Date.now(),
      },
    ]);
  };

  // Ask Gemini AI Brain for General Knowledge & Curriculum Q&A
  const handleUserMessage = async (queryText: string) => {
    if (!queryText.trim()) return;

    soundEffects.playPop();
    const userMsg: JarvisMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: queryText.trim(),
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Check if it's an actionable JARVIS command
    const handled = await processJarvisCommand(queryText);
    if (handled) return;

    // Pass to Gemini API
    setIsThinking(true);
    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: activeChild?.id || 'child-1',
          message: queryText,
          history: historyPayload,
          language: language,
          mode: 'explain',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.reply || (isMalayalam ? 'ഉത്തരം തയ്യാറാണ്!' : 'Here is what I found!');
        addChikooReply(reply);
        // Pure Gemini Voice Output across the application
        speak(reply);
      } else {
        const errReply = isMalayalam
          ? 'ക്ഷമിക്കണം കൂട്ടുകാരാ, എനിക്ക് മനസ്സിലാക്കാൻ കഴിഞ്ഞില്ല. വീണ്ടും ചോദിക്കാമോ?'
          : 'Sorry champion! Could you please ask that again?';
        addChikooReply(errReply);
        speak(errReply);
      }
    } catch (e) {
      const fallbackReply = isMalayalam
        ? 'ചിക്കു കേൾക്കുന്നുണ്ട്! ദയവായി ചോദ്യം ഒന്നുകൂടി പറയൂ.'
        : 'Chikoo is here! Please ask your question once more.';
      addChikooReply(fallbackReply);
      speak(fallbackReply);
    } finally {
      setIsThinking(false);
    }
  };

  // Direct Voice Input (Tap to Talk)
  const startDirectListening = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    stopSpeaking();
    soundEffects.playChime();

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = isMalayalam ? 'ml-IN' : 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const finalTranscript = event.results[i][0].transcript;
          setTranscript(finalTranscript);
          setIsListening(false);
          handleUserMessage(finalTranscript);
        } else {
          interim += event.results[i][0].transcript;
          setTranscript(interim);
        }
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopDirectListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Toggle Background "Hey Chikoo" Wake Word
  useEffect(() => {
    if (!wakeWordEnabled) {
      if (wakeWordRecognitionRef.current) {
        try {
          wakeWordRecognitionRef.current.abort();
        } catch (e) {}
        wakeWordRecognitionRef.current = null;
      }
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    let active = true;

    const startWakeWordListener = () => {
      if (!active) return;
      const recognizer = new SpeechRecognition();
      recognizer.continuous = true;
      recognizer.interimResults = false;
      recognizer.lang = isMalayalam ? 'ml-IN' : 'en-US';

      recognizer.onresult = (event: any) => {
        const lastIdx = event.results.length - 1;
        const text = (event.results[lastIdx][0].transcript || '').toLowerCase();

        if (
          text.includes('chikoo') ||
          text.includes('chiku') ||
          text.includes('chiko') ||
          text.includes('ചിക്കു') ||
          text.includes('ഹേയ് ചിക്കു') ||
          text.includes('hey chikoo')
        ) {
          soundEffects.playStar();
          setIsOpen(true);
          const wakeGreeting = isMalayalam
            ? 'ഹലോ! ചിക്കു കേൾക്കുന്നുണ്ട്, പറയൂ!'
            : 'Yes! Chikoo is listening, champion!';
          speak(wakeGreeting, () => {
            startDirectListening();
          });
        }
      };

      recognizer.onerror = () => {
        // Automatically restart wake word recognizer on error
        setTimeout(() => {
          if (active && wakeWordEnabled) startWakeWordListener();
        }, 1000);
      };

      recognizer.onend = () => {
        // Continuous loop
        if (active && wakeWordEnabled) {
          startWakeWordListener();
        }
      };

      try {
        recognizer.start();
        wakeWordRecognitionRef.current = recognizer;
      } catch (e) {}
    };

    startWakeWordListener();

    return () => {
      active = false;
      if (wakeWordRecognitionRef.current) {
        try {
          wakeWordRecognitionRef.current.abort();
        } catch (e) {}
        wakeWordRecognitionRef.current = null;
      }
    };
  }, [wakeWordEnabled, isMalayalam]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end select-none">
      {/* Expanded Holographic HUD */}
      {isOpen && (
        <div className="mb-3 w-[92vw] sm:w-[420px] max-h-[580px] bg-slate-900/95 backdrop-blur-xl border-2 sm:border-3 border-cyan-400 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white animate-fade-in ring-4 ring-cyan-500/20">
          {/* Top Bar */}
          <div className="px-4 py-3 bg-gradient-to-r from-indigo-900 via-sky-900 to-slate-900 border-b border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-cyan-400">
                <Image
                  src="/characters/chikoo.jpg"
                  alt="Chikoo"
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-black text-sm tracking-wide text-cyan-300">
                    CHIKOO JARVIS
                  </span>
                  <span className="text-[10px] bg-cyan-400/20 text-cyan-300 px-1.5 py-0.5 rounded-full font-bold">
                    AI v2.0
                  </span>
                </div>
                <p className="text-[10px] text-slate-300">
                  {isSpeaking
                    ? isMalayalam
                      ? 'സംസാരിക്കുന്നു... 🔊'
                      : 'Speaking with Gemini Voice... 🔊'
                    : isThinking
                    ? isMalayalam
                      ? 'ചിന്തിക്കുന്നു... ✨'
                      : 'Thinking with Gemini Brain... ✨'
                    : isListening
                    ? isMalayalam
                      ? 'കേൾക്കുന്നു... 🎙️'
                      : 'Listening to your voice... 🎙️'
                    : isMalayalam
                    ? 'തയ്യാറാണ് 🐶'
                    : 'Online & Ready 🐶'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              {/* ChatGPT Style Live Voice Mode Button */}
              <LiveVoiceButton size="sm" />

              {/* Language Switcher Pill */}
              <button
                onClick={() => {
                  const nextLang = isMalayalam ? 'en' : 'ml';
                  setLanguage(nextLang);
                  soundEffects.playPop();
                }}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-amber-300 flex items-center space-x-1 transition"
                title="Toggle Language"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>{isMalayalam ? 'മലയാളം' : 'English'}</span>
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  soundEffects.playPop();
                  setIsOpen(false);
                }}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Suggestion Chips */}
          <div className="px-3 py-2 bg-slate-950/50 border-b border-cyan-500/20 flex items-center space-x-1.5 overflow-x-auto text-[11px] font-bold no-scrollbar">
            <span className="text-slate-400 text-[10px] uppercase font-black tracking-wider flex-shrink-0">
              Try:
            </span>
            <button
              onClick={() => handleUserMessage(isMalayalam ? '3D ക്ലാസ്സ് റൂം തുറക്കൂ' : 'Open 3D Classroom')}
              className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-900 transition flex-shrink-0"
            >
              🚀 {isMalayalam ? '3D ക്ലാസ്സ്' : '3D Class'}
            </button>
            <button
              onClick={() => handleUserMessage(isMalayalam ? 'സയൻസ് പാഠം' : 'Open Science')}
              className="px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-200 hover:bg-purple-900 transition flex-shrink-0"
            >
              🔬 {isMalayalam ? 'സയൻസ്' : 'Science'}
            </button>
            <button
              onClick={() => handleUserMessage(isMalayalam ? 'എന്റെ സ്റ്റാർ എത്രയായി?' : 'How many stars do I have?')}
              className="px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-200 hover:bg-amber-900 transition flex-shrink-0"
            >
              ⭐ {isMalayalam ? 'സ്റ്റാർ' : 'Stars'}
            </button>
            <button
              onClick={() => handleUserMessage(isMalayalam ? 'ഒരു രസകരമായ കഥ പറയൂ' : 'Tell me a fun story')}
              className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 hover:bg-emerald-900 transition flex-shrink-0"
            >
              📖 {isMalayalam ? 'കഥ' : 'Story'}
            </button>
          </div>

          {/* Conversation Stream */}
          <div
            ref={chatScrollRef}
            className="flex-1 p-3.5 space-y-3 overflow-y-auto max-h-[300px] text-xs leading-relaxed"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-md ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-800 border border-cyan-500/40 text-slate-100 rounded-tl-none font-medium'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center space-x-2 text-cyan-400 font-bold animate-pulse text-xs">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>
                  {isMalayalam
                    ? 'ചിക്കു ജെമിനി തലച്ചോറിലൂടെ ചിന്തിക്കുന്നു...'
                    : 'Chikoo is thinking with Gemini Brain...'}
                </span>
              </div>
            )}

            {isListening && transcript && (
              <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-400/50 text-cyan-200 text-xs italic">
                &ldquo;{transcript}&rdquo;
              </div>
            )}
          </div>

          {/* Live Voice Indicator & Input Bar */}
          <div className="p-3 bg-slate-950 border-t border-cyan-500/30 space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUserMessage(inputText);
                }}
                placeholder={
                  isMalayalam
                    ? 'ചിക്കുവിനോട് എന്തും ചോദിക്കൂ അല്ലെങ്കിൽ പറയൂ...'
                    : 'Ask Chikoo anything or say a command...'
                }
                className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />

              {/* Exact ChatGPT Style Blue Waveform Button */}
              <LiveVoiceButton size="sm" />

              {/* Big Mic Button */}
              <button
                onClick={isListening ? stopDirectListening : startDirectListening}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition shadow-lg ${
                  isListening
                    ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse ring-2 ring-rose-400'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black'
                }`}
                title={isListening ? 'Listening...' : 'Tap to Speak'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Send Button */}
              <button
                onClick={() => handleUserMessage(inputText)}
                disabled={!inputText.trim()}
                className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white flex items-center justify-center transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bottom Wake Word Toggle & Voice Stop */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wakeWordEnabled}
                  onChange={(e) => setWakeWordEnabled(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <span className={wakeWordEnabled ? 'text-cyan-300 font-bold' : ''}>
                  Wake Word: &quot;Hey Chikoo&quot;
                </span>
              </label>

              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="flex items-center space-x-1 text-rose-400 hover:text-rose-300 font-bold"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>{isMalayalam ? 'നിർത്തൂ' : 'Stop Voice'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Chikoo Avatar Button */}
      <div className="relative group flex items-center space-x-2">
        {!isOpen && (
          <div
            onClick={() => {
              soundEffects.playPop();
              setIsOpen(true);
            }}
            className="hidden sm:flex items-center space-x-1.5 bg-slate-900/90 backdrop-blur-md border border-cyan-400 px-3 py-1.5 rounded-2xl shadow-xl text-cyan-300 text-xs font-black cursor-pointer hover:bg-slate-800 transition ring-2 ring-cyan-500/20 animate-bounce-gentle"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isMalayalam ? 'ഹേയ് ചിക്കു!' : 'Hey Chikoo! 🐾'}</span>
          </div>
        )}

        <button
          onClick={() => {
            soundEffects.playPop();
            setIsOpen((prev) => !prev);
          }}
          className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-3 sm:border-4 transition-all duration-300 shadow-2xl ${
            isOpen
              ? 'border-cyan-400 ring-4 ring-cyan-400/30 scale-105'
              : isSpeaking
              ? 'border-purple-400 ring-4 ring-purple-400/40 animate-pulse scale-105'
              : isListening
              ? 'border-rose-400 ring-4 ring-rose-400/40 animate-bounce scale-110'
              : 'border-cyan-400 hover:scale-110 ring-2 ring-indigo-300'
          }`}
          title="Chikoo JARVIS — Tap to interact!"
        >
          {/* Glowing pulse aura when speaking or listening */}
          {(isSpeaking || isListening) && (
            <div className="absolute inset-0 bg-cyan-400/30 animate-ping rounded-full pointer-events-none" />
          )}

          <Image
            src="/characters/chikoo.jpg"
            alt="Chikoo Personal JARVIS"
            fill
            sizes="64px"
            className="object-cover"
            priority
          />

          {/* Micro status badge */}
          <div
            className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-slate-900 ${
              isSpeaking
                ? 'bg-purple-500'
                : isListening
                ? 'bg-rose-500 animate-ping'
                : isThinking
                ? 'bg-amber-400 animate-spin'
                : 'bg-emerald-400'
            }`}
          />
        </button>
      </div>
    </div>
  );
}

