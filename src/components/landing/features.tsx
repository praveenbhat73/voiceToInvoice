'use client';
import { Contact, Hand, Send, Wrench, type LucideIcon } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { SectionHead, Shell } from './section';
interface Feature { icon: LucideIcon; title: string; body: string; }
const FEATURES: Feature[] = [
  { icon: Hand, title: 'gloves', body: 'glovesBody' },
  { icon: Wrench, title: 'trade', body: 'tradeBody' },
  { icon: Send, title: 'sendWay', body: 'sendWayBody' },
  { icon: Contact, title: 'looksBusiness', body: 'looksBusinessBody' },
];
export function Features() {
  const t = useT();
  return <section id="features" className="bg-surface-muted py-24 max-sm:py-16"><Shell>
    <SectionHead tag={t('builtJobSite')} title={t('busyHands')} description={t('featuresBody')} />
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{FEATURES.map(({icon:Icon,title,body}) => <article key={title} className="rounded-card bg-surface p-7 shadow-card transition-all duration-200 hover:-translate-y-[3px] hover:shadow-card-hover">
      <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-[13px] bg-brand-gradient text-white shadow-[0_8px_16px_-8px_rgba(255,90,31,0.5)]"><Icon className="h-[21px] w-[21px]" strokeWidth={1.8}/></span>
      <h3 className="mb-2.5 font-body text-[18.5px] font-bold">{t(title)}</h3><p className="text-[14.5px] text-ink-soft">{t(body)}</p>
    </article>)}</div>
  </Shell></section>;
}
