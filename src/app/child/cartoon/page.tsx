'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  Tv,
  Sparkles,
  BookOpen,
  Film,
  Users,
  Award,
  ChevronRight,
  Layers,
  HelpCircle,
  Box,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { CartoonVideoPlayer } from '@/components/cartoon/CartoonVideoPlayer';
import {
  CartoonEpisode,
  getOrCreateCartoonEpisode,
  FAMILY_CHARACTERS,
  PRESET_CARTOON_EPISODES,
} from '@/lib/cartoon/cartoonLessonData';
import { Textbook, TextbookChapter } from '@/lib/db/types';

function CartoonTheaterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterIdParam = searchParams.get('chapterId');
  const subjectIdParam = searchParams.get('subjectId');

  const { activeChild, language, setLanguage } = useApp();

  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [currentChapter, setCurrentChapter] = useState<TextbookChapter | null>(null);
  const [episode, setEpisode] = useState<CartoonEpisode | null>(null);
  const [loading, setLoading] = useState(true);

  // Load textbooks and resolve current chapter
  useEffect(() => {
    if (!activeChild) return;

    fetch(`/api/data/textbooks?childId=${activeChild.id}`)
      .then((res) => res.json())
      .then((data) => {
        const books = (data.textbooks || []) as Textbook[];
        setTextbooks(books);

        // Find chapter
        let foundChapter: TextbookChapter | null = null;
        if (chapterIdParam) {
          for (const b of books) {
            const chap = b.chapters?.find((c) => c.id === chapterIdParam);
            if (chap) {
              foundChapter = chap;
              break;
            }
          }
        }

        // Default to first chapter of first book (or KG2 GA Chapter 1 for UKG)
        if (!foundChapter && books.length > 0) {
          const defaultBook =
            books.find((b) => b.subjectId === subjectIdParam) ||
            books.find((b) => b.chapters && b.chapters.length > 0) ||
            books[0];
          if (defaultBook?.chapters?.length) {
            foundChapter = defaultBook.chapters[0];
          }
        }

        if (foundChapter) {
          setCurrentChapter(foundChapter);
          const ep = getOrCreateCartoonEpisode(
            foundChapter.id,
            foundChapter.title,
            foundChapter.summary,
            foundChapter.keyTerms
          );
          setEpisode(ep);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [activeChild, chapterIdParam, subjectIdParam]);

  const selectChapter = (chap: TextbookChapter) => {
    soundEffects.playPop();
    setCurrentChapter(chap);
    const ep = getOrCreateCartoonEpisode(chap.id, chap.title, chap.summary, chap.keyTerms);
    setEpisode(ep);
    router.replace(`/child/cartoon?chapterId=${chap.id}`);
  };

  if (!activeChild) return null;

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-6xl mx-auto">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-1.5 text-xs font-black text-slate-500 hover:text-slate-800 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ml' ? 'തിരികെ' : 'Back to Lessons'}</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 flex items-center space-x-1.5">
            <Tv className="w-4 h-4 text-rose-600" />
            <span>{language === 'ml' ? 'കാർട്ടൂൺ തീയേറ്റർ' : 'Family Cartoon Theater'}</span>
          </span>
        </div>
      </div>

      {/* Main Banner */}
      <div className="relative rounded-4xl p-6 sm:p-8 overflow-hidden text-white shadow-xl bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block backdrop-blur-md">
              🎬 {activeChild.name}’s Learning Cinema
            </span>
            <h1 className="text-2xl sm:text-4xl font-black mt-2 leading-tight">
              {language === 'ml'
                ? 'കുടുംബത്തോടൊപ്പം കാർട്ടൂൺ പാഠങ്ങൾ കാണാം!'
                : 'Watch & Learn with Cartoon Family Stories!'}
            </h1>
            <p className="text-xs sm:text-sm text-purple-100 mt-2 font-medium">
              {language === 'ml'
                ? 'പപ്പ മനോജും മമ്മി ടെസ്സിയും ചേട്ടൻ ഏദ്രിക്കും ഫൈദാനും ചേർന്ന് എല്ലാ പാഠങ്ങളും കഥയിലൂടെ പറഞ്ഞുതരുന്നു!'
                : 'Starring Papa Manoj, Mummy Tessy, Big Brother Eadrick, and Little Faidan! Every school lesson comes alive in animated family adventures!'}
            </p>
          </div>

          {/* Quick Family Avatars cluster */}
          <div className="flex items-center -space-x-3 bg-white/10 backdrop-blur-md p-2 rounded-3xl border border-white/20 shadow-inner flex-shrink-0">
            {Object.values(FAMILY_CHARACTERS).map((char) => (
              <div
                key={char.id}
                className="relative w-12 h-14 sm:w-14 sm:h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md hover:scale-110 transition duration-200"
                title={`${char.name} (${char.role})`}
              >
                <Image src={char.avatarUrl} alt={char.name} fill className="object-cover object-top" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Cartoon Video Player */}
      {episode ? (
        <div className="space-y-4">
          <CartoonVideoPlayer
            episode={episode}
            language={language}
            onLanguageChange={(newLang) => setLanguage(newLang)}
            onComplete={() => {
              soundEffects.playLevelUp();
            }}
          />

          {/* Quick Chapter Action Shortcuts */}
          {currentChapter && (
            <div className="bg-white rounded-3xl p-4 border-2 border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-black text-slate-800">
                  {language === 'ml' ? currentChapter.malayalamTitle : currentChapter.title}
                </span>
              </div>

              <div className="flex items-center space-x-2 flex-wrap">
                <button
                  onClick={() => router.push(`/child/lesson?chapterId=${currentChapter.id}`)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Teach Me Lesson</span>
                </button>
                <button
                  onClick={() => router.push(`/child/flashcards?chapterId=${currentChapter.id}`)}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center space-x-1"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Flashcards</span>
                </button>
                <button
                  onClick={() => router.push(`/child/world3d?chapterId=${currentChapter.id}`)}
                  className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs flex items-center space-x-1"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Explore 3D</span>
                </button>
                <button
                  onClick={() => router.push(`/child/quiz?chapterId=${currentChapter.id}`)}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center space-x-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Quiz</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-slate-200">
          <p className="text-base font-bold text-slate-600">Loading cartoon episode...</p>
        </div>
      )}

      {/* Meet the Family Characters Cast */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-black text-slate-800">
              {language === 'ml' ? 'നമ്മുടെ കാർട്ടൂൺ കുടുംബാംഗങ്ങൾ' : 'Meet The Cartoon Family Stars'}
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400">5 Loving Family Voices</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.values(FAMILY_CHARACTERS).map((char) => (
            <div
              key={char.id}
              className="bg-white rounded-3xl p-4 border-2 border-slate-200 hover:border-indigo-400 shadow-sm transition space-y-3 flex flex-col items-center text-center card-kid-hover"
            >
              <div className="relative w-24 h-32 rounded-2xl overflow-hidden shadow-md border-2 border-white ring-2 ring-indigo-200 flex-shrink-0">
                <Image src={char.avatarUrl} alt={char.name} fill className="object-cover object-top" />
              </div>

              <div>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${char.badgeColor}`}>
                  {language === 'ml' ? char.malayalamName : char.name}
                </span>
                <h4 className="text-xs font-bold text-slate-700 mt-1">
                  {language === 'ml' ? char.malayalamRole : char.role}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 italic leading-tight">{char.tagline}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Episode Selector / Browse All Chapters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Film className="w-5 h-5 text-rose-600" />
            <h2 className="text-xl font-black text-slate-800">
              {language === 'ml' ? 'മറ്റ് കാർട്ടൂൺ എപ്പിസോഡുകൾ' : 'Explore All Cartoon Episodes'}
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400">Pick any chapter to watch!</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {textbooks.map((book) =>
            book.chapters?.map((chap) => {
              const isActive = currentChapter?.id === chap.id;
              const hasPreset = Boolean(PRESET_CARTOON_EPISODES[chap.id]);
              return (
                <div
                  key={chap.id}
                  onClick={() => selectChapter(chap)}
                  className={`p-4 rounded-3xl border-3 cursor-pointer transition flex items-start space-x-3 ${
                    isActive
                      ? 'bg-rose-50 border-rose-500 shadow-md ring-2 ring-rose-200'
                      : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm flex-shrink-0 shadow-inner ${
                      isActive ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {chap.chapterNumber}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider truncate">
                        {book.title.split(':')[0]}
                      </span>
                      {hasPreset && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800">
                          Featured
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-black text-slate-800 truncate mt-0.5">
                      {language === 'ml' ? chap.malayalamTitle : chap.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {language === 'ml' ? chap.malayalamSummary : chap.summary}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default function CartoonPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-bold">Loading Cartoon Theater...</div>}>
      <CartoonTheaterContent />
    </Suspense>
  );
}

