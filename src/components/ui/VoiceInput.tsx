'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export default function VoiceInput({ onTranscript, className = '' }: VoiceInputProps) {
  const { language } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const webSpeechRecognizerRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const transcriptCaughtRef = useRef<string>('');

  useEffect(() => {
    return () => {
      stopAllRecording();
    };
  }, []);

  const stopAllRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (webSpeechRecognizerRef.current) {
      try {
        webSpeechRecognizerRef.current.abort();
      } catch (e) {}
      webSpeechRecognizerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startListening = async () => {
    transcriptCaughtRef.current = '';
    audioChunksRef.current = [];
    setSeconds(0);

    try {
      // 1. Request microphone access for MediaRecorder
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // Determine supported mime type
      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        }
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        setIsListening(false);
        // If web speech already returned a result, we're done
        if (transcriptCaughtRef.current && transcriptCaughtRef.current.trim().length > 0) {
          return;
        }

        // Otherwise transcribe via Gemini API
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (audioBlob.size > 2000) {
          setIsProcessing(true);
          try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'speech.webm');
            formData.append('language', language);

            const res = await fetch('/api/speech/transcribe', {
              method: 'POST',
              body: formData,
            });

            if (res.ok) {
              const data = await res.json();
              if (data.text && data.text.trim().length > 0) {
                soundEffects.playStar();
                onTranscript(data.text.trim());
              }
            }
          } catch (err) {
            console.warn('AI transcription error:', err);
          } finally {
            setIsProcessing(false);
          }
        }
      };

      recorder.start(250);
      setIsListening(true);
      soundEffects.playPop();

      // Start recording timer (auto stop after 15 seconds)
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= 14) {
            stopListening();
            return 15;
          }
          return prev + 1;
        });
      }, 1000);

      // 2. Parallel Fast-path: Web Speech API (if browser supports it)
      if (typeof window !== 'undefined') {
        const SpeechRecognition =
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          try {
            const recognizer = new SpeechRecognition();
            recognizer.continuous = false;
            recognizer.interimResults = false;
            recognizer.lang = language === 'ml' ? 'ml-IN' : 'en-IN';

            recognizer.onresult = (event: any) => {
              if (event.results?.[0]?.[0]?.transcript) {
                const text = event.results[0][0].transcript;
                if (text && text.trim().length > 0) {
                  transcriptCaughtRef.current = text.trim();
                  stopListening();
                  soundEffects.playStar();
                  onTranscript(text.trim());
                }
              }
            };

            recognizer.onerror = () => {
              // Silently ignore webkit errors since MediaRecorder + Gemini will handle the audio
            };

            recognizer.start();
            webSpeechRecognizerRef.current = recognizer;
          } catch (e) {
            // Silently fallback to MediaRecorder
          }
        }
      }
    } catch (err: any) {
      console.error('Microphone access error:', err);
      setIsListening(false);
      setIsProcessing(false);
      alert(
        language === 'ml'
          ? 'മൈക്രോഫോൺ അനുമതി ആവശ്യമാണ്. ദയവായി ബ്രൗസറിൽ മൈക്രോഫോൺ അനുമതി നൽകുക.'
          : 'Microphone permission needed! Please allow microphone access in your browser to talk to Chikoo.'
      );
    }
  };

  const stopListening = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (webSpeechRecognizerRef.current) {
      try {
        webSpeechRecognizerRef.current.stop();
      } catch (e) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleToggle = () => {
    if (isProcessing) return;
    if (isListening) {
      soundEffects.playPop();
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isProcessing}
        className={`relative p-3 rounded-2xl font-bold transition-all flex items-center justify-center select-none active:scale-95 ${
          isListening
            ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg ring-4 ring-rose-200 animate-pulse'
            : isProcessing
            ? 'bg-amber-400 text-slate-900 cursor-wait'
            : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
        } ${className}`}
        title={
          isListening
            ? `Listening (${seconds}s)... Click to send!`
            : isProcessing
            ? 'Transcribing your voice with AI...'
            : 'Click to speak to Chikoo'
        }
      >
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
        ) : isListening ? (
          <div className="flex items-center space-x-1">
            <MicOff className="w-5 h-5 animate-bounce" />
            <span className="text-[11px] font-black">{seconds}s</span>
          </div>
        ) : (
          <Mic className="w-5 h-5 text-amber-900" />
        )}
      </button>

      {/* Floating Listening Pulse Indicator */}
      {isListening && (
        <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md animate-bounce pointer-events-none">
          🎙️ Listening... Tap to finish!
        </span>
      )}
      {isProcessing && (
        <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md animate-pulse pointer-events-none">
          ✨ Transcribing with Gemini AI...
        </span>
      )}
    </div>
  );
}
