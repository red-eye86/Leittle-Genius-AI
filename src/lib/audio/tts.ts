// Reliable Multi-Engine Speech Synthesis (Cloud Audio Stream + Browser SpeechSynthesis Fallback)
// Supports both English (en-IN / en-US) and Malayalam (ml-IN) reliably on Windows, Mac, iOS, and Android.

let activeAudio: HTMLAudioElement | null = null;
let isCancelled = false;
let activeUtterance: SpeechSynthesisUtterance | null = null;

function splitIntoChunks(text: string, maxLen = 175): string[] {
  const cleaned = text
    .replace(/[*_#`~[\]]/g, '')
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return [];

  // Split by sentence boundaries
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
        // Hard split long sentence by words
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

function fallbackBrowserSpeak(
  text: string,
  language: 'en' | 'ml',
  rate: number,
  pitch: number,
  onEnd?: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    window.speechSynthesis.resume();
  } catch (e) {
    console.warn('SpeechSynthesis reset warning:', e);
  }

  setTimeout(() => {
    if (isCancelled) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    activeUtterance = utterance; // Prevent Chrome V8 garbage collection bug
    utterance.rate = rate;
    utterance.pitch = pitch;

    const voices = window.speechSynthesis.getVoices();
    const hasMalayalamChars = /[\u0D00-\u0D7F]/.test(text);

    if (language === 'ml' && hasMalayalamChars) {
      const mlVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ml'));
      if (mlVoice) {
        utterance.voice = mlVoice;
        utterance.lang = mlVoice.lang;
      } else {
        const inVoice = voices.find((v) => v.lang.includes('IN') || v.name.includes('India'));
        if (inVoice) utterance.voice = inVoice;
        utterance.lang = 'en-IN';
      }
    } else {
      const enVoice =
        voices.find(
          (v) =>
            v.lang === 'en-IN' ||
            (v.lang.startsWith('en') &&
              (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Zira') || v.name.includes('Female')))
        ) || voices.find((v) => v.lang.startsWith('en'));

      if (enVoice) {
        utterance.voice = enVoice;
        utterance.lang = enVoice.lang;
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
  }, 60);
}

export function speakText(
  text: string,
  language: 'en' | 'ml' = 'en',
  rate: number = 0.98,
  pitch: number = 1.1,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined') return false;

  // Stop any current playback first
  stopSpeaking();
  isCancelled = false;

  const chunks = splitIntoChunks(text, 175);
  if (chunks.length === 0) {
    if (onEnd) onEnd();
    return false;
  }

  let currentChunkIndex = 0;

  const playNextChunk = () => {
    if (isCancelled || currentChunkIndex >= chunks.length) {
      activeAudio = null;
      if (onEnd) onEnd();
      return;
    }

    const chunk = chunks[currentChunkIndex];
    currentChunkIndex++;

    const hasMalayalamChars = /[\u0D00-\u0D7F]/.test(chunk);
    const effectiveLang = hasMalayalamChars ? 'ml' : language === 'ml' && hasMalayalamChars ? 'ml' : 'en';

    const url = `/api/tts?lang=${effectiveLang}&text=${encodeURIComponent(chunk)}`;
    const audio = new Audio(url);
    audio.playbackRate = rate;
    activeAudio = audio;

    audio.onended = () => {
      playNextChunk();
    };

    audio.onerror = () => {
      // Fallback to browser SpeechSynthesis if audio endpoint fails
      activeAudio = null;
      fallbackBrowserSpeak(chunks.slice(currentChunkIndex - 1).join(' '), language, rate, pitch, onEnd);
    };

    audio.play().catch(() => {
      activeAudio = null;
      fallbackBrowserSpeak(chunks.slice(currentChunkIndex - 1).join(' '), language, rate, pitch, onEnd);
    });
  };

  playNextChunk();
  return true;
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
  return typeof window !== 'undefined';
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
