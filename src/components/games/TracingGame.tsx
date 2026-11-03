'use client';

import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, Sparkles, Volume2 } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';

const TRACE_TARGETS = [
  { char: 'A', guide: 'Slant up, slant down, cross the bridge!', phonics: 'Ah for Apple 🍎', color: '#ef4444' },
  { char: 'B', guide: 'Straight line down, round and round!', phonics: 'Buh for Ball ⚽', color: '#3b82f6' },
  { char: 'C', guide: 'Curl around like a round moon!', phonics: 'Kuh for Cat 🐱', color: '#f59e0b' },
  { char: '1', guide: 'Straight stick down, that is one!', phonics: 'Number One 🌟', color: '#10b981' },
  { char: '2', guide: 'Around and back on the railroad track: Two Two!', phonics: 'Number Two ✌️', color: '#8b5cf6' },
];

export default function TracingGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { language, speak, addStars } = useApp();
  const [targetIndex, setTargetIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnPointsCount, setDrawnPointsCount] = useState(0);
  const [completed, setCompleted] = useState(false);

  const current = TRACE_TARGETS[targetIndex];

  useEffect(() => {
    drawGuide();
  }, [targetIndex]);

  const drawGuide = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw dotted dashed guide letter
    ctx.font = 'bold 160px "Comic Sans MS", "Comic Neue", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 14;
    ctx.setLineDash([8, 12]);
    ctx.strokeText(current.char, canvas.width / 2, canvas.height / 2);

    // Draw faint fill
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(current.char, canvas.width / 2, canvas.height / 2);

    setDrawnPointsCount(0);
    setCompleted(false);
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.setLineDash([]);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 20;
    ctx.strokeStyle = current.color;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();

    setDrawnPointsCount((prev) => {
      const next = prev + 1;
      if (next >= 40 && !completed) {
        setCompleted(true);
        soundEffects.playCorrect();
        addStars(2);
        speak(language === 'ml' ? `വളരെ മിടുക്കി! ${current.char} ഭംഗിയായി എഴുതി!` : `Super job tracing ${current.char}!`);
      }
      return next;
    });
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const nextChar = () => {
    soundEffects.playPop();
    setTargetIndex((prev) => (prev + 1) % TRACE_TARGETS.length);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border-4 border-pink-300 shadow-xl max-w-lg mx-auto text-center">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">✍️</span>
          <div className="text-left">
            <h3 className="text-lg font-black text-slate-800">
              {language === 'ml' ? 'അക്ഷരങ്ങൾ വിരൽ കൊണ്ട് വരയ്ക്കാം' : 'Letter & Number Tracing'}
            </h3>
            <p className="text-xs text-pink-500 font-bold">{current.guide}</p>
          </div>
        </div>

        <button
          onClick={() => speak(current.phonics)}
          className="p-2 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded-xl"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      <div className="relative inline-block border-4 border-dashed border-pink-200 rounded-3xl bg-pink-50/50 p-2 touch-none">
        <canvas
          ref={canvasRef}
          width={340}
          height={300}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          className="rounded-2xl cursor-crosshair bg-white shadow-inner"
        />

        {completed && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center animate-fade-in">
            <Sparkles className="w-12 h-12 text-yellow-400 animate-spin mb-2" />
            <h4 className="text-2xl font-black text-pink-600">
              {language === 'ml' ? 'മിടുക്കൻ!' : 'Splendid!'}
            </h4>
            <p className="text-sm font-bold text-slate-600 mt-1">+2 Stars Earned ⭐⭐</p>
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-center space-x-4">
        <button
          onClick={drawGuide}
          className="px-4 py-2.5 rounded-2xl border-2 border-slate-300 text-slate-600 font-bold text-xs flex items-center space-x-1 hover:bg-slate-50"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{language === 'ml' ? 'വീണ്ടും വരയ്ക്കാം' : 'Clear & Retry'}</span>
        </button>

        <button
          onClick={nextChar}
          className="px-6 py-2.5 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-black text-sm flex items-center space-x-2 shadow-lg btn-kid-3d"
        >
          <span>{language === 'ml' ? 'അടുത്ത അക്ഷരം' : 'Next Letter'}</span>
          <span>👉</span>
        </button>
      </div>
    </div>
  );
}

