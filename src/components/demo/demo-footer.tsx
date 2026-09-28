'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { LAST_STEP, STEPS } from '@/data/steps';
import { canAdvance, useDemoStore } from '@/store/demo-store';
import { useT } from '@/lib/i18n';



export function DemoFooter() {
  const t = useT();
  const step = useDemoStore((s) => s.step);
  const allowed = useDemoStore((s) => canAdvance(s));
  const next = useDemoStore((s) => s.next);
  const back = useDemoStore((s) => s.back);

  const handleNext = () => {
    if (!allowed) {
      toast(step === 0 ? t('pickJobMessage') : step === 1 ? t('recordMessage') : t('completeMessage'));
      return;
    }
    next();
  };

  return (
    <footer className="flex items-center justify-between border-t border-line bg-surface px-10 py-5 max-sm:px-5 max-sm:py-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={back}
        className={step === 0 ? 'invisible' : undefined}
      >
        <ArrowLeft className="h-4 w-4" /> {t('back')}
      </Button>
      <div className="flex items-center gap-3">
        <span className="text-[13px] text-muted">
          {t('step')} {step + 1} / {STEPS.length}
        </span>
        {step < LAST_STEP && (
          <Button size="sm" onClick={handleNext} aria-disabled={!allowed}>
            {t('continue')} <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </footer>
  );
}
