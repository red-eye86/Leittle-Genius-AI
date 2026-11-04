'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  Sparkles,
  Volume2,
  Palette,
  PenTool,
  Undo2,
  Redo2,
  Download,
  Eraser,
  Pencil,
  Highlighter,
  Stamp,
  Grid,
  CheckCircle2,
  Maximize2,
  Sliders,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { TextbookChapter, Subject } from '@/lib/db/types';

type TraceCategory = 'chapter_words' | 'letters' | 'numbers' | 'shapes' | 'freedraw';
type ToolType = 'pencil' | 'pen' | 'crayon' | 'highlighter' | 'rainbow' | 'eraser' | 'stamp';
type GuideLineStyle = 'four_line' | 'grid' | 'blank';

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

// Rich 14-Color Curated Vibrant Palette
const COLOR_PALETTE = [
  { name: 'Crimson Red', hex: '#ef4444' },
  { name: 'Coral Orange', hex: '#f97316' },
  { name: 'Warm Amber', hex: '#f59e0b' },
  { name: 'Sunshine Yellow', hex: '#eab308' },
  { name: 'Lime Green', hex: '#84cc16' },
  { name: 'Emerald Green', hex: '#10b981' },
  { name: 'Sky Cyan', hex: '#06b6d4' },
  { name: 'Bright Blue', hex: '#3b82f6' },
  { name: 'Royal Indigo', hex: '#6366f1' },
  { name: 'Vivid Purple', hex: '#8b5cf6' },
  { name: 'Hot Pink', hex: '#ec4899' },
  { name: 'Earth Brown', hex: '#854d0e' },
  { name: 'Slate Black', hex: '#1e293b' },
  { name: 'Pure White', hex: '#ffffff' },
];

// Precision Pin-Point Presets
const PIN_POINT_PRESETS = [
  { id: 'ultra_pin', label: '📌 Ultra Pin', size: 2, iconLabel: '2px' },
  { id: 'fine_pen', label: '📍 Fine Point', size: 5, iconLabel: '5px' },
  { id: 'medium', label: '✏️ Pencil', size: 10, iconLabel: '10px' },
  { id: 'marker', label: '🖍️ Marker', size: 18, iconLabel: '18px' },
  { id: 'jumbo', label: '🖌️ Jumbo', size: 28, iconLabel: '28px' },
];

const STICKER_STAMPS = ['⭐', '🌸', '🚀', '🐱', '🦋', '🌈', '🏆', '🐾', '🍎', '🎈'];

export default function TracingGame({ chapter, subject }: TracingGameProps) {
  // Layered canvases: guide canvas in back, drawing canvas on top
  const guideCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const { language, speak, addStars } = useApp();

  const [category, setCategory] = useState<TraceCategory>('chapter_words');
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  // Tools & Brushes
  const [currentTool, setCurrentTool] = useState<ToolType>('pencil');
  const [brushColor, setBrushColor] = useState('#ef4444');
  const [brushSize, setBrushSize] = useState(10);
  const [selectedStamp, setSelectedStamp] = useState('⭐');
  const [lineStyle, setLineStyle] = useState<GuideLineStyle>('four_line');
  const [completed, setCompleted] = useState(false);

  // History Undo / Redo Stacks
  const undoStackRef = useRef<ImageData[]>([]);
  const redoStackRef = useRef<ImageData[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Metric tracking for path coverage
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const strokeLengthRef = useRef(0);
  const minXRef = useRef(9999);
  const maxXRef = useRef(0);
  const rainbowHueRef = useRef(0);

  // Build chapter-specific tracing words from chapter.keyTerms
  const chapterTraceItems: TraceItem[] = (chapter?.keyTerms || []).map((term, idx) => {
    const cleanWord = term.split('(')[0].trim().slice(0, 14);
    const color = COLOR_PALETTE[idx % COLOR_PALETTE.length].hex;
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
    if (category !== 'freedraw' && currentItem && currentTool !== 'eraser' && currentTool !== 'rainbow') {
      setBrushColor(currentItem.color);
    }
    drawBackgroundGuide();
    clearDrawCanvas();
  }, [category, selectedItemIndex, chapter?.id, lineStyle]);

  // Save current drawing surface state for Undo
  const pushUndoState = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      undoStackRef.current.push(imgData);
      if (undoStackRef.current.length > 25) {
        undoStackRef.current.shift();
      }
      redoStackRef.current = [];
      setCanUndo(true);
      setCanRedo(false);
    } catch (e) {}
  };

  const handleUndo = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas || undoStackRef.current.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    soundEffects.playPop();
    const currentImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    redoStackRef.current.push(currentImg);

    const previousImg = undoStackRef.current.pop();
    if (previousImg) {
      ctx.putImageData(previousImg, 0, 0);
    }
    setCanUndo(undoStackRef.current.length > 0);
    setCanRedo(true);
  };

  const handleRedo = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas || redoStackRef.current.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    soundEffects.playPop();
    const currentImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStackRef.current.push(currentImg);

    const nextImg = redoStackRef.current.pop();
    if (nextImg) {
      ctx.putImageData(nextImg, 0, 0);
    }
    setCanUndo(true);
    setCanRedo(redoStackRef.current.length > 0);
  };

  const clearDrawCanvas = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    undoStackRef.current = [];
    redoStackRef.current = [];
    setCanUndo(false);
    setCanRedo(false);

    lastPointRef.current = null;
    strokeLengthRef.current = 0;
    minXRef.current = 9999;
    maxXRef.current = 0;
    setCompleted(false);
  };

  const drawShapePath = (ctx: CanvasRenderingContext2D, shape: string, cx: number, cy: number) => {
    ctx.beginPath();
    if (shape === 'circle') {
      ctx.arc(cx, cy, 105, 0, Math.PI * 2);
    } else if (shape === 'square') {
      ctx.rect(cx - 95, cy - 95, 190, 190);
    } else if (shape === 'triangle') {
      ctx.moveTo(cx, cy - 105);
      ctx.lineTo(cx + 105, cy + 90);
      ctx.lineTo(cx - 105, cy + 90);
      ctx.closePath();
    } else if (shape === 'star') {
      const spikes = 5;
      const outerRadius = 110;
      const innerRadius = 50;
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
      ctx.bezierCurveTo(cx, cy - 50, cx - 100, cy - 100, cx - 100, cy - 20);
      ctx.bezierCurveTo(cx - 100, cy + 40, cx, cy + 70, cx, cy + 105);
      ctx.bezierCurveTo(cx, cy + 70, cx + 100, cy + 40, cx + 100, cy - 20);
      ctx.bezierCurveTo(cx + 100, cy - 100, cx, cy - 50, cx, cy - 35);
      ctx.closePath();
    }
  };

  // Render notebook ruling and dashed letter/word template on the guide canvas
  const drawBackgroundGuide = () => {
    const canvas = guideCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Notebook Guidelines
    ctx.save();
    if (lineStyle === 'four_line') {
      // Traditional 4-Line Primary Handwriting Ruling (Red - Blue - Blue - Red)
      const centerY = canvas.height / 2;
      const lineGap = 42;
      const y1 = centerY - lineGap * 1.5; // Top Red Line
      const y2 = centerY - lineGap * 0.5; // Middle Blue Line (dashed)
      const y3 = centerY + lineGap * 0.5; // Baseline Blue Line
      const y4 = centerY + lineGap * 1.5; // Descender Red Line

      // Top Red line
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(15, y1);
      ctx.lineTo(canvas.width - 15, y1);
      ctx.stroke();

      // Middle Blue Line (dashed)
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(15, y2);
      ctx.lineTo(canvas.width - 15, y2);
      ctx.stroke();

      // Baseline Blue Line (solid)
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(15, y3);
      ctx.lineTo(canvas.width - 15, y3);
      ctx.stroke();

      // Bottom Red Line
      ctx.strokeStyle = '#fca5a5';
      ctx.beginPath();
      ctx.moveTo(15, y4);
      ctx.lineTo(canvas.width - 15, y4);
      ctx.stroke();
    } else if (lineStyle === 'grid') {
      // Subtle Graph Paper Grid
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      for (let x = 30; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 30; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }
    ctx.restore();

    if (category === 'freedraw') return;

    // 2. Render Large Dashed Tracing Template
    ctx.save();
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    if (category === 'shapes' && currentItem?.shapeType) {
      drawShapePath(ctx, currentItem.shapeType, cx, cy);
      ctx.fillStyle = 'rgba(248, 250, 252, 0.7)';
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 12;
      ctx.setLineDash([14, 16]);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    } else if (currentItem) {
      const len = currentItem.display.length;
      const fontSize = len <= 2 ? 180 : len <= 5 ? 105 : len <= 8 ? 74 : 54;
      ctx.font = `bold ${fontSize}px "Comic Sans MS", "Comic Neue", "Arial Rounded MT Bold", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Soft filled silhouette
      ctx.fillStyle = 'rgba(241, 245, 249, 0.8)';
      ctx.fillText(currentItem.display, cx, cy);

      // High-visibility dashed outline for tracing
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = len <= 2 ? 10 : 5;
      ctx.setLineDash([8, 10]);
      ctx.strokeText(currentItem.display, cx, cy);
    }
    ctx.restore();
  };

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement> | React.PointerEvent<HTMLCanvasElement>
  ) => {
    const canvas = drawCanvasRef.current;
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
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    // If in Stamp mode, stamp a cute sticker and exit!
    if (currentTool === 'stamp') {
      pushUndoState();
      ctx.save();
      ctx.font = `${Math.max(28, brushSize * 2.5)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedStamp, x, y);
      ctx.restore();
      soundEffects.playPop();
      return;
    }

    pushUndoState();
    isDrawingRef.current = true;
    lastPointRef.current = { x, y };

    minXRef.current = Math.min(minXRef.current, x);
    maxXRef.current = Math.max(maxXRef.current, x);

    ctx.beginPath();
    ctx.moveTo(x, y);

    // Configure brush styles based on tool
    if (currentTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 1.6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = brushSize;

      if (currentTool === 'highlighter') {
        ctx.strokeStyle = brushColor + '70'; // ~45% translucent
      } else if (currentTool === 'crayon') {
        ctx.strokeStyle = brushColor;
        ctx.shadowColor = brushColor;
        ctx.shadowBlur = 2;
      } else {
        ctx.shadowBlur = 0;
        ctx.strokeStyle = brushColor;
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    // Rainbow magic shifting ink
    if (currentTool === 'rainbow') {
      rainbowHueRef.current = (rainbowHueRef.current + 6) % 360;
      ctx.strokeStyle = `hsl(${rainbowHueRef.current}, 100%, 50%)`;
      ctx.shadowColor = `hsl(${rainbowHueRef.current}, 100%, 70%)`;
      ctx.shadowBlur = 4;
    }

    ctx.lineTo(x, y);
    ctx.stroke();

    if (lastPointRef.current) {
      const dist = Math.hypot(x - lastPointRef.current.x, y - lastPointRef.current.y);
      strokeLengthRef.current += dist;
    }
    lastPointRef.current = { x, y };

    minXRef.current = Math.min(minXRef.current, x);
    maxXRef.current = Math.max(maxXRef.current, x);
  };

  const stopDraw = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const triggerCompletion = () => {
    if (completed) return;
    setCompleted(true);
    soundEffects.playCorrect();
    addStars(3);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.65 } });
    speak(
      language === 'ml'
        ? `വളരെ മിടുക്കൻ! ${currentItem.malayalamLabel} മനോഹരമായി എഴുതി!`
        : `Awesome job tracing ${currentItem.display}! You earned 3 stars!`
    );
  };

  const handleNextItem = () => {
    soundEffects.playPop();
    if (filteredItems.length > 0) {
      setSelectedItemIndex((prev) => (prev + 1) % filteredItems.length);
    }
  };

  // Export & Download the child's drawing as a PNG image
  const handleDownloadDrawing = () => {
    soundEffects.playPop();
    const guideCanvas = guideCanvasRef.current;
    const drawCanvas = drawCanvasRef.current;
    if (!guideCanvas || !drawCanvas) return;

    // Composite both onto an export canvas
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = guideCanvas.width;
    exportCanvas.height = guideCanvas.height;
    const expCtx = exportCanvas.getContext('2d');
    if (!expCtx) return;

    // White background paper
    expCtx.fillStyle = '#ffffff';
    expCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Draw guidelines & drawing
    expCtx.drawImage(guideCanvas, 0, 0);
    expCtx.drawImage(drawCanvas, 0, 0);

    // Footer Watermark
    expCtx.fillStyle = '#94a3b8';
    expCtx.font = 'bold 12px sans-serif';
    expCtx.textAlign = 'right';
    expCtx.fillText('Little Genius AI • Young Artist Studio', exportCanvas.width - 15, exportCanvas.height - 12);

    const link = document.createElement('a');
    link.download = `Little_Genius_Drawing_${currentItem?.display || 'Artwork'}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="bg-white rounded-4xl p-5 sm:p-7 border-4 border-pink-300 shadow-xl max-w-3xl mx-auto space-y-4">
      {/* Chapter Badge */}
      {chapter && (
        <div className="text-center">
          <span className="text-[11px] font-black uppercase px-3 py-1 rounded-full bg-pink-100 text-pink-700">
            {subject?.icon || '✍️'} {language === 'ml' ? subject?.malayalamName : subject?.name} • Ch {chapter.chapterNumber}: {chapter.title}
          </span>
        </div>
      )}

      {/* 1. Category Switcher */}
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
            className={`px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-black transition ${
              category === tab.id
                ? 'bg-pink-500 text-white shadow-md scale-105'
                : 'bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200'
            }`}
          >
            {language === 'ml' ? tab.ml : tab.label}
          </button>
        ))}
      </div>

      {/* 2. Item Selector Pills */}
      {category !== 'freedraw' && (
        <div className="flex items-center justify-center flex-wrap gap-1.5">
          {filteredItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                soundEffects.playPop();
                setSelectedItemIndex(idx);
              }}
              className={`px-3 py-1 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center border-2 transition ${
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

      {/* 3. Header & Audio Guide */}
      <div className="flex items-center justify-between bg-pink-50/70 p-3 sm:p-3.5 rounded-3xl border border-pink-200">
        <div className="flex items-center space-x-3 text-left">
          <span className="text-2xl sm:text-3xl font-black text-pink-600">
            {category === 'freedraw' ? '🎨' : currentItem?.display}
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-800">
              {category === 'freedraw'
                ? language === 'ml'
                  ? 'സ്വതന്ത്രമായി ചിത്രം വരയ്ക്കാം (Pencil, Marker, Rainbow)'
                  : 'Free Drawing Pad (Use Mouse, Finger, or Stylus)'
                : language === 'ml'
                ? currentItem?.malayalamLabel
                : `Trace ${currentItem?.label}`}
            </h3>
            <p className="text-[11px] text-pink-600 font-bold">
              {category === 'freedraw'
                ? 'Choose pencils, pin-points, rainbow ink, or stamps!'
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

      {/* 4. Complete Toolset: Pencils, Pin-Points, Eraser, Rainbow, Stamps & Ruler Lines */}
      <div className="bg-slate-50 p-3 sm:p-4 rounded-3xl border border-slate-200 space-y-3">
        {/* Row A: Drawing Tools & Eraser */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] font-black uppercase text-slate-400 mr-1">Tools:</span>
            {[
              { id: 'pencil', label: '✏️ Pencil', icon: Pencil },
              { id: 'pen', label: '🖋️ Ink Pen', icon: PenTool },
              { id: 'crayon', label: '🖍️ Crayon', icon: Palette },
              { id: 'highlighter', label: '✨ Neon Glow', icon: Highlighter },
              { id: 'rainbow', label: '🌈 Rainbow', icon: Sparkles },
              { id: 'eraser', label: '🧽 Eraser', icon: Eraser },
              { id: 'stamp', label: '⭐ Stamp', icon: Stamp },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = currentTool === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    soundEffects.playPop();
                    setCurrentTool(t.id as ToolType);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1 transition shadow-sm ${
                    isActive
                      ? 'bg-slate-900 text-white scale-105 shadow'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Undo / Redo Actions */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className="p-1.5 rounded-xl bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 border border-slate-200 transition"
              title="Undo Last Stroke"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              className="p-1.5 rounded-xl bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 border border-slate-200 transition"
              title="Redo Stroke"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadDrawing}
              className="p-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition flex items-center space-x-1 text-xs font-bold"
              title="Download Drawing (Save as PNG Image)"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>

        {/* Row B: Precision Pin-Point Sizes + Interactive Slider */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-black uppercase text-slate-400">Pin Points:</span>
            <div className="flex items-center gap-1.5">
              {PIN_POINT_PRESETS.map((p) => {
                const isSelected = brushSize === p.size;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      soundEffects.playPop();
                      setBrushSize(p.size);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-black transition flex items-center space-x-1.5 border ${
                      isSelected
                        ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-sm scale-105'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span
                      className="inline-block rounded-full bg-slate-900"
                      style={{ width: Math.max(3, p.size / 2.5), height: Math.max(3, p.size / 2.5) }}
                    />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pin-Point Slider with Live Size Dot Preview */}
          <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-xl border border-slate-200">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="range"
              min="2"
              max="36"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20 sm:w-24 accent-pink-500 cursor-pointer"
              title={`Custom Tip: ${brushSize}px`}
            />
            <span className="text-xs font-black text-slate-600 w-7 text-right">{brushSize}px</span>
            {/* Live size preview circle */}
            <div className="w-7 h-7 flex items-center justify-center bg-slate-100 rounded-lg">
              <span
                className="rounded-full inline-block transition-all"
                style={{
                  width: Math.min(22, brushSize),
                  height: Math.min(22, brushSize),
                  backgroundColor: currentTool === 'eraser' ? '#94a3b8' : brushColor,
                }}
              />
            </div>
          </div>
        </div>

        {/* Row C: Rich Color Palette & Real Color Picker */}
        {currentTool !== 'eraser' && currentTool !== 'rainbow' && currentTool !== 'stamp' && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200">
            <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
              <span className="text-[11px] font-black uppercase text-slate-400 mr-1">Colors:</span>
              {COLOR_PALETTE.map((col) => {
                const isSelected = brushColor === col.hex;
                return (
                  <button
                    key={col.hex}
                    onClick={() => {
                      soundEffects.playPop();
                      setBrushColor(col.hex);
                    }}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 transition transform ${
                      isSelected ? 'scale-125 border-slate-900 shadow-md ring-2 ring-pink-400' : 'border-white hover:scale-110'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  />
                );
              })}

              {/* Custom HTML5 Color Picker Input */}
              <div className="relative inline-block ml-1">
                <button
                  onClick={() => colorInputRef.current?.click()}
                  className="w-7 h-7 rounded-full border-2 border-slate-300 bg-gradient-to-tr from-rose-500 via-amber-400 to-sky-500 shadow-sm flex items-center justify-center hover:scale-110 transition"
                  title="Pick Any Custom Color!"
                >
                  <Palette className="w-3.5 h-3.5 text-white drop-shadow" />
                </button>
                <input
                  ref={colorInputRef}
                  type="color"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  className="sr-only"
                />
              </div>
            </div>

            {/* Notebook Line Style Switcher */}
            <div className="flex items-center space-x-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Ruling:</span>
              {[
                { id: 'four_line', label: '📝 4-Line' },
                { id: 'grid', label: '📐 Grid' },
                { id: 'blank', label: '📄 Blank' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setLineStyle(style.id as GuideLineStyle)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition ${
                    lineStyle === style.id ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Row D: Sticker Stamp Selector (when Stamp tool is active) */}
        {currentTool === 'stamp' && (
          <div className="flex items-center space-x-2 pt-1 border-t border-slate-200 overflow-x-auto py-1">
            <span className="text-[11px] font-black uppercase text-slate-400">Tap to Stamp:</span>
            {STICKER_STAMPS.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStamp(s)}
                className={`text-xl p-1.5 rounded-xl transition ${
                  selectedStamp === s ? 'bg-amber-300 scale-125 shadow-sm' : 'hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
            <span className="text-xs text-slate-500 font-bold ml-2">👉 Tap anywhere on canvas to stamp!</span>
          </div>
        )}
      </div>

      {/* 5. Dual-Layer Interactive Canvas (Guide underneath, Drawing on top) */}
      <div className="space-y-3">
        <div className="relative flex justify-center">
          <div className="relative inline-block border-4 border-dashed border-pink-300 rounded-3xl bg-white p-2 touch-none shadow-inner overflow-hidden">
            {/* Guide Canvas (Bottom Layer) */}
            <canvas
              ref={guideCanvasRef}
              width={560}
              height={320}
              className="rounded-2xl bg-white max-w-full h-auto pointer-events-none block"
            />

            {/* Active Drawing Canvas (Top Layer - Completely transparent) */}
            <canvas
              ref={drawCanvasRef}
              width={560}
              height={320}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
              className="absolute inset-2 rounded-2xl cursor-crosshair max-w-full h-auto block"
            />
          </div>
        </div>

        {/* Celebratory Banner - Never covers canvas */}
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

      {/* 6. Bottom Action Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
        <button
          onClick={clearDrawCanvas}
          className="px-4 py-2.5 rounded-2xl border-2 border-slate-300 text-slate-700 font-black text-xs flex items-center space-x-1.5 hover:bg-slate-50 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{language === 'ml' ? 'മായ്ക്കുക' : 'Clear My Drawing'}</span>
        </button>

        {category !== 'freedraw' && !completed && (
          <button
            onClick={triggerCompletion}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs sm:text-sm flex items-center space-x-2 shadow-lg transition scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-900" />
            <span>{language === 'ml' ? 'ഞാൻ എഴുതിക്കഴിഞ്ഞു! ⭐' : 'Done Tracing! (I Finished) ⭐'}</span>
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
