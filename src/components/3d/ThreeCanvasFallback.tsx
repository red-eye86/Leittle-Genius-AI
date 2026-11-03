'use client';

import React, { useEffect, useRef } from 'react';
import { Volume2 } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';

export default function ThreeCanvasFallback({ title = '2D Interactive Science View' }: { title?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { language, speak } = useApp();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Sun
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Orbit 1: Earth
      ctx.beginPath();
      ctx.arc(cx, cy, 80, 0, Math.PI * 2);
      ctx.strokeStyle = '#cbd5e1';
      ctx.setLineDash([4, 4]);
      ctx.stroke();

      const earthX = cx + Math.cos(angle) * 80;
      const earthY = cy + Math.sin(angle) * 80;

      ctx.beginPath();
      ctx.arc(earthX, earthY, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();

      // Orbit 2: Mars
      ctx.beginPath();
      ctx.arc(cx, cy, 130, 0, Math.PI * 2);
      ctx.strokeStyle = '#cbd5e1';
      ctx.stroke();

      const marsX = cx + Math.cos(angle * 0.7) * 130;
      const marsY = cy + Math.sin(angle * 0.7) * 130;

      ctx.beginPath();
      ctx.arc(marsX, marsY, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();

      angle += 0.02;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-slate-900 border-4 border-sky-400 p-4 text-center">
      <div className="flex items-center justify-between mb-3 text-white">
        <h4 className="text-sm font-bold text-sky-300">{title}</h4>
        <button
          onClick={() => speak(language === 'ml' ? 'സൗരയൂഥത്തിന്റെ 2D കാഴ്ച' : '2D Solar System View')}
          className="bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold px-3 py-1 rounded-xl text-xs flex items-center space-x-1"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{language === 'ml' ? 'ശബ്ദം' : 'Listen'}</span>
        </button>
      </div>
      <canvas ref={canvasRef} width={600} height={320} className="w-full max-w-lg mx-auto rounded-2xl bg-slate-950" />
      <p className="text-xs text-slate-400 mt-2">
        {language === 'ml' ? '2D മോഡ് - സുഗമമായ പഠനാനുഭവം' : 'Optimized 2D fallback mode for smooth battery-saving performance'}
      </p>
    </div>
  );
}

