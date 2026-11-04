export type ClassGrade = 'LKG' | 'UKG' | 'Class 1' | 'Class 2' | 'Class 3' | 'Class 4' | 'Class 5';
export type Language = 'en' | 'ml';
export type LLMProvider = 'smart_built_in' | 'gemini' | 'openai' | 'anthropic';

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  classGrade: ClassGrade;
  avatar: string; // owl, lion, tiger, rabbit, elephant, astronaut
  themeColor: string;
  stars: number;
  coins: number;
  streakDays: number;
  learningPace: 'gentle' | 'normal' | 'advanced';
  totalLearningMinutes: number;
  createdDate: string;
}

export interface Subject {
  id: string;
  childId: string;
  name: string;
  malayalamName: string;
  icon: string;
  color: string;
  bgGradient: string;
  classGrade: ClassGrade;
  description: string;
  malayalamDescription: string;
}

export interface TextbookChapter {
  id: string;
  chapterNumber: number;
  title: string;
  malayalamTitle: string;
  summary: string;
  malayalamSummary: string;
  topics?: string[];
  keyTerms: string[];
  learningObjectives?: string[];
  extractedTextChunk?: string;
  pageNumber?: number;
}

export interface Textbook {
  id: string;
  childId: string;
  subjectId: string;
  title: string;
  academicYear?: string;
  classGrade: ClassGrade;
  fileName?: string;
  fileSize?: string;
  pageCount?: number;
  author?: string;
  publisher?: string;
  coverImage?: string;
  grade?: string;
  chapters: TextbookChapter[];
  uploadDate?: string;
  rawText?: string;
}

export interface LessonSection {
  type: 'intro' | 'explanation' | 'story' | 'visual' | 'real_life' | 'activity' | 'summary' | 'parent_guide';
  title: string;
  malayalamTitle: string;
  content: string;
  malayalamContent: string;
  visualEmoji?: string;
  interactivePrompt?: string;
}

export interface Lesson {
  id: string;
  chapterId: string;
  subjectId: string;
  childId: string;
  title: string;
  malayalamTitle: string;
  sourceTextbook: string;
  sections: LessonSection[];
  learningObjectives: string[];
  malayalamObjectives: string[];
  updatedAt: string;
}

export interface Flashcard {
  id: string;
  chapterId: string;
  subjectId: string;
  childId: string;
  front: string;
  back: string;
  frontMalayalam: string;
  backMalayalam: string;
  pronunciation?: string;
  visualEmoji: string;
  category: string;
  mastered: boolean;
  reviewCount: number;
  lastReviewed?: string;
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'true_false' | 'fill_blank' | 'picture';
  question: string;
  questionMalayalam: string;
  options: string[];
  optionsMalayalam: string[];
  correctIndex: number; // 0-based index or 0 for true / 1 for false
  explanation: string;
  explanationMalayalam: string;
  hint: string;
  hintMalayalam: string;
  visualEmoji?: string;
}

export interface Quiz {
  id: string;
  chapterId: string;
  subjectId: string;
  childId: string;
  title: string;
  malayalamTitle: string;
  sourceChapter: string;
  questions: QuizQuestion[];
  passingScore: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  childId: string;
  chapterId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  starsEarned: number;
  timestamp: string;
  answers: { questionId: string; selectedIndex: number; isCorrect: boolean }[];
}

export interface LearningSession {
  id: string;
  childId: string;
  subjectId: string;
  chapterId?: string;
  activityType: 'lesson' | 'quiz' | 'flashcard' | 'game' | 'world3d' | 'story' | 'ai_teacher';
  durationMinutes: number;
  timestamp: string;
  notes?: string;
}

export interface Achievement {
  id: string;
  childId: string;
  title: string;
  titleMalayalam: string;
  description: string;
  malayalamDescription: string;
  icon: string;
  category: 'quiz' | 'streak' | 'reading' | 'math' | 'explorer';
  unlockedAt: string | null;
  progress: number; // 0 to 100
  target: number;
  current: number;
}

export interface ParentSettings {
  pin: string;
  parentName: string;
  email: string;
  llmProvider: LLMProvider;
  geminiApiKey: string;
  openAiApiKey: string;
  anthropicApiKey: string;
  dailyTimeLimitMinutes: number;
  enableVoice: boolean;
  enableSoundEffects: boolean;
  defaultLanguage: Language;
  syllabusBoard: 'ICIC' | 'ICSE' | 'Kerala State' | 'CBSE';
  aiSafeMode: boolean;
}

export interface DatabaseState {
  children: ChildProfile[];
  subjects: Subject[];
  textbooks: Textbook[];
  lessons: Lesson[];
  flashcards: Flashcard[];
  quizzes: Quiz[];
  quizAttempts: QuizAttempt[];
  sessions: LearningSession[];
  achievements: Achievement[];
  parentSettings: ParentSettings;
}

