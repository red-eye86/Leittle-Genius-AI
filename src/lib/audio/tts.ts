// Speech Synthesis and Recognition helper for Little Genius AI

export function speakText(
  text: string,
  language: 'en' | 'ml' = 'en',
  rate: number = 0.95,
  pitch: number = 1.15,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip markdown, asterisks, emojis from speech
  const cleanText = text
    .replace(/[*_#`~[\]]/g, '')
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    .trim();

  if (!cleanText) return false;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = rate;
  utterance.pitch = pitch;

  const voices = window.speechSynthesis.getVoices();

  if (language === 'ml') {
    // Try to find a Malayalam or South Asian voice
    const mlVoice = voices.find(
      (v) => v.lang.startsWith('ml') || v.lang.includes('IN') || v.name.includes('India')
    );
    if (mlVoice) {
      utterance.voice = mlVoice;
    }
    utterance.lang = 'ml-IN';
  } else {
    // Find friendly English voice (prefer Indian English or natural voice)
    const enVoice = voices.find(
      (v) => v.lang === 'en-IN' || (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Female')))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (enVoice) {
      utterance.voice = enVoice;
    }
    utterance.lang = 'en-US';
  }

  if (onEnd) {
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
  }

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
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

