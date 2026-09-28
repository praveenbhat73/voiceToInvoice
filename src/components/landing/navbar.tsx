'use client';
import Link from 'next/link';
import { OpenDemoButton } from '@/components/demo/open-demo-button';
import { LanguageSelector } from './language-selector';
import { Shell } from './section';
import { useT } from '@/lib/i18n';

const LINKS = [{ href: '#how', key: 'how' }, { href: '#features', key: 'features' }] as const;

export function Navbar() {
  const t = useT();
  return (
    <nav
      className="sticky z-40 border-b border-line bg-canvas/80 backdrop-blur-xl"
      style={{ top: 'env(safe-area-inset-top, 0px)' }}
    >
      <Shell className="flex h-[76px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-display text-[21px] font-bold">
          <span className="relative h-8 w-8 rounded-[10px] bg-brand-gradient shadow-[0_6px_14px_-6px_rgba(255,90,31,0.55)]">
            <span className="absolute inset-[9px] rounded-full border-2 border-white/90" />
          </span>
          Voicework
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[14.5px] font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {t(link.key)}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <LanguageSelector />
          <OpenDemoButton size="sm">{t('demo')}</OpenDemoButton>
        </div>
      </Shell>
    </nav>
  );
}
