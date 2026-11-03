import fs from 'fs';
import path from 'path';
import { DatabaseState, ChildProfile, Subject, Textbook, Lesson, Flashcard, Quiz, QuizAttempt, LearningSession, Achievement, ParentSettings } from './types';
import { initialDatabaseState } from './seed';

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
      memoryDb = JSON.parse(data);
      return memoryDb!;
    }
  } catch (error) {
    console.error('Error reading database file, using initial state:', error);
  }

  // Initialize with seed data
  memoryDb = JSON.parse(JSON.stringify(initialDatabaseState));
  saveDb(memoryDb!);
  return memoryDb!;
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

export function getSubjects(childId?: string): Subject[] {
  const db = getDb();
  if (!childId) return db.subjects;
  return db.subjects.filter((s) => s.childId === childId);
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

export function getTextbooks(childId?: string, subjectId?: string): Textbook[] {
  const db = getDb();
  let books = db.textbooks;
  if (childId) {
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
  if (childId) {
    cards = cards.filter((c) => c.childId === childId);
  }
  if (chapterId) {
    cards = cards.filter((c) => c.chapterId === chapterId);
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

