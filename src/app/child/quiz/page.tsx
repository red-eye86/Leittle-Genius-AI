'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  HelpCircle,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trophy,
  RefreshCw,
  Volume2,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { Quiz, QuizQuestion, Textbook } from '@/lib/db/types';

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryChapterId = searchParams.get('chapterId');
  const { activeChild, language, t, speak, addStars } = useApp();

  const [resolvedChapterId, setResolvedChapterId] = useState<string>(queryChapterId || '');
  const [noChaptersFound, setNoChaptersFound] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Resolve chapter matching active child's classGrade
  useEffect(() => {
    if (!activeChild) return;

    fetch(`/api/data/textbooks?childId=${activeChild.id}`)
      .then((r) => r.json())
      .then((data) => {
        const books = (data.textbooks || []) as Textbook[];
        const allChaps = books.flatMap((b) => b.chapters || []);

        const matchingChap = queryChapterId ? allChaps.find((c) => c.id === queryChapterId) : null;
        if (matchingChap) {
          setResolvedChapterId(matchingChap.id);
          setNoChaptersFound(false);
        } else if (allChaps.length > 0) {
          setResolvedChapterId(allChaps[0].id);
          setNoChaptersFound(false);
        } else {
          setResolvedChapterId('');
          setNoChaptersFound(true);
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [activeChild?.id, activeChild?.classGrade, queryChapterId]);

  useEffect(() => {
    if (!activeChild || !resolvedChapterId) return;
    setLoading(true);

    fetch('/api/quiz/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chapterId: resolvedChapterId,
        childId: activeChild.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.quiz) {
          setQuiz(data.quiz);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [activeChild?.id, activeChild?.classGrade, resolvedChapterId]);

  if (!activeChild) return null;

  const currentQ: QuizQuestion | undefined = quiz?.questions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (hasAnswered || !currentQ) return;
    setSelectedOption(idx);
    setHasAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      soundEffects.playCorrect();
      setScore((s) => s + 1);
      speak(
        language === 'ml'
          ? `വളരെ ശരി! ${currentQ.explanationMalayalam}`
          : `Awesome! That's correct! ${currentQ.explanation}`
      );
    } else {
      soundEffects.playIncorrect();
      speak(
        language === 'ml'
          ? `നല്ല ശ്രമം! ശരിയായ ഉത്തരം നോക്കാം: ${currentQ.explanationMalayalam}`
          : `Nice try! Here is why: ${currentQ.explanation}`
      );
    }
  };

  const handleNextQuestion = () => {
    soundEffects.playPop();
    if (!quiz) return;

    if (currentIdx + 1 < quiz.questions.length) {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setHasAnswered(false);
      setShowHint(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (!quiz) return;
    setIsCompleted(true);
    soundEffects.playStar();
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });

    const starsEarned = Math.max(1, score * 2);
    addStars(starsEarned);

    // Save attempt to backend
    fetch('/api/data/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'quiz_attempt',
        data: {
          quizId: quiz.id,
          childId: activeChild.id,
          chapterId: quiz.chapterId,
          score,
          totalQuestions: quiz.questions.length,
          starsEarned,
        },
      }),
    }).catch(console.error);
  };

  const restartQuiz = () => {
    soundEffects.playPop();
    setCurrentIdx(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setShowHint(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-2xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-1.5 text-xs font-black text-slate-500 hover:text-slate-800 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ml' ? 'തിരികെ' : 'Back'}</span>
        </button>

        {quiz && !isCompleted && (
          <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800">
            Question {currentIdx + 1} of {quiz.questions.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="bg-white rounded-4xl p-16 text-center border-4 border-amber-200 shadow-sm">
          <p className="text-lg font-black text-slate-700 animate-pulse">
            {language === 'ml' ? 'ക്വിസ് തയ്യാറാക്കുന്നു...' : 'Preparing textbook quiz questions...'}
          </p>
        </div>
      ) : noChaptersFound || !quiz || quiz.questions.length === 0 ? (
        <div className="bg-white rounded-4xl p-12 text-center border-2 border-amber-200 space-y-4">
          <div className="text-5xl">🏆</div>
          <h3 className="text-xl font-black text-slate-800">
            {language === 'ml'
              ? `${activeChild.classGrade} സിലബസിനായി ക്വിസ് ചോദ്യങ്ങൾ ലഭ്യമല്ല`
              : `No quiz questions available yet for ${activeChild.classGrade}`}
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {language === 'ml'
              ? 'പാരന്റ് സോണിൽ നിന്ന് നിങ്ങളുടെ സ്കൂൾ പാഠപുസ്തകങ്ങൾ അപ്‌ലോഡ് ചെയ്യുമ്പോൾ ക്വിസുകൾ ഇവിടെ ലഭ്യമാകും.'
              : 'Upload textbooks under this class/grade in the Parent Zone to unlock chapter quizzes!'}
          </p>
          <button
            onClick={() => router.push('/parent/syllabus')}
            className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition"
          >
            Upload School Textbooks
          </button>
        </div>
      ) : isCompleted ? (
        /* Quiz Complete Screen */
        <div className="bg-white rounded-4xl p-8 sm:p-12 text-center border-4 border-amber-400 shadow-xl space-y-6 animate-bounce-gentle">
          <Trophy className="w-20 h-20 text-amber-500 mx-auto animate-bounce" />
          <h2 className="text-3xl font-black text-slate-800">
            {language === 'ml' ? 'ക്വിസ് പൂർത്തിയാക്കി!' : 'Quest Completed!'}
          </h2>

          <div className="bg-amber-50 rounded-3xl p-6 border-2 border-amber-200 inline-block space-y-2">
            <p className="text-sm font-bold text-slate-600">Your Score</p>
            <p className="text-4xl font-black text-amber-600">
              {score} / {quiz.questions.length}
            </p>
            <p className="text-xs font-black text-emerald-600">
              +{Math.max(1, score * 2)} Stars Earned! ⭐
            </p>
          </div>

          <div className="flex items-center justify-center space-x-4 pt-4">
            <button
              onClick={restartQuiz}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl flex items-center space-x-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t('playAgain')}</span>
            </button>

            <button
              onClick={() => router.push('/child/dashboard')}
              className="px-8 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-sm rounded-2xl shadow-lg btn-kid-3d"
            >
              {t('finish')}
            </button>
          </div>
        </div>
      ) : currentQ ? (
        /* Question Card */
        <div className="bg-white rounded-4xl p-6 sm:p-10 border-4 border-slate-200 shadow-md space-y-6">
          {/* Question Text */}
          <div className="space-y-3 text-center sm:text-left">
            <div className="flex items-center justify-between">
              <span className="text-4xl">{currentQ.visualEmoji || '❓'}</span>
              <button
                onClick={() =>
                  speak(
                    language === 'ml'
                      ? currentQ.questionMalayalam
                      : currentQ.question
                  )
                }
                className="p-2 rounded-2xl bg-sky-100 text-sky-700 hover:bg-sky-200"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
              {language === 'ml' ? currentQ.questionMalayalam : currentQ.question}
            </h3>
          </div>

          {/* Hint Button */}
          {!hasAnswered && (
            <div className="text-left">
              {!showHint ? (
                <button
                  onClick={() => {
                    soundEffects.playPop();
                    setShowHint(true);
                  }}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center space-x-1"
                >
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>{t('hint')}</span>
                </button>
              ) : (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 text-xs font-bold text-amber-800 animate-fade-in">
                  💡 {language === 'ml' ? currentQ.hintMalayalam : currentQ.hint}
                </div>
              )}
            </div>
          )}

          {/* Answer Options */}
          <div className="grid grid-cols-1 gap-3.5 pt-2">
            {(language === 'ml' && currentQ.optionsMalayalam?.length
              ? currentQ.optionsMalayalam
              : currentQ.options
            ).map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentQ.correctIndex;

              let btnStyles = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';
              if (hasAnswered) {
                if (isCorrectAnswer) {
                  btnStyles = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-black';
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyles = 'bg-rose-100 border-rose-400 text-rose-900';
                } else {
                  btnStyles = 'opacity-40 border-slate-200 text-slate-400';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 sm:p-5 rounded-2xl border-3 text-left font-bold text-base sm:text-lg flex items-center justify-between transition shadow-sm ${btnStyles} ${
                    !hasAnswered ? 'btn-kid-3d' : ''
                  }`}
                >
                  <span>{opt}</span>
                  {hasAnswered && isCorrectAnswer && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  )}
                  {hasAnswered && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Immediate Feedback Box */}
          {hasAnswered && (
            <div
              className={`rounded-3xl p-5 border-2 space-y-1 animate-fade-in ${
                selectedOption === currentQ.correctIndex
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              <p className="text-sm font-black">
                {selectedOption === currentQ.correctIndex ? t('correct') : t('incorrect')}
              </p>
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                {language === 'ml' ? currentQ.explanationMalayalam : currentQ.explanation}
              </p>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm flex items-center space-x-1.5 shadow-md btn-kid-3d"
                >
                  <span>
                    {currentIdx + 1 === quiz.questions.length
                      ? language === 'ml'
                        ? 'പൂർത്തിയാക്കുക'
                        : 'See Results'
                      : t('next')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-bold">Loading quiz...</div>}>
      <QuizContent />
    </Suspense>
  );
}

