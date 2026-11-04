'use client';

import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, Sparkles, Volume2, Palette, PenTool, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { TextbookChapter, Subject } from '@/lib/db/types';

type TraceCategory = 'chapter_words' | 'letters' | 'numbers' | 'shapes' | 'freedraw';

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

interface TracingGameProps {
  chapter?: TextbookChapter | null;
  subject?: Subject | null;
}

const BASE_TRACE_ITEMS: TraceItem[] = [
  // Letters
  { id: 'l-a', category: 'letters', display: 'A', label: 'Letter A', malayalamLabel: 'അക്ഷരം A', guide: 'Slant down left, slant down right, cross the middle!', phonics: 'A is for Apple! Ah, Ah, Apple!', color: '#ef4444' },
  { id: 'l-b', category: 'letters', display: 'B', label: 'Letter B', malayalamLabel: 'അക്ഷരം B', guide: 'Straight line down, two big bouncy bellies!', phonics: 'B is for Ball! Buh, Buh, Ball!', color: '#3b82f6' },
  { id: 'l-c', category: 'letters', display: 'C', label: 'Letter C', malayalamLabel: 'അക്ഷരം C', guide: 'Curve around like a crescent moon!', phonics: 'C is for Cat! Kuh, Kuh, Cat!', color: '#f59e0b' },
  { id: 'l-d', category: 'letters', display: 'D', label: 'Letter D', malayalamLabel: 'അക്ഷരം D', guide: 'Straight line down and one big curved tummy!', phonics: 'D is for Dog! Duh, Duh, Dog!', color: '#10b981' },
  { id: 'l-e', category: 'letters', display: 'E', label: 'Letter E', malayalamLabel: 'അക്ഷരം E', guide: 'Line down, top hat, middle belt, bottom shoes!', phonics: 'E is for Elephant! Eh, Eh, Elephant!', color: '#8b5cf6' },
  { id: 'l-m', category: 'letters', display: 'M', label: 'Letter M', malayalamLabel: 'അക്ഷരം M', guide: 'Up the mountain, down, up again, and down!', phonics: 'M is for Mango! Mmm, Mango!', color: '#ec4899' },
  { id: 'l-mal-a', category: 'letters', display: 'അ', label: 'Malayalam അ', malayalamLabel: 'മലയാളം അ (അമ്മ)', guide: 'Curve gently around like a wave!', phonics: 'അ — അമ്മ! അണ്ണാൻ!', color: '#0ea5e9' },
  { id: 'l-mal-aa', category: 'letters', display: 'ആ', label: 'Malayalam ആ', malayalamLabel: 'മലയാളം ആ (ആന)', guide: 'Trace Malayalam vowel ആ carefully!', phonics: 'ആ — ആന! ആമ!', color: '#10b981' },

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

export default function TracingGame({ chapter, subject }: TracingGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { language, speak, addStars } = useApp();

  const [category, setCategory] = useState<TraceCategory>('chapter_words');
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [brushColor, setBrushColor] = useState('#ef4444');
  const [brushSize, setBrushSize] = useState(14);
  const [isDrawing, setIsDrawing] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Path metrics tracking to avoid premature completion
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const strokeLengthRef = useRef<number>(0);
  const minXRef = useRef<number>(9999);
  const maxXRef = useRef<number>(0);
  const minYRef = useRef<number>(9999);
  const maxYRef = useRef<number>(0);

  // Build chapter-specific tracing words from chapter.keyTerms
  const chapterTraceItems: TraceItem[] = (chapter?.keyTerms || []).map((term, idx) => {
    const cleanWord = term.split('(')[0].trim().slice(0, 14);
    const color = CRAYON_COLORS[idx % CRAYON_COLORS.length].hex;
    return {
      id: `cw-${chapter?.id}-${idx}`,
      category: 'chapter_words',
      display: cleanWord,
      label: `"${cleanWord}" (${chapter?.title || 'Chapter Term'})`,
      malayalamLabel: `"${cleanWord}" (${chapter?.malayalamTitle || ''})`,
      guide: `Trace the key word "${cleanWord}" from Ch ${chapter?.chapterNumber}: ${chapter?.title}!`,
      phonics: `${cleanWord}. Key term from ${chapter?.title}.`,
      color,
    };
  });

  const allItems = [...chapterTraceItems, ...BASE_TRACE_ITEMS];
  const filteredItems = allItems.filter((item) => item.category === category);
  const currentItem = filteredItems[selectedItemIndex] || allItems[0];

  useEffect(() => {
    setSelectedItemIndex(0);
  }, [chapter?.id]);

  useEffect(() => {
    if (category !== 'freedraw' && currentItem) {
      setBrushColor(currentItem.color);
    }
    drawCanvasGuide();
  }, [category, selectedItemIndex, chapter?.id]);

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
      ctx.moveTo(cx, cy - 35);
      ctx.bezierCurveTo(cx, cy - 45, cx - 90, cy - 90, cx - 90, cy - 20);
      ctx.bezierCurveTo(cx - 90, cy + 35, cx, cy + 65, cx, cy + 95);
      ctx.bezierCurveTo(cx, cy + 65, cx + 90, cy + 35, cx + 90, cy - 20);
      ctx.bezierCurveTo(cx + 90, cy - 90, cx, cy - 45, cx, cy - 35);
      ctx.closePath();
    }
  };

  const drawCanvasGuide = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw notebook guidelines
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

    // Reset metric tracking
    lastPointRef.current = null;
    strokeLengthRef.current = 0;
    minXRef.current = 9999;
    maxXRef.current = 0;
    minYRef.current = 9999;
    maxYRef.current = 0;
    setCompleted(false);

    if (category === 'freedraw') {
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
      ctx.lineWidth = 10;
      ctx.setLineDash([12, 14]);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    } else if (currentItem) {
      const len = currentItem.display.length;
      const fontSize = len <= 2 ? 170 : len <= 5 ? 95 : len <= 8 ? 68 : 50;
      ctx.font = `bold ${fontSize}px "Comic Sans MS", "Comic Neue", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(currentItem.display, cx, cy);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = len <= 2 ? 10 : 5;
      ctx.setLineDash([8, 10]);
      ctx.strokeText(currentItem.display, cx, cy);
    }
    ctx.restore();
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
    lastPointRef.current = { x, y };
    minXRef.current = Math.min(minXRef.current, x);
    maxXRef.current = Math.max(maxXRef.current, x);
    minYRef.current = Math.min(minYRef.current, y);
    maxYRef.current = Math.max(maxYRef.current, y);

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

    if (lastPointRef.current) {
      const dist = Math.hypot(x - lastPointRef.current.x, y - lastPointRef.current.y);
      strokeLengthRef.current += dist;
    }
    lastPointRef.current = { x, y };

    minXRef.current = Math.min(minXRef.current, x);
    maxXRef.current = Math.max(maxXRef.current, x);
    minYRef.current = Math.min(minYRef.current, y);
    maxYRef.current = Math.max(maxYRef.current, y);
  };

  const triggerCompletion = () => {
    if (completed) return;
    setCompleted(true);
    soundEffects.playCorrect();
    addStars(3);
    confetti({ particleCount: 55, spread: 65, origin: { y: 0.65 } });
    speak(
      language === 'ml'
        ? `വളരെ മിടുക്കൻ! ${currentItem.malayalamLabel} മനോഹരമായി എഴുതി!`
        : `Awesome job tracing ${currentItem.display}! You earned 3 stars!`
    );
  };

  const stopDraw = () => {
    setIsDrawing(false);
    lastPointRef.current = null;

    if (category === 'freedraw') return;

    // Check completion ONLY when user finishes a stroke (lifts pen/finger)
    // and has covered substantial length and span across the word
    const totalLength = strokeLengthRef.current;
    const spanX = maxXRef.current - minXRef.current;
    const isWord = category === 'chapter_words';
    const charCount = currentItem?.display?.length || 1;

    // Generous thresholds so child can comfortably draw without false triggers
    const requiredLength = isWord ? Math.max(260, charCount * 55) : category === 'shapes' ? 240 : 150;
    const requiredSpan = isWord ? Math.max(90, charCount * 25) : 40;

    if (!completed && totalLength >= requiredLength && spanX >= requiredSpan) {
      triggerCompletion();
    }
  };

  const handleNextItem = () => {
    soundEffects.playPop();
    if (filteredItems.length > 0) {
      setSelectedItemIndex((prev) => (prev + 1) % filteredItems.length);
    }
  };

  return (
    <div className="bg-white rounded-4xl p-5 sm:p-7 border-4 border-pink-300 shadow-xl max-w-2xl mx-auto space-y-5">
      {/* Chapter Badge */}
      {chapter && (
        <div className="text-center">
          <span className="text-[11px] font-black uppercase px-3 py-1 rounded-full bg-pink-100 text-pink-700">
            {subject?.icon || '✍️'} {language === 'ml' ? subject?.malayalamName : subject?.name} • Ch {chapter.chapterNumber}: {chapter.title}
          </span>
        </div>
      )}

      {/* Top Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          ...(chapterTraceItems.length > 0
            ? [{ id: 'chapter_words', label: '📖 Chapter Words', ml: '📖 പാഠത്തിലെ വാക്കുകൾ' }]
            : []),
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
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition ${
              category === tab.id
                ? 'bg-pink-500 text-white shadow-md scale-105'
                : 'bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200'
            }`}
          >
            {language === 'ml' ? tab.ml : tab.label}
          </button>
        ))}
      </div>

      {/* Item Quick Picker Pills */}
      {category !== 'freedraw' && (
        <div className="flex items-center justify-center flex-wrap gap-2">
          {filteredItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                soundEffects.playPop();
                setSelectedItemIndex(idx);
              }}
              className={`px-3.5 py-1.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center border-2 transition ${
                selectedItemIndex === idx
                  ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-sm scale-105'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {item.display}
            </button>
          ))}
        </div>
      )}

      {/* Header & Audio Guide */}
      <div className="flex items-center justify-between bg-pink-50/70 p-3.5 sm:p-4 rounded-3xl border border-pink-200">
        <div className="flex items-center space-x-3 text-left">
          <span className="text-2xl sm:text-3xl font-black text-pink-600">
            {category === 'freedraw' ? '🎨' : currentItem?.display}
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-800">
              {category === 'freedraw'
                ? language === 'ml'
                  ? 'സ്വതന്ത്രമായി ചിത്രം വരയ്ക്കാം (Mouse / Finger / Stylus)'
                  : 'Free Drawing Pad (Use Mouse, Finger, or Stylus)'
                : language === 'ml'
                ? currentItem?.malayalamLabel
                : `Trace ${currentItem?.label}`}
            </h3>
            <p className="text-[11px] sm:text-xs text-pink-600 font-bold">
              {category === 'freedraw'
                ? 'Pick any crayon color below and draw your masterpiece!'
                : currentItem?.guide}
            </p>
          </div>
        </div>

        {category !== 'freedraw' && currentItem && (
          <button
            onClick={() => speak(currentItem.phonics)}
            className="p-2.5 sm:p-3 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl shadow-md btn-kid-3d flex items-center space-x-1.5 text-xs font-black shrink-0"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'ml' ? 'ശബ്ദം' : 'Hear Sound'}</span>
          </button>
        )}
      </div>

      {/* Crayon Colors & Brush Thickness */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center space-x-2">
          <Palette className="w-4 h-4 text-slate-500" />
          <div className="flex items-center space-x-1.5">
            {CRAYON_COLORS.map((col) => (
              <button
                key={col.hex}
                onClick={() => setBrushColor(col.hex)}
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 transition transform ${
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
            { label: 'Medium', size: 16 },
            { label: 'Jumbo', size: 24 },
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
      <div className="space-y-3">
        <div className="relative flex justify-center">
          <div className="relative inline-block border-4 border-dashed border-pink-300 rounded-3xl bg-white p-2 touch-none shadow-inner">
            <canvas
              ref={canvasRef}
              width={480}
              height={300}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
              className="rounded-2xl cursor-crosshair bg-white max-w-full h-auto"
            />
          </div>
        </div>

        {/* Celebratory Banner - Keeps canvas fully accessible without blocking */}
        {completed && category !== 'freedraw' && (
          <div className="bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 text-white p-3.5 rounded-2xl shadow-lg flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-6 h-6 text-yellow-200 shrink-0 animate-spin" />
              <div>
                <h4 className="text-xs sm:text-sm font-black">
                  {language === 'ml' ? 'വളരെ മിടുക്കൻ! മനോഹരമായി വരച്ചു!' : 'Super Tracing Champion! ⭐⭐⭐'}
                </h4>
                <p className="text-[11px] text-pink-100 font-bold">
                  {language === 'ml' ? '+3 സ്റ്റാറുകൾ ലഭിച്ചു! തുടർന്നും വരയ്ക്കാം.' : '+3 Stars Earned! Keep drawing or tap Next.'}
                </p>
              </div>
            </div>
            <button
              onClick={handleNextItem}
              className="px-4 py-2 rounded-xl bg-white text-pink-600 hover:bg-pink-50 font-black text-xs shadow-md shrink-0 flex items-center space-x-1"
            >
              <span>{language === 'ml' ? 'അടുത്തത്' : 'Trace Next'}</span>
              <span>👉</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Action Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
        <button
          onClick={drawCanvasGuide}
          className="px-4 py-2.5 rounded-2xl border-2 border-slate-300 text-slate-700 font-black text-xs flex items-center space-x-1.5 hover:bg-slate-50 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{language === 'ml' ? 'മായ്ക്കുക' : 'Clear Canvas'}</span>
        </button>

        {category !== 'freedraw' && !completed && (
          <button
            onClick={triggerCompletion}
            className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs sm:text-sm flex items-center space-x-1.5 shadow-md transition"
          >
            <Sparkles className="w-4 h-4 text-amber-800" />
            <span>{language === 'ml' ? 'പൂർത്തിയായി! ⭐' : 'Done Tracing! ⭐'}</span>
          </button>
        )}

        {category !== 'freedraw' && (
          <button
            onClick={handleNextItem}
            className="px-5 py-2.5 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-black text-xs sm:text-sm flex items-center space-x-1.5 shadow-lg transition btn-kid-3d"
          >
            <span>
              {language === 'ml'
                ? 'അടുത്തത്'
                : category === 'chapter_words'
                ? 'Next Word'
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
