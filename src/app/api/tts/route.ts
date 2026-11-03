import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const rawText = req.nextUrl.searchParams.get('text') || '';
    const langParam = req.nextUrl.searchParams.get('lang') || 'en';

    // Clean emojis and formatting characters
    const cleanText = rawText
      .replace(/[*_#`~[\]()•→÷×]/g, ' ')
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 200);

    if (!cleanText) {
      return new NextResponse('Empty text', { status: 400 });
    }

    // Auto-detect if string contains Malayalam Unicode characters
    const hasMalayalam = /[\u0D00-\u0D7F]/.test(cleanText);
    const tl = hasMalayalam ? 'ml' : langParam === 'ml' ? 'ml' : 'en-IN';

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${tl}&client=tw-ob&q=${encodeURIComponent(
      cleanText
    )}`;

    const response = await fetch(ttsUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      return new NextResponse('TTS upstream error', { status: 502 });
    }

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(Buffer.from(arrayBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('TTS API error:', error);
    return new NextResponse('Internal TTS Error', { status: 500 });
  }
}
