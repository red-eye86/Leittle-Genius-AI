import fs from 'fs';
import path from 'path';
import { DatabaseState, ChildProfile, Subject, Textbook, Lesson, Flashcard, Quiz, QuizAttempt, LearningSession, Achievement, ParentSettings } from './types';
import { initialDatabaseState } from './seed';
import { ICSE_EBOOK_TEXTBOOKS } from './icseSyllabus';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// In-memory cache for fast hot reads
let memoryDb: DatabaseState | null = null;

function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

export function getDb(): DatabaseState {
  if (memoryDb) {
    return memoryDb;
  }

  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed: DatabaseState = JSON.parse(data);

      let updated = false;

      // Ensure all textbooks have classGrade normalized (support legacy 'grade' field)
      parsed.textbooks.forEach((b: any) => {
        if (!b.classGrade && b.grade) {
          b.classGrade = b.grade;
          updated = true;
        }
      });

      // Ensure all 9 official ICSE E-Books (Class 4 & UKG) are synced and up-to-date
      const existingMap = new Map(parsed.textbooks.map((t) => [t.id, t]));
      const needsSync = ICSE_EBOOK_TEXTBOOKS.some((icseBook) => {
        const existing = existingMap.get(icseBook.id);
        return !existing || existing.title !== icseBook.title || existing.chapters.length !== icseBook.chapters.length;
      });

      if (needsSync) {
        const icseIds = new Set(ICSE_EBOOK_TEXTBOOKS.map((t) => t.id));
        const customUploaded = parsed.textbooks.filter(
          (t) => !icseIds.has(t.id) && !['tb-c3-sci-1', 'tb-c3-math-1', 'tb-ukg-phonics-1', 'tb-ukg-math-1'].includes(t.id)
        );
        parsed.textbooks = [...JSON.parse(JSON.stringify(ICSE_EBOOK_TEXTBOOKS)), ...customUploaded];
        // Clear old cached flashcards for updated Social Science and UKG chapters so they regenerate cleanly
        parsed.flashcards = (parsed.flashcards || []).filter(
          (f) =>
            !f.chapterId.startsWith('chap-c4-soc-') &&
            !f.chapterId.startsWith('chap-ukg-evs-') &&
            !f.chapterId.startsWith('chap-ukg-mal-') &&
            !f.chapterId.startsWith('chap-ukg-phonics-') &&
            !f.chapterId.startsWith('chap-ukg-math-') &&
            !f.chapterId.startsWith('chap-ukg-listen-')
        );
        updated = true;
      }

      // Ensure Social Science subject metadata reflects Evergreen Publications
      const socSub = parsed.subjects?.find((s) => s.id === 'sub-c3-social');
      if (socSub && socSub.name !== 'Social Science') {
        socSub.name = 'Social Science';
        socSub.malayalamName = 'സാമൂഹ്യശാസ്ത്രം (Social Science)';
        socSub.description = 'New Trends in Social Studies (Evergreen Publications) — History, Civics & Geography';
        socSub.malayalamDescription = 'ന്യൂ ട്രെൻഡ്സ് ഇൻ സോഷ്യൽ സ്റ്റഡീസ് (Evergreen) — ചരിത്രം, പൗരധർമ്മം, ഭൂമിശാസ്ത്രം';
        updated = true;
      }

      // Ensure UKG Malayalam & General Awareness subjects reflect Faidan Bryan M's actual publications
      const ukgMalSub = parsed.subjects?.find((s) => s.id === 'sub-ukg-malayalam');
      if (ukgMalSub && ukgMalSub.name !== 'Malayalam (ചങ്ങാതി Book-B)') {
        ukgMalSub.name = 'Malayalam (ചങ്ങാതി Book-B)';
        ukgMalSub.malayalamName = 'മലയാളം — ചങ്ങാതി പഠനപ്രവർത്തനങ്ങൾ Book-B';
        ukgMalSub.description = 'Poorna Academia ചങ്ങാതി പഠനപ്രവർത്തനങ്ങൾ Book-B — സ്വരാക്ഷരങ്ങൾ, വ്യഞ്ജനാക്ഷരങ്ങൾ, പ്രകൃതിയിലെ കൂട്ടുകാർ, കുട്ടിപ്പാട്ടുകൾ';
        ukgMalSub.malayalamDescription = 'പൂർണ്ണ അക്കാദമിയ ചങ്ങാതി പഠനപ്രവർത്തനങ്ങൾ Book-B — അക്ഷരങ്ങൾ, വാക്കുകൾ, പ്രകൃതിയിലെ കൂട്ടുകാർ, കുട്ടിപ്പാട്ടുകൾ';
        updated = true;
      }

      const ukgGenSub = parsed.subjects?.find((s) => s.id === 'sub-ukg-general');
      if (ukgGenSub && ukgGenSub.name !== 'General Awareness (KG2 GA)') {
        ukgGenSub.name = 'General Awareness (KG2 GA)';
        ukgGenSub.malayalamName = 'പൊതുവിജ്ഞാനം (Kindergarten Skills KG2 GA)';
        ukgGenSub.icon = '🌱';
        ukgGenSub.description = 'LEARNWAREi Kindergarten Skills: General Awareness (KG2 GA, NCF-FS) — My Body, Family, Plants, Animals, Helpers, Transport & Seasons';
        ukgGenSub.malayalamDescription = 'LEARNWAREi Kindergarten Skills (KG2 GA) — ശരീരഭാഗങ്ങൾ, കുടുംബം, സസ്യങ്ങൾ, മൃഗങ്ങൾ, സഹായികൾ, വാഹനങ്ങൾ, കാലാവസ്ഥ';
        updated = true;
      }

      // Ensure UKG English Reader reflects LEARNWAREi
      const ukgReaderSub = parsed.subjects?.find((s) => s.id === 'sub-ukg-phonics');
      if (ukgReaderSub && ukgReaderSub.name !== 'English Reader (KG2 ENGLISH 2)') {
        ukgReaderSub.name = 'English Reader (KG2 ENGLISH 2)';
        ukgReaderSub.malayalamName = 'ഇംഗ്ലീഷ് റീഡർ (KG2 ENGLISH 2)';
        ukgReaderSub.icon = '📖';
        ukgReaderSub.description = 'LEARNWAREi Kindergarten Skills: English Reader (KG2 ENGLISH 2, NCF-FS) — Phonics, CVC words, Sight words & Short stories';
        ukgReaderSub.malayalamDescription = 'LEARNWAREi ഇംഗ്ലീഷ് റീഡർ — അക്ഷര ശബ്ദങ്ങൾ, മൂന്നക്ഷര വാക്കുകൾ, സൈറ്റ് വേർഡുകൾ, കൊച്ചു ചിത്രകഥകൾ';
        updated = true;
      }

      // Ensure UKG English Listen & Speak exists
      let ukgListenSub = parsed.subjects?.find((s) => s.id === 'sub-ukg-english-listen');
      if (!ukgListenSub) {
        parsed.subjects.push({
          id: 'sub-ukg-english-listen',
          childId: 'child-2',
          name: 'English Listen & Speak (KG2 2)',
          malayalamName: 'ഇംഗ്ലീഷ് ലിസൺ & സ്പീക്ക് (KG2 2)',
          icon: '🗣️',
          color: '#8b5cf6',
          bgGradient: 'from-purple-400 to-indigo-500',
          classGrade: 'UKG',
          description: 'LEARNWAREi Kindergarten Skills: English Listen & Speak (KG2 2, NCF-FS) — Greetings, Rhymes, Questions & Conversations',
          malayalamDescription: 'LEARNWAREi ഇംഗ്ലീഷ് ലിസൺ & സ്പീക്ക് — സംഭാഷണങ്ങൾ, റൈംസ്, ചോദ്യോത്തരങ്ങൾ, ആക്ഷൻ വാക്കുകൾ',
        });
        updated = true;
      }

      // Ensure UKG Math reflects Fun with Numbers
      const ukgMathSub = parsed.subjects?.find((s) => s.id === 'sub-ukg-math');
      if (ukgMathSub && ukgMathSub.name !== 'Fun with Numbers (KG2 MATH)') {
        ukgMathSub.name = 'Fun with Numbers (KG2 MATH)';
        ukgMathSub.malayalamName = 'സംഖ്യകളും കൂട്ടലും (KG2 MATH)';
        ukgMathSub.description = 'LEARNWAREi Kindergarten Skills: Fun with Numbers (KG2 MATH, NCF-FS) — 1-50 Counting, 5+2=7 Addition, Subtraction, Shapes & Clock';
        ukgMathSub.malayalamDescription = 'LEARNWAREi സംഖ്യകളും കണക്കും — 1-50 എണ്ണൽ, 5+2=7 കൂട്ടൽ, കുറയ്ക്കൽ, രൂപങ്ങൾ, ക്ലോക്ക്';
        updated = true;
      }

      memoryDb = parsed;
      if (updated) {
        saveDb(memoryDb);
      }
      return memoryDb;
    }
  } catch (error) {
    console.error('Error reading database file, using initial state:', error);
  }

  // Initialize with seed data
  memoryDb = JSON.parse(JSON.stringify(initialDatabaseState));
  saveDb(memoryDb!);
  return memoryDb!;
}

export function syncIcseSyllabus(): Textbook[] {
  const db = getDb();
  const icseIds = new Set(ICSE_EBOOK_TEXTBOOKS.map((t) => t.id));
  const customBooks = db.textbooks.filter(
    (t) => !icseIds.has(t.id) && !['tb-c3-sci-1', 'tb-c3-math-1'].includes(t.id)
  );
  db.textbooks = [...JSON.parse(JSON.stringify(ICSE_EBOOK_TEXTBOOKS)), ...customBooks];
  db.flashcards = (db.flashcards || []).filter(
    (f) => !f.chapterId.startsWith('chap-c4-soc-') && !f.chapterId.startsWith('chap-ukg-evs-') && !f.chapterId.startsWith('chap-ukg-mal-')
  );
  db.lessons = (db.lessons || []).filter(
    (l) => !l.chapterId.startsWith('chap-c4-soc-') && !l.chapterId.startsWith('chap-ukg-evs-') && !l.chapterId.startsWith('chap-ukg-mal-')
  );
  db.quizzes = (db.quizzes || []).filter(
    (q) => !q.chapterId.startsWith('chap-c4-soc-') && !q.chapterId.startsWith('chap-ukg-evs-') && !q.chapterId.startsWith('chap-ukg-mal-')
  );
  const socSub = db.subjects?.find((s) => s.id === 'sub-c3-social');
  if (socSub) {
    socSub.name = 'Social Science';
    socSub.malayalamName = 'സാമൂഹ്യശാസ്ത്രം (Social Science)';
    socSub.description = 'New Trends in Social Studies (Evergreen Publications) — History, Civics & Geography';
    socSub.malayalamDescription = 'ന്യൂ ട്രെൻഡ്സ് ഇൻ സോഷ്യൽ സ്റ്റഡീസ് (Evergreen) — ചരിത്രം, പൗരധർമ്മം, ഭൂമിശാസ്ത്രം';
  }
  const ukgMalSub = db.subjects?.find((s) => s.id === 'sub-ukg-malayalam');
  if (ukgMalSub) {
    ukgMalSub.name = 'Malayalam (ചങ്ങാതി Book-B)';
    ukgMalSub.malayalamName = 'മലയാളം — ചങ്ങാതി പഠനപ്രവർത്തനങ്ങൾ Book-B';
    ukgMalSub.description = 'Poorna Academia ചങ്ങാതി പഠനപ്രവർത്തനങ്ങൾ Book-B — സ്വരാക്ഷരങ്ങൾ, വ്യഞ്ജനാക്ഷരങ്ങൾ, പ്രകൃതിയിലെ കൂട്ടുകാർ, കുട്ടിപ്പാട്ടുകൾ';
    ukgMalSub.malayalamDescription = 'പൂർണ്ണ അക്കാദമിയ ചങ്ങാതി പഠനപ്രവർത്തനങ്ങൾ Book-B — അക്ഷരങ്ങൾ, വാക്കുകൾ, പ്രകൃതിയിലെ കൂട്ടുകാർ, കുട്ടിപ്പാട്ടുകൾ';
  }
  const ukgGenSub = db.subjects?.find((s) => s.id === 'sub-ukg-general');
  if (ukgGenSub) {
    ukgGenSub.name = 'General Awareness (KG2 GA)';
    ukgGenSub.malayalamName = 'പൊതുവിജ്ഞാനം (Kindergarten Skills KG2 GA)';
    ukgGenSub.icon = '🌱';
    ukgGenSub.description = 'LEARNWAREi Kindergarten Skills: General Awareness (KG2 GA, NCF-FS) — My Body, Family, Plants, Animals, Helpers, Transport & Seasons';
    ukgGenSub.malayalamDescription = 'LEARNWAREi Kindergarten Skills (KG2 GA) — ശരീരഭാഗങ്ങൾ, കുടുംബം, സസ്യങ്ങൾ, മൃഗങ്ങൾ, സഹായികൾ, വാഹനങ്ങൾ, കാലാവസ്ഥ';
  }
  const ukgReaderSub = db.subjects?.find((s) => s.id === 'sub-ukg-phonics');
  if (ukgReaderSub) {
    ukgReaderSub.name = 'English Reader (KG2 ENGLISH 2)';
    ukgReaderSub.malayalamName = 'ഇംഗ്ലീഷ് റീഡർ (KG2 ENGLISH 2)';
    ukgReaderSub.icon = '📖';
    ukgReaderSub.description = 'LEARNWAREi Kindergarten Skills: English Reader (KG2 ENGLISH 2, NCF-FS) — Phonics, CVC words, Sight words & Short stories';
    ukgReaderSub.malayalamDescription = 'LEARNWAREi ഇംഗ്ലീഷ് റീഡർ — അക്ഷര ശബ്ദങ്ങൾ, മൂന്നക്ഷര വാക്കുകൾ, സൈറ്റ് വേർഡുകൾ, കൊച്ചു ചിത്രകഥകൾ';
  }
  let ukgListenSub = db.subjects?.find((s) => s.id === 'sub-ukg-english-listen');
  if (!ukgListenSub) {
    db.subjects.push({
      id: 'sub-ukg-english-listen',
      childId: 'child-2',
      name: 'English Listen & Speak (KG2 2)',
      malayalamName: 'ഇംഗ്ലീഷ് ലിസൺ & സ്പീക്ക് (KG2 2)',
      icon: '🗣️',
      color: '#8b5cf6',
      bgGradient: 'from-purple-400 to-indigo-500',
      classGrade: 'UKG',
      description: 'LEARNWAREi Kindergarten Skills: English Listen & Speak (KG2 2, NCF-FS) — Greetings, Rhymes, Questions & Conversations',
      malayalamDescription: 'LEARNWAREi ഇംഗ്ലീഷ് ലിസൺ & സ്പീക്ക് — സംഭാഷണങ്ങൾ, റൈംസ്, ചോദ്യോത്തരങ്ങൾ, ആക്ഷൻ വാക്കുകൾ',
    });
  }
  const ukgMathSub = db.subjects?.find((s) => s.id === 'sub-ukg-math');
  if (ukgMathSub) {
    ukgMathSub.name = 'Fun with Numbers (KG2 MATH)';
    ukgMathSub.malayalamName = 'സംഖ്യകളും കൂട്ടലും (KG2 MATH)';
    ukgMathSub.description = 'LEARNWAREi Kindergarten Skills: Fun with Numbers (KG2 MATH, NCF-FS) — 1-50 Counting, 5+2=7 Addition, Subtraction, Shapes & Clock';
    ukgMathSub.malayalamDescription = 'LEARNWAREi സംഖ്യകളും കണക്കും — 1-50 എണ്ണൽ, 5+2=7 കൂട്ടൽ, കുറയ്ക്കൽ, രൂപങ്ങൾ, ക്ലോക്ക്';
  }
  saveDb(db);
  return db.textbooks;
}

export function saveDb(state: DatabaseState): void {
  memoryDb = state;
  try {
    ensureDirectoryExistence(DB_FILE);
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving database to file:', error);
  }
}

// Helper methods
export function getChildProfile(id: string): ChildProfile | undefined {
  const db = getDb();
  return db.children.find((c) => c.id === id);
}

export function updateChildProfile(id: string, updates: Partial<ChildProfile>): ChildProfile | null {
  const db = getDb();
  const index = db.children.findIndex((c) => c.id === id);
  if (index === -1) return null;

  db.children[index] = { ...db.children[index], ...updates };
  saveDb(db);
  return db.children[index];
}

export function getSubjects(childId?: string, classGrade?: string): Subject[] {
  const db = getDb();
  const targetGrade = classGrade || (childId ? db.children.find((c) => c.id === childId)?.classGrade : undefined);
  if (targetGrade) {
    return db.subjects.filter((s) => s.classGrade === targetGrade);
  }
  if (childId) {
    return db.subjects.filter((s) => s.childId === childId);
  }
  return db.subjects;
}

export function addSubject(subject: Subject): Subject {
  const db = getDb();
  db.subjects.push(subject);
  saveDb(db);
  return subject;
}

export function deleteSubject(id: string): boolean {
  const db = getDb();
  const initialLen = db.subjects.length;
  db.subjects = db.subjects.filter((s) => s.id !== id);
  if (db.subjects.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}

export function getTextbooks(childId?: string, subjectId?: string, classGrade?: string): Textbook[] {
  const db = getDb();
  let books = db.textbooks;
  const targetGrade = classGrade || (childId ? db.children.find((c) => c.id === childId)?.classGrade : undefined);
  if (targetGrade) {
    books = books.filter((b) => (b.classGrade || (b as any).grade) === targetGrade);
  } else if (childId) {
    books = books.filter((b) => b.childId === childId);
  }
  if (subjectId) {
    books = books.filter((b) => b.subjectId === subjectId);
  }
  return books;
}

export function addTextbook(textbook: Textbook): Textbook {
  const db = getDb();
  db.textbooks.unshift(textbook);
  saveDb(db);
  return textbook;
}

export function deleteTextbook(id: string): boolean {
  const db = getDb();
  const initialLen = db.textbooks.length;
  db.textbooks = db.textbooks.filter((b) => b.id !== id);
  if (db.textbooks.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}

export function getLesson(chapterId: string): Lesson | undefined {
  const db = getDb();
  return db.lessons.find((l) => l.chapterId === chapterId);
}

export function saveLesson(lesson: Lesson): Lesson {
  const db = getDb();
  const index = db.lessons.findIndex((l) => l.chapterId === lesson.chapterId);
  if (index >= 0) {
    db.lessons[index] = lesson;
  } else {
    db.lessons.push(lesson);
  }
  saveDb(db);
  return lesson;
}

export function getFlashcards(childId?: string, chapterId?: string): Flashcard[] {
  const db = getDb();
  let cards = db.flashcards;
  if (chapterId) {
    return cards.filter((c) => c.chapterId === chapterId);
  }
  if (childId) {
    const child = db.children.find((c) => c.id === childId);
    if (child) {
      const validBooks = db.textbooks.filter((b) => (b.classGrade || (b as any).grade) === child.classGrade);
      const validChapIds = new Set(validBooks.flatMap((b) => b.chapters.map((ch) => ch.id)));
      return cards.filter((c) => validChapIds.has(c.chapterId));
    }
    return cards.filter((c) => c.childId === childId);
  }
  return cards;
}

export function saveFlashcard(flashcard: Flashcard): Flashcard {
  const db = getDb();
  const index = db.flashcards.findIndex((f) => f.id === flashcard.id);
  if (index >= 0) {
    db.flashcards[index] = flashcard;
  } else {
    db.flashcards.push(flashcard);
  }
  saveDb(db);
  return flashcard;
}

export function getQuiz(chapterId: string): Quiz | undefined {
  const db = getDb();
  return db.quizzes.find((q) => q.chapterId === chapterId);
}

export function saveQuiz(quiz: Quiz): Quiz {
  const db = getDb();
  const index = db.quizzes.findIndex((q) => q.chapterId === quiz.chapterId);
  if (index >= 0) {
    db.quizzes[index] = quiz;
  } else {
    db.quizzes.push(quiz);
  }
  saveDb(db);
  return quiz;
}

export function recordQuizAttempt(attempt: QuizAttempt): void {
  const db = getDb();
  db.quizAttempts.unshift(attempt);

  // Update child stars and coins
  const child = db.children.find((c) => c.id === attempt.childId);
  if (child) {
    child.stars += attempt.starsEarned;
    child.coins += attempt.starsEarned * 2;
  }

  saveDb(db);
}

export function recordSession(session: LearningSession): void {
  const db = getDb();
  db.sessions.unshift(session);

  const child = db.children.find((c) => c.id === session.childId);
  if (child) {
    child.totalLearningMinutes += session.durationMinutes;
  }

  saveDb(db);
}

export function getAchievements(childId: string): Achievement[] {
  const db = getDb();
  return db.achievements.filter((a) => a.childId === childId);
}

export function getParentSettings(): ParentSettings {
  const db = getDb();
  return db.parentSettings;
}

export function updateParentSettings(settings: Partial<ParentSettings>): ParentSettings {
  const db = getDb();
  db.parentSettings = { ...db.parentSettings, ...settings };
  saveDb(db);
  return db.parentSettings;
}

