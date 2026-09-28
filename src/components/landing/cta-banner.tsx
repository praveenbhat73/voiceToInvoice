'use client';
import { OpenDemoButton } from '@/components/demo/open-demo-button';
import { useT } from '@/lib/i18n';
import { Shell } from './section';
export function CtaBanner() {
  const t = useT();
  return <section className="relative overflow-hidden bg-cta-radial py-24 text-canvas">
    <div className="pointer-events-none absolute -left-32 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,90,31,0.3),transparent_70%)] blur-[70px]" />
    <Shell className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
      <div><h2 className="max-w-[14ch] text-[clamp(30px,4vw,46px)] font-bold text-white">{t('ctaTitle')}</h2><p className="mt-3.5 text-base text-[#9DA0AE]">{t('ctaBody')}</p></div>
      <OpenDemoButton>{t('interactive')}</OpenDemoButton>
    </Shell>
  </section>;
}
