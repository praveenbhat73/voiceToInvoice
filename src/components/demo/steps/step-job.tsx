'use client';

import { JOBS } from '@/data/jobs';
import { cn } from '@/lib/utils';
import { useDemoStore } from '@/store/demo-store';
import { StepHeading } from './step-heading';
import { useT } from '@/lib/i18n';

export function StepJob() {
  const t = useT();
  const jobId = useDemoStore((s) => s.jobId);
  const selectJob = useDemoStore((s) => s.selectJob);

  return (
    <div>
      <StepHeading title={t('jobQuestion')}>
        {t('jobContext')}
      </StepHeading>
      <div className="grid max-w-[640px] gap-3.5 sm:grid-cols-2">
        {JOBS.map((job) => {
          const selected = job.id === jobId;
          return (
            <button
              key={job.id}
              type="button"
              aria-pressed={selected}
              onClick={() => selectJob(job.id)}
              className={cn(
                'flex items-center gap-3.5 rounded-panel border-[1.5px] bg-surface px-5 py-[18px] text-left transition-all hover:-translate-y-0.5 hover:shadow-card',
                selected
                  ? 'border-brand shadow-[0_10px_24px_-12px_rgba(255,90,31,0.45)]'
                  : 'border-line',
              )}
            >
              <span
                className={cn(
                  'flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[11px] font-mono text-[13px] font-semibold transition-colors',
                  selected ? 'bg-brand-gradient text-white' : 'bg-surface-muted text-ink-soft',
                )}
              >
                {job.code}
              </span>
              <span>
                <strong className="block text-[15.5px]">{job.title}</strong>
                <span className="mt-0.5 block text-[13px] text-muted">{job.blurb}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
