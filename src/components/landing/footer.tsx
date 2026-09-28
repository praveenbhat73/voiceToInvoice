'use client';
import { useT } from '@/lib/i18n';
import { Shell } from './section';
export function Footer() {
  const t = useT();
  return <footer className="bg-steel pb-9 pt-14 text-sm text-[#8B8FA0]"><Shell>
    <div className="flex flex-wrap items-start justify-between gap-6"><div><p className="mb-2.5 font-display text-[21px] font-bold text-white">Voicework</p><p className="max-w-[34ch]">{t('footerBody')}</p></div>
      <nav aria-label="Footer" className="flex flex-col gap-2.5"><a href="#how" className="transition-colors hover:text-canvas">{t('how')}</a><a href="#features" className="transition-colors hover:text-canvas">{t('features')}</a></nav>
    </div><p className="mt-12 border-t border-line-dark pt-5 text-[12.5px]">{t('prototype')}</p>
  </Shell></footer>;
}
