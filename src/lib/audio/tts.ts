// Reliable Multi-Engine Speech Synthesis for Little Genius AI
// Uses Native OS/Browser SpeechSynthesis (works directly with Windows Headsets & zero latency)
// + Cloud TTS Audio Stream for Malayalam when native Malayalam OS voice is not installed.

export type VoiceProfileId =
  | 'kid_sweet'       // Sweet Kid Voice (UKG & Faidan default: pitch 1.5, rate 0.90)
  | 'kid_bright'      // Energetic Kid Voice (Eadrick: pitch 1.35, rate 0.96)
  | 'grandma_lilly'   // Grandma Lilly Joseph (Storyteller: pitch 1.12, rate 0.88)
  | 'mummy_tessy'     // Mummy Tessy (Sweet maternal: pitch 1.25, rate 0.95)
  | 'papa_manoj'      // Papa Manoj (Calm guide: pitch 0.92, rate 0.95)
  | 'natural';        // Natural teacher voice (pitch 1.05, rate 0.95)

export interface VoiceProfileConfig {
  id: VoiceProfileId;
  name: string;
  malayalamName: string;
  description: string;
  malayalamDescription: string;
  icon: string;
  pitch: number;
  rate: number;
  malayalamRate: number;
  malayalamSample: string;
  englishSample: string;
}

export const VOICE_PROFILES: Record<VoiceProfileId, VoiceProfileConfig> = {
  kid_sweet: {
    id: 'kid_sweet',
    name: 'Sweet Kid Voice (Faidan / UKG)',
    malayalamName: 'മധുരമുള്ള കുട്ടിശബ്ദം (ഫൈദാൻ)',
    description: 'Very sweet, cute & cheerful child voice — perfect for UKG and Little Faidan!',
    malayalamDescription: 'കൊച്ചു കുട്ടികളുടെ മധുരമുള്ള ശബ്ദം — UKG പാഠങ്ങൾക്കും ഫൈദാനും അനുയോജ്യം',
    icon: '🧒',
    pitch: 1.5,
    rate: 0.9,
    malayalamRate: 1.16,
    malayalamSample: 'ഹലോ! ഞാൻ കൊച്ചു ഫൈദാൻ! നമുക്ക് മലയാളം പാഠങ്ങൾ ഒന്നിച്ചു പഠിക്കാം!',
    englishSample: "Hello! I am little Faidan. Let's learn our fun lessons together!",
  },
  kid_bright: {
    id: 'kid_bright',
    name: 'Big Brother Eadrick',
    malayalamName: 'ചേട്ടൻ ഏദ്രിക് (നാലാം ക്ലാസ്)',
    description: 'Energetic, confident boy voice (Class 4 primary explorer)',
    malayalamDescription: 'ഉത്സാഹഭരിതമായ ചേട്ടന്റെ കുട്ടിക്കൂട്ടുകാരൻ ശബ്ദം',
    icon: '👦',
    pitch: 1.32,
    rate: 0.98,
    malayalamRate: 1.1,
    malayalamSample: 'ഹേയ് ഫൈദാൻ, ചേട്ടൻ ഏദ്രിക്കാണ്! നമുക്ക് ഈ പാഠം അടിപൊളിയായി പഠിക്കാം!',
    englishSample: 'Hey Faidan! Brother Eadrick is here! Let us ace this chapter together!',
  },
  grandma_lilly: {
    id: 'grandma_lilly',
    name: 'Grandma Lilly Joseph',
    malayalamName: 'മുത്തശ്ശി ലില്ലി ജോസഫ് (കഥാകാരി)',
    description: 'Warm, gentle & affectionate grandmother storytelling voice',
    malayalamDescription: 'സ്നേഹത്തോടെ കഥ പറഞ്ഞുതരുന്ന മുത്തശ്ശിയുടെ വാത്സല്യ ശബ്ദം',
    icon: '👵',
    pitch: 1.12,
    rate: 0.88,
    malayalamRate: 0.88,
    malayalamSample: 'എന്റെ പൊന്നുമക്കൾക്ക് മുത്തശ്ശി ലില്ലി നല്ലൊരു കഥ പറഞ്ഞുതരാം കേട്ടോ!',
    englishSample: 'My sweet children, Grandma Lilly will tell you a wonderful story!',
  },
  mummy_tessy: {
    id: 'mummy_tessy',
    name: 'Mummy Tessy',
    malayalamName: 'മമ്മി ടെസ്സി (സ്നേഹ അധ്യാപിക)',
    description: 'Sweet, encouraging maternal teacher voice',
    malayalamDescription: 'സ്നേഹനിധിയായ അമ്മയുടെയും അധ്യാപികയുടെയും മധുര ശബ്ദം',
    icon: '👩',
    pitch: 1.25,
    rate: 0.95,
    malayalamRate: 1.02,
    malayalamSample: 'മക്കൾ രണ്ടുപേരും നല്ല മിടുക്കരായി മലയാളം പാഠങ്ങൾ വായിക്കണം കേട്ടോ!',
    englishSample: 'Mummy is so proud of you both! Keep learning with joy!',
  },
  papa_manoj: {
    id: 'papa_manoj',
    name: 'Papa Manoj',
    malayalamName: 'പപ്പ മനോജ് (മാർഗ്ഗദർശി)',
    description: 'Calm, clear and reassuring fatherly guide',
    malayalamDescription: 'വ്യക്തതയുള്ള ശാന്തമായ അച്ഛന്റെ മാർഗ്ഗദർശന ശബ്ദം',
    icon: '👨',
    pitch: 0.92,
    rate: 0.95,
    malayalamRate: 0.92,
    malayalamSample: 'നല്ല കുട്ടികളായി പാഠങ്ങൾ പഠിച്ചാൽ പപ്പ നിങ്ങൾക്ക് സമ്മാനങ്ങൾ തരാം!',
    englishSample: 'Work hard and learn well, champions! Papa is always here for you.',
  },
  natural: {
    id: 'natural',
    name: 'Hootie Owl Teacher',
    malayalamName: 'ഹുട്ടി ടീച്ചർ',
    description: 'Balanced friendly school teacher voice',
    malayalamDescription: 'സ്കൂളിലെ നല്ല ടീച്ചറുടെ വ്യക്തമായ ശബ്ദം',
    icon: '🦉',
    pitch: 1.05,
    rate: 0.95,
    malayalamRate: 0.98,
    malayalamSample: 'നമസ്കാരം കൂട്ടുകാരേ! ഇന്നത്തെ മലയാളം പാഠം ശ്രദ്ധിച്ചു കേൾക്കൂ!',
    englishSample: "Welcome Little Geniuses! Listen carefully to today's lesson.",
  },
};

let activeAudio: HTMLAudioElement | null = null;
let isCancelled = false;
let activeUtterance: SpeechSynthesisUtterance | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];
let preferredSinkId: string = '';

export function getVoiceProfile(): VoiceProfileId {
  if (typeof window === 'undefined') return 'kid_sweet';
  const saved = localStorage.getItem('lg_voice_profile') as VoiceProfileId;
  return saved && VOICE_PROFILES[saved] ? saved : 'kid_sweet';
}

export function setVoiceProfile(profileId: VoiceProfileId) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lg_voice_profile', profileId);
  }
}

export function getSelectedVoiceURI(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('lg_selected_voice_uri') || '';
}

export function setSelectedVoiceURI(uri: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lg_selected_voice_uri', uri);
  }
}

export function getAvailableBrowserVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  return voices.length > 0 ? voices : cachedVoices;
}

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
  onEnd?: () => void,
  character?: string
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
    const profile = VOICE_PROFILES[getVoiceProfile()] || VOICE_PROFILES.kid_sweet;
    const effectivePitch = pitch === 1.1 ? profile.pitch : pitch;
    const effectiveRate = rate === 0.95 ? profile.rate : rate;

    utterance.volume = 1.0;
    utterance.rate = effectiveRate;
    utterance.pitch = effectivePitch;

    const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
    const hasMalayalamChars = /[\u0D00-\u0D7F]/.test(cleaned);
    const customVoiceUri = getSelectedVoiceURI();

    if (customVoiceUri) {
      const customVoice = voices.find((v) => v.voiceURI === customVoiceUri);
      if (customVoice) {
        utterance.voice = customVoice;
        utterance.lang = customVoice.lang;
      }
    }

    if (!utterance.voice) {
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
        const charId = character || profile.id;
        const isMalePersona = charId === 'father' || charId === 'papa_manoj' || charId === 'voice_giant' || charId === 'giant';
        const isBoyPersona = charId === 'eadrick' || charId === 'kid_bright';
        const isCreaturePersona = charId === 'voice_creature' || charId === 'creature' || charId === 'voice_bird' || charId === 'bird';

        if (isCreaturePersona) {
          // Cute creature/bird voice
          const brightVoice =
            voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Zira') || v.name.includes('Female'))) ||
            voices.find((v) => v.lang.startsWith('en'));
          if (brightVoice) utterance.voice = brightVoice;
          utterance.pitch = 1.6;
          utterance.rate = 1.08;
        } else if (isMalePersona) {
          // Select MALE voice for Papa Manoj / Giant in English
          const maleVoice =
            voices.find(
              (v) =>
                v.lang.startsWith('en') &&
                (v.name.includes('David') ||
                  v.name.includes('Mark') ||
                  v.name.includes('Guy') ||
                  v.name.includes('George') ||
                  v.name.includes('Male'))
            ) || voices.find((v) => v.lang.startsWith('en'));

          if (maleVoice) {
            utterance.voice = maleVoice;
            utterance.pitch = charId === 'voice_giant' || charId === 'giant' ? 0.65 : 0.84;
          }
        } else if (isBoyPersona) {
          // Select BOY voice for Brother Eadrick
          const boyVoice =
            voices.find(
              (v) =>
                v.lang.startsWith('en') &&
                (v.name.includes('Mark') || v.name.includes('David') || v.name.includes('Male'))
            ) || voices.find((v) => v.lang.startsWith('en'));

          if (boyVoice) {
            utterance.voice = boyVoice;
            utterance.pitch = 1.25;
          }
        } else {
          // Female / Sweet Kid voices (Mummy Tessy, Grandma Lilly, Faidan)
          const femaleVoice =
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

          if (femaleVoice) {
            utterance.voice = femaleVoice;
          }
        }

        if (!utterance.voice) {
          utterance.lang = 'en-US';
        }
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
  onEnd?: () => void,
  character?: string
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
    const profile = VOICE_PROFILES[getVoiceProfile()] || VOICE_PROFILES.kid_sweet;
    const charParam = character || profile.id;

    const url = `/api/tts?lang=${effectiveLang}&character=${encodeURIComponent(
      charParam
    )}&text=${encodeURIComponent(chunk)}`;
    const audio = new Audio(url);
    audio.volume = 1.0;

    // Pitch modulation: when preservesPitch is false, altering playbackRate shifts pitch!
    try {
      (audio as any).preservesPitch = false;
      (audio as any).mozPreservesPitch = false;
      (audio as any).webkitPreservesPitch = false;
    } catch (e) {
      // ignore
    }

    const effectiveRate = effectiveLang === 'ml' ? (profile.malayalamRate || rate) : rate;
    audio.playbackRate = Math.max(0.7, Math.min(1.4, effectiveRate));
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
      speakWithBrowserSynthesis(
        chunks.slice(currentChunkIndex - 1).join(' '),
        language,
        rate,
        pitch,
        onEnd,
        character
      );
    };

    audio.play().catch(() => {
      activeAudio = null;
      speakWithBrowserSynthesis(
        chunks.slice(currentChunkIndex - 1).join(' '),
        language,
        rate,
        pitch,
        onEnd,
        character
      );
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
  onEnd?: () => void,
  character?: string
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
  const profile = VOICE_PROFILES[getVoiceProfile()] || VOICE_PROFILES.kid_sweet;
  const effectiveRate = rate === 0.95 ? profile.rate : rate;
  const effectivePitch = pitch === 1.1 ? profile.pitch : pitch;

  if (enginePref === 'cloud' || (hasMalayalamChars && !hasNativeMalayalamVoice)) {
    return speakWithCloudAudio(text, language, effectiveRate, effectivePitch, onEnd, character);
  }

  return speakWithBrowserSynthesis(text, language, effectiveRate, effectivePitch, onEnd, character);
}

export function testVoiceSampleAudio(profId: VoiceProfileId, lang: 'en' | 'ml' = 'en') {
  const prof = VOICE_PROFILES[profId] || VOICE_PROFILES.kid_sweet;
  setVoiceProfile(profId);
  const text = lang === 'ml' ? prof.malayalamSample : prof.englishSample;
  speakText(text, lang, prof.rate, prof.pitch, undefined, profId);
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
