'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RefreshCw, Volume2, CheckCircle2, HelpCircle } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { TextbookChapter, Subject } from '@/lib/db/types';

interface ChapterQuestGameProps {
  chapter?: TextbookChapter | null;
  subject?: Subject | null;
}

interface MatchPair {
  id: string;
  term: string;
  clue: string;
  emoji: string;
}

function getEmojiForTerm(term: string, idx: number): string {
  const t = term.toLowerCase();
  if (t.includes('history') || t.includes('monument') || t.includes('heritage')) return '🏛️';
  if (t.includes('coin')) return '🪙';
  if (t.includes('manuscript') || t.includes('inscript')) return '📜';
  if (t.includes('archaeolog') || t.includes('historian')) return '🔍';
  if (t.includes('almanac') || t.includes('calendar') || t.includes('timeline')) return '📅';
  if (t.includes('citizen') || t.includes('democracy') || t.includes('constitution')) return '🇮🇳';
  if (t.includes('earth') || t.includes('globe') || t.includes('rotation')) return '🌍';
  if (t.includes('himalaya') || t.includes('mountain') || t.includes('plateau')) return '🏔️';
  if (t.includes('compass') || t.includes('map') || t.includes('atlas')) return '🧭';
  if (t.includes('monsoon') || t.includes('rain') || t.includes('water')) return '🌧️';
  if (t.includes('soil') || t.includes('forest') || t.includes('plant') || t.includes('photosynthesis')) return '🌳';
  if (t.includes('crop') || t.includes('kharif') || t.includes('rabi') || t.includes('agriculture')) return '🌾';
  if (t.includes('highway') || t.includes('metro') || t.includes('transport')) return '🚆';
  if (t.includes('satellite')) return '🛰️';
  if (t.includes('pollution') || t.includes('recycle') || t.includes('biodegradable')) return '♻️';
  if (t.includes('tooth') || t.includes('incisor') || t.includes('molar') || t.includes('enamel')) return '🦷';
  if (t.includes('nutrient') || t.includes('protein') || t.includes('vitamin') || t.includes('diet')) return '🥗';
  if (t.includes('fraction') || t.includes('numerator')) return '🍕';
  if (t.includes('apple')) return '🍎';
  if (t.includes('ball')) return '⚽';
  if (t.includes('cat')) return '🐱';
  if (t.includes('dog')) return '🐶';
  if (t.includes('elephant')) return '🐘';
  // Coding & AI
  if (t.includes('bit') || t.includes('byte') || t.includes('ram') || t.includes('rom') || t.includes('memory') || t.includes('disk')) return '💾';
  if (t.includes('robot') || t.includes('ai') || t.includes('artificial') || t.includes('sensor')) return '🤖';
  if (t.includes('code') || t.includes('program') || t.includes('loop') || t.includes('algorithm') || t.includes('flowchart') || t.includes('sprite')) return '💻';
  if (t.includes('window') || t.includes('desktop') || t.includes('folder') || t.includes('file')) return '📁';
  // Moral & Values
  if (t.includes('gratitude') || t.includes('prayer') || t.includes('bless') || t.includes('god')) return '🙏';
  if (t.includes('kind') || t.includes('love') || t.includes('heart') || t.includes('peace') || t.includes('care')) return '❤️';
  if (t.includes('truth') || t.includes('honest') || t.includes('courage') || t.includes('forgive')) return '🛡️';
  if (t.includes('friend') || t.includes('family') || t.includes('share') || t.includes('help')) return '🤝';
  // English Literature
  if (t.includes('garden') || t.includes('flower') || t.includes('rose')) return '🌹';
  if (t.includes('key')) return '🗝️';
  if (t.includes('king') || t.includes('prince') || t.includes('queen') || t.includes('palace')) return '👑';
  if (t.includes('magic') || t.includes('fairy') || t.includes('wizard')) return '🪄';
  if (t.includes('book') || t.includes('story') || t.includes('poem') || t.includes('tale')) return '📖';
  // Hindi
  if (t.includes('पर्वत') || t.includes('शीश') || t.includes('पहाड़')) return '🏔️';
  if (t.includes('सागर') || t.includes('तरंग') || t.includes('नदी')) return '🌊';
  if (t.includes('बीरबल') || t.includes('अकबर') || t.includes('राजा')) return '👑';
  if (t.includes('खटोला') || t.includes('हवाई') || t.includes('उड़न') || t.includes('विमान')) return '🪶';
  if (t.includes('पेड़') || t.includes('वृक्ष') || t.includes('फल')) return '🌳';
  if (t.includes('सच्च') || t.includes('मित्र') || t.includes('दोस्त')) return '🤝';
  const fallback = ['🌟', '🎯', '🧩', '🚀', '💡', '🏆'];
  return fallback[idx % fallback.length];
}

export default function ChapterQuestGame({ chapter, subject }: ChapterQuestGameProps) {
  const { language, speak, addStars } = useApp();

  const [pairs, setPairs] = useState<MatchPair[]>([]);
  const [shuffledClues, setShuffledClues] = useState<MatchPair[]>([]);
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<boolean>(false);

  const initQuest = () => {
    if (!chapter) return;

    const terms = chapter.keyTerms && chapter.keyTerms.length > 0 ? chapter.keyTerms : ['Concept 1', 'Concept 2', 'Concept 3'];
    const topics = chapter.topics && chapter.topics.length > 0 ? chapter.topics : [chapter.title];

    const builtPairs: MatchPair[] = terms.slice(0, 5).map((term, idx) => {
      const matchingTopic =
        topics.find((top) => top.toLowerCase().includes(term.toLowerCase())) ||
        topics[idx % topics.length] ||
        chapter.summary;

      return {
        id: `pair-${idx}`,
        term,
        clue: matchingTopic,
        emoji: getEmojiForTerm(term, idx),
      };
    });

    setPairs(builtPairs);
    setShuffledClues([...builtPairs].sort(() => Math.random() - 0.5));
    setSelectedTermId(builtPairs[0]?.id || null);
    setMatchedIds([]);
    setWrongPair(false);
  };

  useEffect(() => {
    initQuest();
  }, [chapter?.id]);

  if (!chapter) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center border-2 border-slate-200 font-bold text-slate-500">
        Select a chapter above to play the Chapter Concept Matcher!
      </div>
    );
  }

  const handleSelectTerm = (pair: MatchPair) => {
    if (matchedIds.includes(pair.id)) return;
    soundEffects.playPop();
    setSelectedTermId(pair.id);
    speak(pair.term);
  };

  const handleSelectClue = (cluePair: MatchPair) => {
    if (matchedIds.includes(cluePair.id) || !selectedTermId) return;

    if (cluePair.id === selectedTermId) {
      soundEffects.playCorrect();
      const nextMatched = [...matchedIds, cluePair.id];
      setMatchedIds(nextMatched);
      setWrongPair(false);

      speak(
        language === 'ml'
          ? `വളരെ ശരി! ${cluePair.term} — ${cluePair.clue}`
          : `Correct match! ${cluePair.term} matches ${cluePair.clue}`
      );

      // Auto-select next unmatched term
      const remaining = pairs.find((p) => !nextMatched.includes(p.id));
      setSelectedTermId(remaining?.id || null);

      if (nextMatched.length === pairs.length) {
        soundEffects.playStar();
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        addStars(5);
      }
    } else {
      soundEffects.playIncorrect();
      setWrongPair(true);
      setTimeout(() => setWrongPair(false), 700);
    }
  };

  const isCompleted = pairs.length > 0 && matchedIds.length === pairs.length;

  return (
    <div className="bg-white rounded-4xl p-6 sm:p-8 border-4 border-purple-400 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-purple-100 pb-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-purple-100 text-purple-700">
            {subject?.icon || '🎯'} {language === 'ml' ? subject?.malayalamName : subject?.name} • Ch {chapter.chapterNumber} Game
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-1.5">
            🧩 {language === 'ml' ? 'പാഠഭാഗം പദ-ആശയ മാച്ചിംഗ് ഗെയിം' : `Chapter Concept Matcher: ${chapter.title}`}
          </h3>
          <p className="text-xs font-bold text-slate-500 mt-0.5">
            {language === 'ml'
              ? 'ഇടതുവശത്തെ പ്രധാന പദത്തിൽ തൊട്ട് വലതുവശത്തെ ശരിയായ പാഠഭാഗ ആശയവുമായി യോജിപ്പിക്കുക!'
              : 'Step 1: Tap a Key Term on the left → Step 2: Tap its matching Chapter Topic on the right!'}
          </p>
        </div>

        <button
          onClick={initQuest}
          className="px-4 py-2.5 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-black text-xs flex items-center space-x-1.5 self-start sm:self-auto shrink-0 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{language === 'ml' ? 'വീണ്ടും കളിക്കാം' : 'Shuffle Game'}</span>
        </button>
      </div>

      {/* Matching Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Chapter Key Terms */}
        <div className="space-y-2.5">
          <p className="text-xs font-black uppercase text-purple-700 tracking-wider">
            1. {language === 'ml' ? 'പ്രധാന പദങ്ങൾ (Key Terms):' : 'Chapter Key Terms (Tap to Select):'}
          </p>
          {pairs.map((p) => {
            const isMatched = matchedIds.includes(p.id);
            const isSelected = selectedTermId === p.id;
            return (
              <button
                key={p.id}
                disabled={isMatched}
                onClick={() => handleSelectTerm(p)}
                className={`w-full p-4 rounded-2xl border-2 text-left font-black text-sm sm:text-base flex items-center justify-between transition ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800 opacity-75'
                    : isSelected
                    ? 'bg-purple-600 text-white border-purple-700 shadow-lg scale-[1.02]'
                    : 'bg-slate-50 hover:bg-purple-50 text-slate-800 border-slate-200'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <span className="text-2xl">{p.emoji}</span>
                  <span>{p.term}</span>
                </span>
                {isMatched ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <Volume2 className="w-4 h-4 opacity-75 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Column: Chapter Topic Clues */}
        <div className="space-y-2.5">
          <p className="text-xs font-black uppercase text-indigo-700 tracking-wider">
            2. {language === 'ml' ? 'പാഠഭാഗ ആശയങ്ങൾ (Match Topic Clue):' : 'Matching Chapter Topics (Tap Match):'}
          </p>
          {shuffledClues.map((c) => {
            const isMatched = matchedIds.includes(c.id);
            return (
              <button
                key={c.id}
                disabled={isMatched}
                onClick={() => handleSelectClue(c)}
                className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-xs sm:text-sm flex items-center justify-between transition ${
                  isMatched
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                    : wrongPair
                    ? 'bg-rose-50 border-rose-300 text-slate-800'
                    : 'bg-indigo-50/70 hover:bg-indigo-100 text-slate-800 border-indigo-200 shadow-sm'
                }`}
              >
                <span className="leading-snug pr-2">{c.clue}</span>
                {isMatched ? (
                  <span className="text-xs font-black bg-emerald-600 text-white px-2.5 py-1 rounded-xl shrink-0">
                    ✓ {c.term}
                  </span>
                ) : (
                  <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl p-6 text-center shadow-lg animate-bounce-gentle">
          <Sparkles className="w-10 h-10 text-yellow-300 mx-auto mb-2" />
          <h4 className="text-2xl font-black">
            {language === 'ml'
              ? `അഭിനന്ദനങ്ങൾ! "${chapter.malayalamTitle}" ഗെയിം പൂർത്തിയാക്കി!`
              : `Champion! You Mastered "${chapter.title}"!`}
          </h4>
          <p className="text-sm font-bold text-emerald-100 mt-1">
            +5 Golden Stars Added to Your Profile! ⭐⭐⭐⭐⭐
          </p>
        </div>
      )}
    </div>
  );
}

