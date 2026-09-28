'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
      <Toaster position="bottom-center" toastOptions={{ className: 'font-body' }} />
    </MotionConfig>
  );
}
