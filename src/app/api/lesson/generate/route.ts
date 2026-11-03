import { NextRequest, NextResponse } from 'next/server';
import { getDb, getLesson, saveLesson, getChildProfile } from '@/lib/db/store';
import { retrieveCurriculumContext } from '@/lib/ai/rag';
import { Lesson, LessonSection } from '@/lib/db/types';

export async function POST(req: NextRequest) {
  try {
    const { chapterId, childId, subjectId, forceRegenerate } = await req.json();

    if (!chapterId) {
      return NextResponse.json({ error: 'Missing chapterId' }, { status: 400 });
    }

    // Check if lesson already exists
    if (!forceRegenerate) {
      const existing = getLesson(chapterId);
      if (existing) {
        return NextResponse.json({ success: true, lesson: existing, isCached: true });
      }
    }

    const child = getChildProfile(childId || 'child-1');
    const db = getDb();

    // Find the chapter details from textbooks
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

    const chapterTitle = targetChapter ? targetChapter.title : 'Exciting New Concept';
    const malayalamTitle = targetChapter ? targetChapter.malayalamTitle : chapterTitle;
    const isUKG = child?.classGrade === 'UKG';
    const bookTitle = targetBook ? targetBook.title : 'Curriculum Textbook';

    // Build structured lesson sections
    const sections: LessonSection[] = [
      {
        type: 'intro',
        title: isUKG ? `Welcome to ${chapterTitle}! 🎈` : `Chapter Introduction: ${chapterTitle} 🚀`,
        malayalamTitle: `${malayalamTitle} - ആമുഖം 🎈`,
        content: isUKG
          ? `Hello little genius! Today we are going to explore ${chapterTitle}. It is full of pictures, sounds, and wonders!`
          : `Welcome to this adventure in ${chapterTitle}! Have you ever wondered how this works around us? Let's discover step-by-step!`,
        malayalamContent: isUKG
          ? `ഹലോ കൊച്ചു കൂട്ടുകാരി! ഇന്ന് നമ്മൾ ${malayalamTitle} പഠിക്കാൻ പോകുന്നു. ചിത്രങ്ങളും രസകരമായ ശബ്ദങ്ങളും നിറഞ്ഞ പാഠമാണിത്!`
          : `${malayalamTitle} എന്ന അധ്യായത്തിലേക്ക് സ്വാഗതം! നമുക്ക് ഇത് ലളിതമായി മനസ്സിലാക്കാം!`,
        visualEmoji: isUKG ? '🌟' : '💡',
      },
      {
        type: 'explanation',
        title: isUKG ? 'Let Us Learn Together! 🍎' : 'Core Lesson Concepts 📖',
        malayalamTitle: 'പ്രധാന ആശയങ്ങൾ 📖',
        content: targetChapter?.summary || `In this chapter, we discover the foundation of ${chapterTitle}. Everything is designed to make learning intuitive and memorable.`,
        malayalamContent: targetChapter?.malayalamSummary || `${malayalamTitle} പാഠത്തിലെ പ്രധാനപ്പെട്ട ആശയങ്ങൾ എളുപ്പത്തിൽ ഇവിടെ വിശദീകരിക്കുന്നു.`,
        visualEmoji: '📚',
      },
      {
        type: 'visual',
        title: isUKG ? 'Look at the Pictures! 🎨' : 'Visual Concept Breakdown 🔍',
        malayalamTitle: 'ചിത്രങ്ങളിലൂടെയുള്ള വിശദീകരണം 🎨',
        content: isUKG
          ? `Look carefully at the shapes, colors, and friends! Repeat each sound out loud with Hootie!`
          : `Key topics covered:\n${(targetChapter?.topics || ['Foundational concept', 'Practical examples', 'Key exercises']).map((t: string) => `• ${t}`).join('\n')}`,
        malayalamContent: isUKG
          ? `ചിത്രങ്ങളിലേക്ക് നോക്കൂ! ഓരോ വാക്കും ഉറക്കെ പറഞ്ഞു നോക്കൂ!`
          : `പ്രധാന വിഷയങ്ങൾ:\n${(targetChapter?.topics || ['അടിസ്ഥാനം', 'ഉദാഹരണങ്ങൾ']).map((t: string) => `• ${t}`).join('\n')}`,
        visualEmoji: '🎨',
      },
      {
        type: 'story',
        title: isUKG ? 'A Little Friend Story 🐾' : 'Story Time: Learning in Action 📖',
        malayalamTitle: 'കഥാ സമയം 🐾',
        content: isUKG
          ? `Once upon a time, little bunny Mimi hopped through the green garden and discovered how exciting ${chapterTitle} is!`
          : `Imagine a young scientist in Kerala named Arya who used ${chapterTitle} to solve an everyday mystery with her friends!`,
        malayalamContent: isUKG
          ? `ഒരിടത്തൊരിടത്ത് ഒരു കൊച്ചു മുയൽക്കുട്ടി തുള്ളിച്ചാടി നടക്കുമ്പോൾ ഈ പുതിയ കാര്യം കണ്ടുപിടിച്ചു!`
          : `നമ്മുടെ കൊച്ചു കൂട്ടുകാർ ചേർന്ന് ഈ വിഷയം ഉപയോഗിച്ച് ഒരു പുതിയ കണ്ടെത്തൽ നടത്തുന്ന കഥ!`,
        visualEmoji: '✨',
      },
      {
        type: 'activity',
        title: 'Interactive Fun Challenge 🎯',
        malayalamTitle: 'ഇന്ററാക്ടീവ് ചലഞ്ച് 🎯',
        content: isUKG
          ? 'Tap the Quiz or Flashcards button below to play with letters, numbers, and colorful stars!'
          : 'Head to the Quiz Arena to test your knowledge or open the 3D Learning World to explore this concept in 3D!',
        malayalamContent: 'താഴെയുള്ള ക്വിസ് അല്ലെങ്കിൽ ഫ്ലാഷ് കാർഡ് ബട്ടൺ അമർത്തി കളിച്ചു പഠിക്കൂ!',
        visualEmoji: '⭐',
      },
    ];

    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      chapterId,
      subjectId: subjectId || targetBook?.subjectId || '',
      childId: childId || 'child-1',
      title: chapterTitle,
      malayalamTitle,
      sourceTextbook: `${bookTitle}, Chapter ${targetChapter?.chapterNumber || 1}`,
      learningObjectives: targetChapter?.topics?.map((t: string) => `Understand ${t}`) || [
        `Understand the fundamental concepts of ${chapterTitle}`,
        `Apply knowledge to everyday examples`,
      ],
      malayalamObjectives: [
        `${malayalamTitle} അടിസ്ഥാന ആശയങ്ങൾ മനസ്സിലാക്കുക`,
        `ദൈനംദിന ജീവിതത്തിലെ ഉദാഹരണങ്ങൾ അറിയുക`,
      ],
      sections,
      updatedAt: new Date().toISOString(),
    };

    saveLesson(newLesson);

    return NextResponse.json({ success: true, lesson: newLesson, isCached: false });
  } catch (error: any) {
    console.error('Lesson generation error:', error);
    return NextResponse.json({ error: 'Failed to generate lesson: ' + error.message }, { status: 500 });
  }
}

