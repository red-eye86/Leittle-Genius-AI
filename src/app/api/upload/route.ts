import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromBuffer } from '@/lib/pdf/extractor';
import { addTextbook } from '@/lib/db/store';
import { Textbook, ClassGrade } from '@/lib/db/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const childId = (formData.get('childId') as string) || 'child-1';
    const subjectId = (formData.get('subjectId') as string) || '';
    const title = (formData.get('title') as string) || file?.name || 'Uploaded Textbook';
    const academicYear = (formData.get('academicYear') as string) || '2026-2027';
    const classGrade = ((formData.get('classGrade') as string) || 'Class 4') as ClassGrade;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process file and extract chapters
    const extracted = await extractTextFromBuffer(buffer, file.name);

    const fileSizeFormatted = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    const newTextbook: Textbook = {
      id: `tb-${Date.now()}`,
      childId,
      subjectId,
      title,
      academicYear,
      classGrade,
      fileName: file.name,
      fileSize: fileSizeFormatted,
      pageCount: extracted.pageCount,
      chapters: extracted.chapters,
      uploadDate: new Date().toISOString().split('T')[0],
      rawText: extracted.text.slice(0, 50000), // Store preview for RAG
    };

    const saved = addTextbook(newTextbook);

    return NextResponse.json({
      success: true,
      textbook: saved,
      chaptersCount: saved.chapters.length,
      extractedPreview: extracted.text.slice(0, 300),
    });
  } catch (error: any) {
    console.error('Upload processing error:', error);
    return NextResponse.json({ error: 'Failed to process textbook upload: ' + error.message }, { status: 500 });
  }
}

