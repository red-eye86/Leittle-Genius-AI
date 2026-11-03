import { NextRequest, NextResponse } from 'next/server';
import { getChildProfile } from '@/lib/db/store';
import { generateAIChatResponse } from '@/lib/ai/gemini';
import { retrieveCurriculumContext } from '@/lib/ai/rag';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { childId, message, history = [], mode = 'explain', language = 'en', chapterId, subjectId } = body;

    const child = getChildProfile(childId || 'child-1');
    if (!child) {
      return NextResponse.json({ error: 'Child profile not found' }, { status: 404 });
    }

    // Retrieve grounding context from uploaded textbooks
    const ragContext = retrieveCurriculumContext(child.id, chapterId, subjectId, message);

    // Generate AI response
    const aiResponse = await generateAIChatResponse(
      child,
      message,
      history,
      mode,
      language,
      ragContext
    );

    return NextResponse.json({
      success: true,
      reply: aiResponse.text,
      sourceContext: ragContext ? {
        book: ragContext.sourceTextbook,
        chapter: ragContext.chapterTitle,
      } : null,
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to process AI chat: ' + error.message }, { status: 500 });
  }
}

