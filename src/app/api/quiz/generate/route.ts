import { NextRequest, NextResponse } from 'next/server';
import { getDb, getQuiz, saveQuiz, getChildProfile } from '@/lib/db/store';
import { Quiz, QuizQuestion } from '@/lib/db/types';

export async function POST(req: NextRequest) {
  try {
    const { chapterId, childId, subjectId, forceRegenerate } = await req.json();

    if (!chapterId) {
      return NextResponse.json({ error: 'Missing chapterId' }, { status: 400 });
    }

    if (!forceRegenerate) {
      const existing = getQuiz(chapterId);
      if (existing) {
        return NextResponse.json({ success: true, quiz: existing, isCached: true });
      }
    }

    const child = getChildProfile(childId || 'child-1');
    const isUKG = child?.classGrade === 'UKG';
    const db = getDb();

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

    const chapterTitle = targetChapter ? targetChapter.title : 'Chapter Knowledge';
    const malayalamTitle = targetChapter ? targetChapter.malayalamTitle : chapterTitle;

    // Generate questions tailored to grade
    const questions: QuizQuestion[] = isUKG
      ? [
          {
            id: `q-${Date.now()}-1`,
            type: 'picture',
            question: `Which cute friend belongs to ${chapterTitle}?`,
            questionMalayalam: `${malayalamTitle} പാഠവുമായി ബന്ധപ്പെട്ടത് ഏതാണ്?`,
            options: ['🍎 Sweet Apple', '⭐ Twinkling Star', '🐱 Playful Kitten', '🎈 Flying Balloon'],
            optionsMalayalam: ['🍎 മധുരമുള്ള ആപ്പിൾ', '⭐ തിളങ്ങുന്ന നക്ഷത്രം', '🐱 പൂച്ചക്കുട്ടി', '🎈 ബലൂൺ'],
            correctIndex: 0,
            explanation: 'Great job! You found the right friend!',
            explanationMalayalam: 'വളരെ ശരി! നിങ്ങൾ കൃത്യമായി കണ്ടെത്തി!',
            hint: 'Look for the red crunchy fruit!',
            hintMalayalam: 'ചുവന്ന പഴം നോക്കൂ!',
            visualEmoji: '🍎',
          },
          {
            id: `q-${Date.now()}-2`,
            type: 'mcq',
            question: 'Can you count how many stars are smiling at you? ⭐ ⭐ ⭐ ⭐',
            questionMalayalam: 'ഇവിടെ എത്ര നക്ഷത്രങ്ങൾ ചിരിക്കുന്നുണ്ട്? ⭐ ⭐ ⭐ ⭐',
            options: ['2', '3', '4', '5'],
            optionsMalayalam: ['2', '3', '4', '5'],
            correctIndex: 2,
            explanation: '1, 2, 3, 4! Four shining stars for you!',
            explanationMalayalam: 'ഒന്ന്, രണ്ട്, മൂന്ന്, നാല്! നാല് നക്ഷത്രങ്ങൾ!',
            hint: 'Touch each star with your finger!',
            hintMalayalam: 'ഓരോ നക്ഷത്രത്തിലും വിരൽ തൊട്ട് എണ്ണി നോക്കൂ!',
            visualEmoji: '⭐',
          },
          {
            id: `q-${Date.now()}-3`,
            type: 'true_false',
            question: 'Are learning and reading super fun?',
            questionMalayalam: 'പുസ്തകങ്ങൾ വായിക്കാൻ നല്ല രസമാണോ?',
            options: ['Yes! (True)', 'No (False)'],
            optionsMalayalam: ['അതെ! (ശരി)', 'അല്ല (തെറ്റ്)'],
            correctIndex: 0,
            explanation: 'Learning with Chikoo is always full of fun and smiles! 🐾',
            explanationMalayalam: 'ചിക്കുവിനോടൊപ്പം പഠിക്കുന്നത് എപ്പോഴും സന്തോഷകരമാണ്! 🐾',
            hint: 'Think of how happy you feel when you learn something new!',
            hintMalayalam: 'പുതിയ കാര്യം പഠിക്കുമ്പോൾ തോന്നുന്ന സന്തോഷം ഓർക്കൂ!',
            visualEmoji: '🎉',
          },
        ]
      : [
          {
            id: `q-${Date.now()}-1`,
            type: 'mcq',
            question: `What is the primary concept taught in "${chapterTitle}"?`,
            questionMalayalam: `"${malayalamTitle}" പാഠത്തിലെ പ്രധാന ആശയം എന്താണ്?`,
            options: [
              targetChapter?.topics?.[0] || 'Foundational principles and understanding',
              'Completely random unverified facts',
              'Unrelated space fiction',
              'None of the above',
            ],
            optionsMalayalam: [
              targetChapter?.topics?.[0] || 'അടിസ്ഥാന തത്വങ്ങളും ധാരണകളും',
              'തെറ്റായ വിവരങ്ങൾ',
              'ബന്ധമില്ലാത്ത കാര്യങ്ങൾ',
              'ഇതൊന്നുമല്ല',
            ],
            correctIndex: 0,
            explanation: `According to the textbook syllabus, ${targetChapter?.topics?.[0] || 'this core topic'} forms the foundation of this chapter.`,
            explanationMalayalam: 'പാഠപുസ്തകത്തിലെ വിവരങ്ങൾ പ്രകാരം ഇതാണ് ശരിയായ ഉത്തരം.',
            hint: 'Review the chapter summary or first lesson section!',
            hintMalayalam: 'പാഠത്തിന്റെ ആദ്യ ഭാഗം ഓർത്തു നോക്കൂ!',
            visualEmoji: '📚',
          },
          {
            id: `q-${Date.now()}-2`,
            type: 'mcq',
            question: `Which of the following is true about ${targetChapter?.topics?.[1] || chapterTitle}?`,
            questionMalayalam: `${targetChapter?.topics?.[1] || malayalamTitle} എന്നതിനെക്കുറിച്ച് ശരിയായ പ്രസ്താവന ഏത്?`,
            options: [
              'It helps us understand how the world and science work',
              'It has no practical use in daily life',
              'It only applies to planets outside Earth',
              'It cannot be calculated or observed',
            ],
            optionsMalayalam: [
              'പ്രകൃതിയും ലോകവും എങ്ങനെ പ്രവർത്തിക്കുന്നു എന്ന് മനസ്സിലാക്കാൻ സഹായിക്കുന്നു',
              'ദൈനംദിന ജീവിതത്തിൽ ഇതിന് യാതൊരു ഉപയോഗവുമില്ല',
              'മറ്റു ഗ്രഹങ്ങൾക്ക് മാത്രമേ ഇത് ബാധകമാകൂ',
              'ഇത് മനസ്സിലാക്കാൻ കഴിയില്ല',
            ],
            correctIndex: 0,
            explanation: 'Knowledge in this subject connects directly to real-life observations and logic.',
            explanationMalayalam: 'ഈ അറിവ് നമ്മുടെ നിത്യജീവിതത്തിലെ അനുഭവങ്ങളുമായി ബന്ധപ്പെട്ടിരിക്കുന്നു.',
            hint: 'Think about real-life observations!',
            hintMalayalam: 'നിത്യജീവിതത്തിലെ ഉദാഹരണങ്ങൾ ചിന്തിക്കൂ!',
            visualEmoji: '💡',
          },
          {
            id: `q-${Date.now()}-3`,
            type: 'true_false',
            question: 'True or False: Practicing questions regularly helps us master any subject easily.',
            questionMalayalam: 'ശരിയോ തെറ്റോ: പതിവായി ചോദ്യങ്ങൾ പരിശീലിക്കുന്നത് ഏത് വിഷയവും എളുപ്പത്തിൽ പഠിക്കാൻ സഹായിക്കും.',
            options: ['True', 'False'],
            optionsMalayalam: ['ശരി', 'തെറ്റ്'],
            correctIndex: 0,
            explanation: 'True! Consistent practice and curiosity make you a Little Genius!',
            explanationMalayalam: 'ശരിയാണ്! തുടർച്ചയായ പരിശീലനം പഠനം എളുപ്പമാക്കുന്നു.',
            hint: 'Practice makes perfect!',
            hintMalayalam: 'പരിശീലനം നമ്മെ മിടുക്കരാക്കുന്നു!',
            visualEmoji: '🏆',
          },
        ];

    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      chapterId,
      subjectId: subjectId || targetBook?.subjectId || '',
      childId: childId || 'child-1',
      title: `${chapterTitle} Master Challenge`,
      malayalamTitle: `${malayalamTitle} ക്വിസ്`,
      sourceChapter: `${targetBook?.title || 'Textbook'}, ${chapterTitle}`,
      questions,
      passingScore: isUKG ? 2 : 2,
    };

    saveQuiz(newQuiz);

    return NextResponse.json({ success: true, quiz: newQuiz, isCached: false });
  } catch (error: any) {
    console.error('Quiz generation error:', error);
    return NextResponse.json({ error: 'Failed to generate quiz: ' + error.message }, { status: 500 });
  }
}

