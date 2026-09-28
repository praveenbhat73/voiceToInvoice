'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
  length: number;
}

interface SpeechRecognitionResultListLike {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
}

type SpeechRecognitionEventLike = Event & {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
};

type SpeechRecognitionErrorEventLike = Event & { error: string };

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

interface UseSpeechRecognitionOptions {
  language: string;
  onTranscript: (text: string) => void;
}

export function useSpeechRecognition({ language, onTranscript }: UseSpeechRecognitionOptions) {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const transcriptRef = useRef('');
  const activeRef = useRef(false);
  const languageRef = useRef(language);
  const onTranscriptRef = useRef(onTranscript);
  const [supported, setSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    languageRef.current = language;
    onTranscriptRef.current = onTranscript;
  }, [language, onTranscript]);

  useEffect(() => {
    const SpeechRecognition = (window as SpeechWindow).SpeechRecognition ?? (window as SpeechWindow).webkitSpeechRecognition;
    setSupported(Boolean(SpeechRecognition));
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = languageRef.current;

    recognition.onresult = (event) => {
      let interim = '';
      let finalText = transcriptRef.current;
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result?.[0]?.transcript?.trim() ?? '';
        if (result?.isFinal) {
          finalText = `${finalText} ${text}`.trim();
        } else {
          interim = `${interim} ${text}`.trim();
        }
      }
      transcriptRef.current = finalText;
      onTranscriptRef.current(`${finalText}${interim ? `${finalText ? ' ' : ''}${interim}` : ''}`.trim());
    };

    recognition.onerror = (event) => {
      if (event.error === 'aborted' || event.error === 'no-speech') return;
      setError(event.error);
    };

    recognition.onend = () => {
      if (activeRef.current) {
        try {
          recognition.lang = languageRef.current;
          recognition.start();
        } catch {
          // A browser may reject a restart while it is transitioning states.
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
    return () => {
      activeRef.current = false;
      recognition.abort();
      recognitionRef.current = null;
    };
  }, []);

  const start = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return false;
    transcriptRef.current = '';
    setError(null);
    activeRef.current = true;
    recognition.lang = languageRef.current;
    try {
      recognition.start();
      setIsListening(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const stop = useCallback(() => {
    activeRef.current = false;
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { supported, isListening, error, start, stop };
}
