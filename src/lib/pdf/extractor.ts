import { TextbookChapter } from '../db/types';

export interface ExtractedBookResult {
  text: string;
  pageCount: number;
  chapters: TextbookChapter[];
}

export async function extractTextFromBuffer(buffer: Buffer, fileName: string): Promise<ExtractedBookResult> {
  let fullText = '';
  let pageCount = 1;

  if (fileName.toLowerCase().endsWith('.pdf')) {
    try {
      // Dynamic import to avoid SSR build conflicts
      const pdf = require('pdf-parse');
      const data = await pdf(buffer);
      fullText = data.text || '';
      pageCount = data.numpages || 1;
    } catch (e) {
      console.warn('PDF parsing error, falling back to text stream:', e);
      fullText = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
    }
  } else {
    // Text, Markdown or utf-8 based doc
    fullText = buffer.toString('utf-8');
  }

  // Parse chapters from extracted text
  const chapters = parseChaptersFromText(fullText, fileName);

  return {
    text: fullText,
    pageCount,
    chapters,
  };
}

export function parseChaptersFromText(text: string, titleHint: string): TextbookChapter[] {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const detectedChapters: TextbookChapter[] = [];

  // Patterns for chapter headings:
  // "Chapter 1: The Solar System", "Lesson 2 Plants", "Unit 3", "1. Living Things", "അധ്യായം 1"
  const chapterRegex = /^(?:chapter|unit|lesson|അധ്യായം|പാഠം)\s*(\d+)[:.\s-]*(.*)$/i;
  const numRegex = /^(\d+)[:.]\s+([A-Z][a-zA-Z0-9\s]{3,40})$/;

  let currentChapter: Partial<TextbookChapter> | null = null;
  let currentChunk: string[] = [];
  let chapCount = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(chapterRegex) || line.match(numRegex);

    if (match && line.length < 80) {
      if (currentChapter && currentChunk.length > 0) {
        currentChapter.extractedTextChunk = currentChunk.slice(0, 1500).join('\n');
        currentChapter.summary = summarizeChunk(currentChunk.join(' '));
        detectedChapters.push(currentChapter as TextbookChapter);
      }

      const chapterNumber = parseInt(match[1], 10) || chapCount;
      const title = match[2]?.trim() || `Chapter ${chapterNumber}`;

      currentChapter = {
        id: `chap-${Date.now()}-${chapCount++}`,
        chapterNumber,
        title,
        malayalamTitle: title,
        summary: '',
        malayalamSummary: '',
        topics: extractTopics(lines.slice(i + 1, i + 20)),
        keyTerms: ['Core Concept', 'Exercise', 'Key Term'],
        pageNumber: chapCount * 5,
      };
      currentChunk = [];
    } else if (currentChapter) {
      currentChunk.push(line);
    }
  }

  // Push last chapter
  if (currentChapter && currentChunk.length > 0) {
    currentChapter.extractedTextChunk = currentChunk.slice(0, 1500).join('\n');
    currentChapter.summary = summarizeChunk(currentChunk.join(' '));
    detectedChapters.push(currentChapter as TextbookChapter);
  }

  // Fallback: If no explicit "Chapter X" pattern was found in raw text, auto-chunk intelligently into chapters
  if (detectedChapters.length === 0) {
    const chunkSize = 25; // lines
    for (let i = 0; i < Math.min(lines.length, 100); i += chunkSize) {
      const slice = lines.slice(i, i + chunkSize);
      const chapNum = Math.floor(i / chunkSize) + 1;
      const firstLineTitle = slice[0]?.slice(0, 40) || `Chapter ${chapNum}`;

      detectedChapters.push({
        id: `chap-${Date.now()}-${chapNum}`,
        chapterNumber: chapNum,
        title: `${firstLineTitle}`,
        malayalamTitle: `${firstLineTitle}`,
        summary: summarizeChunk(slice.join(' ')),
        malayalamSummary: 'ഈ അധ്യായത്തിലെ പ്രധാന ആശയങ്ങൾ',
        topics: extractTopics(slice),
        keyTerms: ['Vocabulary', 'Learning Points'],
        extractedTextChunk: slice.join('\n'),
        pageNumber: chapNum * 4,
      });
    }
  }

  // Ensure at least 1 chapter exists
  if (detectedChapters.length === 0) {
    detectedChapters.push({
      id: `chap-${Date.now()}-1`,
      chapterNumber: 1,
      title: `${titleHint.replace(/\.[^/.]+$/, '')} - Overview`,
      malayalamTitle: 'അധ്യായം 1 - പാഠഭാഗം',
      summary: 'Complete introductory concepts and foundational learning material.',
      malayalamSummary: 'അടിസ്ഥാന ആശയങ്ങളും പഠന വിവരങ്ങളും.',
      topics: ['Introduction', 'Core Learning', 'Summary'],
      keyTerms: ['Concept', 'Practice'],
      extractedTextChunk: text.slice(0, 1500),
      pageNumber: 1,
    });
  }

  return detectedChapters;
}

function summarizeChunk(chunk: string): string {
  const clean = chunk.replace(/\s+/g, ' ').trim();
  if (clean.length <= 160) return clean;
  return clean.slice(0, 160) + '...';
}

function extractTopics(lines: string[]): string[] {
  const topics: string[] = [];
  for (const line of lines) {
    if (line.length > 5 && line.length < 50 && !line.includes('.') && topics.length < 4) {
      topics.push(line.replace(/^[0-9.-]\s*/, ''));
    }
  }
  return topics.length > 0 ? topics : ['Foundational Concept', 'Key Points', 'Practice Exercises'];
}

