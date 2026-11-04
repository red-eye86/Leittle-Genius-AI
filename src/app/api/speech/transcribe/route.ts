import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudioWithGemini } from '@/lib/ai/gemini';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    let audioBase64 = '';
    let mimeType = 'audio/webm';
    let language: 'en' | 'ml' = 'en';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('audio') as File | null;
      language = ((formData.get('language') as string) || 'en') as 'en' | 'ml';

      if (!file) {
        return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      audioBase64 = Buffer.from(arrayBuffer).toString('base64');
      mimeType = file.type || 'audio/webm';
    } else {
      const body = await req.json();
      audioBase64 = body.audio || '';
      mimeType = body.mimeType || 'audio/webm';
      language = (body.language || 'en') as 'en' | 'ml';
    }

    if (!audioBase64) {
      return NextResponse.json({ error: 'Missing audio data' }, { status: 400 });
    }

    // Clean base64 header if present (e.g. data:audio/webm;base64,...)
    if (audioBase64.includes('base64,')) {
      audioBase64 = audioBase64.split('base64,')[1];
    }

    const transcript = await transcribeAudioWithGemini(audioBase64, mimeType, language);

    return NextResponse.json({
      success: true,
      text: transcript,
    });
  } catch (error: any) {
    console.error('Speech transcription error:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio: ' + (error.message || error) },
      { status: 500 }
    );
  }
}

