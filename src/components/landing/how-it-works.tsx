'use client';
import { SectionHead, Shell } from './section';
import { useT } from '@/lib/i18n';

const STEPS = [
  {
    title: 'speakJob',
    body: 'speakJobBody',
  },
  {
    title: 'buildInvoice',
    body: 'buildInvoiceBody',
  },
  {
    title: 'sendDriveway',
    body: 'sendDrivewayBody',
  },
];

export function HowItWorks() {
  const t = useT();
  return (
    <section id="how" className="py-24 max-sm:py-16">
      <Shell>
        <SectionHead
          tag={t('workflow')}
          title={t('threeSteps')}
          description={t('workflowBody')}
        />
        <ol className="grid gap-7 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li
              key={t(step.title)}
              className="rounded-card bg-surface p-8 shadow-card transition-all duration-200 hover:-translate-y-[3px] hover:shadow-card-hover"
            >
              <span className="mb-5 flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-surface-muted font-mono text-[13px] text-ink-soft">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mb-3 text-[22px] font-bold">{t(step.title)}</h3>
              <p className="max-w-[32ch] text-[15px] text-ink-soft">{t(step.body)}</p>
            </li>
          ))}
        </ol>
      </Shell>
    </section>
  );
}
