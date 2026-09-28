'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useDemoStore } from '@/store/demo-store';
import { DemoFooter } from './demo-footer';
import { DemoStepper } from './demo-stepper';
import { STEP_COMPONENTS } from './steps';
import { useT } from '@/lib/i18n';

export function DemoDialog() {
  const t = useT();
  const isOpen = useDemoStore((s) => s.isOpen);
  const step = useDemoStore((s) => s.step);
  const closeDemo = useDemoStore((s) => s.closeDemo);
  const StepComponent = STEP_COMPONENTS[step] ?? STEP_COMPONENTS[0]!;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && closeDemo()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] animate-fade-in bg-steel/70 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-3 z-[101] flex max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-[1040px] -translate-x-1/2 animate-fade-in flex-col overflow-hidden rounded-[28px] bg-canvas shadow-[0_60px_120px_-20px_rgba(0,0,0,0.55)] focus:outline-none sm:top-8 sm:max-h-[calc(100dvh-4rem)]"
          aria-describedby="demo-description"
        >
          <header className="flex items-center justify-between bg-steel px-7 py-5 text-canvas">
            <div className="flex items-center gap-2.5 font-display text-[19px] font-bold">
              <Dialog.Title>Voicework</Dialog.Title>
              <span className="rounded-full bg-brand-gradient px-2.5 py-1 font-body text-[11px] font-bold text-[#1C0900]">
                {t('live')}
              </span>
            </div>
            <Dialog.Close
              aria-label={t('close')}
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-line-dark bg-white/[0.08] transition-colors hover:bg-white/[0.16]"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </header>
          <Dialog.Description id="demo-description" className="sr-only">
            {t('interactive')}
          </Dialog.Description>

          <DemoStepper />

          <div className="min-h-0 flex-1 overflow-y-auto px-10 pb-10 pt-9 max-sm:px-5 max-sm:pb-7 max-sm:pt-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22 }}
              >
                <StepComponent />
              </motion.div>
            </AnimatePresence>
          </div>

          <DemoFooter />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
