'use client';

import { Mic } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const SAMPLES = [
  { text: 'Replaced kitchen sink P-trap, 1.5 hrs labor…', label: 'Kitchen sink trap + labor', amount: '$210.00' },
  { text: 'New 20A breaker, dedicated garage circuit…', label: 'Breaker + circuit install', amount: '$254.00' },
  { text: 'Condenser coil clean, filter, refrigerant…', label: 'Seasonal HVAC maintenance', amount: '$166.00' },
] as const;

const BARS = Array.from({ length: 22 }, (_, i) => i);

export function HeroPhone() {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [lineVisible, setLineVisible] = useState(false);
  const sample = SAMPLES[index % SAMPLES.length]!;

  useEffect(() => {
    let i = 0;
    let revealTimer: number | undefined;
    setTyped('');
    setLineVisible(false);

    const typer = window.setInterval(() => {
      i += 1;
      setTyped(sample.text.slice(0, i));
      if (i >= sample.text.length) {
        window.clearInterval(typer);
        revealTimer = window.setTimeout(() => setLineVisible(true), 300);
      }
    }, 26);
    const advance = window.setTimeout(() => setIndex((v) => v + 1), 5200);

    return () => {
      window.clearInterval(typer);
      window.clearTimeout(advance);
      if (revealTimer) window.clearTimeout(revealTimer);
    };
  }, [index, sample.text]);

  return (
    <div className="w-[300px] rounded-[38px] bg-[#05060A] p-3.5 shadow-[0_50px_90px_-30px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.06)]">
      <div className="flex min-h-[460px] flex-col overflow-hidden rounded-[26px] bg-surface">
        <div className="flex h-[22px] items-center justify-center">
          <span className="h-[5px] w-[54px] rounded-full bg-ink/15" />
        </div>
        <div className="flex flex-1 flex-col gap-3.5 px-5 pb-5 pt-4">
          <p className="font-mono text-[11px] text-muted">Job note — 09:41 AM</p>
          <div className="flex items-center gap-3.5">
            <div className="relative flex h-[52px] w-[52px] flex-none items-center justify-center rounded-full bg-brand-gradient shadow-[0_8px_18px_-6px_rgba(255,90,31,0.55)]">
              <span className="absolute -inset-1.5 animate-pulse-ring rounded-full border-2 border-brand/35 motion-reduce:animate-none" />
              <Mic className="h-5 w-5 text-[#1C0900]" strokeWidth={2} />
            </div>
            <div className="flex h-[26px] flex-1 items-center gap-[3px]" aria-hidden>
              {BARS.map((bar) => (
                <span
                  key={bar}
                  className="w-[3px] animate-wave rounded-sm bg-brand/70 motion-reduce:animate-none"
                  style={{ animationDelay: `${bar * 0.06}s` }}
                />
              ))}
            </div>
          </div>
          <div className="min-h-16 rounded-panel border border-line bg-surface-muted px-3.5 py-3 text-[13.5px]">
            {typed}
          </div>
          <div
            className={cn(
              'flex items-center justify-between rounded-panel border border-utility/35 bg-utility-light px-3.5 py-[11px] font-mono text-[13px] text-utility-dark transition-all duration-500',
              lineVisible ? 'translate-y-0 opacity-100' : 'translate-y-1.5 opacity-0',
            )}
          >
            <span>{sample.label}</span>
            <span>{sample.amount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
