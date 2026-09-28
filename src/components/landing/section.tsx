import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Shell({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('relative mx-auto w-full max-w-shell px-7', className)}>{children}</div>;
}

interface SectionHeadProps {
  tag: string;
  title: string;
  description?: string;
}

export function SectionHead({ tag, title, description }: SectionHeadProps) {
  return (
    <div className="mb-14 max-w-[640px]">
      <p className="mb-3.5 text-[13.5px] font-semibold tracking-tight text-brand">{tag}</p>
      <h2 className="text-[clamp(32px,3.6vw,44px)] font-bold leading-[1.05]">{title}</h2>
      {description && (
        <p className="mt-4 max-w-[52ch] text-[17px] text-ink-soft">{description}</p>
      )}
    </div>
  );
}
