'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, VolumeX, Sparkles, BookOpen, RefreshCw, Mic } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import MascotOwl from '@/components/ui/MascotOwl';
import VoiceInput from '@/components/ui/VoiceInput';
import { soundEffects } from '@/lib/audio/soundEffects';

interface Message {
  id: string;
  sender: 'user' | 'chikoo';
  text: string;
  source?: { book: string; chapter: string } | null;
}

export default function AITeacherPage() {
  const { activeChild, language, t, speak, stopSpeaking, isSpeaking } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<string>('explain');
  const [autoVoice, setAutoVoice] = useState<boolean>(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isUKG = activeChild?.classGrade === 'UKG' || activeChild?.classGrade === 'LKG';

  const quickVoiceQuestions = isUKG
    ? [
        {
          en: 'Why is the sky blue?',
          ml: 'ആകാശം എന്തുകൊണ്ട് നീല നിറത്തിൽ കാണുന്നു?',
          emoji: '🌤️',
        },
        {
          en: 'What sound does Letter A make?',
          ml: 'A എന്ന അക്ഷരത്തിന്റെ ശബ്ദം എന്താണ്?',
          emoji: '🍎',
        },
        {
          en: 'Can we count 1 to 5 together?',
          ml: 'നമുക്ക് 1 മുതൽ 5 വരെ എണ്ണാമോ?',
          emoji: '🖐️',
        },
        {
          en: 'How do plants grow?',
          ml: 'ചെടികൾ എങ്ങനെയാണ് വളരുന്നത്?',
          emoji: '🌱',
        },
      ]
    : [
        {
          en: 'Why is the sky blue?',
          ml: 'ആകാശം എന്തുകൊണ്ട് നീല നിറത്തിൽ കാണുന്നു?',
          emoji: '🌤️',
        },
        {
          en: 'How many 5s are there in 20?',
          ml: 'How many 5s are there in 20?',
          displayMl: '20-ൽ എത്ര 5-കൾ ഉണ്ട്? (How many 5s in 20?)',
          emoji: '🔢',
        },
        {
          en: 'How do plants make their food?',
          ml: 'സസ്യങ്ങൾ എങ്ങനെയാണ് ആഹാരം പാകം ചെയ്യുന്നത്?',
          emoji: '🌱',
        },
        {
          en: 'Explain the Water Cycle like a story!',
          ml: 'ജലചക്രത്തെക്കുറിച്ച് പറഞ്ഞു തരാമോ?',
          emoji: '💧',
        },
      ];

  useEffect(() => {
    if (!activeChild) return;
    const welcomeMsg: Message = {
      id: 'welcome-1',
      sender: 'chikoo',
      text: isUKG
        ? language === 'ml'
          ? `ഹലോ ${activeChild.name}! 🐾 ഞാൻ നിന്റെ സ്വന്തം AI വോയ്സ് കൂട്ടുകാരൻ ചിക്കു (Chikoo) ആണ്! 🐶 മൈക്കിൽ തൊട്ട് എന്നോട് സംസാരിക്കാം, അല്ലെങ്കിൽ താഴെയുള്ള ചോദ്യങ്ങളിൽ തൊട്ട് ഉത്തരം കേൾക്കാം! 🎈`
          : `Hello ${activeChild.name}! 🐾 I'm your AI Voice Pet Buddy Chikoo! 🐶 You can ask me "Why is the sky blue?" or play with phonics and hear me explain aloud! 🎈`
        : language === 'ml'
        ? `നമസ്കാരം ${activeChild.name}! 🐾 ഞാൻ നിന്റെ സ്വന്തം AI വോയ്സ് കൂട്ടുകാരൻ ചിക്കു (Chikoo) ആണ്! 🐶 "ആകാശം എന്തുകൊണ്ട് നീല നിറത്തിൽ കാണുന്നു?" അല്ലെങ്കിൽ "20-ൽ എത്ര 5-കൾ ഉണ്ട്?" എന്ന് ചോദിച്ചു നോക്കൂ — ഞാൻ ശബ്ദത്തോടെ ലളിതമായി പറഞ്ഞുതരാം! ✨`
        : `Hi ${activeChild.name}! 🚀 I'm your AI Voice Pet Buddy Chikoo! 🐶 Ask me "Why is the sky blue?" or "How many 5s are there in 20?" and hear a simple, fun voice explanation!`,
    };
    setMessages([welcomeMsg]);
  }, [activeChild, language, isUKG]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading || !activeChild) return;

    soundEffects.playPop();
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: activeChild.id,
          message: text,
          mode,
          language,
          history: messages.slice(-4).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });

      const data = await res.json();
      if (data.reply) {
        soundEffects.playStar();
        const botMsg: Message = {
          id: `c-${Date.now()}`,
          sender: 'chikoo',
          text: data.reply,
          source: data.sourceContext,
        };
        setMessages((prev) => [...prev, botMsg]);
        if (autoVoice) {
          speak(data.reply);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const modes = [
    { id: 'explain', label: 'Simple Explanation', malayalamLabel: 'ലളിതമായി വിശദീകരിക്കൂ 📖', icon: '📖' },
    { id: 'story', label: 'Teach as Story', malayalamLabel: 'കഥയായി പറയൂ 🐾', icon: '🐾' },
    { id: 'homework', label: 'Homework Hints', malayalamLabel: 'ഹോംവർക്ക് സൂചന 💡', icon: '💡' },
    { id: 'questions', label: 'Quiz Me', malayalamLabel: 'ചോദ്യം ചോദിക്കൂ 🎯', icon: '🎯' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12 animate-fade-in">
      {/* Voice Teacher Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 rounded-4xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <MascotOwl size="md" speaking={loading || isSpeaking} />
            {isSpeaking && (
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-amber-400 text-slate-900 rounded-full text-[10px] font-black animate-bounce">
                🔊 Speaking
              </span>
            )}
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-100 bg-white/20 px-3 py-1 rounded-full">
              🎙️ Interactive AI Voice Teacher
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              {t('aiTeacher')}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-50 mt-0.5">
              {language === 'ml'
                ? 'ചോദ്യങ്ങൾ ചോദിക്കൂ, ലളിതമായ വിശദീകരണം ശബ്ദത്തോടെ കേൾക്കൂ!'
                : 'Ask questions by voice or tap below to hear simple spoken explanations!'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              setAutoVoice((prev) => !prev);
            }}
            className={`px-3.5 py-2.5 rounded-2xl text-xs font-black flex items-center space-x-1.5 transition ${
              autoVoice ? 'bg-amber-400 text-slate-900 shadow-md' : 'bg-white/20 text-white'
            }`}
          >
            {autoVoice ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{autoVoice ? 'Voice On 🔊' : 'Voice Muted'}</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playPop();
              stopSpeaking();
              setMessages((prev) => [prev[0]]);
            }}
            className="p-2.5 bg-white/20 hover:bg-white/30 rounded-2xl transition text-white"
            title="Reset Chat"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tap-to-Ask Quick Voice Prompts */}
      <div className="bg-emerald-50/80 border-2 border-emerald-200 rounded-3xl p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black uppercase text-emerald-800 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>
              {language === 'ml'
                ? 'ഒരു ചോദ്യത്തിൽ തൊട്ടുനോക്കൂ — ചിക്കു ശബ്ദത്തോടെ ഉത്തരം പറയും:'
                : 'Tap a question to hear Chikoo explain aloud:'}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickVoiceQuestions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(language === 'ml' ? item.ml : item.en)}
              disabled={loading}
              className="px-3.5 py-2 rounded-2xl bg-white hover:bg-emerald-500 hover:text-white text-slate-700 border-2 border-emerald-200 text-xs font-black transition shadow-sm flex items-center space-x-1.5"
            >
              <span>{item.emoji}</span>
              <span>
                {language === 'ml' ? (item as any).displayMl || item.ml : `"${item.en}"`}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mode Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              soundEffects.playPop();
              setMode(m.id);
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition flex items-center space-x-1.5 ${
              mode === m.id
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <span>{m.icon}</span>
            <span>{language === 'ml' ? m.malayalamLabel : m.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-4xl p-6 border-4 border-slate-200 shadow-sm min-h-[380px] max-h-[520px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isChikoo = msg.sender === 'chikoo';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                isChikoo ? 'justify-start' : 'justify-end flex-row-reverse space-x-reverse'
              }`}
            >
              {isChikoo ? (
                <div className="w-10 h-10 flex-shrink-0">
                  <MascotOwl size="sm" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-2xl bg-indigo-500 text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-sm">
                  {activeChild?.avatar?.startsWith('data:') ? '🧒' : activeChild?.avatar || '🧒'}
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 shadow-sm space-y-2 ${
                  isChikoo
                    ? 'bg-emerald-50 border-2 border-emerald-200 text-slate-800'
                    : 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white'
                }`}
              >
                <div className="text-sm sm:text-base font-semibold leading-relaxed whitespace-pre-line">
                  {msg.text}
                </div>

                {isChikoo && (
                  <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60 text-xs">
                    <button
                      onClick={() => speak(msg.text)}
                      className="px-3 py-1 rounded-xl bg-emerald-200/70 hover:bg-emerald-300 text-emerald-900 font-black flex items-center space-x-1 transition"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{language === 'ml' ? 'വീണ്ടും കേൾക്കാം 🔊' : 'Hear Explanation Aloud 🔊'}</span>
                    </button>

                    {msg.source && (
                      <span className="text-[10px] text-slate-400 font-bold flex items-center space-x-1">
                        <BookOpen className="w-3 h-3 text-emerald-500" />
                        <span className="truncate max-w-[150px]">{msg.source.book}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-3">
            <MascotOwl size="sm" speaking />
            <div className="bg-emerald-50 border-2 border-emerald-200 px-4 py-3 rounded-2xl text-xs font-bold text-emerald-800 animate-pulse">
              Chikoo is preparing your voice explanation... 🐶🔊
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box with Voice Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="bg-white rounded-3xl p-2 sm:p-3 border-4 border-emerald-300 shadow-md flex items-center space-x-2"
      >
        <VoiceInput
          onTranscript={(text) => {
            setInputText(text);
            handleSend(text);
          }}
        />

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            language === 'ml'
              ? 'ചോദിക്കൂ: "ആകാശം എന്തുകൊണ്ട് നീല നിറത്തിൽ കാണുന്നു?" അല്ലെങ്കിൽ മൈക്കിൽ തൊട്ട് സംസാരിക്കൂ...'
              : 'Ask "Why is the sky blue?" or "How many 5s are there in 20?"...'
          }
          className="flex-1 bg-transparent px-3 py-2 text-sm sm:text-base font-bold text-slate-800 outline-none placeholder:text-slate-400"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || loading}
          className="p-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-2xl font-bold shadow-md transition btn-kid-3d"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
