import { NextRequest, NextResponse } from 'next/server';
import { getParentSettings } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

// In-memory audio LRU cache for ultra-fast instantaneous playback and zero duplicate API calls
const audioCache = new Map<string, { buffer: Buffer; contentType: string; timestamp: number }>();
const MAX_CACHE_SIZE = 150;

function getCachedAudio(key: string): { buffer: Buffer; contentType: string } | null {
  const item = audioCache.get(key);
  if (item) {
    item.timestamp = Date.now();
    return { buffer: item.buffer, contentType: item.contentType };
  }
  return null;
}

function setCachedAudio(key: string, buffer: Buffer, contentType: string) {
  if (audioCache.size >= MAX_CACHE_SIZE) {
    let oldestKey = '';
    let oldestTime = Infinity;
    for (const [k, v] of audioCache.entries()) {
      if (v.timestamp < oldestTime) {
        oldestTime = v.timestamp;
        oldestKey = k;
      }
    }
    if (oldestKey) audioCache.delete(oldestKey);
  }
  audioCache.set(key, { buffer, contentType, timestamp: Date.now() });
}

/**
 * Converts raw 16-bit linear PCM audio into a standard playable WAV file with a valid 44-byte header.
 * Gemini 2.0 Flash Audio returns raw linear PCM at 24000Hz, 1 channel.
 */
function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitDepth = 16): Buffer {
  const header = Buffer.alloc(44);
  const byteRate = (sampleRate * numChannels * bitDepth) / 8;
  const blockAlign = (numChannels * bitDepth) / 8;
  const dataSize = pcmBuffer.length;
  const chunkSize = 36 + dataSize;

  // RIFF chunk descriptor
  header.write('RIFF', 0);
  header.writeUInt32LE(chunkSize, 4);
  header.write('WAVE', 8);

  // "fmt " sub-chunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size for PCM
  header.writeUInt16LE(1, 20); // AudioFormat 1 = PCM
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitDepth, 34);

  // "data" sub-chunk
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

/**
 * Clean text for audio synthesis:
 * - Normalizes Unicode for Malayalam (NFC)
 * - Removes markdown asterisks, hashtags, bullets, emojis
 * - Trims excess whitespace
 */
function cleanTextForSpeech(rawText: string): string {
  return rawText
    .normalize('NFC')
    .replace(/[*_#`~[\]()•→÷×]/g, ' ')
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Try generating speech using Google Cloud Neural Text-to-Speech API
 * with the user's paid Gemini/Google API key.
 * Features native Kerala Malayalam Wavenet voice (ml-IN-Wavenet-A) and Indian English (en-IN-Wavenet-D).
 */
async function tryGoogleCloudTts(
  text: string,
  apiKey: string,
  isMalayalam: boolean
): Promise<{ buffer: Buffer; contentType: string } | null> {
  try {
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(apiKey)}`;
    const langCode = isMalayalam ? 'ml-IN' : 'en-IN';
    const voiceName = isMalayalam ? 'ml-IN-Wavenet-A' : 'en-IN-Wavenet-D';

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: langCode,
          name: voiceName,
          ssmlGender: 'FEMALE',
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: isMalayalam ? 0.95 : 1.0,
          pitch: 0.0,
        },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.audioContent) {
        const buf = Buffer.from(data.audioContent, 'base64');
        return { buffer: buf, contentType: 'audio/mpeg' };
      }
    }
  } catch (e) {
    // Continue to next strategy
  }
  return null;
}

/**
 * Try generating native Gemini Audio using Gemini 2.0 Flash model.
 * Models: gemini-2.0-flash with responseModalities: ["AUDIO"]
 */
async function tryGeminiNativeAudio(
  text: string,
  apiKey: string,
  isMalayalam: boolean
): Promise<{ buffer: Buffer; contentType: string } | null> {
  const models = ['gemini-2.0-flash', 'gemini-2.0-flash-exp'];

  const promptText = isMalayalam
    ? `You are Chikoo (ചിക്കു), an adorable, loving pet dog and voice buddy for Kerala kids. Speak the following Malayalam text aloud with warm, joyful, crystal-clear, flawless native Kerala Malayalam pronunciation. Do not say anything else, only speak the text naturally:\n\n${text}`
    : `You are Chikoo, an enthusiastic, joyful pet dog and AI voice companion for young kids. Speak the following text aloud in a cheerful, clear, friendly kid-friendly voice. Do not say anything else, only speak the text naturally:\n\n${text}`;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: promptText }],
            },
          ],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: isMalayalam ? 'Aoede' : 'Puck',
                },
              },
            },
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const part = data?.candidates?.[0]?.content?.parts?.[0];
        if (part?.inlineData?.data) {
          const rawBuf = Buffer.from(part.inlineData.data, 'base64');
          const mime = part.inlineData.mimeType || 'audio/wav';

          if (mime.includes('pcm')) {
            const wavBuf = pcmToWav(rawBuf, 24000, 1, 16);
            return { buffer: wavBuf, contentType: 'audio/wav' };
          }

          return { buffer: rawBuf, contentType: mime };
        }
      }
    } catch (e) {
      // Continue to next model or fallback
    }
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const rawText = req.nextUrl.searchParams.get('text') || '';
    const langParam = req.nextUrl.searchParams.get('lang') || 'en';

    const cleanText = cleanTextForSpeech(rawText);
    if (!cleanText) {
      return new NextResponse('Empty text', { status: 400 });
    }

    // Auto-detect if text contains Malayalam Unicode characters (0x0D00 - 0x0D7F)
    const hasMalayalam = /[\u0D00-\u0D7F]/.test(cleanText);
    const isMalayalam = hasMalayalam || langParam === 'ml';
    const effectiveLang = isMalayalam ? 'ml' : 'en';

    // Check fast in-memory cache
    const cacheKey = `${effectiveLang}:${cleanText.slice(0, 150)}`;
    const cached = getCachedAudio(cacheKey);
    if (cached) {
      return new NextResponse(new Uint8Array(cached.buffer), {
        status: 200,
        headers: {
          'Content-Type': cached.contentType,
          'Cache-Control': 'public, max-age=86400',
          'X-Voice-Source': 'cache',
        },
      });
    }

    // 1. Retrieve the user's Gemini API Key from Parent Settings or Environment
    const settings = getParentSettings();
    const apiKey = (settings.geminiApiKey || process.env.GEMINI_API_KEY || '').trim();

    // 2. If Gemini API key is configured, use Gemini Voice Output
    if (apiKey) {
      // Strategy A: Try Google Cloud Neural TTS (Pure studio Malayalam / English Wavenet)
      const cloudAudio = await tryGoogleCloudTts(cleanText, apiKey, isMalayalam);
      if (cloudAudio) {
        setCachedAudio(cacheKey, cloudAudio.buffer, cloudAudio.contentType);
        return new NextResponse(new Uint8Array(cloudAudio.buffer), {
          status: 200,
          headers: {
            'Content-Type': cloudAudio.contentType,
            'Cache-Control': 'public, max-age=86400',
            'X-Voice-Source': 'gemini-neural',
          },
        });
      }

      // Strategy B: Try Gemini 2.0 Flash Native Audio Generation
      const geminiAudio = await tryGeminiNativeAudio(cleanText, apiKey, isMalayalam);
      if (geminiAudio) {
        setCachedAudio(cacheKey, geminiAudio.buffer, geminiAudio.contentType);
        return new NextResponse(new Uint8Array(geminiAudio.buffer), {
          status: 200,
          headers: {
            'Content-Type': geminiAudio.contentType,
            'Cache-Control': 'public, max-age=86400',
            'X-Voice-Source': 'gemini-native',
          },
        });
      }
    }

    // 3. Fallback Stream (Only if API key is not yet set or during network offline)
    const tl = isMalayalam ? 'ml' : 'en-IN';
    const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${tl}&client=tw-ob&q=${encodeURIComponent(
      cleanText.slice(0, 200)
    )}`;

    const fallbackRes = await fetch(fallbackUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
    });

    if (fallbackRes.ok) {
      const arrayBuffer = await fallbackRes.arrayBuffer();
      const rawBuffer = Buffer.from(arrayBuffer);
      setCachedAudio(cacheKey, rawBuffer, 'audio/mpeg');

      return new NextResponse(new Uint8Array(rawBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=86400',
          'X-Voice-Source': 'fallback',
        },
      });
    }

    return new NextResponse('Voice synthesis unavailable', { status: 502 });
  } catch (error) {
    console.error('TTS API error:', error);
    return new NextResponse('Internal Voice Error', { status: 500 });
  }
}
