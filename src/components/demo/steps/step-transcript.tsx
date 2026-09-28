'use client';

import { useDemoStore } from '@/store/demo-store';
import { StepHeading } from './step-heading';
import { useT } from '@/lib/i18n';

export function StepTranscript() {
  const t = useT();
  const transcript = useDemoStore((s) => s.transcript);
  const setTranscript = useDemoStore((s) => s.setTranscript);

  return (
    <div>
      <StepHeading title={t('heard')}>
        Your real speech-to-text result appears here. Fix anything that&apos;s off before the invoice is prepared.
      </StepHeading>
      <div className="max-w-[680px] rounded-panel border border-l-4 border-line border-l-utility bg-surface p-5 shadow-card">
        <label htmlFor="transcript" className="sr-only">
          Transcript
        </label>
        <textarea
          id="transcript"
          rows={5}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder={t('transcriptPlaceholder')}
          className="min-h-[110px] w-full resize-y bg-transparent text-[15.5px] leading-relaxed text-ink outline-none"
        />
      </div>
    </div>
  );
}
