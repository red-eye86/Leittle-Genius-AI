import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

export const dynamic = 'force-dynamic';

/**
 * Character voice transformation filters for FFMPEG
 * Converts upstream audio to distinct gender and age personas:
 * - father (Papa Manoj): Deep, warm adult MALE voice (rubberband pitch shift + bass presence)
 * - eadrick (Brother Eadrick): Energetic young BOY voice (Class 4)
 * - faidan (Little Faidan): Sweet, high, cute KID voice (UKG)
 * - mother (Mummy Tessy): Sweet, gentle FEMALE voice
 * - grandmother (Grandma Lilly): Warm, affectionate ELDER FEMALE storytelling voice
 */
function getAudioFilterForCharacter(character: string): string {
  switch (character) {
    case 'father':
    case 'papa_manoj':
      // Clear, rich adult male baritone voice
      return 'rubberband=pitch=0.70,equalizer=f=200:t=q:w=1:g=4';
    case 'eadrick':
    case 'kid_bright':
      // 9-year-old cheerful boy voice
      return 'rubberband=pitch=0.88:tempo=1.03';
    case 'faidan':
    case 'kid_sweet':
      // 5-year-old sweet kindergarten child voice
      return 'rubberband=pitch=1.35:tempo=0.96';
    case 'mother':
    case 'mummy_tessy':
      // Loving mother/teacher female voice
      return 'rubberband=pitch=1.06';
    case 'grandmother':
    case 'grandma_lilly':
      // Warm, affectionate grandmother storyteller
      return 'rubberband=pitch=0.96:tempo=0.88';
    case 'voice_creature':
    case 'creature':
      // High, cute animated animal / creature voice
      return 'rubberband=pitch=1.34:tempo=1.06';
    case 'voice_giant':
    case 'giant':
      // Big friendly animal (Elephant, Lion, Whale)
      return 'rubberband=pitch=0.62:tempo=0.92,equalizer=f=160:t=q:w=1:g=5';
    case 'voice_bird':
    case 'bird':
      // Chirpy, bright talking bird
      return 'rubberband=pitch=1.42:tempo=1.10';
    case 'voice_robot':
    case 'robot':
      // Fun robotic effect with flanger
      return 'rubberband=pitch=1.02:tempo=0.98,flanger=delay=4:depth=3';
    case 'voice_wise':
    case 'wise':
      // Wise storyteller / professor
      return 'rubberband=pitch=0.82:tempo=0.90';
    default:
      return '';
  }
}

async function transformAudioWithFfmpeg(inputBuffer: Buffer, filter: string): Promise<Buffer> {
  if (!filter) return inputBuffer;

  return new Promise((resolve) => {
    try {
      const ffmpeg = spawn('ffmpeg', [
        '-i',
        'pipe:0',
        '-af',
        filter,
        '-f',
        'mp3',
        'pipe:1',
      ]);

      const chunks: Buffer[] = [];
      ffmpeg.stdout.on('data', (d) => chunks.push(d));

      ffmpeg.on('close', (code) => {
        if (code === 0 && chunks.length > 0) {
          resolve(Buffer.concat(chunks));
        } else {
          // Fallback to original buffer if ffmpeg exits with error
          resolve(inputBuffer);
        }
      });

      ffmpeg.on('error', (err) => {
        console.warn('FFmpeg transform error, using raw audio:', err);
        resolve(inputBuffer);
      });

      ffmpeg.stdin.write(inputBuffer);
      ffmpeg.stdin.end();
    } catch (e) {
      console.warn('FFmpeg execution error:', e);
      resolve(inputBuffer);
    }
  });
}

export async function GET(req: NextRequest) {
  try {
    const rawText = req.nextUrl.searchParams.get('text') || '';
    const langParam = req.nextUrl.searchParams.get('lang') || 'en';
    const character = req.nextUrl.searchParams.get('character') || '';

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
    const rawBuffer = Buffer.from(arrayBuffer);

    // Apply proper gender and character pitch filter (transforms upstream female voice to genuine male, boy, sweet kid, grandma)
    const filter = getAudioFilterForCharacter(character);
    const finalAudio = filter ? await transformAudioWithFfmpeg(rawBuffer, filter) : rawBuffer;

    return new NextResponse(new Uint8Array(finalAudio), {
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

