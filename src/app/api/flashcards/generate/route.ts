import { NextRequest, NextResponse } from 'next/server';
import { getDb, getFlashcards, saveFlashcard, getChildProfile } from '@/lib/db/store';
import { Flashcard } from '@/lib/db/types';

const EMOJI_BY_KEYWORD: Record<string, string> = {
  food: '🥗',
  nutrient: '🍎',
  carbohydrate: '🍞',
  protein: '🥛',
  vitamin: '🍊',
  teeth: '🦷',
  incisor: '🦷',
  digest: '🍽️',
  plant: '🌱',
  photosynthesis: '☀️',
  chlorophyll: '🍃',
  animal: '🦁',
  habitat: '🐘',
  camouflage: '🦎',
  matter: '🧊',
  solid: '🧱',
  liquid: '💧',
  gas: '💨',
  force: '🧲',
  gravity: '🌍',
  machine: '⚙️',
  solar: '🪐',
  planet: '🚀',
  number: '🔢',
  place: '📊',
  roman: '🏛️',
  add: '➕',
  subtract: '➖',
  multiply: '✖️',
  divide: '➗',
  factor: '🧩',
  prime: '🌟',
  fraction: '🍕',
  decimal: '🎯',
  geometry: '📐',
  angle: '📏',
  circle: '⭕',
  perimeter: '🔲',
  measure: '⚖️',
  time: '⏰',
  money: '🪙',
  noun: '📘',
  pronoun: '🗣️',
  adjective: '🌈',
  verb: '🏃',
  tense: '⏳',
  sentence: '✍️',
  story: '📖',
  poem: '🎭',
  india: '🇮🇳',
  himalaya: '🏔️',
  river: '🌊',
  forest: '🌳',
  crop: '🌾',
  transport: '🚆',
  constitution: '⚖️',
  apple: '🍎',
  vowel: '🔤',
  sense: '👀',
};

function pickEmojiForText(text: string, fallback = '✨'): string {
  const lower = text.toLowerCase();
  for (const [key, emoji] of Object.entries(EMOJI_BY_KEYWORD)) {
    if (lower.includes(key)) return emoji;
  }
  return fallback;
}

function generateChapterFlashcards(childId: string, chapterId: string, subjectId?: string): Flashcard[] {
  const db = getDb();
  const child = getChildProfile(childId || 'child-1');
  const isUKG = child?.classGrade === 'UKG' || child?.classGrade === 'LKG';

  let targetChapter: any = null;
  let targetBook: any = null;

  for (const b of db.textbooks) {
    const found = b.chapters.find((c) => c.id === chapterId);
    if (found) {
      targetChapter = found;
      targetBook = b;
      break;
    }
  }

  if (!targetChapter) {
    return getFlashcards(childId);
  }

  const chapterTitle = targetChapter.title;
  const malayalamTitle = targetChapter.malayalamTitle || chapterTitle;
  const effectiveSubjectId = subjectId || targetBook?.subjectId || '';
  const topics: string[] = targetChapter.topics || [];
  const keyTerms: string[] = targetChapter.keyTerms || [];

  const createdCards: Flashcard[] = [];

  // 1. Create cards for each topic in the chapter
  topics.forEach((topic: string, idx: number) => {
    const emoji = pickEmojiForText(`${chapterTitle} ${topic}`, isUKG ? '🎈' : '💡');
    const card: Flashcard = {
      id: `fc-${chapterId}-topic-${idx}`,
      chapterId,
      subjectId: effectiveSubjectId,
      childId: childId || targetBook?.childId || 'child-1',
      front: topic,
      back: isUKG
        ? `Let's say and practice "${topic}" from ${chapterTitle}! (${targetChapter.summary.slice(0, 110)})`
        : `${topic} — A core concept in "${chapterTitle}". ${targetChapter.summary}`,
      frontMalayalam: `${topic} (${malayalamTitle})`,
      backMalayalam: `${malayalamTitle}: ${targetChapter.malayalamSummary || targetChapter.summary}`,
      pronunciation: topic,
      visualEmoji: emoji,
      category: `Ch ${targetChapter.chapterNumber}: ${chapterTitle}`,
      mastered: false,
      reviewCount: 0,
    };
    saveFlashcard(card);
    createdCards.push(card);
  });

  // 2. Create cards for key vocabulary terms in the chapter
  keyTerms.forEach((term: string, idx: number) => {
    const emoji = pickEmojiForText(`${term} ${chapterTitle}`, isUKG ? '🌟' : '🔑');
    const card: Flashcard = {
      id: `fc-${chapterId}-term-${idx}`,
      chapterId,
      subjectId: effectiveSubjectId,
      childId: childId || targetBook?.childId || 'child-1',
      front: `Key Term: ${term}`,
      back: isUKG
        ? `"${term}" is an important word in ${chapterTitle}! Say "${term}" aloud with a big smile!`
        : `Definition & Role of "${term}" in ${chapterTitle}: Essential ICSE keyword related to ${topics[idx % Math.max(1, topics.length)] || chapterTitle}.`,
      frontMalayalam: `പ്രധാന പദം: ${term}`,
      backMalayalam: `${malayalamTitle} എന്ന അധ്യായത്തിലെ പ്രധാനപ്പെട്ട പദമാണ് "${term}". (${targetChapter.malayalamSummary})`,
      pronunciation: term,
      visualEmoji: emoji,
      category: `Key Vocabulary • Ch ${targetChapter.chapterNumber}`,
      mastered: false,
      reviewCount: 0,
    };
    saveFlashcard(card);
    createdCards.push(card);
  });

  return createdCards;
}

export async function GET(req: NextRequest) {
  const childId = req.nextUrl.searchParams.get('childId') || 'child-1';
  const chapterId = req.nextUrl.searchParams.get('chapterId') || undefined;
  const subjectId = req.nextUrl.searchParams.get('subjectId') || undefined;

  if (chapterId) {
    const existing = getFlashcards(childId, chapterId);
    if (existing.length > 0) {
      return NextResponse.json({ flashcards: existing });
    }
    const generated = generateChapterFlashcards(childId, chapterId, subjectId);
    return NextResponse.json({ flashcards: generated });
  }

  let cards = getFlashcards(childId);
  if (subjectId) {
    const filtered = cards.filter((c) => c.subjectId === subjectId);
    if (filtered.length > 0) {
      return NextResponse.json({ flashcards: filtered });
    }
    // Generate flashcards for the first chapter of this subject if none exist yet
    const db = getDb();
    const book = db.textbooks.find((b) => b.subjectId === subjectId && b.childId === childId);
    if (book && book.chapters.length > 0) {
      const generated = generateChapterFlashcards(childId, book.chapters[0].id, subjectId);
      return NextResponse.json({ flashcards: generated });
    }
  }

  return NextResponse.json({ flashcards: cards });
}

export async function POST(req: NextRequest) {
  try {
    const { chapterId, childId, subjectId } = await req.json();

    if (!chapterId) {
      return NextResponse.json({ error: 'Missing chapterId' }, { status: 400 });
    }

    const existing = getFlashcards(childId, chapterId);
    if (existing.length > 0) {
      return NextResponse.json({ success: true, flashcards: existing, isCached: true });
    }

    const generated = generateChapterFlashcards(childId || 'child-1', chapterId, subjectId);
    return NextResponse.json({ success: true, flashcards: generated, isCached: false });
  } catch (error: any) {
    console.error('Flashcard generation error:', error);
    return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 });
  }
}
