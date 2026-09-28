'use client';

import { OpenDemoButton } from '@/components/demo/open-demo-button';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HeroPhone } from './hero-phone';
import { Shell } from './section';
import { useT } from '@/lib/i18n';

const FACTS = [
  { value: 'voiceFirst', label: 'voiceFirstSub' },
  { value: 'sendYourWay', label: 'sendYourWaySub' },
  { value: 'noSignup', label: 'noSignupSub' },
];

export function Hero() {
  const t = useT();
  return (
    <header className="relative overflow-hidden bg-hero-radial pb-28 pt-24 text-canvas max-sm:pb-20 max-sm:pt-16">
      <div className="pointer-events-none absolute -left-32 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,90,31,0.35),transparent_70%)] blur-[70px]" />
      <div className="pointer-events-none absolute -bottom-44 -right-24 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(23,184,153,0.28),transparent_70%)] blur-[70px]" />

      <Shell className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line-dark bg-white/[0.07] py-[7px] pl-2.5 pr-3.5 text-[13.5px] font-semibold">
            <span className="h-[7px] w-[7px] rounded-full bg-brand shadow-[0_0_0_4px_rgba(255,90,31,0.22)]" />
            {t('heroBadge')}
          </p>
          <h1 className="max-w-[11ch] text-[clamp(44px,5.6vw,70px)] font-bold leading-none text-white">
            {t('hero1')}
            <br />
            {t('hero2')}
          </h1>
          <p className="mt-4 max-w-[46ch] text-sm font-medium text-[#D5D7DF]">{t('nativeHint')}</p>
          <p className="mt-3 max-w-[46ch] text-lg text-[#B8BBC6]">
            {t('heroBody')}
          </p>
          <div className="mt-9 flex flex-wrap gap-3.5">
            <OpenDemoButton>{t('interactive')}</OpenDemoButton>
            <a href="#how" className={cn(buttonVariants({ variant: 'ghostDark' }))}>
              {t('seeHow')}
            </a>
          </div>
          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-5">
            {FACTS.map((fact) => (
              <div key={t(fact.value)}>
                <dt className="font-display text-[19px] font-bold text-white">{t(fact.value)}</dt>
                <dd className="text-[13px] text-[#8B8FA0]">{t(fact.label)}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="order-first flex justify-center lg:order-none">
          <HeroPhone />
        </div>
      </Shell>
    </header>
  );
}
