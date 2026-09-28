'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const BIN_COUNT = 64;
const FALLBACK_INTERVAL_MS = 90;

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

/**
 * Captures microphone level data for a live waveform.
 * Audio is never recorded, stored, or uploaded — only frequency levels are read.
 * Falls back to an animated preview if the mic is unavailable or blocked.
 */
export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [usingFallback, setUsingFallback] = useState(false);

  const secondsRef = useRef(0);
  const activeRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const levelsRef = useRef(new Uint8Array(BIN_COUNT));
  const lastFallbackRef = useRef(0);

  const cleanup = useCallback(() => {
    activeRef.current = false;
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      void audioCtxRef.current.close();
    }
    audioCtxRef.current = null;
    analyserRef.current = null;
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const start = useCallback(async () => {
    activeRef.current = true;
    secondsRef.current = 0;
    setSeconds(0);
    setUsingFallback(false);
    setIsRecording(true);

    timerRef.current = window.setInterval(() => {
      secondsRef.current += 1;
      setSeconds(secondsRef.current);
    }, 1000);

    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Microphone unsupported');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!activeRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      const AudioCtx = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
      if (!AudioCtx) throw new Error('Web Audio unsupported');

      const audioCtx = new AudioCtx();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = BIN_COUNT * 2;
      audioCtx.createMediaStreamSource(stream).connect(analyser);

      streamRef.current = stream;
      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;
    } catch {
      setUsingFallback(true);
    }
  }, []);

  /** Stops recording and returns the duration in seconds. */
  const stop = useCallback((): number => {
    const duration = secondsRef.current;
    cleanup();
    setIsRecording(false);
    return duration;
  }, [cleanup]);

  /** Stable getter, safe to call every animation frame. */
  const getLevels = useCallback((): Uint8Array => {
    const levels = levelsRef.current;
    const analyser = analyserRef.current;
    if (analyser) {
      analyser.getByteFrequencyData(levels);
      return levels;
    }
    const now = performance.now();
    if (now - lastFallbackRef.current > FALLBACK_INTERVAL_MS) {
      lastFallbackRef.current = now;
      for (let i = 0; i < levels.length; i += 1) levels[i] = 40 + Math.random() * 180;
    }
    return levels;
  }, []);

  return { isRecording, seconds, usingFallback, start, stop, getLevels };
}
