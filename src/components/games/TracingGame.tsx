'use client';

import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, Sparkles, Volume2, Palette, PenTool } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';

type TraceCategory = 'letters' | 'numbers' | 'shapes' | 'freedraw';

interface TraceItem {
  id: string;
  category: TraceCategory;
  display: string;
  label: string;
  malayalamLabel: string;
  guide: string;
  phonics: string;
  color: string;
  shapeType?: 'circle' | 'square' | 'triangle' | 'star' | 'heart';
}

const TRACE_ITEMS: TraceItem[] = [
  // Letters
  { id: 'l-a', category: 'letters', display: 'A', label: 'Letter A', malayalamLabel: 'അക്ഷരം A', guide: 'Slant down left, slant down right, cross the middle!', phonics: 'A is for Apple! Ah, Ah, Apple!', color: '#ef4444' },
  { id: 'l-b', category: 'letters', display: 'B', label: 'Letter B', malayalamLabel: 'അക്ഷരം B', guide: 'Straight line down, two big bouncy bellies!', phonics: 'B is for Ball! Buh, Buh, Ball!', color: '#3b82f6' },
  { id: 'l-c', category: 'letters', display: 'C', label: 'Letter C', malayalamLabel: 'അക്ഷരം C', guide: 'Curve around like a crescent moon!', phonics: 'C is for Cat! Kuh, Kuh, Cat!', color: '#f59e0b' },
  { id: 'l-d', category: 'letters', display: 'D', label: 'Letter D', malayalamLabel: 'അക്ഷരം D', guide: 'Straight line down and one big curved tummy!', phonics: 'D is for Dog! Duh, Duh, Dog!', color: '#10b981' },
  { id: 'l-e', category: 'letters', display: 'E', label: 'Letter E', malayalamLabel: 'അക്ഷരം E', guide: 'Line down, top hat, middle belt, bottom shoes!', phonics: 'E is for Elephant! Eh, Eh, Elephant!', color: '#8b5cf6' },
  { id: 'l-m', category: 'letters', display: 'M', label: 'Letter M', malayalamLabel: 'അക്ഷരം M', guide: 'Up the mountain, down, up again, and down!', phonics: 'M is for Mango! Mmm, Mango!', color: '#ec4899' },
  { id: 'l-mal-a', category: 'letters', display: 'അ', label: 'Malayalam അ', malayalamLabel: 'മലയാളം അ (അമ്മ)', guide: 'Curve gently around like a wave!', phonics: 'അ — അമ്മ! അണ്ണാൻ!', color: '#0ea5e9' },

  // Numbers
  { id: 'n-1', category: 'numbers', display: '1', label: 'Number 1', malayalamLabel: 'സംഖ്യ 1 (ഒന്ന്)', guide: 'Straight stick down from top to bottom: One!', phonics: 'Number One! One bright sun!', color: '#10b981' },
  { id: 'n-2', category: 'numbers', display: '2', label: 'Number 2', malayalamLabel: 'സംഖ്യ 2 (രണ്ട്)', guide: 'Curve around the track and slide right back: Two!', phonics: 'Number Two! Two little shoes!', color: '#8b5cf6' },
  { id: 'n-3', category: 'numbers', display: '3', label: 'Number 3', malayalamLabel: 'സംഖ്യ 3 (മൂന്ന്)', guide: 'Around the tree and around the tree: Three!', phonics: 'Number Three! Three buzzing bees!', color: '#f97316' },
  { id: 'n-4', category: 'numbers', display: '4', label: 'Number 4', malayalamLabel: 'സംഖ്യ 4 (നാല്)', guide: 'Down and across, then straight down once more: Four!', phonics: 'Number Four! Four legs on a chair!', color: '#ef4444' },
  { id: 'n-5', category: 'numbers', display: '5', label: 'Number 5', malayalamLabel: 'സംഖ്യ 5 (അഞ്ച്)', guide: 'Short neck, big round tummy, hat on top: Five!', phonics: 'Number Five! High five!', color: '#3b82f6' },

  // Shapes
  { id: 's-circle', category: 'shapes', display: '⭕', label: 'Circle', malayalamLabel: 'വൃത്തം (Circle)', guide: 'Go round and round like a bouncy ball!', phonics: 'Circle! Round like the full moon and a wheel!', color: '#ef4444', shapeType: 'circle' },
  { id: 's-square', category: 'shapes', display: '🟦', label: 'Square', malayalamLabel: 'സമചതുരം (Square)', guide: 'Four equal straight sides and four corners!', phonics: 'Square! Four equal sides like a window!', color: '#3b82f6', shapeType: 'square' },
  { id: 's-triangle', category: 'shapes', display: '🔺', label: 'Triangle', malayalamLabel: 'ത്രികോണം (Triangle)', guide: 'Three slanted sides like a mountain peak!', phonics: 'Triangle! Three sides and three pointy corners!', color: '#10b981', shapeType: 'triangle' },
  { id: 's-star', category: 'shapes', display: '⭐', label: 'Star', malayalamLabel: 'നക്ഷത്രം (Star)', guide: 'Five shining points twinkling in the sky!', phonics: 'Star! Twinkle twinkle little star!', color: '#eab308', shapeType: 'star' },
  { id: 's-heart', category: 'shapes', display: '❤️', label: 'Heart', malayalamLabel: 'ഹൃദയം (Heart)', guide: 'Two curves on top meeting at a point below!', phonics: 'Heart! Full of love and kindness!', color: '#ec4899', shapeType: 'heart' },
];

const CRAYON_COLORS = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#10b981' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Gold', hex: '#eab308' },
];

export default function TracingGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { language, speak, addStars } = useApp();

  const [category, setCategory] = useState<TraceCategory>('letters');
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [brushColor, setBrushColor] = useState('#ef4444');
  const [brushSize, setBrushSize] = useState(18);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnPointsCount, setDrawnPointsCount] = useState(0);
  const [completed, setCompleted] = useState(false);

  const filteredItems = TRACE_ITEMS.filter((item) => item.category === category);
  const currentItem = filteredItems[selectedItemIndex] || TRACE_ITEMS[0];

  useEffect(() => {
    if (category !== 'freedraw' && currentItem) {
      setBrushColor(currentItem.color);
    }
    drawCanvasGuide();
  }, [category, selectedItemIndex]);

  const drawShapePath = (ctx: CanvasRenderingContext2D, shape: string, cx: number, cy: number) => {
    ctx.beginPath();
    if (shape === 'circle') {
      ctx.arc(cx, cy, 95, 0, Math.PI * 2);
    } else if (shape === 'square') {
      ctx.rect(cx - 85, cy - 85, 170, 170);
    } else if (shape === 'triangle') {
      ctx.moveTo(cx, cy - 95);
      ctx.lineTo(cx + 95, cy + 80);
      ctx.lineTo(cx - 95, cy + 80);
      ctx.closePath();
    } else if (shape === 'star') {
      const spikes = 5;
      const outerRadius = 100;
      const innerRadius = 45;
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;
        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
    } else if (shape === 'heart') {
      const topCurveHeight = 55;
      ctx.moveTo(cx, cy - 35);
      ctx.bezierCurveTo(cx, cy - 45, cx - 90, cy - 90, cx - 90, cy - 20);
      ctx.bezierCurveTo(cx - 90, cy + 35, cx, cy + 65, cx, cy + 95);
      ctx.bezierCurveTo(cx, cy + 65, cx + 90, cy + 35, cx + 90, cy - 20);
      ctx.bezierCurveTo(cx + 90, cy - 90, cx, cy - 45, cx, cy - 35);
      void topCurveHeight;
      ctx.closePath();
    }
  };

  const drawCanvasGuide = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw notebook grid lines subtly
    ctx.save();
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    for (let y = 40; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    ctx.restore();

    if (category === 'freedraw') {
      setDrawnPointsCount(0);
      setCompleted(false);
      return;
    }

    ctx.save();
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    if (category === 'shapes' && currentItem?.shapeType) {
      drawShapePath(ctx, currentItem.shapeType, cx, cy);
      ctx.fillStyle = '#f8fafc';
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 12;
      ctx.setLineDash([12, 14]);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    } else if (currentItem) {
      ctx.font = 'bold 175px "Comic Sans MS", "Comic Neue", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(currentItem.display, cx, cy);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 12;
      ctx.setLineDash([10, 14]);
      ctx.strokeText(currentItem.display, cx, cy);
    }
    ctx.restore();

    setDrawnPointsCount(0);
    setCompleted(false);
  };

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement> | React.PointerEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e && e.touches.length > 0) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else if ('clientX' in e) {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
    return { x: 0, y: 0 };
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
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = brushColor;
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
      if (category !== 'freedraw' && next >= 42 && !completed) {
        setCompleted(true);
        soundEffects.playCorrect();
        addStars(3);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        speak(
          language === 'ml'
            ? `വളരെ മിടുക്കൻ! ${currentItem.malayalamLabel} മനോഹരമായി വരച്ചു!`
            : `Awesome job tracing ${currentItem.label}! You earned 3 stars!`
        );
      }
      return next;
    });
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const handleNextItem = () => {
    soundEffects.playPop();
    if (filteredItems.length > 0) {
      setSelectedItemIndex((prev) => (prev + 1) % filteredItems.length);
    }
  };

  return (
    <div className="bg-white rounded-4xl p-6 sm:p-8 border-4 border-pink-300 shadow-xl max-w-2xl mx-auto space-y-6">
      {/* Top Category Tabs: Letters, Numbers, Shapes, Free Draw */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { id: 'letters', label: '🔤 Letters (A-Z / അ)', ml: '🔤 അക്ഷരങ്ങൾ' },
          { id: 'numbers', label: '🔢 Numbers (1-5)', ml: '🔢 സംഖ്യകൾ' },
          { id: 'shapes', label: '🔺 Shapes', ml: '🔺 രൂപങ്ങൾ (Shapes)' },
          { id: 'freedraw', label: '🎨 Free Drawing', ml: '🎨 ചിത്രം വരയ്ക്കാം' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              soundEffects.playPop();
              setCategory(tab.id as TraceCategory);
              setSelectedItemIndex(0);
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition ${
              category === tab.id
                ? 'bg-pink-500 text-white shadow-md scale-105'
                : 'bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200'
            }`}
          >
            {language === 'ml' ? tab.ml : tab.label}
          </button>
        ))}
      </div>

      {/* Item Quick Picker Pills (when not in freedraw) */}
      {category !== 'freedraw' && (
        <div className="flex items-center justify-center flex-wrap gap-2">
          {filteredItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                soundEffects.playPop();
                setSelectedItemIndex(idx);
              }}
              className={`w-11 h-11 rounded-2xl font-black text-base flex items-center justify-center border-2 transition ${
                selectedItemIndex === idx
                  ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-sm scale-110'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {item.display}
            </button>
          ))}
        </div>
      )}

      {/* Header & Audio Guide */}
      <div className="flex items-center justify-between bg-pink-50/70 p-4 rounded-3xl border border-pink-200">
        <div className="flex items-center space-x-3 text-left">
          <span className="text-3xl">{category === 'freedraw' ? '🎨' : currentItem?.display}</span>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              {category === 'freedraw'
                ? language === 'ml'
                  ? 'സ്വതന്ത്രമായി ചിത്രം വരയ്ക്കാം (Mouse / Finger / Stylus)'
                  : 'Free Drawing Pad (Use Mouse, Finger, or Stylus)'
                : language === 'ml'
                ? currentItem?.malayalamLabel
                : `Trace ${currentItem?.label}`}
            </h3>
            <p className="text-xs text-pink-600 font-bold">
              {category === 'freedraw'
                ? 'Pick any crayon color below and draw your masterpiece!'
                : currentItem?.guide}
            </p>
          </div>
        </div>

        {category !== 'freedraw' && currentItem && (
          <button
            onClick={() => speak(currentItem.phonics)}
            className="p-3 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl shadow-md btn-kid-3d flex items-center space-x-1.5 text-xs font-black"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'ml' ? 'ശബ്ദം' : 'Hear Sound'}</span>
          </button>
        )}
      </div>

      {/* Crayon Colors & Brush Thickness */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
        <div className="flex items-center space-x-2">
          <Palette className="w-4 h-4 text-slate-500" />
          <div className="flex items-center space-x-1.5">
            {CRAYON_COLORS.map((col) => (
              <button
                key={col.hex}
                onClick={() => setBrushColor(col.hex)}
                className={`w-7 h-7 rounded-full border-2 transition transform ${
                  brushColor === col.hex ? 'scale-125 border-slate-900 shadow-md' : 'border-white'
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.name}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <PenTool className="w-4 h-4 text-slate-500" />
          {[
            { label: 'Fine', size: 10 },
            { label: 'Medium', size: 18 },
            { label: 'Jumbo', size: 26 },
          ].map((b) => (
            <button
              key={b.size}
              onClick={() => setBrushSize(b.size)}
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition ${
                brushSize === b.size ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Drawing Canvas */}
      <div className="relative flex justify-center">
        <div className="relative inline-block border-4 border-dashed border-pink-300 rounded-3xl bg-white p-2 touch-none shadow-inner">
          <canvas
            ref={canvasRef}
            width={420}
            height={320}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
            className="rounded-2xl cursor-crosshair bg-white max-w-full h-auto"
          />

          {completed && category !== 'freedraw' && (
            <div className="absolute inset-0 bg-white/85 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center animate-fade-in p-6">
              <Sparkles className="w-14 h-14 text-amber-400 animate-spin mb-2" />
              <h4 className="text-2xl font-black text-pink-600">
                {language === 'ml' ? 'മിടുക്കൻ! വളരെ മനോഹരം!' : 'Super Tracing Champion!'}
              </h4>
              <p className="text-sm font-black text-amber-600 mt-1">+3 Stars Earned ⭐⭐⭐</p>
              <button
                onClick={handleNextItem}
                className="mt-4 px-6 py-2.5 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-black text-xs shadow-lg btn-kid-3d"
              >
                {language === 'ml' ? 'അടുത്തത് വരയ്ക്കാം 👉' : 'Trace Next 👉'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={drawCanvasGuide}
          className="px-5 py-3 rounded-2xl border-2 border-slate-300 text-slate-700 font-black text-xs flex items-center space-x-1.5 hover:bg-slate-50"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{language === 'ml' ? 'മായ്ച്ച് വീണ്ടും വരയ്ക്കാം' : 'Clear Canvas'}</span>
        </button>

        {category !== 'freedraw' && (
          <button
            onClick={handleNextItem}
            className="px-6 py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-black text-xs sm:text-sm flex items-center space-x-2 shadow-lg btn-kid-3d"
          >
            <span>
              {language === 'ml'
                ? 'അടുത്തത്'
                : category === 'letters'
                ? 'Next Letter'
                : category === 'numbers'
                ? 'Next Number'
                : 'Next Shape'}
            </span>
            <span>👉</span>
          </button>
        )}
      </div>
    </div>
  );
}
