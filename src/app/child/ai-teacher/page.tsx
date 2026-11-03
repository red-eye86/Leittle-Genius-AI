'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, Sparkles, Bot, BookOpen, RefreshCw } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import MascotOwl from '@/components/ui/MascotOwl';
import VoiceInput from '@/components/ui/VoiceInput';
import { soundEffects } from '@/lib/audio/soundEffects';

interface Message {
  id: string;
  sender: 'user' | 'hootie';
  text: string;
  source?: { book: string; chapter: string } | null;
}

export default function AITeacherPage() {
  const { activeChild, language, t, speak } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<string>('explain');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeChild) return;
    const isUKG = activeChild.classGrade === 'UKG';
    const welcomeMsg: Message = {
      id: 'welcome-1',
      sender: 'hootie',
      text: isUKG
        ? language === 'ml'
          ? `ഹലോ ${activeChild.name}! ഞാൻ ഹുട്ടി ടീച്ചറാണ്! 🍎 ഇന്ന് നമുക്ക് എന്ത് പാട്ടാണ് പാടേണ്ടത്? അക്ഷരങ്ങളോ സംഖ്യകളോ?`
          : `Hello ${activeChild.name}! 🦉 I'm Teacher Hootie! Shall we play with letter sounds or count shiny apples today? 🎈`
        : language === 'ml'
        ? `നമസ്കാരം ${activeChild.name}! ഞാൻ നിന്റെ പഠന സഹായിയായ ഹുട്ടി ടീച്ചറാണ്! സ്കൂൾ പാഠപുസ്തകത്തിലെ ഏത് സംശയവും എന്നോട് ചോദിക്കാം. നമുക്ക് അത് കഥയായും ഉദാഹരണങ്ങളായും പഠിക്കാം! ✨`
        : `Hi ${activeChild.name}! 🚀 I'm your AI teacher Hootie! Ask me anything from your science or math textbook, and I'll explain it with real-life examples and fun stories!`,
    };
    setMessages([welcomeMsg]);
  }, [activeChild, language]);

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
          id: `h-${Date.now()}`,
          sender: 'hootie',
          text: data.reply,
          source: data.sourceContext,
        };
        setMessages((prev) => [...prev, botMsg]);
        speak(data.reply);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const modes = [
    { id: 'explain', label: 'Explain Lesson', malayalamLabel: 'വിശദീകരിക്കൂ 📖', icon: '📖' },
    { id: 'story', label: 'Teach as Story', malayalamLabel: 'കഥയായി പറയൂ 🐾', icon: '🐾' },
    { id: 'homework', label: 'Homework Hints', malayalamLabel: 'ഹോംവർക്ക് സൂചന 💡', icon: '💡' },
    { id: 'questions', label: 'Ask Me Questions', malayalamLabel: 'ചോദ്യം ചോദിക്കൂ 🎯', icon: '🎯' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-4xl p-6 sm:p-8 text-white shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <MascotOwl size="md" speaking={loading} />
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-200 bg-white/20 px-3 py-1 rounded-full">
              Personalized AI Teacher
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              {t('aiTeacher')}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
              {language === 'ml'
                ? 'നിങ്ങളുടെ ചോദ്യങ്ങൾക്ക് സ്നേഹത്തോടെ ഉത്തരം നൽകുന്നു'
                : 'Patient, encouraging, and syllabus-grounded tutoring'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundEffects.playPop();
            setMessages((prev) => [prev[0]]);
          }}
          className="p-2.5 bg-white/20 hover:bg-white/30 rounded-2xl transition text-white"
          title="Clear Conversation"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
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
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <span>{m.icon}</span>
            <span>{language === 'ml' ? m.malayalamLabel : m.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-4xl p-6 border-4 border-slate-200 shadow-sm min-h-[420px] max-h-[550px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isHootie = msg.sender === 'hootie';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isHootie ? 'justify-start' : 'justify-end flex-row-reverse space-x-reverse'}`}
            >
              {isHootie ? (
                <div className="w-10 h-10 flex-shrink-0">
                  <MascotOwl size="sm" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-2xl bg-indigo-500 text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-sm">
                  {activeChild?.avatar || '🧒'}
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 shadow-sm space-y-2 ${
                  isHootie
                    ? 'bg-emerald-50 border-2 border-emerald-200 text-slate-800'
                    : 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white'
                }`}
              >
                <div className="text-sm sm:text-base font-semibold leading-relaxed whitespace-pre-line">
                  {msg.text}
                </div>

                {isHootie && (
                  <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60 text-xs">
                    <button
                      onClick={() => speak(msg.text)}
                      className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center space-x-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{language === 'ml' ? 'ശബ്ദം' : 'Listen'}</span>
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
              Hootie is thinking... 🦉✨
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
              ? 'ഹുട്ടിയോട് എന്തെങ്കിലും ചോദിക്കൂ... (അല്ലെങ്കിൽ മൈക്ക് അമർത്തി സംസാരിക്കൂ)'
              : 'Ask Hootie anything... or tap the mic to speak!'
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

