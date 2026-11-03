import { NextRequest, NextResponse } from 'next/server';
import { getDb, getFlashcards, saveFlashcard, getChildProfile } from '@/lib/db/store';
import { Flashcard } from '@/lib/db/types';

export async function GET(req: NextRequest) {
  const childId = req.nextUrl.searchParams.get('childId') || 'child-1';
  const chapterId = req.nextUrl.searchParams.get('chapterId') || undefined;
  const cards = getFlashcards(childId, chapterId);
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

    const db = getDb();
    const child = getChildProfile(childId || 'child-1');
    const isUKG = child?.classGrade === 'UKG';

    let targetChapter: any = null;
    for (const b of db.textbooks) {
      const found = b.chapters.find((c) => c.id === chapterId);
      if (found) {
        targetChapter = found;
        break;
      }
    }

    const title = targetChapter?.title || 'Key Fact';
    const topics = targetChapter?.topics || ['Core Concept', 'Formula / Word'];

    const newCards: Flashcard[] = topics.map((topic: string, idx: number) => {
      const card: Flashcard = {
        id: `fc-${Date.now()}-${idx}`,
        chapterId,
        subjectId: subjectId || '',
        childId: childId || 'child-1',
        front: topic,
        back: isUKG
          ? `Say it loud with Hootie! "${topic}" 🎈`
          : `Important definition and practice concept for ${topic} in ${title}.`,
        frontMalayalam: topic,
        backMalayalam: `${topic} എന്നതിൻ്റെ പ്രധാന അർത്ഥവും ആശയവും.`,
        pronunciation: topic,
        visualEmoji: isUKG ? '⭐' : '📖',
        category: isUKG ? 'Phonics & Words' : 'Curriculum Concept',
        mastered: false,
        reviewCount: 0,
      };
      saveFlashcard(card);
      return card;
    });

    return NextResponse.json({ success: true, flashcards: newCards, isCached: false });
  } catch (error: any) {
    console.error('Flashcard generation error:', error);
    return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 });
  }
}

