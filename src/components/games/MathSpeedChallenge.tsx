'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Timer, Zap, Trophy, RefreshCw } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { TextbookChapter, Subject } from '@/lib/db/types';

interface MathQuestion {
  text: string;
  options: (number | string)[];
  answer: number | string;
}

interface MathSpeedChallengeProps {
  chapter?: TextbookChapter | null;
  subject?: Subject | null;
}

export default function MathSpeedChallenge({ chapter, subject }: MathSpeedChallengeProps) {
  const { activeChild, language, speak, addStars } = useApp();
  const isUKG = activeChild?.classGrade === 'UKG';

  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentQ, setCurrentQ] = useState<MathQuestion | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const generateQuestion = (): MathQuestion => {
    const chapTitle = (chapter?.title || '').toLowerCase();

    // UKG Gentle Counting & Addition (1 to 10)
    if (isUKG) {
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * 4) + 1;
      const answer = a + b;
      const text = `${a} 🍎 + ${b} 🍎`;
      const wrong = new Set<number>();
      while (wrong.size < 3) {
        const w = Math.max(1, answer + (Math.floor(Math.random() * 5) - 2));
        if (w !== answer) wrong.add(w);
      }
      return {
        text,
        options: [...Array.from(wrong), answer].sort(() => Math.random() - 0.5),
        answer,
      };
    }

    // Class 4 Fractions Chapter
    if (chapTitle.includes('fraction') || chapTitle.includes('decimal')) {
      const bank: MathQuestion[] = [
        { text: '1/4 + 2/4', options: ['3/4', '1/2', '3/8', '4/4'], answer: '3/4' },
        { text: 'Half of 20', options: [10, 5, 15, 40], answer: 10 },
        { text: 'Quarter (1/4) of 16', options: [4, 8, 2, 12], answer: 4 },
        { text: '0.5 as a Fraction', options: ['1/2', '1/5', '5/100', '1/4'], answer: '1/2' },
        { text: '5/8 - 2/8', options: ['3/8', '7/8', '3/16', '1/8'], answer: '3/8' },
      ];
      return bank[Math.floor(Math.random() * bank.length)];
    }

    // Class 4 Place Value & Roman Numerals Chapter
    if (chapTitle.includes('roman') || chapTitle.includes('place value')) {
      const bank: MathQuestion[] = [
        { text: 'Roman Numeral for 10', options: ['X', 'V', 'L', 'C'], answer: 'X' },
        { text: 'Roman Numeral for 50', options: ['L', 'C', 'X', 'V'], answer: 'L' },
        { text: 'Value of IX', options: [9, 11, 6, 4], answer: 9 },
        { text: '1000 + 400 + 20 + 5', options: [1425, 1452, 1245, 4125], answer: 1425 },
        { text: 'Value of XXIV', options: [24, 26, 14, 34], answer: 24 },
      ];
      return bank[Math.floor(Math.random() * bank.length)];
    }

    // Class 4 Standard Multiplication / Division / Addition Blitz
    const mode = Math.random();
    let text = '';
    let answer = 0;

    if (mode < 0.5) {
      const a = Math.floor(Math.random() * 9) + 3; // 3-11
      const b = Math.floor(Math.random() * 8) + 2; // 2-9
      text = `${a} × ${b}`;
      answer = a * b;
    } else if (mode < 0.75) {
      const b = Math.floor(Math.random() * 7) + 2;
      const ans = Math.floor(Math.random() * 8) + 2;
      const a = b * ans;
      text = `${a} ÷ ${b}`;
      answer = ans;
    } else {
      const a = Math.floor(Math.random() * 50) + 15;
      const b = Math.floor(Math.random() * 40) + 12;
      text = `${a} + ${b}`;
      answer = a + b;
    }

    const wrongOptions = new Set<number>();
    while (wrongOptions.size < 3) {
      const delta = (Math.floor(Math.random() * 7) - 3) * 2 || 2;
      const wrong = Math.max(1, answer + delta);
      if (wrong !== answer) wrongOptions.add(wrong);
    }

    const options = [...Array.from(wrongOptions), answer].sort(() => Math.random() - 0.5);
    return { text, options, answer };
  };

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setTimeLeft(30);
    setScore(0);
    setStreak(0);
    setCurrentQ(generateQuestion());
  };

  useEffect(() => {
    setIsPlaying(false);
    setGameOver(false);
  }, [chapter?.id, activeChild?.id]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    soundEffects.playStar();
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    addStars(Math.max(1, Math.floor(score / 2)));
    speak(language === 'ml' ? `അതിശയകരം! നിങ്ങൾ ${score} പോയിന്റുകൾ നേടി!` : `Time is up! You scored ${score} points!`);
  };

  const handleAnswer = (choice: number | string) => {
    if (!currentQ) return;
    if (choice === currentQ.answer) {
      soundEffects.playCorrect();
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
      setCurrentQ(generateQuestion());
    } else {
      soundEffects.playIncorrect();
      setStreak(0);
      setCurrentQ(generateQuestion());
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border-4 border-blue-400 shadow-xl max-w-lg mx-auto text-center">
      <div className="flex items-center justify-between mb-4">
        <div className="text-left">
          {chapter && (
            <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
              {subject?.icon || '⚡'} {activeChild?.classGrade} • Ch {chapter.chapterNumber}
            </span>
          )}
          <div className="flex items-center space-x-2 mt-1">
            <Zap className="w-6 h-6 text-amber-500 animate-bounce" />
            <h3 className="text-xl font-black text-slate-800">
              {language === 'ml' ? 'കണക്ക് സ്പീഡ് ചലഞ്ച് ⚡' : isUKG ? 'UKG Counting Blitz ⚡' : 'Class 4 Speed Math Blitz ⚡'}
            </h3>
          </div>
        </div>

        {isPlaying && (
          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-2xl border border-blue-200">
            <Timer className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="font-mono font-black text-blue-700">{timeLeft}s</span>
          </div>
        )}
      </div>

      {!isPlaying && !gameOver && (
        <div className="py-8">
          <div className="text-5xl mb-4">⏱️ 🧮</div>
          <h4 className="text-lg font-bold text-slate-700 mb-2">
            {language === 'ml' ? '30 സെക്കൻഡിൽ എത്ര ചോദ്യങ്ങൾ ചെയ്യാം?' : 'How many problems can you solve in 30s?'}
          </h4>
          <p className="text-xs text-slate-500 mb-6">
            {isUKG
              ? 'Fun picture counting and easy addition for UKG!'
              : 'Class 4 multiplication, division, fractions, and mental math!'}
          </p>
          <button
            onClick={startGame}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black text-lg rounded-2xl shadow-lg btn-kid-3d"
          >
            {language === 'ml' ? 'കളി തുടങ്ങാം! 🚀' : 'Start Blitz! 🚀'}
          </button>
        </div>
      )}

      {isPlaying && currentQ && (
        <div>
          <div className="flex justify-between items-center px-4 mb-3 text-xs font-bold text-slate-500">
            <span>
              Score: <strong className="text-blue-600 text-sm">{score}</strong>
            </span>
            <span>
              Streak: <strong className="text-amber-500 text-sm">{streak} 🔥</strong>
            </span>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl py-8 mb-6 shadow-inner">
            <span className="text-3xl sm:text-4xl font-black text-blue-900 tracking-wider">
              {currentQ.text} = ?
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                className="py-4 bg-white hover:bg-blue-50 border-3 border-blue-300 active:border-blue-500 text-2xl font-black text-slate-800 rounded-2xl shadow-md btn-kid-3d transition"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameOver && (
        <div className="py-6">
          <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-2 animate-bounce" />
          <h4 className="text-2xl font-black text-slate-800">
            {language === 'ml' ? 'സമയമായി!' : 'Time Up! Excellent Job!'}
          </h4>
          <p className="text-lg font-bold text-blue-600 mt-1">
            Score: {score} correct answers!
          </p>
          <p className="text-xs text-slate-500 mt-1">
            +{Math.max(1, Math.floor(score / 2))} Stars added to your profile ⭐
          </p>
          <button
            onClick={startGame}
            className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl flex items-center space-x-2 mx-auto shadow-md btn-kid-3d"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{language === 'ml' ? 'വീണ്ടും കളിക്കാം' : 'Play Again'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
