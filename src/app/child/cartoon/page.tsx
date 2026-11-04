'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NetlifyImage from '@/components/ui/NetlifyImage';
import {
  ArrowLeft,
  Tv,
  Sparkles,
  BookOpen,
  Film,
  Users,
  Award,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Layers,
  HelpCircle,
  Box,
  Filter,
  CheckCircle2,
  PlayCircle,
  RotateCcw,
  Check,
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
import { Subject, Textbook, TextbookChapter } from '@/lib/db/types';

function CartoonTheaterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterIdParam = searchParams.get('chapterId');
  const subjectIdParam = searchParams.get('subjectId');

  const { activeChild, language, setLanguage } = useApp();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [currentChapter, setCurrentChapter] = useState<TextbookChapter | null>(null);
  const [episode, setEpisode] = useState<CartoonEpisode | null>(null);
  const [loading, setLoading] = useState(true);
  const [watchedChapterIds, setWatchedChapterIds] = useState<Set<string>>(new Set());
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});

  const isSubjectExpanded = (subId: string) => {
    // Hidden / collapsed by default. Only expanded when explicitly toggled or chosen via filter
    return expandedSubjects[subId] === true;
  };

  const toggleSubjectExpanded = (subId: string) => {
    soundEffects.playPop();
    setExpandedSubjects((prev) => ({
      ...prev,
      [subId]: !prev[subId],
    }));
  };

  // Load watched chapters from localStorage when active child changes
  useEffect(() => {
    if (!activeChild) return;
    try {
      const key = `little_genius_watched_cartoons_${activeChild.id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWatchedChapterIds(new Set(parsed));
          return;
        }
      }
    } catch (err) {
      console.error('Error reading watched cartoons from localStorage:', err);
    }
    setWatchedChapterIds(new Set());
  }, [activeChild?.id]);

  // Mark or unmark a chapter as watched
  const markChapterWatched = (chapterId: string, watched = true) => {
    if (!activeChild) return;
    setWatchedChapterIds((prev) => {
      const next = new Set(prev);
      if (watched) {
        next.add(chapterId);
      } else {
        next.delete(chapterId);
      }
      try {
        const key = `little_genius_watched_cartoons_${activeChild.id}`;
        localStorage.setItem(key, JSON.stringify(Array.from(next)));
      } catch (err) {
        console.error('Error saving watched cartoons:', err);
      }
      return next;
    });
  };

  const toggleChapterWatched = (chapterId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEffects.playPop();
    const isCurrentlyWatched = watchedChapterIds.has(chapterId);
    markChapterWatched(chapterId, !isCurrentlyWatched);
  };

  // Load subjects, textbooks, and resolve active chapter
  useEffect(() => {
    if (!activeChild) return;

    Promise.all([
      fetch(`/api/data/subjects?childId=${activeChild.id}`).then((res) => res.json()),
      fetch(`/api/data/textbooks?childId=${activeChild.id}`).then((res) => res.json()),
    ])
      .then(([subData, tbData]) => {
        const subs = (subData.subjects || []) as Subject[];
        const books = (tbData.textbooks || []) as Textbook[];
        setSubjects(subs);
        setTextbooks(books);

        // Find chapter from query param
        let foundChapter: TextbookChapter | null = null;
        let foundSubjectId = 'all';

        if (chapterIdParam) {
          for (const b of books) {
            const chap = b.chapters?.find((c) => c.id === chapterIdParam);
            if (chap) {
              foundChapter = chap;
              foundSubjectId = b.subjectId;
              break;
            }
          }
        }

        // Default fallback if no param or chapter not found
        if (!foundChapter && books.length > 0) {
          const defaultBook =
            books.find((b) => b.subjectId === subjectIdParam) ||
            books.find((b) => b.chapters && b.chapters.length > 0) ||
            books[0];
          if (defaultBook?.chapters?.length) {
            foundChapter = defaultBook.chapters[0];
            foundSubjectId = defaultBook.subjectId;
          }
        }

        const learnerId: 'eadrick' | 'faidan' = activeChild.id === 'child-2' || activeChild.classGrade === 'UKG' ? 'faidan' : 'eadrick';

        if (foundChapter) {
          setCurrentChapter(foundChapter);
          const ep = getOrCreateCartoonEpisode(
            foundChapter.id,
            foundChapter.title,
            foundChapter.summary,
            foundChapter.keyTerms,
            learnerId
          );
          setEpisode(ep);
        } else {
          setCurrentChapter(null);
          setEpisode(null);
        }

        if (subjectIdParam) {
          setSelectedSubjectFilter(subjectIdParam);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading cartoon catalog:', err);
        setLoading(false);
      });
  }, [activeChild, chapterIdParam, subjectIdParam]);

  const selectChapter = (chap: TextbookChapter, subjectId?: string) => {
    soundEffects.playPop();
    setCurrentChapter(chap);
    const learnerId: 'eadrick' | 'faidan' = activeChild?.id === 'child-2' ? 'faidan' : 'eadrick';
    const ep = getOrCreateCartoonEpisode(chap.id, chap.title, chap.summary, chap.keyTerms, learnerId);
    setEpisode(ep);
    router.replace(`/child/cartoon?chapterId=${chap.id}${subjectId ? `&subjectId=${subjectId}` : ''}`);

    // Scroll smoothly to video player
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!activeChild) return null;

  // Calculate total episodes count
  const totalEpisodesCount = textbooks.reduce((acc, b) => acc + (b.chapters?.length || 0), 0);

  // Find next chapter in the current textbook or curriculum
  const getNextChapter = (): { chapter: TextbookChapter; subjectId: string } | null => {
    if (!currentChapter || textbooks.length === 0) return null;

    for (let bIdx = 0; bIdx < textbooks.length; bIdx++) {
      const book = textbooks[bIdx];
      if (!book.chapters) continue;
      const cIdx = book.chapters.findIndex((c) => c.id === currentChapter.id);
      if (cIdx !== -1) {
        // Next chapter in the same textbook
        if (cIdx < book.chapters.length - 1) {
          return { chapter: book.chapters[cIdx + 1], subjectId: book.subjectId };
        }
        // Last chapter of this book, move to next book if available
        if (bIdx < textbooks.length - 1) {
          const nextBook = textbooks[bIdx + 1];
          if (nextBook.chapters && nextBook.chapters.length > 0) {
            return { chapter: nextBook.chapters[0], subjectId: nextBook.subjectId };
          }
        }
      }
    }
    return null;
  };

  const nextChapInfo = getNextChapter();

  const handleNextEpisodeOrContinue = () => {
    soundEffects.playLevelUp();
    if (currentChapter) {
      markChapterWatched(currentChapter.id, true);
    }
    if (nextChapInfo) {
      selectChapter(nextChapInfo.chapter, nextChapInfo.subjectId);
    } else {
      // Last chapter reached, scroll down to catalog so user can explore other subjects
      const el = document.getElementById('episodes-catalog');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (typeof window !== 'undefined') {
        window.scrollBy({ top: 400, behavior: 'smooth' });
      }
    }
  };

  // Filter books by subject filter
  const visibleSubjects = subjects.filter((sub) => {
    if (selectedSubjectFilter === 'all') return true;
    return sub.id === selectedSubjectFilter;
  });

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
          {/* Watched progress count badge */}
          <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1.5 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              {watchedChapterIds.size} / {totalEpisodesCount} {language === 'ml' ? 'കണ്ടു കഴിഞ്ഞു' : 'Watched'}
            </span>
          </span>

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
              🎬 {activeChild.name}’s Animated Cinema
            </span>
            <h1 className="text-2xl sm:text-4xl font-black mt-2 leading-tight">
              {language === 'ml'
                ? 'വിഷയാടിസ്ഥാനത്തിൽ കാർട്ടൂൺ പാഠങ്ങൾ കാണാം!'
                : 'Subject-Wise Cartoon Animated Episodes!'}
            </h1>
            <p className="text-xs sm:text-sm text-purple-100 mt-2 font-medium">
              {language === 'ml'
                ? 'ഓരോ വിഷയത്തിലെയും എല്ലാ പാഠങ്ങളും പ്രത്യേകം കാറ്റഗറിയായി ക്രമീകരിച്ചിരിക്കുന്നു. കാണാൻ ആഗ്രഹിക്കുന്ന വിഷയം തിരഞ്ഞെടുക്കൂ!'
                : 'Every lesson from your school syllabus arranged cleanly by subject! Click any subject category below to watch its episodes.'}
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
                <NetlifyImage src={char.avatarUrl} alt={char.name} width={56} height={64} loading="lazy" className="w-full h-full object-cover object-top" />
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
            isWatched={currentChapter ? watchedChapterIds.has(currentChapter.id) : false}
            learnerId={activeChild.id === 'child-2' ? 'faidan' : 'eadrick'}
            nextChapterTitle={
              nextChapInfo
                ? language === 'ml'
                  ? nextChapInfo.chapter.malayalamTitle
                  : nextChapInfo.chapter.title
                : undefined
            }
            onNextEpisode={handleNextEpisodeOrContinue}
            onComplete={() => {
              soundEffects.playLevelUp();
              if (currentChapter) {
                markChapterWatched(currentChapter.id, true);
              }
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

                {watchedChapterIds.has(currentChapter.id) && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'ml' ? 'കണ്ടു കഴിഞ്ഞു ✓' : 'Watched ✓'}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2 flex-wrap">
                {/* Mark as Watched / Unwatched Toggle Button */}
                <button
                  onClick={() => toggleChapterWatched(currentChapter.id)}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center space-x-1.5 transition border shadow-2xs ${
                    watchedChapterIds.has(currentChapter.id)
                      ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border-emerald-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                  title={watchedChapterIds.has(currentChapter.id) ? 'Mark as unwatched' : 'Mark as watched'}
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      watchedChapterIds.has(currentChapter.id) ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  />
                  <span>
                    {watchedChapterIds.has(currentChapter.id)
                      ? language === 'ml'
                        ? 'കണ്ടു കഴിഞ്ഞു ✓'
                        : 'Watched ✓'
                      : language === 'ml'
                      ? 'പൂർത്തിയായി എന്ന് രേഖപ്പെടുത്തുക'
                      : 'Mark as Watched'}
                  </span>
                </button>

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
      ) : !loading && !currentChapter ? (
        <div className="bg-white rounded-4xl p-12 text-center border-2 border-indigo-200 space-y-4">
          <div className="text-5xl">🎬</div>
          <h3 className="text-xl font-black text-slate-800">
            {language === 'ml'
              ? `${activeChild.classGrade} സിലബസിനായി കാർട്ടൂൺ എപ്പിസോഡുകൾ ലഭ്യമല്ല`
              : `No cartoon episodes yet for ${activeChild.classGrade}`}
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {language === 'ml'
              ? 'പാരന്റ് സോണിൽ നിന്ന് പുതിയ പാഠപുസ്തകങ്ങൾ അപ്‌ലോഡ് ചെയ്യുമ്പോൾ കാർട്ടൂൺ എപ്പിസോഡുകൾ യാന്ത്രികമായി തയ്യാറാക്കപ്പെടും.'
              : 'Upload textbooks under this class/grade in the Parent Zone to unlock cartoon episodes!'}
          </p>
          <button
            onClick={() => router.push('/parent/syllabus')}
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
          >
            Upload School Textbooks
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-slate-200">
          <p className="text-base font-bold text-slate-600">Loading cartoon episode...</p>
        </div>
      )}

      {/* Episode Guest Stars & Cartoon Animals */}
      {episode?.cast && episode.cast.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-black text-slate-800">
                {language === 'ml' ? 'ഈ പാഠത്തിലെ പ്രത്യേക കാർട്ടൂൺ കഥാപാത്രങ്ങൾ' : 'This Episode’s Guest Stars & Animals'}
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-400">Unique to this lesson!</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {episode.cast.map((guest) => (
              <div
                key={guest.id}
                className="bg-white rounded-3xl p-4 border-2 border-slate-200 hover:border-amber-400 shadow-sm transition space-y-3 flex items-center space-x-4 card-kid-hover"
              >
                <div
                  className={`w-16 h-20 rounded-2xl bg-gradient-to-tr ${guest.bgGradient} flex items-center justify-center text-4xl shadow-md border-2 border-white flex-shrink-0 animate-bounce-slight`}
                >
                  {guest.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${guest.badgeColor} inline-block`}>
                    {language === 'ml' ? guest.malayalamName : guest.name}
                  </span>
                  <h4 className="text-xs font-bold text-slate-700 mt-1">
                    {language === 'ml' ? guest.malayalamRole : guest.role}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 italic leading-tight">{guest.tagline}</p>
                </div>
              </div>
            ))}
          </div>
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
                <NetlifyImage src={char.avatarUrl} alt={char.name} width={96} height={128} loading="lazy" className="w-full h-full object-cover object-top" />
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

      {/* =========================================================================
          SUBJECT / CATEGORY WISE EPISODES CATALOG
          Organized cleanly by Subject with filter pills for easy navigation!
      ========================================================================= */}
      <div id="episodes-catalog" className="space-y-6 pt-4 border-t-2 border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-lg shadow-sm">
              🎬
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                {language === 'ml' ? 'വിഷയാടിസ്ഥാനത്തിൽ കാർട്ടൂൺ എപ്പിസോഡുകൾ' : 'Subject-Wise Cartoon Episodes'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {language === 'ml'
                  ? `${totalEpisodesCount} എപ്പിസോഡുകൾ വിഷയം തിരിച്ച് ക്രമീകരിച്ചിരിക്കുന്നു`
                  : `${totalEpisodesCount} total episodes neatly organized by school subject`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative inline-flex items-center">
              <select
                value={selectedSubjectFilter}
                onChange={(e) => {
                  soundEffects.playPop();
                  const val = e.target.value;
                  setSelectedSubjectFilter(val);
                  if (val !== 'all') {
                    setExpandedSubjects((prev) => ({ ...prev, [val]: true }));
                  }
                }}
                className="appearance-none bg-white font-black text-xs text-slate-700 pl-3.5 pr-8 py-2 rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              >
                <option value="all">🎬 {language === 'ml' ? 'എല്ലാ വിഷയങ്ങളും (All Subjects)' : 'All Subjects'} ({totalEpisodesCount})</option>
                {subjects.map((sub) => {
                  const subBooks = textbooks.filter((b) => b.subjectId === sub.id);
                  const count = subBooks.reduce((acc, b) => acc + (b.chapters?.length || 0), 0);
                  if (count === 0) return null;
                  return (
                    <option key={sub.id} value={sub.id}>
                      {sub.icon} {language === 'ml' ? sub.malayalamName : sub.name} ({count} {language === 'ml' ? 'എപ്പിസോഡുകൾ' : 'episodes'})
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="w-4 h-4 text-indigo-600 absolute right-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Subject Category Filter Tabs / Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => {
              soundEffects.playPop();
              setSelectedSubjectFilter('all');
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center space-x-2 flex-shrink-0 shadow-xs ${
              selectedSubjectFilter === 'all'
                ? 'bg-rose-600 text-white shadow-rose-200 ring-2 ring-rose-300'
                : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-rose-300'
            }`}
          >
            <span>🎬</span>
            <span>{language === 'ml' ? 'എല്ലാ വിഷയങ്ങളും' : 'All Subjects'}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                selectedSubjectFilter === 'all' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {totalEpisodesCount}
            </span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>

          {subjects.map((sub) => {
            const subBooks = textbooks.filter((b) => b.subjectId === sub.id);
            const count = subBooks.reduce((acc, b) => acc + (b.chapters?.length || 0), 0);
            if (count === 0) return null;

            const isSelected = selectedSubjectFilter === sub.id;

            return (
              <button
                key={sub.id}
                onClick={() => {
                  soundEffects.playPop();
                  setSelectedSubjectFilter(sub.id);
                  setExpandedSubjects((prev) => ({ ...prev, [sub.id]: true }));
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-black transition flex items-center space-x-2 flex-shrink-0 shadow-xs ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-indigo-200 ring-2 ring-indigo-300'
                    : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-indigo-300'
                }`}
              >
                <span>{sub.icon}</span>
                <span className="truncate max-w-[150px]">
                  {language === 'ml' ? sub.malayalamName.split(' ')[0] : sub.name.split('(')[0].trim()}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition ${isSelected ? 'text-white' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </div>

        {/* Category Sections: One prominent section per Subject */}
        <div className="space-y-8">
          {totalEpisodesCount === 0 ? (
            <div className="bg-white rounded-3xl p-8 border-2 border-indigo-100 text-center space-y-3">
              <p className="text-sm font-bold text-slate-600">
                {language === 'ml'
                  ? `${activeChild.classGrade} സിലബസിനായി കാർട്ടൂൺ എപ്പിസോഡുകൾ ലഭ്യമാക്കിയിട്ടില്ല.`
                  : `No cartoon episodes catalog found for ${activeChild.classGrade}.`}
              </p>
              <button
                onClick={() => router.push('/parent/syllabus')}
                className="px-5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
              >
                Upload School Textbooks
              </button>
            </div>
          ) : (
            visibleSubjects.map((sub) => {
              const matchingBooks = textbooks.filter((b) => b.subjectId === sub.id);
              const allChaps = matchingBooks.flatMap((b) => b.chapters || []);
              if (allChaps.length === 0) return null;

              const bookTitle = matchingBooks[0]?.title || sub.name;
              const isExpanded = isSubjectExpanded(sub.id);

            return (
              <div
                key={sub.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border-3 border-slate-200 shadow-sm space-y-4 hover:border-indigo-300 transition"
              >
                {/* Subject Header with Dropdown / Collapse Button */}
                <div
                  onClick={() => toggleSubjectExpanded(sub.id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 cursor-pointer select-none group"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${
                        sub.bgGradient || 'from-indigo-500 to-purple-600'
                      } text-white flex items-center justify-center text-2xl shadow-sm flex-shrink-0 group-hover:scale-105 transition`}
                    >
                      {sub.icon}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition flex items-center space-x-1.5">
                        <span>{language === 'ml' ? sub.malayalamName : sub.name}</span>
                      </h3>
                      <p className="text-[11px] text-purple-600 font-bold truncate max-w-sm sm:max-w-md">
                        📖 {bookTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {allChaps.length} {language === 'ml' ? 'കാർട്ടൂൺ എപ്പിസോഡുകൾ' : 'Episodes'}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSubjectExpanded(sub.id);
                      }}
                      className={`px-2.5 py-1.5 rounded-xl border transition flex items-center space-x-1 text-xs font-black ${
                        isExpanded
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                      }`}
                      title={isExpanded ? 'Collapse chapters' : 'Expand chapters'}
                    >
                      <span className="text-[11px] font-bold">
                        {isExpanded
                          ? language === 'ml'
                            ? 'ചാപ്റ്ററുകൾ ചുരുക്കുക'
                            : 'Hide'
                          : language === 'ml'
                          ? 'ചാപ്റ്ററുകൾ കാണുക'
                          : 'Show'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Grid of Chapter Episodes under this Subject (Collapsible) */}
                {isExpanded ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 animate-in fade-in duration-200">
                    {matchingBooks.map((book) =>
                      book.chapters?.map((chap) => {
                        const isActive = currentChapter?.id === chap.id;
                        const isWatched = watchedChapterIds.has(chap.id);
                        const presetEp = PRESET_CARTOON_EPISODES[chap.id];
                        const hasPreset = Boolean(presetEp);
                        const themeEmoji = presetEp?.themeEmoji || '🎬';

                        return (
                          <div
                            key={chap.id}
                            onClick={() => selectChapter(chap, sub.id)}
                            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-start space-x-3 group relative ${
                              isActive
                                ? 'bg-rose-50 border-rose-500 shadow-md ring-4 ring-rose-200/70 scale-[1.01]'
                                : isWatched
                                ? 'bg-emerald-50/50 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50/80 shadow-2xs hover:shadow-sm'
                                : 'bg-slate-50/70 border-slate-200 hover:border-indigo-400 hover:bg-white shadow-2xs hover:shadow-sm'
                            }`}
                          >
                            {/* Chapter Number Badge */}
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 transition ${
                                isActive
                                  ? 'bg-rose-500 text-white shadow-md'
                                  : isWatched
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-white text-slate-700 border border-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                              }`}
                            >
                              {isActive ? '▶' : isWatched ? '✓' : chap.chapterNumber}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                                  Episode {chap.chapterNumber} {themeEmoji}
                                </span>

                                <div className="flex items-center space-x-1">
                                  {isWatched ? (
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1 shadow-2xs">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      <span>{language === 'ml' ? 'കണ്ടു കഴിഞ്ഞു ✓' : 'Watched ✓'}</span>
                                    </span>
                                  ) : hasPreset ? (
                                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800">
                                      Featured ⭐
                                    </span>
                                  ) : null}
                                </div>
                              </div>

                              <h4
                                className={`text-xs font-black truncate mt-0.5 ${
                                  isActive
                                    ? 'text-rose-900'
                                    : isWatched
                                    ? 'text-emerald-950 font-black'
                                    : 'text-slate-800 group-hover:text-indigo-600'
                                }`}
                              >
                                {language === 'ml' ? chap.malayalamTitle : chap.title}
                              </h4>

                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 leading-snug">
                                {language === 'ml' ? chap.malayalamSummary : chap.summary}
                              </p>

                              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100/90 gap-1">
                                {isActive ? (
                                  <span className="text-[10px] font-black text-rose-600 flex items-center space-x-1">
                                    <PlayCircle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                                    <span>
                                      {isWatched
                                        ? language === 'ml'
                                          ? 'ഇപ്പോൾ കാണുന്നു (വീണ്ടും)'
                                          : 'Watching Now (Rewatch)'
                                        : language === 'ml'
                                        ? 'ഇപ്പോൾ കാണുന്നു'
                                        : 'Watching Now'}
                                    </span>
                                  </span>
                                ) : isWatched ? (
                                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-xl flex items-center space-x-1.5 border border-emerald-300 transition group-hover:scale-105 shadow-2xs">
                                    <RotateCcw className="w-3 h-3 text-emerald-700" />
                                    <span>{language === 'ml' ? 'വീണ്ടും കാണുക ↺' : 'Rewatch ↺'}</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-indigo-600 flex items-center space-x-1 group-hover:underline">
                                    <PlayCircle className="w-3 h-3 text-indigo-500" />
                                    <span>{language === 'ml' ? 'കാർട്ടൂൺ കാണുക ▶' : 'Watch Cartoon ▶'}</span>
                                  </span>
                                )}

                                <div className="flex items-center space-x-1.5">
                                  {isActive && (
                                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                                  )}

                                  <button
                                    onClick={(e) => toggleChapterWatched(chap.id, e)}
                                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center space-x-0.5 transition ${
                                      isWatched
                                        ? 'text-emerald-700 hover:bg-emerald-100 bg-emerald-50'
                                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
                                    }`}
                                    title={
                                      isWatched
                                        ? language === 'ml'
                                          ? 'കണ്ടിട്ടില്ല എന്ന് മാറ്റുക'
                                          : 'Mark as uncompleted'
                                        : language === 'ml'
                                        ? 'കണ്ടു എന്ന് രേഖപ്പെടുത്തുക'
                                        : 'Mark as finished'
                                    }
                                  >
                                    <span>{isWatched ? '✓ Done' : 'Mark'}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => toggleSubjectExpanded(sub.id)}
                    className="py-3 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-300 transition"
                  >
                    <p className="text-xs font-bold text-slate-500 flex items-center justify-center space-x-1.5">
                      <span>
                        {language === 'ml'
                          ? `ഈ വിഷയത്തിലെ ${allChaps.length} കാർട്ടൂൺ പാഠങ്ങൾ കാണാൻ ഇവിടെ ക്ലിക്ക് ചെയ്യുക`
                          : `Click to drop down and view all ${allChaps.length} cartoon chapter videos`}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-indigo-500" />
                    </p>
                  </div>
                )}
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
