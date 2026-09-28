'use client';

import { STEPS } from '@/data/steps';
import { cn } from '@/lib/utils';
import { useDemoStore } from '@/store/demo-store';
import { useT } from '@/lib/i18n';

export function DemoStepper() {
  const t = useT();
  const step = useDemoStore((s) => s.step);
  const maxStep = useDemoStore((s) => s.maxStep);
  const goToStep = useDemoStore((s) => s.goToStep);

  return (
    <ol className="flex gap-1.5 px-7 pt-5">
      {STEPS.map((item, index) => {
        const active = index === step;
        const done = !active && index < maxStep;
        return (
          <li key={item.id} className="flex-1">
            <button
              type="button"
              onClick={() => goToStep(index)}
              disabled={index > maxStep}
              aria-current={active ? 'step' : undefined}
              className={cn(
                'flex w-full flex-col gap-2 text-left text-xs font-semibold transition-colors disabled:cursor-default',
                active ? 'text-ink' : done ? 'text-ink-soft' : 'text-muted',
              )}
            >
              <span
                className={cn(
                  'block h-1 w-full rounded-full transition-colors duration-300',
                  active ? 'bg-brand-gradient' : done ? 'bg-utility' : 'bg-line',
                )}
              />
              <span className="hidden sm:inline">{t(item.id === 'job' ? 'pickJob' : item.id === 'record' ? 'record' : item.id === 'transcript' ? 'transcript' : item.id === 'items' ? 'lineItems' : item.id === 'details' ? 'details' : 'sendIt')}</span>
              <span className="sr-only sm:hidden">{t(item.id === 'job' ? 'pickJob' : item.id === 'record' ? 'record' : item.id === 'transcript' ? 'transcript' : item.id === 'items' ? 'lineItems' : item.id === 'details' ? 'details' : 'sendIt')}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
