'use client';

import { Loader2, Mic, Square } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAudioRecorder } from '@/hooks/use-audio-recorder';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { formatDuration } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useDemoStore } from '@/store/demo-store';
import { VOICE_LANGUAGES } from '@/lib/languages';
import { WaveformCanvas } from '../waveform-canvas';
import { StepHeading } from './step-heading';
import { useT } from '@/lib/i18n';

const PROCESSING_MS = 700;

export function StepRecord() {
  const t = useT();
  const { isRecording, seconds, usingFallback, start, stop, getLevels } = useAudioRecorder();
  const [processing, setProcessing] = useState(false);
  const [finishedSeconds, setFinishedSeconds] = useState<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const voiceLanguage = useDemoStore((s) => s.voiceLanguage);
  const markRecorded = useDemoStore((s) => s.markRecorded);
  const setTranscript = useDemoStore((s) => s.setTranscript);
  const setTranscriptReady = useDemoStore((s) => s.setTranscriptReady);
  const next = useDemoStore((s) => s.next);
  const selectedLanguage = VOICE_LANGUAGES.find((language) => language.code === voiceLanguage);

  const { supported: speechSupported, error: speechError, start: startSpeech, stop: stopSpeech } =
    useSpeechRecognition({
      language: voiceLanguage,
      onTranscript: setTranscript,
    });

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
      stopSpeech();
    },
    [stopSpeech],
  );

  const handleToggle = () => {
    if (processing) return;
    if (!isRecording) {
      setFinishedSeconds(null);
      setTranscript('');
      setTranscriptReady(false);
      void start();
      startSpeech();
      return;
    }

    const duration = stop();
    stopSpeech();
    setFinishedSeconds(duration);
    setProcessing(true);
    timeoutRef.current = window.setTimeout(() => {
      markRecorded(duration);
      setTranscriptReady(true);
      setProcessing(false);
      next();
    }, PROCESSING_MS);
  };

  const timerLabel = isRecording
    ? formatDuration(seconds)
    : finishedSeconds !== null
      ? `Recorded ${formatDuration(finishedSeconds)}`
      : 'Tap to start recording';

  const hint = isRecording
    ? usingFallback
      ? 'Microphone level preview is active; your browser speech recognition is capturing words.'
      : speechSupported
        ? `Listening in ${selectedLanguage?.nativeLabel ?? selectedLanguage?.label ?? voiceLanguage}. Speak naturally.`
        : 'Your browser does not provide speech-to-text here. Try Chrome or Edge for live transcription.'
    : speechSupported
      ? `Speak in ${selectedLanguage?.nativeLabel ?? selectedLanguage?.label ?? voiceLanguage}. Your words will appear in the next step.`
      : 'Choose a language above. Live speech-to-text depends on browser support.';

  return (
    <div>
      <StepHeading title={t('talkTitle')}>
        {t('talkBody')}
      </StepHeading>
      <div className="flex flex-col items-center pt-5">
        <button
          type="button"
          onClick={handleToggle}
          disabled={processing}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          className={cn(
            'flex h-[116px] w-[116px] items-center justify-center rounded-full text-[#1C0900] transition-transform hover:scale-[1.03] disabled:opacity-60',
            isRecording
              ? 'animate-mic-pulse bg-gradient-to-br from-brand-deep to-brand motion-reduce:animate-none'
              : 'bg-brand-gradient shadow-brand',
          )}
        >
          {isRecording ? <Square className="h-9 w-9" fill="currentColor" /> : <Mic className="h-[42px] w-[42px]" />}
        </button>
        <p className="mt-5 min-h-5 font-mono text-[15px] text-ink-soft" aria-live="polite">
          {timerLabel}
        </p>
        <p className="mt-1.5 max-w-[48ch] text-center text-sm text-muted">{hint}</p>
        {speechError && speechError !== 'no-speech' && (
          <p className="mt-2 max-w-[48ch] text-center text-xs text-red-600">
            Speech recognition reported: {speechError}. You can try again or switch browser/language.
          </p>
        )}
        <div className="mt-5 h-16 w-full max-w-[520px]">
          <WaveformCanvas active={isRecording} getLevels={getLevels} />
        </div>
        {processing && (
          <p className="mt-5 flex items-center gap-3 text-[14.5px]">
            <Loader2 className="h-[18px] w-[18px] animate-spin text-brand" />
            Preparing your transcript…
          </p>
        )}
      </div>
    </div>
  );
}
