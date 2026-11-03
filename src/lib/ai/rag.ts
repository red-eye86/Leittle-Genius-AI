import { getDb } from '../db/store';
import { Textbook, TextbookChapter } from '../db/types';

export interface RetrievedContext {
  sourceTextbook: string;
  chapterNumber: number;
  chapterTitle: string;
  excerpt: string;
  keyTerms: string[];
}

export function retrieveCurriculumContext(
  childId: string,
  chapterId?: string,
  subjectId?: string,
  query?: string
): RetrievedContext | null {
  const db = getDb();
  const textbooks = db.textbooks.filter((b) => b.childId === childId);

  // 1. Direct chapter match
  if (chapterId) {
    for (const book of textbooks) {
      const foundChap = book.chapters.find((c) => c.id === chapterId);
      if (foundChap) {
        return {
          sourceTextbook: `${book.title} (Grade: ${book.classGrade})`,
          chapterNumber: foundChap.chapterNumber,
          chapterTitle: foundChap.title,
          excerpt: foundChap.extractedTextChunk || foundChap.summary || 'Core chapter concepts and syllabus guidelines.',
          keyTerms: foundChap.keyTerms || foundChap.topics || [],
        };
      }
    }
  }

  // 2. Subject search
  if (subjectId) {
    const subjectBook = textbooks.find((b) => b.subjectId === subjectId);
    if (subjectBook && subjectBook.chapters.length > 0) {
      const firstChap = subjectBook.chapters[0];
      return {
        sourceTextbook: subjectBook.title,
        chapterNumber: firstChap.chapterNumber,
        chapterTitle: firstChap.title,
        excerpt: firstChap.extractedTextChunk || firstChap.summary,
        keyTerms: firstChap.keyTerms || [],
      };
    }
  }

  // 3. Keyword query search across all books for child
  if (query) {
    const qLower = query.toLowerCase();
    for (const book of textbooks) {
      for (const chap of book.chapters) {
        const inTitle = chap.title.toLowerCase().includes(qLower);
        const inSummary = chap.summary.toLowerCase().includes(qLower);
        const inChunk = chap.extractedTextChunk?.toLowerCase().includes(qLower);

        if (inTitle || inSummary || inChunk) {
          return {
            sourceTextbook: book.title,
            chapterNumber: chap.chapterNumber,
            chapterTitle: chap.title,
            excerpt: chap.extractedTextChunk || chap.summary,
            keyTerms: chap.keyTerms || [],
          };
        }
      }
    }
  }

  return null;
}

