
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  BookOpen,
  Bot,
  Box,
  Layers,
  HelpCircle,
  Sparkles,
  Gamepad2,
  Trophy,
  Flame,
  ArrowRight,
  Volume2,
  FileText,
  Edit3,
  Tv,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import MascotOwl from '@/components/ui/MascotOwl';
import KidAvatar from '@/components/ui/KidAvatar';
import EditChildProfileModal from '@/components/ui/EditChildProfileModal';
import { soundEffects } from '@/lib/audio/soundEffects';
import { Subject } from '@/lib/db/types';

export default function ChildDashboardPage() {
  const router = useRouter();
  const { activeChild, language, t, speak } = useApp();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!activeChild) return;
    fetch(`/api/data/subjects?childId=${activeChild.id}`)
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data.subjects || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [activeChild]);

  if (!activeChild) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-bold text-slate-500">Loading your profile...</p>
      </div>
    );
  }

  const isUKG = activeChild.classGrade === 'UKG';

  const readWelcome = () => {
    const text = language === 'ml'
      ? `ഹലോ ${activeChild.name}! ഇന്ന് നമ്മൾ എന്ത് പുതിയ കാര്യമാണ് പഠിക്കാൻ പോകുന്നത്?`
      : `Hello ${activeChild.name}! What exciting adventure shall we learn today?`;
    speak(text);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Top Child Hero Card */}
      <section
        className={`relative rounded-4xl p-6 sm:p-10 text-white shadow-xl overflow-hidden border-4 ${isUKG
            ? 'bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 border-pink-300'
            : 'bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 border-sky-300'
          }`}
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-5">
            <div
              onClick={() => setIsEditModalOpen(true)}
              className="relative cursor-pointer group"
              title="Click to change name or photo!"
            >
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-3xl border-2 border-white/40 shadow-inner group-hover:scale-105 transition">
                <KidAvatar avatar={activeChild.avatar} size="2xl" />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1.5 bg-white text-slate-800 rounded-xl shadow-md border border-slate-200 group-hover:bg-amber-100 transition">
                <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <h1 className="text-3xl sm:text-4xl font-black">
                  {t('welcome')} {activeChild.name}!
                </h1>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-white transition text-xs font-bold flex items-center space-x-1"
                  title="Change Name or Picture"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={readWelcome}
                  className="p-1.5 bg-white/20 hover:bg-white/30 rounded-xl transition"
                >
                  <Volume2 className="w-5 h-5 text-white" />
                </button>
              </div>
              <p className="text-sm font-bold text-white/90 mt-1">
                {activeChild.classGrade} • {isUKG ? (language === 'ml' ? 'ആനന്ദപൂർണ്ണമായ തുടക്കം' : 'Joyful Steps') : (language === 'ml' ? 'പ്രൈമറി എക്സ്പ്ലോറർ' : 'Primary Explorer')} ({language === 'ml' ? 'വയസ്സ്' : 'Age'} {activeChild.age})
              </p>
              <div className="flex items-center justify-center sm:justify-start space-x-3 mt-3">
                <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-xl flex items-center space-x-1 shadow-sm">
                  <span>⭐</span>
                  <span>{activeChild.stars} {t('stars')}</span>
                </span>
                <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-xl flex items-center space-x-1">
                  <span>🪙</span>
                  <span>{activeChild.coins} {t('coins')}</span>
                </span>
                <span className="bg-orange-500 text-white font-black text-xs px-3 py-1 rounded-xl flex items-center space-x-1 shadow-sm">
                  <Flame className="w-3.5 h-3.5 text-yellow-300" />
                  <span>{activeChild.streakDays} {t('streak')}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={() => {
                soundEffects.playPop();
                router.push(isUKG ? '/child/world3d' : '/child/lesson');
              }}
              className="bg-white hover:bg-amber-50 text-slate-900 font-black text-base px-6 py-4 rounded-3xl shadow-xl flex items-center space-x-2 btn-kid-3d transition border-2 border-amber-300"
            >
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>{t('continueLearning')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Learning Zones (Large, Fun, Colorful Cards) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center space-x-2">
            <span>🚀</span>
            <span>{language === 'ml' ? 'പഠന വിനോദങ്ങൾ' : "Today's Fun Quests"}</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* AI Teacher */}
          <div
            onClick={() => {
              soundEffects.playPop();
              router.push('/child/ai-teacher');
            }}
            className="cursor-pointer bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-3xl p-5 flex flex-col items-center text-center justify-between card-kid-hover shadow-md border-3 border-emerald-300 min-h-[170px]"
          >
            <div className="p-3 bg-white/20 rounded-2xl mb-2">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base leading-tight">
                {t('aiTeacher')}
              </h3>
              <p className="text-[11px] text-emerald-100 font-bold mt-1">
                {language === 'ml' ? 'സംശയം ചോദിക്കാം 🐾' : 'Ask Chikoo 🐾'}
              </p>
            </div>
          </div>

          {/* 3D World */}
          <div
            onClick={() => {
              soundEffects.playPop();
              router.push('/child/world3d');
            }}
            className="cursor-pointer bg-gradient-to-br from-sky-400 to-blue-600 text-white rounded-3xl p-5 flex flex-col items-center text-center justify-between card-kid-hover shadow-md border-3 border-sky-300 min-h-[170px]"
          >
            <div className="p-3 bg-white/20 rounded-2xl mb-2">
              <Box className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base leading-tight">
                {t('world3d')}
              </h3>
              <p className="text-[11px] text-sky-100 font-bold mt-1">
                {language === 'ml' ? 'സൗരയൂഥം 3D' : 'Explore Planets'}
              </p>
            </div>
          </div>

          {/* Flashcards */}
          <div
            onClick={() => {
              soundEffects.playPop();
              router.push('/child/flashcards');
            }}
            className="cursor-pointer bg-gradient-to-br from-purple-400 to-indigo-600 text-white rounded-3xl p-5 flex flex-col items-center text-center justify-between card-kid-hover shadow-md border-3 border-purple-300 min-h-[170px]"
          >
            <div className="p-3 bg-white/20 rounded-2xl mb-2">
              <Layers className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base leading-tight">
                {t('flashcards')}
              </h3>
              <p className="text-[11px] text-purple-100 font-bold mt-1">
                {language === 'ml' ? 'കാർഡുകൾ മറിക്കാം' : 'Memory Cards'}
              </p>
            </div>
          </div>

          {/* Quiz Zone */}
          <div
            onClick={() => {
              soundEffects.playPop();
              router.push('/child/quiz');
            }}
            className="cursor-pointer bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-3xl p-5 flex flex-col items-center text-center justify-between card-kid-hover shadow-md border-3 border-amber-300 min-h-[170px]"
          >
            <div className="p-3 bg-white/20 rounded-2xl mb-2">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base leading-tight">
                {t('quizZone')}
              </h3>
              <p className="text-[11px] text-amber-100 font-bold mt-1">
                {language === 'ml' ? 'നക്ഷത്രങ്ങൾ നേടാം' : 'Win Stars ⭐'}
              </p>
            </div>
          </div>

          {/* Educational Games */}
          <div
            onClick={() => {
              soundEffects.playPop();
              router.push('/child/games');
            }}
            className="cursor-pointer bg-gradient-to-br from-pink-400 to-rose-500 text-white rounded-3xl p-5 flex flex-col items-center text-center justify-between card-kid-hover shadow-md border-3 border-pink-300 min-h-[170px]"
          >
            <div className="p-3 bg-white/20 rounded-2xl mb-2">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base leading-tight">
                {t('gamesZone')}
              </h3>
              <p className="text-[11px] text-pink-100 font-bold mt-1">
                {isUKG ? 'Tracing & Apples' : 'Math Blitz'}
              </p>
            </div>
          </div>

          {/* Story Time */}
          <div
            onClick={() => {
              soundEffects.playPop();
              router.push('/child/story');
            }}
            className="cursor-pointer bg-gradient-to-br from-teal-400 to-emerald-600 text-white rounded-3xl p-5 flex flex-col items-center text-center justify-between card-kid-hover shadow-md border-3 border-teal-300 min-h-[170px]"
          >
            <div className="p-3 bg-white/20 rounded-2xl mb-2">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base leading-tight">
                {t('storyTime')}
              </h3>
              <p className="text-[11px] text-teal-100 font-bold mt-1">
                {language === 'ml' ? 'നല്ല കഥകൾ' : 'Bedtime Stories'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Family Cartoon Video Theater Banner */}
      <section
        onClick={() => {
          soundEffects.playPop();
          router.push('/child/cartoon');
        }}
        className="cursor-pointer relative overflow-hidden rounded-4xl bg-gradient-to-r from-purple-700 via-pink-600 to-rose-500 p-6 sm:p-8 text-white shadow-xl card-kid-hover border-4 border-pink-300"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-flex items-center space-x-1.5 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping"></span>
              <span>🎬 {language === 'ml' ? 'പുതിയ ഫീച്ചർ' : 'New Feature'}: Family Cartoon Theater</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-black mt-2 leading-tight">
              {language === 'ml'
                ? 'കാർട്ടൂൺ വീഡിയോകളിലൂടെ എല്ലാ പാഠങ്ങളും പഠിക്കാം!'
                : 'Learn Every Lesson with Cartoon Family Stories!'}
            </h3>
            <p className="text-xs sm:text-sm text-pink-100 mt-1.5 font-medium">
              {language === 'ml'
                ? 'മുത്തശ്ശി ലില്ലി ജോസഫ്, പപ്പ മനോജ്, മമ്മി ടെസ്സി, ചേട്ടൻ ഏദ്രിക്, കൊച്ചു ഫൈദാൻ എന്നിവരോടൊപ്പം എല്ലാ UKG പാഠങ്ങളും ആസ്വദിക്കൂ!'
                : 'Starring Grandma Lilly Joseph, Papa Manoj, Mummy Tessy, Brother Eadrick & Little Faidan in animated video lessons!'}
            </p>

            <div className="mt-4 inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-white text-slate-900 font-black text-xs shadow-lg btn-kid-3d">
              <Tv className="w-4 h-4 text-rose-600" />
              <span>{language === 'ml' ? 'കാർട്ടൂൺ തീയേറ്ററിലേക്ക് പോകാം' : 'Watch Cartoon Lessons 🎬'}</span>
              <ArrowRight className="w-4 h-4 text-slate-500 ml-1" />
            </div>
          </div>

          {/* 5 Family Character Photo Badges */}
          <div className="flex items-center -space-x-4 bg-white/10 backdrop-blur-md p-2.5 rounded-3xl border border-white/25 shadow-inner">
            <div className="relative w-14 h-18 sm:w-16 sm:h-22 rounded-2xl overflow-hidden border-2 border-white shadow-md hover:scale-110 transition duration-200">
              <Image src="/characters/grandmother_lilly.jpg" alt="Grandma Lilly Joseph" fill className="object-cover object-top" />
            </div>
            <div className="relative w-14 h-18 sm:w-16 sm:h-22 rounded-2xl overflow-hidden border-2 border-white shadow-md hover:scale-110 transition duration-200">
              <Image src="/characters/father_manoj.jpg" alt="Papa Manoj" fill className="object-cover object-top" />
            </div>
            <div className="relative w-14 h-18 sm:w-16 sm:h-22 rounded-2xl overflow-hidden border-2 border-white shadow-md hover:scale-110 transition duration-200">
              <Image src="/characters/mother_tessy.jpg" alt="Mummy Tessy" fill className="object-cover object-top" />
            </div>
            <div className="relative w-14 h-18 sm:w-16 sm:h-22 rounded-2xl overflow-hidden border-2 border-white shadow-md hover:scale-110 transition duration-200">
              <Image src="/characters/brother_eadrick.jpg" alt="Brother Eadrick" fill className="object-cover object-top" />
            </div>
            <div className="relative w-14 h-18 sm:w-16 sm:h-22 rounded-2xl overflow-hidden border-2 border-white shadow-md hover:scale-110 transition duration-200 ring-2 ring-amber-300">
              <Image src="/characters/faidan.jpg" alt="Little Faidan" fill className="object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      {/* My School Subjects Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center space-x-2">
            <span>📚</span>
            <span>{t('mySubjects')}</span>
          </h2>
          <button
            onClick={() => router.push('/child/subjects')}
            className="text-xs font-black text-sky-600 hover:text-sky-700 flex items-center space-x-1"
          >
            <span>{language === 'ml' ? 'എല്ലാം കാണുക' : 'View All'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              onClick={() => {
                soundEffects.playPop();
                router.push(`/child/chapters?subjectId=${sub.id}`);
              }}
              className="cursor-pointer bg-white rounded-3xl p-6 border-3 border-slate-200 hover:border-sky-400 shadow-sm card-kid-hover flex items-start justify-between"
            >
              <div className="flex items-start space-x-4">
                <span className="text-4xl p-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner">
                  {sub.icon}
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-800">
                    {language === 'ml' ? sub.malayalamName : sub.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold mt-0.5 line-clamp-2">
                    {language === 'ml' ? sub.malayalamDescription : sub.description}
                  </p>
                  <div className="mt-3 flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-sky-50 text-sky-700">
                      {sub.classGrade}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      Textbook Ready
                    </span>
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 flex-shrink-0 mt-2" />
            </div>
          ))}
        </div>
      </section>

      {/* Special Recommended Power Features */}
      <section className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center space-x-2">
          <span>✨</span>
          <span>
            {language === 'ml'
              ? 'പ്രത്യേക പഠന സവിശേഷതകൾ (Special Learning Features)'
              : 'Interactive Power Learning Zones'}
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. AI Story Learning */}
          <div
            onClick={() => {
              soundEffects.playPop();
              router.push('/child/story');
            }}
            className="cursor-pointer bg-white rounded-3xl p-5 border-3 border-teal-300 hover:border-teal-500 shadow-sm card-kid-hover flex items-start space-x-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 text-white flex items-center justify-center text-3xl flex-shrink-0 shadow-md">
              🧚‍♂️
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-black text-slate-800">
                {language === 'ml' ? 'AI കഥാ പഠനം (AI Story Learning)' : 'AI Story Learning'}
              </h3>
              <p className="text-xs font-bold text-slate-600 mt-1 leading-relaxed">
                {language === 'ml'
                  ? 'പാഠഭാഗങ്ങൾ കാർട്ടൂൺ കഥാപാത്രങ്ങളുള്ള മനോഹരമായ കഥകളാക്കി മാറ്റി പഠിക്കാം.'
                  : 'Convert school lessons into stories. Teach plants, animals, or environmental science through a story with animated characters.'}
              </p>
            </div>
          </div>

          {/* 2. Writing and Drawing Practice */}
          <div
            onClick={() => {
              soundEffects.playPop();
              router.push('/child/games');
            }}
            className="cursor-pointer bg-white rounded-3xl p-5 border-3 border-pink-300 hover:border-pink-500 shadow-sm card-kid-hover flex items-start space-x-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 text-white flex items-center justify-center text-3xl flex-shrink-0 shadow-md">
              ✍️
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-black text-slate-800">
                {language === 'ml'
                  ? 'എഴുത്തും വരയും (Writing & Drawing Practice)'
                  : 'Writing and Drawing Practice'}
              </h3>
              <p className="text-xs font-bold text-slate-600 mt-1 leading-relaxed">
                {language === 'ml'
                  ? 'വിരൽ, മൗസ് അല്ലെങ്കിൽ സ്റ്റൈലസ് ഉപയോഗിച്ച് അക്ഷരങ്ങൾ, സംഖ്യകൾ, രൂപങ്ങൾ എന്നിവ വരച്ചു പഠിക്കാം.'
                  : 'Let the UKG & primary child trace letters, numbers, and shapes using a mouse, finger, or stylus.'}
              </p>
            </div>
          </div>

          {/* 3. AI Voice Teacher */}
          <div
            onClick={() => {
              soundEffects.playPop();
              router.push('/child/ai-teacher');
            }}
            className="cursor-pointer bg-white rounded-3xl p-5 border-3 border-emerald-300 hover:border-emerald-500 shadow-sm card-kid-hover flex items-start space-x-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-white flex items-center justify-center text-3xl flex-shrink-0 shadow-md">
              🤖
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-black text-slate-800">
                {language === 'ml' ? 'AI വോയ്സ് ടീച്ചർ (AI Voice Teacher)' : 'AI Voice Teacher'}
              </h3>
              <p className="text-xs font-bold text-slate-600 mt-1 leading-relaxed">
                {language === 'ml'
                  ? '"ആകാശം എന്തുകൊണ്ട് നീല നിറത്തിൽ കാണുന്നു?" അല്ലെങ്കിൽ "20-ൽ എത്ര 5-കൾ ഉണ്ട്?" എന്ന് ചോദിച്ച് ലളിതമായ വിശദീകരണം കേൾക്കാം.'
                  : 'The child can ask, "Why is the sky blue?" or "How many 5s are there in 20?" and hear a simple explanation.'}
              </p>
            </div>
          </div>

          {/* 4. Learning Rewards */}
          <div
            onClick={() => {
              soundEffects.playPop();
              router.push('/child/progress');
            }}
            className="cursor-pointer bg-white rounded-3xl p-5 border-3 border-amber-300 hover:border-amber-500 shadow-sm card-kid-hover flex items-start space-x-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl flex-shrink-0 shadow-md">
              🎁
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-black text-slate-800">
                {language === 'ml' ? 'പഠന സമ്മാനങ്ങൾ (Learning Rewards)' : 'Learning Rewards'}
              </h3>
              <p className="text-xs font-bold text-slate-600 mt-1 leading-relaxed">
                {language === 'ml'
                  ? 'പാഠങ്ങൾ പൂർത്തിയാക്കി നക്ഷത്രങ്ങൾ നേടാം — പുതിയ പഠന ലോകങ്ങളും കഥാപാത്രങ്ങളും കളികളും തുറക്കാം.'
                  : 'Complete chapters and earn stars to unlock new learning worlds, characters, and educational activities.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Mascot Tip Card */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-4xl p-6 border-3 border-amber-300 shadow-sm flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <MascotOwl size="md" />
        <div className="text-center sm:text-left flex-1">
          <p className="text-xs font-black text-amber-700 uppercase tracking-wider flex items-center space-x-1.5 justify-center sm:justify-start">
            <span>🐾</span>
            <span>{language === 'ml' ? 'ചിക്കുവിന്റെ കൊച്ചു നിർദ്ദേശം' : "Chikoo's Daily AI Tip"}</span>
          </p>
          <p className="text-sm sm:text-base font-bold text-slate-800 mt-1">
            {isUKG
              ? language === 'ml'
                ? 'ദിവസവും ഒരു പുതിയ അക്ഷരവും വാക്കും പാടി പഠിച്ചാൽ നമ്മൾ മിടുക്കരാകും! 🍎'
                : 'Say each letter sound out loud with big smiles! You are doing amazing! 🎈'
              : language === 'ml'
                ? '3D സൗരയൂഥത്തിൽ ഗ്രഹങ്ങളെ തിരിച്ചു നോക്കൂ, സയൻസ് പഠനം വളരെ എളുപ്പമാകും! 🪐'
                : 'Explore the 3D Solar System world today to see Earth and Saturn orbit in space! 🚀'}
          </p>
        </div>
        <button
          onClick={() => {
            soundEffects.playStar();
            router.push('/child/ai-teacher');
          }}
          className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs px-4 py-2.5 rounded-2xl shadow-sm whitespace-nowrap btn-kid-3d"
        >
          {language === 'ml' ? 'ചിക്കുവിനോട് സംസാരിക്കാം 💬' : 'Chat with Chikoo 💬'}
        </button>
      </section>

      {/* Edit Child Profile Modal */}
      {activeChild && (
        <EditChildProfileModal
          child={activeChild}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}

