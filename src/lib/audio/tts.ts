// Reliable Multi-Engine Speech Synthesis for Little Genius AI
// Uses Native OS/Browser SpeechSynthesis (works directly with Windows Headsets & zero latency)
// + Cloud TTS Audio Stream for Malayalam when native Malayalam OS voice is not installed.

let activeAudio: HTMLAudioElement | null = null;
let isCancelled = false;
let activeUtterance: SpeechSynthesisUtterance | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];
let preferredSinkId: string = '';

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export function setPreferredAudioOutputDevice(deviceId: string) {
  preferredSinkId = deviceId;
  if (typeof window !== 'undefined') {
    localStorage.setItem('lg_audio_device', deviceId);
  }
}

export function getPreferredAudioOutputDevice(): string {
  if (typeof window !== 'undefined' && !preferredSinkId) {
    preferredSinkId = localStorage.getItem('lg_audio_device') || '';
  }
  return preferredSinkId;
}

function cleanTextForSpeech(text: string): string {
  return text
    .replace(/[*_#`~[\]]/g, '')
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitIntoChunks(text: string, maxLen = 180): string[] {
  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) return [];

  const rawSentences = cleaned.split(/(?<=[.!?।])\s+/);
  const chunks: string[] = [];
  let current = '';

  for (const sentence of rawSentences) {
    if ((current + ' ' + sentence).trim().length <= maxLen) {
      current = (current + ' ' + sentence).trim();
    } else {
      if (current) chunks.push(current);
      if (sentence.length <= maxLen) {
        current = sentence;
      } else {
        const words = sentence.split(' ');
        let temp = '';
        for (const w of words) {
          if ((temp + ' ' + w).trim().length <= maxLen) {
            temp = (temp + ' ' + w).trim();
          } else {
            if (temp) chunks.push(temp);
            temp = w;
          }
        }
        current = temp;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function speakWithBrowserSynthesis(
  text: string,
  language: 'en' | 'ml',
  rate: number,
  pitch: number,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return false;
  }

  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) {
    if (onEnd) onEnd();
    return false;
  }

  const startUtterance = () => {
    if (isCancelled) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.resume();
    } catch (e) {
      console.warn(e);
    }

    const utterance = new SpeechSynthesisUtterance(cleaned);
    activeUtterance = utterance; // Keep strong reference so Chrome V8 doesn't GC mid-speech
    utterance.volume = 1.0;
    utterance.rate = rate;
    utterance.pitch = pitch;

    const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
    const hasMalayalamChars = /[\u0D00-\u0D7F]/.test(cleaned);

    if (language === 'ml' || hasMalayalamChars) {
      const mlVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ml'));
      if (mlVoice) {
        utterance.voice = mlVoice;
        utterance.lang = mlVoice.lang;
      } else {
        const inVoice = voices.find((v) => v.lang.includes('IN') || v.name.includes('India'));
        if (inVoice) {
          utterance.voice = inVoice;
          utterance.lang = inVoice.lang;
        } else {
          utterance.lang = 'en-IN';
        }
      }
    } else {
      const preferredVoice =
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('Zira') ||
              v.name.includes('Aria') ||
              v.name.includes('Female'))
        ) ||
        voices.find((v) => v.lang === 'en-IN') ||
        voices.find((v) => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
        utterance.lang = preferredVoice.lang;
      } else {
        utterance.lang = 'en-US';
      }
    }

    utterance.onend = () => {
      activeUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      activeUtterance = null;
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  };

  // If currently speaking, cancel first and wait 50ms so Chrome doesn't drop the new utterance.
  // If idle, speak synchronously inside the user click gesture!
  if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn(e);
    }
    setTimeout(startUtterance, 50);
  } else {
    startUtterance();
  }

  return true;
}

function speakWithCloudAudio(
  text: string,
  language: 'en' | 'ml',
  rate: number,
  pitch: number,
  onEnd?: () => void
): boolean {
  const chunks = splitIntoChunks(text, 175);
  if (chunks.length === 0) {
    if (onEnd) onEnd();
    return false;
  }

  let currentChunkIndex = 0;

  const playNextChunk = async () => {
    if (isCancelled || currentChunkIndex >= chunks.length) {
      activeAudio = null;
      if (onEnd) onEnd();
      return;
    }

    const chunk = chunks[currentChunkIndex];
    currentChunkIndex++;

    const hasMalayalamChars = /[\u0D00-\u0D7F]/.test(chunk);
    const effectiveLang = hasMalayalamChars || language === 'ml' ? 'ml' : 'en';

    const url = `/api/tts?lang=${effectiveLang}&text=${encodeURIComponent(chunk)}`;
    const audio = new Audio(url);
    audio.volume = 1.0;
    audio.playbackRate = rate;
    activeAudio = audio;

    // Route to preferred headset sink if supported and set
    const sinkId = getPreferredAudioOutputDevice();
    if (sinkId && typeof (audio as any).setSinkId === 'function') {
      try {
        await (audio as any).setSinkId(sinkId);
      } catch (e) {
        console.warn('Could not set audio sinkId:', e);
      }
    }

    audio.onended = () => {
      playNextChunk();
    };

    audio.onerror = () => {
      activeAudio = null;
      speakWithBrowserSynthesis(chunks.slice(currentChunkIndex - 1).join(' '), language, rate, pitch, onEnd);
    };

    audio.play().catch(() => {
      activeAudio = null;
      speakWithBrowserSynthesis(chunks.slice(currentChunkIndex - 1).join(' '), language, rate, pitch, onEnd);
    });
  };

  playNextChunk();
  return true;
}

export function speakText(
  text: string,
  language: 'en' | 'ml' = 'en',
  rate: number = 0.95,
  pitch: number = 1.1,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined') return false;

  // Stop any active audio stream first
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.src = '';
    } catch (e) {
      console.warn(e);
    }
    activeAudio = null;
  }
  isCancelled = false;

  const enginePref = localStorage.getItem('lg_voice_engine') || 'system'; // 'system' | 'cloud'
  const hasMalayalamChars = /[\u0D00-\u0D7F]/.test(text);
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis?.getVoices?.() || [];
  const hasNativeMalayalamVoice = voices.some((v) => v.lang.toLowerCase().startsWith('ml'));

  // Use Native Browser/OS SpeechSynthesis by default for English (works directly with Windows Headsets!)
  // Only use Cloud TTS stream when user explicitly chooses 'cloud' OR when speaking Malayalam without a native Malayalam voice.
  if (enginePref === 'cloud' || (hasMalayalamChars && !hasNativeMalayalamVoice)) {
    return speakWithCloudAudio(text, language, rate, pitch, onEnd);
  }

  return speakWithBrowserSynthesis(text, language, rate, pitch, onEnd);
}

export function stopSpeaking(): void {
  isCancelled = true;
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.src = '';
    } catch (e) {
      console.warn(e);
    }
    activeAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn(e);
    }
  }
  activeUtterance = null;
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Voice Recognition (Speech to Text)
export interface SpeechRecognitionResultHandler {
  (text: string): void;
}

export function createSpeechRecognizer(
  onResult: SpeechRecognitionResultHandler,
  onError?: (err: string) => void,
  language: 'en' | 'ml' = 'en'
): { start: () => void; stop: () => void; isSupported: boolean } {
  if (typeof window === 'undefined') {
    return { start: () => {}, stop: () => {}, isSupported: false };
  }

  const SpeechRecognition =
    (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition: any }).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return { start: () => {}, stop: () => {}, isSupported: false };
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = language === 'ml' ? 'ml-IN' : 'en-IN';

  recognition.onresult = (event: any) => {
    if (event.results && event.results[0] && event.results[0][0]) {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    }
  };

  recognition.onerror = (event: any) => {
    if (onError) onError(event.error || 'Speech recognition error');
  };

  return {
    start: () => {
      try {
        recognition.start();
      } catch (e) {
        console.warn('Recognition start error:', e);
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch (e) {
        console.warn('Recognition stop error:', e);
      }
    },
    isSupported: true,
  };
}
