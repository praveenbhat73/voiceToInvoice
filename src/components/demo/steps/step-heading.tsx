import type { ReactNode } from 'react';

export function StepHeading({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <h2 className="mb-2.5 text-[27px] font-bold">{title}</h2>
      <p className="mb-7 max-w-[56ch] text-[15px] text-ink-soft">{children}</p>
    </>
  );
}
