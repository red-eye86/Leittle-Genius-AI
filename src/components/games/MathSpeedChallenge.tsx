'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Timer, Zap, Trophy, RefreshCw } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';

interface MathQuestion {
  text: string;
  options: number[];
  answer: number;
}

export default function MathSpeedChallenge() {
  const { language, speak, addStars } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentQ, setCurrentQ] = useState<MathQuestion | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const generateQuestion = (): MathQuestion => {
    // Multiplication tables (2 to 9) or addition
    const isMultiplication = Math.random() > 0.3;
    let text = '';
    let answer = 0;

    if (isMultiplication) {
      const a = Math.floor(Math.random() * 8) + 2; // 2-9
      const b = Math.floor(Math.random() * 8) + 2; // 2-9
      text = `${a} × ${b}`;
      answer = a * b;
    } else {
      const a = Math.floor(Math.random() * 40) + 10;
      const b = Math.floor(Math.random() * 40) + 10;
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

  const handleAnswer = (choice: number) => {
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
        <div className="flex items-center space-x-2">
          <Zap className="w-6 h-6 text-amber-500 animate-bounce" />
          <h3 className="text-xl font-black text-slate-800">
            {language === 'ml' ? 'കണക്ക് സ്പീഡ് ചലഞ്ച് ⚡' : 'Speed Math Blitz ⚡'}
          </h3>
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
            {language === 'ml' ? 'ഗുണനവും കൂട്ടലും എളുപ്പത്തിൽ പരിശീലിക്കാം' : 'Sharpen your multiplication and addition skills!'}
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
            <span>Score: <strong className="text-blue-600 text-sm">{score}</strong></span>
            <span>Streak: <strong className="text-amber-500 text-sm">{streak} 🔥</strong></span>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl py-8 mb-6 shadow-inner">
            <span className="text-4xl sm:text-5xl font-black text-blue-900 tracking-wider">
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

